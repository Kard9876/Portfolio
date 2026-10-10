export interface ExperienceItem {
  id: string;
  role: string;
  institution: string;
  project?: string;
  period: string;
  location: string;
  reference?: string;
  highlights: string[];
}

export interface EducationItem {
  degree: string;
  institution?: string;
  specialization?: string;
  period?: string;
  location?: string;
  grade?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'ml' | 'systems' | 'web';
  period: string;
  description: string;
  detailedDescription?: string;
  technologies: string[];
  githubUrl: string;
  evaluation?: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ContactInfo {
  name: string;
  email: string;
  citizenship: string;
  github: string;
  githubUsername: string;
  linkedin: string;
}
