export const candidates = [
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    role: "Senior UX Designer",
    currentRole: "Lead Product Designer at Northstar",
    yearsExperience: 8,
    location: "Austin, TX",
    salary: "$162k/yr",
    matchScore: 94,
    interestScore: 88,
    finalScore: 92,
    status: "Open to Work",
    skills: ["User Research", "Figma", "Design Ops", "Product Strategy", "Accessibility", "Journey Mapping"],
    highlightedSkills: ["User Research", "Figma", "Design Ops"],
    bio: "Design leader focused on research-backed product systems and cross-functional collaboration for growth-stage product teams.",
    insight: "Candidate is highly aligned on systems thinking and has shown consistent retention impact across design orgs.",
    timeline: [
      {
        years: "2021 - Present",
        title: "Lead Product Designer",
        company: "Northstar Labs",
        summary: "Built a unified design system that supported six product teams and improved design delivery speed by 33%.",
      },
      {
        years: "2018 - 2021",
        title: "Senior UX Designer",
        company: "Vista Commerce",
        summary: "Led end-to-end research and redesign of the checkout funnel, improving conversion by 18%.",
      },
    ],
    messages: [
      {
        sender: "ai",
        time: "10:12 AM",
        text: "Hi Alex! Your experience leading research-heavy design systems stood out. Would you be open to a senior product design role with a fast-growing B2B platform?",
      },
      {
        sender: "candidate",
        time: "10:14 AM",
        text: "Yes, I am interested. I would love to hear how mature their design operations are and how close the role is to product strategy.",
      },
      {
        sender: "ai",
        time: "10:15 AM",
        text: "That is a strong fit. Product and design are tightly aligned, and the role owns both systems quality and experimentation velocity.",
      },
    ],
  },
  {
    id: "marcus-chen",
    name: "Marcus Chen",
    role: "UX Strategy Lead",
    currentRole: "Design Director at Elevate Studio",
    yearsExperience: 12,
    location: "Seattle, WA",
    salary: "$188k/yr",
    matchScore: 89,
    interestScore: 75,
    finalScore: 85,
    status: "Passive",
    skills: ["Product Strategy", "Prototyping", "Design Leadership", "Stakeholder Alignment", "Workshop Facilitation"],
    highlightedSkills: ["Product Strategy", "Prototyping"],
    bio: "Experienced design strategy leader with a strong track record in enterprise transformation and service design.",
    insight: "Strong executive presence and stakeholder management. Interest is moderate but could rise with clearer role autonomy.",
    timeline: [
      {
        years: "2020 - Present",
        title: "Design Director",
        company: "Elevate Studio",
        summary: "Guided enterprise product vision for clients in healthcare and fintech with globally distributed teams.",
      },
      {
        years: "2014 - 2020",
        title: "Principal UX Strategist",
        company: "BrightLayer",
        summary: "Owned concept development and prototyping for multi-product initiatives spanning web and mobile.",
      },
    ],
    messages: [
      {
        sender: "ai",
        time: "9:08 AM",
        text: "Hi Marcus, your strategy work in regulated industries caught our eye. Are you open to hearing about a design leadership role with real product ownership?",
      },
      {
        sender: "candidate",
        time: "9:22 AM",
        text: "Potentially. It depends on how empowered the role is and whether there is executive sponsorship for design.",
      },
    ],
  },
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    role: "Senior Frontend Engineer",
    currentRole: "Lead UI Architect at TechFlow Solutions",
    yearsExperience: 8,
    location: "Remote",
    salary: "$145k/yr",
    matchScore: 82,
    interestScore: 95,
    finalScore: 84,
    status: "Highly Engaged",
    skills: ["React / Next.js", "TypeScript", "Tailwind CSS", "Node.js", "GraphQL", "Figma"],
    highlightedSkills: ["React / Next.js", "TypeScript", "Tailwind CSS"],
    bio: "Passionate developer with 8+ years of experience building scalable design systems and high-performance React applications. Currently focusing on accessible UI and AI-driven user experiences.",
    insight: "Candidate shows high engagement with technical culture. Highlighting team autonomy should maintain momentum.",
    timeline: [
      {
        years: "2021 - Present",
        title: "Lead UI Architect",
        company: "TechFlow Solutions",
        summary: "Leading a team of 12 developers to rebuild the core design system used by 50+ internal products.",
      },
      {
        years: "2018 - 2021",
        title: "Senior Frontend Developer",
        company: "Innovate Global",
        summary: "Developed real-time analytics dashboards using React and D3.js, improving load times by 40%.",
      },
    ],
    messages: [
      {
        sender: "ai",
        time: "10:24 AM",
        text: "Hi Elena! I've been reviewing your portfolio. Your work on TechFlow's design system is impressive. Are you open to discussing a Lead role at a Series B fintech startup?",
      },
      {
        sender: "candidate",
        time: "10:26 AM",
        text: "Thanks! I'm definitely interested. Can you tell me more about their tech stack and how they approach accessibility?",
      },
      {
        sender: "ai",
        time: "10:27 AM",
        text: "Absolutely. They're using Next.js 14 and Tailwind. Accessibility is a top priority and they're aiming for full WCAG 2.1 compliance.",
      },
      {
        sender: "candidate",
        time: "10:30 AM",
        text: "That sounds great. I'd love to see the product in action. Do you have a demo or a case study you can share?",
      },
    ],
  },
];

export const dashboardPreviewCandidates = candidates.slice(0, 2);

export function getCandidateById(id) {
  return candidates.find((candidate) => candidate.id === id);
}
