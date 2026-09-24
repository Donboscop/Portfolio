import React from 'react';
import { 
  Code, 
  Layers, 
  Cpu, 
  Zap, 
  Globe, 
  Star, 
  ArrowUpRight, 
  Github, 
  ExternalLink, 
  Award, 
  Briefcase, 
  Mail, 
  User, 
  Database, 
  Terminal, 
  ShieldCheck, 
  Sparkles,
  Layout,
  Smartphone,
  Server
} from 'lucide-react';

const iconMap = {
  code: Code,
  layers: Layers,
  cpu: Cpu,
  zap: Zap,
  globe: Globe,
  star: Star,
  arrow: ArrowUpRight,
  github: Github,
  external: ExternalLink,
  award: Award,
  briefcase: Briefcase,
  mail: Mail,
  user: User,
  database: Database,
  terminal: Terminal,
  shield: ShieldCheck,
  sparkles: Sparkles,
  layout: Layout,
  mobile: Smartphone,
  server: Server
};

export default function IconsaxIcon({ name = 'code', size = 20, className = '', color }) {
  const IconComponent = iconMap[name.toLowerCase()] || Code;
  return (
    <span className={`inline-flex items-center justify-center p-1.5 rounded-xl bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 icon-glow ${className}`}>
      <IconComponent size={size} color={color} className="stroke-[2.2]" />
    </span>
  );
}
