// This file simulates the data we would get from the backend APIs.

export const mockResumeData = {
  // --- Personal & Contact Information ---
  personal: {
    name: "Pavan Reddy",
    title: "Software Engineer & AI Enthusiast",
    phone: "(555) 123-4567",
    email: "pavanreddy@example.com",
    linkedin: "linkedin.com/in/pavanreddy",
    github: "github.com/alex-dev",
    location: "HYD, India",
  },

  // --- Auto-Generated Summary (Editable in UI) ---
  summary:
    "Highly motivated and results-oriented Software Engineer with 3 years of experience in full-stack development. Successfully led two major projects, incorporating modern React and Next.js frameworks. Proven ability to quickly master new technologies and deliver scalable solutions, as verified through internal project modules and online course certifications.",

  // --- Education ---
  education: [
    {
      institution: "State University of Technology",
      degree: "B.S. in Computer Science",
      gpa: "3.9/4.0",
      startDate: "Sept 2018",
      endDate: "May 2022",
    },
    {
      institution: "Online Certification Institute", // NEW ENTRY
      degree: "Certified Full-Stack Developer",
      gpa: "N/A",
      startDate: "June 2022",
      endDate: "Sept 2022",
    },
  ],

  // --- Experience ---
  experience: [
    {
      company: "Innovatech Solutions",
      title: "Full-Stack Intern",
      startDate: "May 2021",
      endDate: "Aug 2021",
      achievements: [
        "Developed and deployed a customer feedback module using React, reducing manual data entry by 30%.",
        "Integrated third-party APIs for payment processing, improving checkout flow security.",
      ],
      isVerified: true, // Verification Module flag
    },
  ],

  // --- Projects ---
  projects: [
    {
      name: "Dynamic Resume Generator (Hackathon Project)",
      role: "Lead Developer",
      startDate: "Jan 2022",
      description: "Built a web application that generates professional resumes from uploaded JSON data using Next.js and Tailwind CSS.",
      techStack: ["Next.js", "Tailwind CSS", "Node.js"],
      isVerified: true, // Verification Module flag
    },
  ],

  // --- Skills ---
  skills: {
    languages: ["JavaScript", "Python", "SQL", "C++"],
    frameworks: ["React", "Next.js", "Express.js", "Tailwind CSS"],
    tools: ["Git", "Docker", "AWS", "Jira"],
  },
};