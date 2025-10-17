// app/page.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */ // <-- THIS IS THE FINAL FIX

import { useState } from 'react'; 
import { mockResumeData } from "../data/mockResumeData"; 
import React from 'react';

// --- Initializing data for editable headings ---
const initialHeadings = {
    summary: 'SUMMARY',
    skills: 'SKILLS',
    experience: 'PROFESSIONAL EXPERIENCE',
    projects: 'KEY PROJECTS',
    education: 'EDUCATION',
};

// Define the type for the headings keys
type HeadingKeys = keyof typeof initialHeadings;
// Define a union type for the valid resume data category keys
type ResumeKeys = 'experience' | 'education' | 'projects' | 'summary' | 'personal';
type CategoryType = ResumeKeys | 'headings'; 


// --- Templates for new entries (CRITICAL FOR 'ADD' BUTTONS) ---
const newEducationTemplate = {
    institution: "New University/Course",
    degree: "New Degree/Certification",
    gpa: "N/A",
    startDate: "Month YYYY",
    endDate: "Present",
};

const newExperienceTemplate = {
    company: "New Company Name",
    title: "Job Title",
    startDate: "Month YYYY",
    endDate: "Present",
    achievements: ["New achievement 1", "New achievement 2"],
    isVerified: false,
};

const newProjectTemplate = {
    name: "New Project Title",
    role: "Your Role",
    startDate: "Month YYYY",
    description: "Brief description of the project.",
    techStack: ["Tech A", "Tech B"],
    isVerified: false,
};


