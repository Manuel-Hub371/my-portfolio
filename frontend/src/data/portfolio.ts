export const siteConfig = {
  name: "Emmanuel Darko",
  title: "AI Engineer | Robotics Developer | Full-Stack Software Engineer",
  tagline:
    "Building intelligent software, autonomous systems, and business automation solutions.",
  email: "emmanuel.darko@manueltech.dev",
  phone: "+1 (555) 123-4567",
  whatsapp: "https://wa.me/15551234567",
  linkedin: "https://linkedin.com/in/emmanuel-darko",
  github: "https://github.com/emmanuel-darko",
  resumeUrl: "/resume/emmanuel-darko-resume.pdf",
  location: "Remote · Worldwide",
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
];

export const contactHref = "/contact";

export const aboutContent = {
  intro:
    "I'm Emmanuel Darko — an engineer who bridges artificial intelligence, robotics, and production-grade software. I design systems that perceive, decide, and act in the real world.",
  specialization:
    "End-to-end AI systems, autonomous robotics, and full-stack platforms for automation-heavy businesses.",
  yearsExperience: "6+",
  expertise: [
    "Artificial Intelligence",
    "Machine Learning",
    "Robotics",
    "Automation Systems",
    "Web Development",
    "Embedded Systems",
    "Computer Vision",
    "Large Language Models",
  ],
  technologies: [
    "Python",
    "TypeScript",
    "ROS 2",
    "PyTorch",
    "React",
    "Next.js",
    "PostgreSQL",
    "Docker",
    "AWS",
  ],
  goals:
    "Ship reliable AI products, advance open robotics research, and help organizations automate intelligently at scale.",
};

export const skillCategories = [
  {
    title: "Programming Languages",
    skills: ["Python", "JavaScript", "TypeScript", "C++", "Java", "SQL"],
  },
  {
    title: "AI & Machine Learning",
    skills: [
      "PyTorch",
      "TensorFlow",
      "Scikit-Learn",
      "LangChain",
      "RAG Systems",
      "LLM Engineering",
    ],
  },
  {
    title: "Robotics & Embedded Systems",
    skills: ["ROS", "Arduino", "Raspberry Pi", "ESP32", "Sensor Integration"],
  },
  {
    title: "Computer Vision",
    skills: ["OpenCV", "YOLO", "Object Detection", "SLAM", "Depth Sensing"],
  },
  {
    title: "Web Development",
    skills: ["React", "Next.js", "Node.js", "Django", "FastAPI", "PostgreSQL"],
  },
  {
    title: "Cloud & DevOps",
    skills: ["Docker", "Kubernetes", "AWS", "Azure", "GitHub Actions"],
  },
];

export const featuredProjects = [
  {
    id: "smart-home-robot",
    name: "Smart Home Robot",
    description:
      "Voice-controlled robotic assistant with computer vision navigation, obstacle avoidance, and GPT-powered natural interaction.",
    technologies: ["Python", "ROS", "OpenCV", "YOLO", "GPT-4"],
    challenges: [
      "Real-time obstacle avoidance on edge hardware",
      "Low-latency voice-to-action pipeline",
      "Multi-room SLAM without cloud dependency",
    ],
    results: [
      "95% navigation success in home environments",
      "Sub-200ms voice command response",
      "Deployed on Raspberry Pi 4 + custom chassis",
    ],
    github: "https://github.com/emmanuel-darko/smart-home-robot",
    demo: "#",
    image: "/projects/smart-home-robot.svg",
  },
  {
    id: "rag-enterprise-agent",
    name: "Enterprise RAG Agent Platform",
    description:
      "Multi-tenant AI agent system with document ingestion, hybrid search, and audit-ready conversation logs for business automation.",
    technologies: ["Python", "LangChain", "FastAPI", "PostgreSQL", "React"],
    challenges: [
      "Accurate retrieval across heterogeneous document formats",
      "Tenant isolation and compliance logging",
      "Cost-efficient embedding refresh strategy",
    ],
    results: [
      "40% reduction in support ticket handling time",
      "99.2% retrieval precision on internal benchmarks",
      "SOC2-ready audit trail architecture",
    ],
    github: "https://github.com/emmanuel-darko/rag-agent-platform",
    demo: "#",
    image: "/projects/rag-agent.svg",
  },
  {
    id: "fleet-autonomy",
    name: "Autonomous Fleet Monitoring",
    description:
      "Sensor fusion dashboard for warehouse AMRs with predictive maintenance alerts and live telemetry visualization.",
    technologies: ["TypeScript", "Node.js", "MQTT", "ROS 2", "Docker"],
    challenges: [
      "High-frequency telemetry ingestion",
      "Cross-protocol sensor normalization",
      "Predictive failure detection with limited labels",
    ],
    results: [
      "Monitors 50+ robots in real time",
      "30% downtime reduction via early alerts",
      "Unified API for ops and engineering teams",
    ],
    github: "https://github.com/emmanuel-darko/fleet-monitor",
    demo: "#",
    image: "/projects/fleet-monitor.svg",
  },
];

