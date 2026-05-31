import {
  Smartphone,
  Bot,
  Palette,
  Camera,
  Video,
  Film,
  Lightbulb,
  PenLine,
  FileSearch,
  Megaphone,
  PartyPopper,
  Mic,
  type LucideIcon,
} from "lucide-react";

export type DepartmentCategory =
  | "Creative Media"
  | "Communication & Leadership"
  | "Digital Content"
  | "Strategy & Operations";

export interface Department {
  id: string;
  name: string;
  emoji: string;
  short: string;
  description: string;
  icon: LucideIcon;
  category: DepartmentCategory;
}

export const DEPARTMENTS: Department[] = [
  {
    id: "social-media",
    name: "Social Media Handling",
    emoji: "📱",
    short: "Curate the official voice across platforms.",
    description: "Plan, post, and engage across the college's official handles.",
    icon: Smartphone,
    category: "Digital Content",
  },
  {
    id: "ai-tools",
    name: "AI Tools & Digital Assistance",
    emoji: "🤖",
    short: "Use AI to amplify creativity & speed.",
    description: "Leverage modern AI tooling to accelerate content workflows.",
    icon: Bot,
    category: "Digital Content",
  },
  {
    id: "graphic-design",
    name: "Graphic Designing",
    emoji: "🎨",
    short: "Craft visuals that define the brand.",
    description: "Posters, post designs, branding kits, and visual systems.",
    icon: Palette,
    category: "Creative Media",
  },
  {
    id: "photography",
    name: "Photography",
    emoji: "📸",
    short: "Capture stories one frame at a time.",
    description: "Cover events and shoot campaigns with a cinematic eye.",
    icon: Camera,
    category: "Creative Media",
  },
  {
    id: "videography",
    name: "Videography",
    emoji: "🎥",
    short: "Document moments in motion.",
    description: "Shoot reels, aftermovies, and behind-the-scenes coverage.",
    icon: Video,
    category: "Creative Media",
  },
  {
    id: "video-editing",
    name: "Video Editing",
    emoji: "🎬",
    short: "Cut, color, and craft cinematic edits.",
    description: "Edit reels, recap videos, and promotional content.",
    icon: Film,
    category: "Creative Media",
  },
  {
    id: "content-creation",
    name: "Content Creation",
    emoji: "💡",
    short: "Ideate scroll-stopping concepts.",
    description: "Conceptualize series, campaigns, and digital storytelling formats.",
    icon: Lightbulb,
    category: "Digital Content",
  },
  {
    id: "content-writing",
    name: "Content Writing",
    emoji: "✍",
    short: "Write copy that lands.",
    description: "Captions, scripts, articles, and brand voice writing.",
    icon: PenLine,
    category: "Communication & Leadership",
  },
  {
    id: "research",
    name: "Research & Documentation",
    emoji: "📝",
    short: "Insights that drive every campaign.",
    description: "Research trends, document achievements, and archive history.",
    icon: FileSearch,
    category: "Strategy & Operations",
  },
  {
    id: "promotion",
    name: "Promotion (Online & Offline)",
    emoji: "📢",
    short: "Take the message everywhere.",
    description: "Distribute and amplify content across channels.",
    icon: Megaphone,
    category: "Communication & Leadership",
  },
  {
    id: "event-management",
    name: "Event Management",
    emoji: "🎪",
    short: "Execute flawless on-ground experiences.",
    description: "Plan, coordinate, and run institutional events end-to-end.",
    icon: PartyPopper,
    category: "Strategy & Operations",
  },
  {
    id: "voice-over",
    name: "Voice Over",
    emoji: "🎙",
    short: "Lend your voice to the brand.",
    description: "Narrate reels, podcasts, announcements, and promo videos.",
    icon: Mic,
    category: "Communication & Leadership",
  },
];

export function deriveInsight(selectedIds: string[]): string {
  if (selectedIds.length !== 3) return "";
  const tally: Record<DepartmentCategory, number> = {
    "Creative Media": 0,
    "Communication & Leadership": 0,
    "Digital Content": 0,
    "Strategy & Operations": 0,
  };
  for (const id of selectedIds) {
    const dep = DEPARTMENTS.find((d) => d.id === id);
    if (dep) tally[dep.category] += 1;
  }
  const top = (Object.entries(tally) as [DepartmentCategory, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
  const map: Record<DepartmentCategory, string> = {
    "Creative Media":
      "Your interests indicate a strong inclination toward Creative Media — visuals, photography, and cinematic storytelling.",
    "Communication & Leadership":
      "Your interests indicate strengths in Communication & Leadership — voice, writing, and promotion.",
    "Digital Content":
      "Your interests indicate strong Digital Content Potential — social, AI, and modern content workflows.",
    "Strategy & Operations":
      "Your interests indicate sharp Strategy & Operations instincts — research, planning, and event execution.",
  };
  return map[top];
}
