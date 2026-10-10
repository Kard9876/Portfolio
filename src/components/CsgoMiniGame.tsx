import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Crosshair, Volume2, VolumeX, RotateCcw, Shield, Trophy, Zap, MousePointer } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface Target {
  id: number;
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  z: number; // depth scale 0.7 to 1.2
  width: number;
  height: number;
  vx: number;
  vy: number;
  type: 'terrorist' | 'fast';
  health: number;
  maxHealth: number;
  spawnTime: number;
  lifeTime: number; // duration in ms
  state: 'rising' | 'active' | 'dying' | 'dead';
  animProgress: number; // 0 to 1
  isHeadshot?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface KillFeedEntry {
  id: number;
  killer: string;
  victim: string;
  weapon: string;
  isHeadshot: boolean;
  time: number;
}

type WeaponType = 'ak47' | 'deagle' | 'awp';

const WEAPONS_DATA = {
  ak47: {
    name: 'AK-47',
    magSize: 30,
    reserve: 90,
    fireRateMs: 110,
    damageBody: 60, // 2 body hits to kill
    damageHead: 150, // 1 headshot kill
    recoilAmount: 7,
    recoilRecovery: 0.14,
    spread: 2.2,
  },
  deagle: {
    name: 'Desert Eagle',
    magSize: 7,
    reserve: 35,
    fireRateMs: 240,
    damageBody: 80, // 2 body hits to kill
    damageHead: 250, // 1 headshot kill
    recoilAmount: 14,
    recoilRecovery: 0.09,
    spread: 1.2,
  },
  awp: {
    name: 'AWP Sniper',
    magSize: 10,
    reserve: 30,
    fireRateMs: 1100,
    damageBody: 250, // 1 shot kill anywhere
    damageHead: 450, // 1 shot kill
    recoilAmount: 20,
    recoilRecovery: 0.06,
    spread: 0.5,
  },
};

export const CsgoMiniGame: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Weapon & sound state
  const [currentWeapon, setCurrentWeapon] = useState<WeaponType>('ak47');
  const [isScoped, setIsScoped] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string>('');

  // Ammo & HUD State
  const [ammo, setAmmo] = useState<{ mag: number; reserve: number }>({ mag: 30, reserve: 90 });
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [kills, setKills] = useState<number>(0);
  const [headshots, setHeadshots] = useState<number>(0);
  const [shotsFired, setShotsFired] = useState<number>(0);
  const [shotsHit, setShotsHit] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [highScore, setHighScore] = useState<number>(0);
  const [killFeed, setKillFeed] = useState<KillFeedEntry[]>([]);

  // References for the loop to avoid re-renders
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 480, y: 270 });
  const recoilOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isMouseDownRef = useRef<boolean>(false);
  const lastShotTimeRef = useRef<number>(0);
  const targetsRef = useRef<Target[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const nextTargetIdRef = useRef<number>(1);
  const nextSpawnTimeRef = useRef<number>(0);
  const muzzleFlashRef = useRef<number>(0);

  // Load high score
  useEffect(() => {
    try {
      const saved = localStorage.getItem('shooting_range_highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Sync ammo when weapon changes
  useEffect(() => {
    const w = WEAPONS_DATA[currentWeapon];
    setAmmo({ mag: w.magSize, reserve: w.reserve });
    setIsReloading(false);
    setIsScoped(false);
  }, [currentWeapon]);

  // Audio mute sync
  const toggleSound = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  // Start / Reset game (Purely Aim Reflex 45s Mode)
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setIsGameOver(false);
    setGameResult('');
    setScore(0);
    setKills(0);
    setHeadshots(0);
    setShotsFired(0);
    setShotsHit(0);
    setKillFeed([]);
    setTimeLeft(45);

    const w = WEAPONS_DATA[currentWeapon];
    setAmmo({ mag: w.magSize, reserve: w.reserve });
    setIsReloading(false);

    targetsRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    nextSpawnTimeRef.current = performance.now() + 400;
  }, [currentWeapon]);

  // Reload action
  const triggerReload = useCallback(() => {
    const w = WEAPONS_DATA[currentWeapon];
    if (isReloading || ammo.mag === w.magSize || ammo.reserve <= 0) return;

    setIsReloading(true);
    sounds.playReload();

    setTimeout(() => {
      setAmmo((prev) => {
        const needed = w.magSize - prev.mag;
        const available = Math.min(needed, prev.reserve);
        return {
          mag: prev.mag + available,
          reserve: prev.reserve - available,
        };
      });
      setIsReloading(false);
    }, 1500);
  }, [currentWeapon, isReloading, ammo]);

  // Spawn a target
  const spawnTarget = useCallback((now: number) => {
    const targetType = Math.random() > 0.4 ? 'terrorist' : 'fast';
    const depth = 0.75 + Math.random() * 0.45; // 0.75 to 1.2
    const baseW = 75 * depth;
    const baseH = 125 * depth;

    // Distribute targets nicely across the range
    const laneX = 0.15 + Math.random() * 0.7;
    const laneY = 0.38 + Math.random() * 0.22;

    const newTarget: Target = {
      id: nextTargetIdRef.current++,
      x: laneX,
      y: laneY,
      z: depth,
      width: baseW,
      height: baseH,
      vx: targetType === 'fast' ? (Math.random() > 0.5 ? 0.08 : -0.08) : 0,
      vy: 0,
      type: targetType,
      health: 100,
      maxHealth: 100,
      spawnTime: now,
      lifeTime: 3200 + Math.random() * 1400,
      state: 'rising',
      animProgress: 0,
    };

    targetsRef.current.push(newTarget);
  }, []);

  // Handle weapon shot
  const shoot = useCallback(() => {
    if (isReloading) return;
    const w = WEAPONS_DATA[currentWeapon];

    if (ammo.mag <= 0) {
      sounds.playEmptyClick();
      triggerReload();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Spend bullet
    setAmmo((prev) => ({ ...prev, mag: prev.mag - 1 }));
    setShotsFired((prev) => prev + 1);
    muzzleFlashRef.current = 4; // frames of muzzle flash

    // Play weapon sound
    if (currentWeapon === 'ak47') sounds.playAk47();
    else if (currentWeapon === 'deagle') sounds.playDeagle();
    else if (currentWeapon === 'awp') sounds.playAwp();

    // Actual bullet trajectory: EXACTLY where the player's crosshair is pointing!
    const spreadMultiplier = isScoped ? 0.2 : currentWeapon === 'awp' ? 5 : 1;
    const spreadX = (Math.random() - 0.5) * w.spread * spreadMultiplier;
    const spreadY = (Math.random() - 0.5) * w.spread * spreadMultiplier;
    const aimX = mousePosRef.current.x + recoilOffsetRef.current.x + spreadX;
    const aimY = mousePosRef.current.y - recoilOffsetRef.current.y + spreadY;

    // Now apply recoil kick for the NEXT shot
    const kickY = w.recoilAmount * (isScoped ? 0.35 : 1);
    const kickX = (Math.random() - 0.5) * w.recoilAmount * 0.5;
    recoilOffsetRef.current.y += kickY;
    recoilOffsetRef.current.x += kickX;

    let hitRegistered = false;
    // Iterate from front to back (sorted by z)
    const sortedTargets = [...targetsRef.current].sort((a, b) => b.z - a.z);

    for (const target of sortedTargets) {
      if (target.state === 'dead') continue;
      if (target.state === 'dying') {
        target.state = 'dead';
        continue;
      }

      const tx = target.x * canvas.width;
      const ty = target.y * canvas.height + (1 - target.animProgress) * 40;
      const tw = target.width;
      const th = target.height;

      // Head hitbox
      const headCenterX = tx;
      const headCenterY = ty - th * 0.38;
      const headRadius = tw * 0.28;
      const distToHead = Math.hypot(aimX - headCenterX, aimY - headCenterY);
      const isHeadHit = distToHead <= headRadius;

      // Body hitbox
      const isBodyHit =
        aimX >= tx - tw * 0.42 &&
        aimX <= tx + tw * 0.42 &&
        aimY >= ty - th * 0.26 &&
        aimY <= ty + th * 0.45;

      if (isHeadHit || isBodyHit) {
        hitRegistered = true;
        setShotsHit((prev) => prev + 1);

        const damage = isHeadHit ? w.damageHead : currentWeapon === 'awp' ? 250 : w.damageBody;
        target.health -= damage;

        // Visual spark / impact
        for (let i = 0; i < (isHeadHit ? 14 : 7); i++) {
          particlesRef.current.push({
            x: aimX,
            y: aimY,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6 - 2,
            color: isHeadHit ? '#f59e0b' : '#ef4444',
            size: Math.random() * 3 + 2,
            life: 1,
            maxLife: 20 + Math.random() * 15,
          });
        }

        if (isHeadHit) {
          sounds.playHeadshotDink();
          floatingTextsRef.current.push({
            x: tx,
            y: ty - th * 0.6,
            text: '💥 HEADSHOT! +100',
            color: '#fbbf24',
            size: 16,
            life: 1,
            maxLife: 35,
          });
        } else {
          sounds.playBodyHit();
          floatingTextsRef.current.push({
            x: tx,
            y: ty - th * 0.2,
            text: `+${damage}`,
            color: '#e2e8f0',
            size: 13,
            life: 1,
            maxLife: 25,
          });
        }

        if (target.health <= 0) {
          target.state = 'dying';
          target.isHeadshot = isHeadHit;
          target.animProgress = 0.95; // Begin collapsing down immediately

          setKills((prev) => prev + 1);
          if (isHeadHit) setHeadshots((prev) => prev + 1);

          const addedScore = isHeadHit ? 150 : 75;
          setScore((prev) => prev + addedScore);

          // Add to killfeed
          const newFeed: KillFeedEntry = {
            id: Date.now() + Math.random(),
            killer: 'Player',
            victim: `Bot_${target.id}`,
            weapon: w.name,
            isHeadshot: isHeadHit,
            time: Date.now(),
          };
          setKillFeed((prev) => [newFeed, ...prev.slice(0, 4)]);
        }
        break; // Bullet stops at first target hit
      }
    }

    if (!hitRegistered) {
      // Dust puff on wall/crate
      for (let i = 0; i < 4; i++) {
        particlesRef.current.push({
          x: aimX,
          y: aimY,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          color: '#a1a1aa',
          size: 2,
          life: 1,
          maxLife: 15,
        });
      }
    }
  }, [currentWeapon, isReloading, ammo, isScoped, triggerReload]);

  // Main canvas rendering & game loop
  useEffect(() => {
    let animId: number;
    let lastFrameTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(0.08, (currentTime - lastFrameTime) / 1000);
      lastFrameTime = currentTime;

      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(loop);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(loop);
        return;
      }

      try {
        const width = canvas.width;
        const height = canvas.height;

        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.45);
        skyGrad.addColorStop(0, '#1c1917');
        skyGrad.addColorStop(0.6, '#292524');
        skyGrad.addColorStop(1, '#3b2f27');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height * 0.45);

        // Back Wall
        const wallGrad = ctx.createLinearGradient(0, height * 0.25, 0, height * 0.6);
        wallGrad.addColorStop(0, '#57483d');
        wallGrad.addColorStop(1, '#44372e');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, height * 0.25, width, height * 0.35);

        // Target rails
        ctx.strokeStyle = '#27201b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.36);
        ctx.lineTo(width, height * 0.36);
        ctx.moveTo(0, height * 0.48);
        ctx.lineTo(width, height * 0.48);
        ctx.stroke();

        // Floor
        const floorGrad = ctx.createLinearGradient(0, height * 0.6, 0, height);
        floorGrad.addColorStop(0, '#362c26');
        floorGrad.addColorStop(0.5, '#261e1a');
        floorGrad.addColorStop(1, '#181311');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, height * 0.6, width, height * 0.4);

        // Floor perspective lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i <= 8; i++) {
          const xBottom = (width / 8) * i;
          ctx.beginPath();
          ctx.moveTo(width * 0.5, height * 0.55);
          ctx.lineTo(xBottom, height);
          ctx.stroke();
        }

        // Draw Cover Crates
        const drawCrate = (cx: number, cy: number, cw: number, ch: number, label: string) => {
          ctx.fillStyle = 'rgba(0,0,0,0.45)';
          ctx.fillRect(cx - 4, cy + ch - 6, cw + 8, 12);

          ctx.fillStyle = '#6b4f3b';
          ctx.fillRect(cx, cy, cw, ch);

          ctx.strokeStyle = '#423023';
          ctx.lineWidth = 3;
          ctx.strokeRect(cx, cy, cw, ch);

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + cw, cy + ch);
          ctx.moveTo(cx + cw, cy);
          ctx.lineTo(cx, cy + ch);
          ctx.stroke();

          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          ctx.font = `bold ${Math.round(cw * 0.3)}px JetBrains Mono, monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, cx + cw / 2, cy + ch / 2);
        };

        drawCrate(width * 0.08, height * 0.48, 110, 85, 'A');
        drawCrate(width * 0.76, height * 0.46, 130, 95, 'B');
        drawCrate(width * 0.42, height * 0.52, 90, 70, '📦');

        // Spawn targets (Reflex Mode: up to 4 targets simultaneously)
        if (isPlaying && !isGameOver) {
          if (currentTime >= nextSpawnTimeRef.current) {
            const activeCount = targetsRef.current.filter(
              (t) => t.state === 'active' || t.state === 'rising'
            ).length;
            if (activeCount < 4) {
              spawnTarget(currentTime);
            }
            nextSpawnTimeRef.current = currentTime + (750 + Math.random() * 750);
          }
        }

        // Update and Draw Targets
        targetsRef.current.forEach((t) => {
          if (t.state === 'rising') {
            t.animProgress = Math.min(1, t.animProgress + dt * 4);
            if (t.animProgress >= 1) {
              t.animProgress = 1;
              t.state = 'active';
            }
          } else if (t.state === 'dying') {
            t.animProgress = Math.max(0, t.animProgress - dt * 6);
            if (t.animProgress <= 0) {
              t.state = 'dead';
            }
          }

          if (t.state === 'active' || t.state === 'rising') {
            if (t.state === 'active') {
              t.x += t.vx * dt;
              if (t.x < 0.12 || t.x > 0.82) t.vx *= -1; // bounce at borders
            }

            if (currentTime - t.spawnTime > t.lifeTime) {
              t.state = 'dying';
            }
          }

          if (t.state !== 'dead') {
            const tx = t.x * width;
            const ty = t.y * height + (1 - t.animProgress) * 40;
            const tw = Math.max(10, t.width);
            const th = Math.max(15, t.height);

            ctx.save();
            ctx.translate(tx, ty);

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(0, Math.max(1, th * 0.45), Math.max(1, tw * 0.4), 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Torso
            ctx.fillStyle = t.type === 'fast' ? '#b45309' : '#1e293b';
            ctx.beginPath();
            ctx.roundRect(-tw * 0.35, -th * 0.25, tw * 0.7, th * 0.65, 8);
            ctx.fill();
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Chest Bullseye
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(1, tw * 0.18), 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fill();

            // Head
            ctx.fillStyle = t.type === 'fast' ? '#d97706' : '#334155';
            ctx.beginPath();
            ctx.ellipse(0, -th * 0.38, Math.max(1, tw * 0.26), Math.max(1, th * 0.18), 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#0f172a';
            ctx.stroke();

            // Visor
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-tw * 0.15, -th * 0.42, tw * 0.3, th * 0.07);

            // Headshot marker
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, -th * 0.38, Math.max(1, tw * 0.14), 0, Math.PI * 2);
            ctx.stroke();

            // Health bar
            if (t.health < t.maxHealth && t.health > 0) {
              ctx.fillStyle = '#18181b';
              ctx.fillRect(-tw * 0.35, -th * 0.58, tw * 0.7, 4);
              ctx.fillStyle = '#ef4444';
              ctx.fillRect(-tw * 0.35, -th * 0.58, tw * 0.7 * Math.max(0, t.health / t.maxHealth), 4);
            }

            ctx.restore();
          }
        });

        // Clean up dead targets
        targetsRef.current = targetsRef.current.filter((t) => t.state !== 'dead');

        // Particles
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15;
          p.life++;

          const progress = p.life / p.maxLife;
          if (progress >= 1) return;

          const currentRadius = Math.max(0.1, p.size * (1 - progress));

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
        });
        particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

        // Floating Feedback Text
        floatingTextsRef.current.forEach((ft) => {
          ft.y -= 0.8;
          ft.life++;

          const alpha = 1 - ft.life / ft.maxLife;
          ctx.fillStyle = ft.color;
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.font = `bold ${ft.size}px JetBrains Mono, monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.globalAlpha = 1;
        });
        floatingTextsRef.current = floatingTextsRef.current.filter((ft) => ft.life < ft.maxLife);

        // Recoil Decay
        const wData = WEAPONS_DATA[currentWeapon];
        recoilOffsetRef.current.x *= 1 - wData.recoilRecovery;
        recoilOffsetRef.current.y *= 1 - wData.recoilRecovery;

        const aimX = mousePosRef.current.x + recoilOffsetRef.current.x;
        const aimY = mousePosRef.current.y - recoilOffsetRef.current.y;

        // Muzzle Flash
        if (muzzleFlashRef.current > 0) {
          muzzleFlashRef.current--;
          ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
          ctx.beginPath();
          ctx.arc(width * 0.65, height * 0.9, Math.max(10, 50 + Math.random() * 25), 0, Math.PI * 2);
          ctx.fill();
        }

        // Gun Silhouette (Bottom Right)
        if (!isScoped) {
          ctx.save();
          const gunX = width * 0.72 + recoilOffsetRef.current.x * 0.5;
          const gunY = height * 0.78 + recoilOffsetRef.current.y * 0.3;

          ctx.fillStyle = '#18181b';
          ctx.strokeStyle = '#27272a';
          ctx.lineWidth = 3;

          if (currentWeapon === 'ak47') {
            ctx.beginPath();
            ctx.moveTo(gunX, gunY + 60);
            ctx.lineTo(gunX + 40, gunY);
            ctx.lineTo(gunX - 50, gunY - 30);
            ctx.lineTo(gunX - 70, gunY - 20);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#78350f';
            ctx.fillRect(gunX - 40, gunY - 25, 45, 12);
            ctx.fillStyle = '#27272a';
            ctx.beginPath();
            ctx.arc(gunX - 10, gunY + 15, 25, 0.4, 2.2);
            ctx.lineWidth = 10;
            ctx.stroke();
          } else if (currentWeapon === 'deagle') {
            ctx.fillStyle = '#71717a';
            ctx.fillRect(gunX - 30, gunY - 20, 70, 24);
            ctx.fillStyle = '#18181b';
            ctx.fillRect(gunX + 10, gunY + 4, 25, 40);
          } else if (currentWeapon === 'awp') {
            ctx.fillStyle = '#3f4c38';
            ctx.fillRect(gunX - 90, gunY - 15, 120, 25);
            ctx.fillStyle = '#18181b';
            ctx.fillRect(gunX - 140, gunY - 10, 50, 8);
            ctx.fillRect(gunX - 40, gunY - 35, 45, 16);
          }
          ctx.restore();
        }

        // Draw Crosshair / Scope
        if (isScoped && currentWeapon === 'awp') {
          const scopeRadius = Math.max(20, Math.min(width, height) * 0.42);

          // Dark peripheral mask OUTSIDE the scope aperture (leaves inside 100% visible)
          ctx.save();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.94)';
          ctx.beginPath();
          ctx.rect(0, 0, width, height);
          ctx.arc(aimX, aimY, scopeRadius, 0, Math.PI * 2, true);
          ctx.fill('evenodd');
          ctx.restore();

          // Optical lens vignette inside the aperture
          ctx.save();
          const lensVignette = ctx.createRadialGradient(
            aimX,
            aimY,
            scopeRadius * 0.7,
            aimX,
            aimY,
            scopeRadius
          );
          lensVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
          lensVignette.addColorStop(0.85, 'rgba(0, 30, 10, 0.12)');
          lensVignette.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
          ctx.fillStyle = lensVignette;
          ctx.beginPath();
          ctx.arc(aimX, aimY, scopeRadius, 0, Math.PI * 2);
          ctx.fill();

          // Beveled metallic rim rings
          ctx.strokeStyle = '#18181b';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(aimX, aimY, scopeRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = '#27272a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(aimX, aimY, scopeRadius - 2, 0, Math.PI * 2);
          ctx.stroke();

          // Green AWP reticle wires
          ctx.strokeStyle = '#15803d';
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.moveTo(aimX - scopeRadius, aimY);
          ctx.lineTo(aimX + scopeRadius, aimY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(aimX, aimY - scopeRadius);
          ctx.lineTo(aimX, aimY + scopeRadius);
          ctx.stroke();

          // Mil-dot tick marks
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 1;
          for (let r = 24; r < scopeRadius - 15; r += 32) {
            ctx.beginPath();
            ctx.moveTo(aimX + r, aimY - 4);
            ctx.lineTo(aimX + r, aimY + 4);
            ctx.moveTo(aimX - r, aimY - 4);
            ctx.lineTo(aimX - r, aimY + 4);
            ctx.moveTo(aimX - 4, aimY + r);
            ctx.lineTo(aimX + 4, aimY + r);
            ctx.moveTo(aimX - 4, aimY - r);
            ctx.lineTo(aimX + 4, aimY - r);
            ctx.stroke();
          }

          // Center precision dot
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(aimX, aimY, 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        } else if (currentWeapon !== 'awp') {
          // Classic Dynamic Crosshair (unscoped AWP has NO crosshair on screen)
          const recoilSpread = (wData.spread + recoilOffsetRef.current.y * 1.5) * 1.2;
          const lineLen = 9;
          const lineThickness = 2;

          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = lineThickness;

          ctx.beginPath();
          ctx.moveTo(aimX, aimY - recoilSpread);
          ctx.lineTo(aimX, aimY - recoilSpread - lineLen);
          ctx.moveTo(aimX, aimY + recoilSpread);
          ctx.lineTo(aimX, aimY + recoilSpread + lineLen);
          ctx.moveTo(aimX - recoilSpread, aimY);
          ctx.lineTo(aimX - recoilSpread - lineLen, aimY);
          ctx.moveTo(aimX + recoilSpread, aimY);
          ctx.lineTo(aimX + recoilSpread + lineLen, aimY);
          ctx.stroke();

          ctx.fillStyle = '#22c55e';
          ctx.fillRect(aimX - 1, aimY - 1, 2, 2);
        }

        // Automatic fire handler for AK-47
        if (
          isMouseDownRef.current &&
          currentWeapon === 'ak47' &&
          isPlaying &&
          !isGameOver &&
          currentTime - lastShotTimeRef.current >= WEAPONS_DATA.ak47.fireRateMs
        ) {
          shoot();
          lastShotTimeRef.current = currentTime;
        }
      } catch (err) {
        console.warn('Canvas render caught error:', err);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, currentWeapon, isScoped, shoot, spawnTarget, timeLeft]);

  // Game timer countdown (Purely Aim Reflex: 45s)
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsGameOver(true);
          setIsPlaying(false);
          setGameResult(`ROUND OVER // Final Score: ${score}`);
          if (score > highScore) {
            setHighScore(score);
            try {
              localStorage.setItem('shooting_range_highscore', score.toString());
            } catch {
              // Ignore
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, score, highScore]);

  // Mouse & Touch Interaction Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mousePosRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 2) {
      e.preventDefault();
      if (currentWeapon === 'awp') {
        setIsScoped((prev) => !prev);
      }
      return;
    }

    if (e.button === 0) {
      isMouseDownRef.current = true;
      if (isPlaying && !isGameOver) {
        shoot();
        lastShotTimeRef.current = performance.now();
      }
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      mousePosRef.current = {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    handleTouchMove(e);
    if (isPlaying && !isGameOver) {
      shoot();
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        triggerReload();
      } else if (e.key === '1') {
        setCurrentWeapon('ak47');
      } else if (e.key === '2') {
        setCurrentWeapon('deagle');
      } else if (e.key === '3') {
        setCurrentWeapon('awp');
      } else if (e.key === ' ' && currentWeapon === 'awp') {
        setIsScoped((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerReload, currentWeapon]);

  const accuracy = shotsFired > 0 ? Math.round((shotsHit / shotsFired) * 100) : 0;
  const hsRatio = kills > 0 ? Math.round((headshots / kills) * 100) : 0;

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-xl border border-zinc-800 bg-[#09090b] shadow-2xl overflow-hidden font-sans">
      {/* Top Header / Match Status Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-950 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono font-semibold tracking-wider text-amber-400 flex items-center gap-1.5">
            <Crosshair className="w-4 h-4 text-amber-400" />
            Shooting Range
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded transition-colors cursor-pointer"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Main Game Screen Canvas */}
      <div
        className={`relative aspect-[16/9] w-full bg-black select-none overflow-hidden ${
          isPlaying && !isGameOver ? 'cursor-none' : 'cursor-default'
        }`}
      >
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Top Center: Timer & Score */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-1.5 bg-black/70 backdrop-blur border border-zinc-800 rounded-lg text-white pointer-events-none">
          <div className="text-center font-mono">
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest">Time</div>
            <div className={`text-base font-bold tabular-nums ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`}>
              {timeLeft}s
            </div>
          </div>
          <div className="w-px h-6 bg-zinc-800" />
          <div className="text-center font-mono">
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest">Score</div>
            <div className="text-base font-bold text-white tabular-nums">{score}</div>
          </div>
          <div className="w-px h-6 bg-zinc-800" />
          <div className="text-center font-mono">
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest">Kills</div>
            <div className="text-base font-bold text-emerald-400 tabular-nums">
              {kills} <span className="text-[10px] text-zinc-400 font-normal">({hsRatio}% HS)</span>
            </div>
          </div>
        </div>

        {/* Top Right: Killfeed */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end pointer-events-none max-w-xs">
          {killFeed.map((kf) => (
            <div
              key={kf.id}
              className="flex items-center gap-2 px-2.5 py-1 bg-black/80 border border-zinc-800/80 rounded text-[11px] font-mono shadow-sm animate-fade-in"
            >
              <span className="text-sky-400 font-semibold">{kf.killer}</span>
              <span className="text-zinc-500">[{kf.weapon}]</span>
              {kf.isHeadshot && <span className="text-amber-400">💥</span>}
              <span className="text-red-400">{kf.victim}</span>
            </div>
          ))}
        </div>

        {/* Bottom Left: Health & Armor */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 px-3 py-2 bg-black/75 backdrop-blur border border-zinc-800/90 rounded-lg pointer-events-none font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-base">
            <span className="text-xs">+</span> 100
          </div>
          <div className="w-px h-4 bg-zinc-800" />
          <div className="flex items-center gap-1.5 text-sky-400 font-bold text-base">
            <Shield className="w-3.5 h-3.5" /> 100
          </div>
        </div>

        {/* Bottom Right: Weapon & Ammo */}
        <div className="absolute bottom-3 right-3 flex items-center gap-3 px-3 py-2 bg-black/75 backdrop-blur border border-zinc-800/90 rounded-lg pointer-events-none font-mono">
          <div className="text-right">
            <div className="text-[10px] text-zinc-400 uppercase">{WEAPONS_DATA[currentWeapon].name}</div>
            <div className="text-lg font-bold text-amber-400 tabular-nums">
              {isReloading ? (
                <span className="text-xs text-amber-300 animate-pulse">RELOADING...</span>
              ) : (
                `${ammo.mag} | ${ammo.reserve}`
              )}
            </div>
          </div>
        </div>

        {/* Start / Game Over Overlay */}
        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="max-w-md w-full">
              {isGameOver ? (
                <>
                  <div className="text-2xl font-bold font-mono text-amber-400 mb-1">{gameResult}</div>
                  <p className="text-xs text-zinc-400 mb-6">
                    Accuracy: {accuracy}% · Headshots: {headshots} ({hsRatio}%)
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crosshair className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-bold text-white tracking-tight">Shooting Range</h3>
                  </div>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    Aim reflex mode: Hit targets and score headshots within 45 seconds!
                  </p>
                </>
              )}

              {/* High Score */}
              {highScore > 0 && (
                <div className="flex items-center justify-center gap-2 mb-6 text-xs text-amber-400 font-mono">
                  <Trophy className="w-4 h-4" /> Personal Best: {highScore} pts
                </div>
              )}

              {/* Start Button */}
              <button
                onClick={startGame}
                className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" /> {isGameOver ? 'Play Again' : 'Start Aim Reflex Mode'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Weapon Bar Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-950 border-t border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-mono text-[10px] mr-1">WEAPONS [1-3]:</span>
          <button
            onClick={() => setCurrentWeapon('ak47')}
            className={`px-3 py-1.5 rounded border font-mono transition-colors cursor-pointer ${
              currentWeapon === 'ak47'
                ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                : 'border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            [1] AK-47
          </button>
          <button
            onClick={() => setCurrentWeapon('deagle')}
            className={`px-3 py-1.5 rounded border font-mono transition-colors cursor-pointer ${
              currentWeapon === 'deagle'
                ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                : 'border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            [2] Deagle
          </button>
          <button
            onClick={() => setCurrentWeapon('awp')}
            className={`px-3 py-1.5 rounded border font-mono transition-colors cursor-pointer ${
              currentWeapon === 'awp'
                ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                : 'border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            [3] AWP
          </button>

          {currentWeapon === 'awp' && (
            <button
              onClick={() => setIsScoped((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded border font-mono transition-colors cursor-pointer ${
                isScoped ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400' : 'border-zinc-800 text-zinc-400'
              }`}
            >
              [R-Click / Space] {isScoped ? 'Unscope' : 'Scope In'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerReload}
            disabled={isReloading}
            className="px-3 py-1.5 rounded border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 font-mono transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} /> [R] Reload
          </button>

          <button
            onClick={startGame}
            className="px-3 py-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 font-mono transition-colors cursor-pointer"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Control Tips Footer */}
      <div className="px-4 py-2 bg-zinc-950/70 border-t border-zinc-900 text-[11px] text-zinc-500 flex flex-wrap items-center justify-between gap-2 font-mono">
        <span className="flex items-center gap-1.5">
          <MousePointer className="w-3.5 h-3.5 text-zinc-400" /> Left click to fire · Headshots trigger critical dink (+100)
        </span>
        <span>Aim Reflex mode · Browser-optimized 60 FPS Canvas</span>
      </div>
    </div>
  );
};