export const aiRoboticsShowcase = [
  {
    title: "AI Agents",
    description: "Task-oriented agents with tool use, memory, and RAG over private knowledge bases.",
    tags: ["LangChain", "RAG", "GPT"],
  },
  {
    title: "Computer Vision",
    description: "Real-time detection, tracking, and scene understanding for robotics and security.",
    tags: ["YOLO", "OpenCV", "TensorRT"],
  },
  {
    title: "Robotics Systems",
    description: "Mobile manipulators, AMRs, and custom ROS 2 stacks for indoor navigation.",
    tags: ["ROS 2", "MoveIt", "Nav2"],
  },
  {
    title: "Autonomous Vehicles",
    description: "Sensor fusion prototypes combining LiDAR, camera, and IMU for path planning.",
    tags: ["SLAM", "Kalman Filter", "C++"],
  },
  {
    title: "Sensor Networks",
    description: "ESP32-based IoT meshes with edge preprocessing and cloud aggregation.",
    tags: ["ESP32", "MQTT", "InfluxDB"],
  },
  {
    title: "Industrial Automation",
    description: "PLC integration, vision-guided pick-and-place, and MES-connected workflows.",
    tags: ["OPC-UA", "Vision", "Python"],
  },
];

export const experience = [
  {
    company: "ManuelTech",
    position: "Founder & Lead Engineer",
    duration: "2022 — Present",
    responsibilities: [
      "Built management systems for SMEs",
      "Developed AI solutions and LLM integrations",
      "Created automation systems for operations teams",
      "Designed robotics products and prototypes",
    ],
    achievements: [
      "Delivered 15+ production systems across AI, web, and robotics",
      "Grew client base through referrals and technical demos",
      "Established open-source robotics tooling used by local makers",
    ],
  },
  {
    company: "TechVision Labs",
    position: "Senior AI Engineer",
    duration: "2020 — 2022",
    responsibilities: [
      "Led computer vision pipelines for industrial inspection",
      "Mentored junior engineers on MLOps practices",
      "Architected microservices for model serving",
    ],
    achievements: [
      "Reduced false positives by 28% on defect detection",
      "Cut model deployment time from days to hours",
    ],
  },
  {
    company: "RoboSystems Inc.",
    position: "Robotics Software Engineer",
    duration: "2018 — 2020",
    responsibilities: [
      "Developed ROS navigation stacks for warehouse robots",
      "Integrated LiDAR and depth cameras for localization",
      "Collaborated with hardware team on sensor placement",
    ],
    achievements: [
      "Shipped 3 autonomous navigation releases to production",
      "Published internal SLAM tuning guide adopted company-wide",
    ],
  },
];

export const researchItems = [
  {
    title: "Efficient Edge SLAM for Resource-Constrained Robots",
    type: "Technical Article",
    year: "2024",
    link: "#",
    description: "Comparative study of lightweight SLAM backends on ARM SBCs.",
  },
  {
    title: "Hybrid Retrieval for Domain-Specific LLMs",
    type: "White Paper",
    year: "2023",
    link: "#",
    description: "Dense + sparse retrieval patterns for enterprise knowledge bases.",
  },
  {
    title: "ROS 2 Navigation Tuning Experiments",
    type: "Open Source",
    year: "2023",
    link: "https://github.com/emmanuel-darko",
    description: "Reproducible configs and benchmarks for Nav2 in cluttered spaces.",
  },
];

export const certifications = [
  {
    name: "Machine Learning Specialization",
    issuer: "Stanford Online / Coursera",
    year: "2023",
    verifyUrl: "#",
  },
  {
    name: "Deep Learning Specialization",
    issuer: "deeplearning.ai",
    year: "2022",
    verifyUrl: "#",
  },
  {
    name: "AWS Solutions Architect Associate",
    issuer: "Amazon Web Services",
    year: "2022",
    verifyUrl: "#",
  },
  {
    name: "ROS for Robotics Programming",
    issuer: "The Construct",
    year: "2021",
    verifyUrl: "#",
  },
];

export const services = [
  {
    title: "AI Development",
    description: "Custom models, RAG pipelines, agents, and MLOps for production workloads.",
    icon: "brain",
  },
  {
    title: "Web Development",
    description: "Scalable React/Next.js apps with robust Node.js APIs and PostgreSQL backends.",
    icon: "globe",
  },
  {
    title: "Robotics Solutions",
    description: "ROS stacks, navigation, perception, and hardware-software integration.",
    icon: "bot",
  },
  {
    title: "Business Automation",
    description: "Workflow automation, integrations, and intelligent document processing.",
    icon: "workflow",
  },
  {
    title: "Computer Vision Systems",
    description: "Detection, tracking, inspection, and edge deployment on cameras and SBCs.",
    icon: "eye",
  },
  {
    title: "Custom Software",
    description: "End-to-end product engineering from prototype to maintained production.",
    icon: "code",
  },
];

export const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO, LogiFlow",
    quote:
      "Emmanuel delivered an AI automation platform that cut our ops overhead in half. Deep technical skill and clear communication throughout.",
    avatar: "SC",
  },
  {
    name: "Marcus Webb",
    role: "Product Lead, AutoSense",
    quote:
      "The robotics navigation stack was production-ready ahead of schedule. Rare combination of AI and embedded expertise.",
    avatar: "MW",
  },
  {
    name: "Amina Okonkwo",
    role: "Founder, GreenField IoT",
    quote:
      "Our sensor network went from prototype to deployed fleet in weeks. Highly recommend for complex hardware-software projects.",
    avatar: "AO",
  },
];
