import { ContactInfo, EducationItem, ExperienceItem, ProjectItem, SkillCategory } from '../types/portfolio';

export const contactInfo: ContactInfo = {
  name: 'Guilherme Barbosa',
  email: 'gjf.barbosa603@gmail.com',
  citizenship: 'EU citizen',
  github: 'https://github.com/Kard9876',
  githubUsername: 'Kard9876',
  linkedin: 'https://www.linkedin.com/in/guilherme-barbosa-se',
};

export const summary =
  'Recent M.Sc. Software Engineering graduate from UMinho, specialized in data science and machine learning. Applied predictive architectures and built streaming geospatial data pipelines at Centro ALGORITMI while teaching practical AI and multi-agent systems at the University of Minho. Also architected an orchestrator-driven multi-agent RAG platform with isolated vector knowledge bases and microservices. Looking to keep expanding my machine learning and backend systems expertise on a good engineering team.';

export const educationList: EducationItem[] = [
  {
    degree: 'M.Sc. Software Engineering',
    specialization: 'Distributed Systems & Intelligent Systems',
    institution: 'University of Minho',
    period: 'Sept. 2024 – Jul. 2026 (expected)',
    location: 'Braga, Portugal',
  },
  {
    degree: 'B.Sc. Software Engineering',
  },
];

export const experienceList: ExperienceItem[] = [
  {
    id: 'algoritmi-aquashield',
    role: 'Researcher & Machine Learning Engineer',
    institution: 'University of Minho (Centro ALGORITMI)',
    project: 'Aquashield Project',
    period: 'Jul. 2026 – Present',
    location: 'Braga, Portugal',
    highlights: [
      'Researched and trained predictive architectures for intelligent monitoring and preventive management of surface water bodies.',
      'Built end-to-end data pipelines pre-processing multi-source streaming and geospatial data, including Sentinel/Copernicus satellite imagery.',
    ],
  },
  {
    id: 'invited-assistant-professor',
    role: 'Invited Assistant Professor',
    institution: 'University of Minho',
    period: 'Sep. 2025 – Present',
    location: 'Braga, Portugal',
    highlights: [
      'Taught practical sessions of multiple curricular units in Artificial Intelligence.',
      'Covered the development of machine learning and deep learning models, multi-agent systems, and knowledge extraction from data.',
    ],
  },
  {
    id: 'suturing-skills',
    role: 'AI Model Developer',
    institution: 'University of Minho',
    project: 'Open Suturing Skills Challenge 2025',
    period: 'Jun. 2025 – Sep. 2025',
    location: 'Braga, Portugal',
    highlights: [
      'Developed various artificial intelligence models targeted across 3 challenge tasks evaluating surgical procedure precision and technique.',
    ],
  },
  {
    id: 'inov-am',
    role: 'AI Research Engineer',
    institution: 'University of Minho - Instituto de Polímeros e Compósitos (IPC)',
    project: 'INOV.AM – Inovação em Fabricação Aditiva',
    reference: 'Ref: PRR/49/INOV.AM/EE',
    period: 'Feb. 2025 – Dec. 2025',
    location: 'Braga, Portugal',
    highlights: [
      'Developed a novel multi-objective methodology leveraging Inverse Artificial Neural Networks to significantly accelerate the optimization process.',
    ],
  },
  {
    id: 'premio-iniciacao',
    role: 'Undergraduate Research Scholar',
    institution: 'University of Minho - Prémios de Iniciação à Investigação Científica',
    project: 'A penalty-based optimization scheme for polymer single screw extruder design',
    period: 'Nov. 2022 – Dec. 2023',
    location: 'Braga, Portugal',
    highlights: [
      'Determined optimal operating conditions for a polymer extruder based on multiple variables, including screw temperature, extruder length, and material elasticity.',
      'Studied and applied multivariable numerical optimization techniques and Pareto optimality concepts.',
      'Presented project findings at the “Prémio UMinho Iniciação Investigação Científica” conference in December 2023.',
    ],
  },
];

