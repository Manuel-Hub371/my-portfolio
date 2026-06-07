import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./mongoose.js";
import { AdminUser } from "../models/AdminUser.js";
import { PortfolioProfile } from "../models/PortfolioProfile.js";
import { Service } from "../models/Service.js";
import { Project } from "../models/Project.js";
import { BlogPost } from "../models/BlogPost.js";

const defaultSiteConfig = {
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

const defaultAbout = {
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
  technologies: ["Python", "TypeScript", "ROS 2", "PyTorch", "React", "Next.js", "PostgreSQL", "Docker", "AWS"],
  goals:
    "Ship reliable AI products, advance open robotics research, and help organizations automate intelligently at scale.",
  experience: [
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
  ],
  research: [
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
  ],
  certifications: [
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
  ],
  testimonials: [
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
  ],
};


const defaultServices = [
  { title: "AI Development", description: "Custom models, RAG pipelines, agents, and MLOps for production workloads.", icon: "brain" },
  { title: "Web Development", description: "Scalable React/Next.js apps with robust Node.js APIs and PostgreSQL backends.", icon: "globe" },
  { title: "Robotics Solutions", description: "ROS stacks, navigation, perception, and hardware-software integration.", icon: "bot" },
  { title: "Business Automation", description: "Workflow automation, integrations, and intelligent document processing.", icon: "workflow" },
  { title: "Computer Vision Systems", description: "Detection, tracking, inspection, and edge deployment on cameras and SBCs.", icon: "eye" },
  { title: "Custom Software", description: "End-to-end product engineering from prototype to maintained production.", icon: "code" },
];

const defaultProjects = [
  {
    slug: "smart-home-robot",
    name: "Smart Home Robot",
    description: "Voice-controlled robotic assistant with computer vision navigation, obstacle avoidance, and GPT-powered natural interaction.",
    technologies: ["Python", "ROS", "OpenCV", "YOLO", "GPT-4"],
    challenges: ["Real-time obstacle avoidance on edge hardware", "Low-latency voice-to-action pipeline"],
    results: ["95% navigation success in home environments", "Sub-200ms voice command response"],
    github: "https://github.com/emmanuel-darko/smart-home-robot",
    demo: "#",
    image: "",
  },
  {
    slug: "rag-enterprise-agent",
    name: "Enterprise RAG Agent Platform",
    description: "Multi-tenant AI agent system with document ingestion, hybrid search, and audit-ready conversation logs.",
    technologies: ["Python", "LangChain", "FastAPI", "PostgreSQL", "React"],
    challenges: ["Accurate retrieval across heterogeneous document formats"],
    results: ["40% reduction in support ticket handling time"],
    github: "https://github.com/emmanuel-darko/rag-agent-platform",
    demo: "#",
    image: "",
  },
];

const defaultPosts = [
  {
    slug: "building-ai-agents-with-rag",
    title: "Building AI Agents with RAG",
    description: "A practical guide to retrieval-augmented generation for enterprise knowledge bases.",
    body: "## Why RAG?\n\nPure LLMs hallucinate on domain-specific facts. RAG injects relevant context at inference time.\n\n## Architecture\n\n1. Ingestion\n2. Embedding\n3. Retrieval\n4. Generation",
    tags: ["AI", "RAG", "LangChain"],
  },
  {
    slug: "designing-autonomous-robots",
    title: "Designing Autonomous Robots",
    description: "From sensors to Nav2 — architecting mobile robots that navigate reliably.",
    body: "## Perception\n\nCameras and LiDAR provide complementary data.\n\n## Navigation\n\nNav2 behavior trees compose recovery behaviors.",
    tags: ["Robotics", "ROS"],
  },
];

async function seed() {
  await connectDB();

  // Clear existing databases to run clean seed
  console.log("Clearing existing database collections...");
  await AdminUser.deleteMany({});
  await PortfolioProfile.deleteMany({});
  await Service.deleteMany({});
  await Project.deleteMany({});
  await BlogPost.deleteMany({});

  const email = (process.env.ADMIN_EMAIL ?? "admin@manueltech.dev").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const hash = await bcrypt.hash(password, 12);

  // Admin User
  await AdminUser.create({
    email,
    passwordHash: hash,
  });

  // Portfolio Profile
  await PortfolioProfile.create({
    siteConfig: defaultSiteConfig,
    aboutContent: defaultAbout,
  });

  // Services
  for (let i = 0; i < defaultServices.length; i++) {
    const s = defaultServices[i];
    await Service.create({
      ...s,
      sortOrder: i,
    });
  }

  // Projects
  for (let i = 0; i < defaultProjects.length; i++) {
    const p = defaultProjects[i];
    await Project.create({
      ...p,
      sortOrder: i,
    });
  }

  // Blog Posts
  for (const post of defaultPosts) {
    await BlogPost.create({
      ...post,
      published: true,
      publishedAt: new Date(),
    });
  }

  console.log("Database seeded successfully with MongoDB.");
  console.log(`Admin login: ${email} / (password from ADMIN_PASSWORD env)`);
  
  await mongoose.connection.close();
}

seed().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.connection.close();
  } catch {}
  process.exit(1);
});