export default function Home() {
  // 1. State for all resume content
  const [resumeData, setResumeData] = useState(mockResumeData); 
  // 2. State for editable headings
  const [headings, setHeadings] = useState(initialHeadings);
  // 3. State for the active theme (accent color)
  const [theme, setTheme] = useState("default"); 
  // 4. State for the active font style
  const [fontStyle, setFontStyle] = useState("font-style-default");
  // 5. State for the paper background color
  const [paperBg, setPaperBg] = useState("paper-bg-white"); 

  const resume = resumeData; // For convenience

  /* --- CRUD FUNCTIONS (CREATE) --- */
  const addEntry = (category: ResumeKeys, template: any) => {
    setResumeData(prevData => ({
      ...prevData,
      [category]: [...(prevData as any)[category], template]
    }));
  };

  /* --- CRUD FUNCTIONS (DELETE) --- */
  const removeEntry = (category: ResumeKeys, indexToRemove: number) => {
    setResumeData(prevData => {
        const updatedArray = (prevData as any)[category].filter((_: any, i: number) => i !== indexToRemove);
        return {
            ...prevData,
            [category]: updatedArray
        };
    });
  };


  /* --- UNIVERSAL LIVE EDITING FUNCTION (UPDATE) --- */
  const handleLiveEdit = (category: CategoryType, field: string, newValue: string | string[], index?: number) => {
    
    // Check if we are editing a HEADING
    if (category === 'headings') {
        setHeadings(prev => ({ ...prev, [field as HeadingKeys]: (newValue as string).toUpperCase() }));
        return;
    }

    // Handle content state updates
    setResumeData(prevData => {
        const prevDataAny = prevData as any;

        if (index !== undefined) {
            // Update items in arrays (Experience, Education, Projects)
            const updatedArray = prevDataAny[category].map((item: any, i: number) => {
                if (i === index) {
                    return { ...item, [field]: newValue };
                }
                return item;
            });
            return { ...prevData, [category]: updatedArray };
        }
        
        // Update simple top-level fields (Personal, Summary)
        return {
            ...prevData,
            [category]: category === 'summary' ? newValue : { ...prevDataAny[category], [field]: newValue },
        };
    });
  };
  /* --- END UNIVERSAL LIVE EDITING FUNCTION --- */


  /* --- RENDER FUNCTION FOR EDITABLE FIELDS (ContentEditable for single lines) --- */
  const EditableText = ({ tag, category, field, index, className, style }: any) => { 
    const Tag = tag || 'span';
    
    // Determine the current value from the state
    let currentValue = '';
    const resumeDataAny = resumeData as any;

    if (category === 'headings') {
        currentValue = headings[field as HeadingKeys] || ''; 
    } else if (index !== undefined) {
        currentValue = resumeDataAny[category][index][field] || '';
    } else if (category === 'personal') {
        currentValue = resumeDataAny.personal[field] || '';
    }
    
    const handleBlur = (e: React.FocusEvent<HTMLElement>) => { 
        handleLiveEdit(category, field, e.currentTarget.textContent || '', index);
    };

    return (
      <Tag 
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={handleBlur} 
        className={`${className} focus:outline-none focus:bg-yellow-50 focus:rounded-sm transition cursor-text`}
        dangerouslySetInnerHTML={{ __html: currentValue }}
        style={style}
      />
    );
  };


  return (
    <div className="flex min-h-screen bg-gray-100"> 
      
      {/* 1. Customization Panel (1/3 width, with dedicated editing sections) */}
      <div className="w-1/3 p-6 border-r border-gray-300 bg-white shadow-lg sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Resume Customizer
        </h2>
        
        {/* --- LIVE EDITING GUIDE --- */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h3 className="text-lg font-bold text-indigo-600 mb-4">
            Editing Mode
          </h3>
          <p className="text-sm text-gray-700 mb-4">
                **Direct Edit:** Click on any single text field (Name, Dates, Title) on the resume to update it instantly.
                **Multi-line Edit:** Use the sections below for descriptions and achievements.
          </p>
        </div>


        {/* ========================================= */}
        {/* === SECTION-SPECIFIC EDITING FORMS (Mirroring Resume Flow) === */}
        {/* ========================================= */}

        {/* --- 1. DEDICATED SUMMARY EDITOR (Multi-line focus) --- */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Edit Professional Summary
          </h3>
          <textarea
            rows={6}
            className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={resume.summary}
            onChange={(e) => {
              setResumeData({ ...resumeData, summary: e.target.value });
            }}
          />
        </div>
        
        {/* --- 2. DEDICATED EXPERIENCE EDITOR --- */}
        <div className="mb-8 border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
                Edit: Professional Experience
            </h3>
            {/* ADD NEW BUTTON */}
            <button 
                onClick={() => addEntry('experience', newExperienceTemplate)}
                className="mb-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-4 rounded text-sm transition"
            >
                + Add New Job/Internship
            </button>
            
            {resume.experience.map((job, jobIndex) => (
                <div key={jobIndex} className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200 relative">
                    <p className="text-xs font-semibold text-indigo-600 mb-2">Entry #{jobIndex + 1}: {job.title} at {job.company}</p>
                    
                    {/* REMOVE BUTTON */}
                    <button 
                        onClick={() => removeEntry('experience', jobIndex)}
                        className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-lg leading-none"
                        title="Remove Entry"
                    >
                        &times;
                    </button>

                    <p className="text-xs font-medium text-gray-700 mt-3 mb-1">Achievements (Bullet Points)</p>
                    {/* Achievements are still an array of strings, handled by separate textareas */}
                    {job.achievements.map((achievement, achIndex) => (
                        <textarea
                            key={achIndex}
                            rows={2}
                            className="w-full border border-gray-300 p-2 rounded-lg text-xs focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                            value={achievement}
                            onChange={(e) => {
                                // Logic to update the achievement array item
                                const newAchievements = [...job.achievements];
                                newAchievements[achIndex] = e.target.value;
                                handleLiveEdit('experience', 'achievements', newAchievements, jobIndex); 
                            }} 
                        />
                    ))}
                </div>
            ))}
        </div>
        
        {/* --- 3. DEDICATED PROJECTS EDITOR --- */}
        <div className="mb-8 border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
                Edit: Key Projects
            </h3>
            {/* ADD NEW BUTTON */}
            <button 
                onClick={() => addEntry('projects', newProjectTemplate)}
                className="mb-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-4 rounded text-sm transition"
            >
                + Add New Project
            </button>
            {resume.projects.map((project, projIndex) => (
                <div key={projIndex} className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200 relative">
                    <p className="text-xs font-semibold text-indigo-600 mb-2">Entry #{projIndex + 1}: {project.name}</p>
                    
                    {/* REMOVE BUTTON */}
                    <button 
                        onClick={() => removeEntry('projects', projIndex)}
                        className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-lg leading-none"
                        title="Remove Entry"
                    >
                        &times;
                    </button>
                    
                    <label htmlFor={`proj-desc-${projIndex}`} className="block text-xs font-medium text-gray-700 mt-2 mb-1">Description</label>
                    <textarea
                        id={`proj-desc-${projIndex}`}
                        rows={4}
                        className="w-full border border-gray-300 p-1 rounded-lg text-xs"
                        value={project.description}
                        onChange={(e) => handleLiveEdit('projects', 'description', e.target.value, projIndex)}
                    />
                </div>
            ))}
        </div>

        {/* --- 4. DEDICATED EDUCATION EDITOR --- */}
        <div className="mb-8 border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
                Edit: Education & Certifications
            </h3>
            {/* ADD NEW BUTTON */}
            <button 
                onClick={() => addEntry('education', newEducationTemplate)}
                className="mb-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-4 rounded text-sm transition"
            >
                + Add New Education Entry
            </button>
            {resume.education.map((edu, eduIndex) => (
                <div key={eduIndex} className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200 relative">
                    <p className="text-xs font-semibold text-indigo-600 mb-2">Entry #{eduIndex + 1}: {edu.institution}</p>
                    
                    {/* REMOVE BUTTON */}
                    <button 
                        onClick={() => removeEntry('education', eduIndex)}
                        className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-lg leading-none"
                        title="Remove Entry"
                    >
                        &times;
                    </button>

                    <label htmlFor={`degree-edit-${eduIndex}`} className="block text-xs font-medium text-gray-700 mt-2 mb-1">Degree/Certification</label>
                    <textarea
                        id={`degree-edit-${eduIndex}`}
                        rows={2}
                        className="w-full border border-gray-300 p-1 rounded-lg text-xs"
                        value={edu.degree}
                        onChange={(e) => handleLiveEdit('education', 'degree', e.target.value, eduIndex)}
                    />
                </div>
            ))}
        </div>

        {/* Background Customizer */}
        <div className="mb-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Resume Paper Background</h3>
            <div className="flex gap-4">
                <button onClick={() => setPaperBg("paper-bg-white")} className={`w-10 h-10 rounded-full border-4 ${paperBg === 'paper-bg-white' ? 'border-gray-500 ring-4 ring-gray-200' : 'border-gray-200'}`} style={{ backgroundColor: '#ffffff', outline: '1px solid #ccc' }} title="White Background"><span className="text-xs text-gray-600">W</span></button>
                <button onClick={() => setPaperBg("paper-bg-light-gray")} className={`w-10 h-10 rounded-full border-4 ${paperBg === 'paper-bg-light-gray' ? 'border-gray-500 ring-4 ring-gray-200' : 'border-gray-200'}`} style={{ backgroundColor: '#f3f4f6' }} title="Light Gray Background"><span className="text-xs text-gray-600">G</span></button>
            </div>
        </div>

        /* ... (Font and Theme Customizers are correctly placed here) ... */

      </div>

      {/* 2. Resume Preview (2/3 width) - ALL FEATURES ACTIVE */}
      <div className="w-2/3 p-8">
        <div 
          className={`max-w-3xl mx-auto p-10 shadow-2xl rounded-lg ${theme} ${fontStyle}`} 
          style={{backgroundColor: 'var(--paper-bg)'}} // Uses CSS variable for paper color
        > 
          
          /* ... (Header, Summary, Skills, Experience, Projects, Education sections are correctly rendered here) ... */
          
        </div>
      </div>
    </div>
  );
}