export const projectList: ProjectItem[] = [
  {
    id: 'rag-chatbot',
    title: 'RAG Chatbot',
    category: 'ml',
    period: 'Oct. 2025 – Jan. 2026',
    description:
      'Microservices-based multi-agent system featuring a central orchestrator that intelligently routes helpdesk queries to specialized domain agents.',
    detailedDescription:
      'Architected a microservices-based multi-agent system featuring a central orchestrator that intelligently routes helpdesk queries to specialized domain agents. Implemented Retrieval-Augmented Generation (RAG) with isolated vector knowledge bases per platform, significantly improving retrieval precision and eliminating cross-domain hallucinations.',
    technologies: ['Python', 'Pinecone', 'RAG', 'Docker', 'MongoDB'],
    githubUrl: 'https://github.com/Kard9876',
    highlights: [
      'Architected microservices-based multi-agent system with central orchestrator.',
      'Isolated vector knowledge bases per platform in Pinecone.',
      'Eliminated cross-domain hallucinations and optimized query routing.',
    ],
  },
  {
    id: 'picturas',
    title: 'PictuRAS',
    category: 'systems',
    period: 'Oct. 2024 – Jan. 2025',
    description:
      'Distributed image processing microservices platform. Owned the Projects backend coordinating jobs over RabbitMQ with MongoDB persistence.',
    detailedDescription:
      'Owned the Projects service, the backend responsible for managing user projects and persisting their state in MongoDB while coordinating image processing jobs over RabbitMQ. Containerized the service using Docker with NFS persistent volumes ensuring data durability across node restarts alongside an integrated payments service.',
    technologies: ['Python', 'RabbitMQ', 'MongoDB', 'NFS', 'Docker'],
    githubUrl: 'https://github.com/Kard9876/PictuRAS',
    highlights: [
      'Engineered backend Projects service handling concurrent job orchestration via RabbitMQ.',
      'Containerized service using Docker with NFS persistent volumes for data durability.',
      'Coordinated image manipulation pipeline with integrated payments service.',
    ],
  },
  {
    id: 'bitclone',
    title: 'BitClone',
    category: 'systems',
    period: '2024',
    description:
      'Peer-to-peer file transfer engine implementing core BitTorrent protocol specifications with concurrent piece verification and swarm networking.',
    detailedDescription:
      'A systems-level implementation of a peer-to-peer file sharing protocol inspired by BitTorrent. Features decentralized swarm coordination, bencoding parsing, concurrent multi-threaded block verification, piece hashing (SHA-1), and choked/unchoked bandwidth allocation strategies.',
    technologies: ['C/C++', 'Sockets', 'Multi-threading', 'SHA-1', 'Networking'],
    githubUrl: 'https://github.com/Kard9876/BitClone',
    highlights: [
      'Implemented custom bencoding deserialization and tracker communication protocol.',
      'Designed concurrent chunk verification and multi-peer downloading algorithm.',
      'Optimized bandwidth allocation and sliding-window piece validation.',
    ],
  },
  {
    id: 'xml-graphical-engine',
    title: 'XML_Graphical_Engine',
    category: 'systems',
    period: '2024',
    description:
      'Interactive 3D graphical engine written in C++ and OpenGL that dynamically constructs and renders complex hierarchical scene graphs from XML definitions.',
    detailedDescription:
      'Engineered a complete 3D graphics rendering pipeline that parses XML scene graph schemas. Features hierarchical transformations, custom geometric primitives generation, dynamic camera controls (first-person and orbital), texture mapping, lighting shaders, and Bezier curve patches.',
    technologies: ['C++', 'OpenGL', 'GLUT', 'XML Parsing', 'Shaders', '3D Graphics'],
    githubUrl: 'https://github.com/Kard9876/XML_Graphical_Engine',
    highlights: [
      'Hierarchical scene graph data structure parsing arbitrary nested XML nodes.',
      'Custom matrix transformation stack supporting rotation, translation, and scale.',
      'Dynamic illumination models with directional, point, and spotlight shaders.',
    ],
  },
  {
    id: 'intelligent-parking',
    title: 'IntelligentParking',
    category: 'ml',
    period: '2024',
    description:
      'Real-time automated parking management system combining computer vision occupancy tracking with automated booking dispatch.',
    detailedDescription:
      'An intelligent IoT and computer vision system for automated parking lot monitoring. Employs image classification and spatial boundary detection on video feeds to determine parking spot occupancy in real-time, synchronizing availability to a responsive web dashboard for drivers and operators.',
    technologies: ['Python', 'OpenCV', 'Computer Vision', 'IoT', 'FastAPI'],
    githubUrl: 'https://github.com/Kard9876/IntelligentParking',
    highlights: [
      'Real-time space occupancy detection using polygon mask segmentation.',
      'Low-latency status broadcasting to parking management endpoints.',
      'Robust performance under varying environmental lighting and weather conditions.',
    ],
  },
  {
    id: 'ai-text-detection',
    title: 'AI_Text_Dectection',
    category: 'ml',
    period: '2024',
    description:
      'Deep learning classifier designed to distinguish between human-written and synthetically generated text using transformer embeddings.',
    detailedDescription:
      'Investigated and implemented deep learning models to identify AI-generated text. Extracted linguistic features, perplexity metrics, and dense transformer embeddings (BERT/RoBERTa) to train robust binary classifiers capable of identifying subtle statistical signatures of large language models.',
    technologies: ['Python', 'PyTorch', 'Transformers', 'NLP', 'Scikit-Learn'],
    githubUrl: 'https://github.com/Kard9876/AI_Text_Dectection',
    highlights: [
      'Comparative evaluation of transformer embeddings versus statistical perplexity metrics.',
      'Fine-tuned classification heads achieving high precision across varied prompt domains.',
      'Mitigated out-of-distribution bias through data augmentation techniques.',
    ],
  },
  {
    id: 'weather-app',
    title: 'WeatherApp',
    category: 'web',
    period: '2023',
    description:
      'Modern responsive meteorological application featuring geolocation lookup, dynamic forecasts, and interactive weather visualizations.',
    detailedDescription:
      'A sleek, responsive weather application offering real-time atmospheric data, multi-day forecasting, and location-based lookup. Built with clean state management, modular component architecture, and responsive layouts.',
    technologies: ['JavaScript', 'HTML5/CSS3', 'Weather API', 'Geolocation'],
    githubUrl: 'https://github.com/Kard9876/WeatherApp',
    highlights: [
      'Real-time forecast retrieval with geolocation auto-detection.',
      'Responsive interface optimized for seamless mobile and desktop browsing.',
      'Robust client-side caching to minimize API rate-limit overhead.',
    ],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    category: 'Programming Languages',
    skills: ['Python', 'C', 'C++', 'Java', 'JavaScript'],
  },
  {
    category: 'AI & Machine Learning',
    skills: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'KNIME', 'OpenCV', 'Transformers', 'RAG'],
  },
  {
    category: 'Database & Messaging',
    skills: ['MongoDB', 'Pinecone', 'RabbitMQ', 'JSON'],
  },
  {
    category: 'Infrastructure & Tools',
    skills: ['Docker', 'Linux', 'GitLab', 'Git / GitHub', 'CI/CD'],
  },
  {
    category: 'Languages',
    skills: ['Portuguese (native)', 'English (fluent)'],
  },
];
