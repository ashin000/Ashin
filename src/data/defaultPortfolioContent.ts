import { certificatesData } from '../components/sections/Certificates';
import { timelineEvents } from '../components/sections/Experience';
import { servicesData } from '../components/sections/Services';
import { skillsData } from '../components/sections/Skills';
import { statsData } from '../components/sections/Stats';
import profileImage from '../assets/profile.jpg';
import { projectsData } from './projectsData';
import type { PortfolioContent } from './portfolioContent';

export const defaultPortfolioContent: PortfolioContent = {
  profile: {
    name: 'ASHIN R',
    roles: ['AI Engineer', 'Machine Learning Engineer', 'Full Stack Developer', 'Product Developer', 'Python Developer', 'Automation Engineer'],
    summary: 'Building intelligent software that transforms ideas into real-world solutions through Artificial Intelligence, Full Stack Development, and Modern Technologies.',
    imageUrl: profileImage,
    resumeUrl: '/resume.pdf',
  },
  about: {
    opening: 'My curiosity started with one question: How machines think like humans?',
    paragraphs: [
      'That single question inspired my journey into Artificial Intelligence. Today I build intelligent software, AI systems, automation tools, IoT applications, and modern web platforms that solve real-world problems.',
      'I believe every unfamiliar technology is simply another opportunity to learn. Whenever I encounter a new challenge, I quickly adapt, learn what is necessary, and build the solution.',
    ],
    mission: 'Pioneering intelligent software architectures that bridge complex data structures with intuitive human interfaces.',
    vision: 'Accelerating developer capabilities and enterprise scalability by automating deployment, systems, and workflow engines.',
    values: 'Cultivating a growth mindset, practicing technical integrity, and deploying responsive systems built on solid principles.',
  },
  contact: {
    email: 'ashin@example.com',
    phone: '+91 98765 43210',
    location: 'Kerala, India',
    linkedin: 'https://in.linkedin.com/in/ashin-r-05a4b9325',
    github: 'https://github.com/ashin000',
    instagram: 'https://instagram.com',
    introTitle: "Let's Build Something Revolutionary",
    intro: 'Whether you want to discuss AI integrations, full-stack architectures, or have an open role for a forward-thinking AI Engineer—drop a line.',
  },
  stats: statsData.map(({ icon: _icon, ...stat }) => ({ ...stat, iconKey: stat.label })),
  experience: timelineEvents.map((event) => ({ ...event })),
  skills: skillsData.map(({ icon: _icon, skills, ...category }) => ({
    ...category,
    skills: skills.map((skill) => skill.name),
  })),
  projects: projectsData.map((project) => ({ ...project })),
  certificates: certificatesData.map((certificate) => ({ ...certificate })),
  services: servicesData.map(({ icon: _icon, ...service }) => ({ ...service, iconKey: service.title })),
};
