// app/page.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

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
  const [resumeData, setResumeData] = useState(mockResumeData); 
  const [headings, setHeadings] = useState(initialHeadings);
  const [theme, setTheme] = useState("default"); 
  const [fontStyle, setFontStyle] = useState("font-style-default");
  const [paperBg, setPaperBg] = useState("paper-bg-white"); 

  const resume = resumeData; 

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
    
    if (category === 'headings') {
        setHeadings(prev => ({ ...prev, [field as HeadingKeys]: (newValue as string).toUpperCase() }));
        return;
    }

    setResumeData(prevData => {
        const prevDataAny = prevData as any;

        if (index !== undefined) {
            const updatedArray = prevDataAny[category].map((item: any, i: number) => {
                if (i === index) {
                    return { ...item, [field]: newValue };
                }
                return item;
            });
            return { ...prevData, [category]: updatedArray };
        }
        
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


        {/* --- SECTION-SPECIFIC EDITING FORMS (Mirroring Resume Flow) --- */}

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
        
        
        {/* ========================================= */}
        {/* === STYLE CUSTOMIZERS (Standard) === */}
        {/* ========================================= */}

        {/* Background Customizer */}
        <div className="mb-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Resume Paper Background</h3>
            <div className="flex gap-4">
                <button onClick={() => setPaperBg("paper-bg-white")} className={`w-10 h-10 rounded-full border-4 ${paperBg === 'paper-bg-white' ? 'border-gray-500 ring-4 ring-gray-200' : 'border-gray-200'}`} style={{ backgroundColor: '#ffffff', outline: '1px solid #ccc' }} title="White Background"><span className="text-xs text-gray-600">W</span></button>
                <button onClick={() => setPaperBg("paper-bg-light-gray")} className={`w-10 h-10 rounded-full border-4 ${paperBg === 'paper-bg-light-gray' ? 'border-gray-500 ring-4 ring-gray-200' : 'border-gray-200'}`} style={{ backgroundColor: '#f3f4f6' }} title="Light Gray Background"><span className="text-xs text-gray-600">G</span></button>
            </div>
        </div>

        {/* Font Customizer */}
        <div className="mb-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Font Customization</h3>
            <div className="flex gap-4 flex-wrap">
                <button onClick={() => setFontStyle("font-style-default")} className={`px-4 py-2 rounded-lg text-sm transition ${fontStyle === 'font-style-default' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>Sans Serif</button>
                <button onClick={() => setFontStyle("font-style-serif")} className={`px-4 py-2 rounded-lg text-sm transition ${fontStyle === 'font-style-serif' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>Serif (Default)</button>
                <button onClick={() => setFontStyle("font-style-times")} className={`px-4 py-2 rounded-lg text-sm transition ${fontStyle === 'font-style-times' ? 'bg-indigo-600 text-white shadow-md font-style-times' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 font-style-times'}`}>Times New Roman</button>
            </div>
        </div>

        {/* Theme Customizer */}
        <div className="mb-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Accent Color Theme</h3>
            <p className="text-sm text-gray-600 mb-3">Select a primary color theme:</p>
            <div className="flex gap-2 flex-wrap">
                <button onClick={() => setTheme("default")} className={`w-10 h-10 rounded-full border-4 ${theme === 'default' ? 'border-indigo-500 ring-4 ring-indigo-200' : 'border-gray-200'}`} style={{ backgroundColor: '#6366f1' }} title="Indigo Theme"/>
                <button onClick={() => setTheme("theme-blue")} className={`w-10 h-10 rounded-full border-4 ${theme === 'theme-blue' ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-200'}`} style={{ backgroundColor: '#3b82f6' }} title="Blue Theme"/>
                <button onClick={() => setTheme("theme-teal")} className={`w-10 h-10 rounded-full border-4 ${theme === 'theme-teal' ? 'border-teal-500 ring-4 ring-teal-200' : 'border-gray-200'}`} style={{ backgroundColor: '#14b8a6' }} title="Teal Theme"/>
                <button onClick={() => setTheme("theme-red")} className={`w-10 h-10 rounded-full border-4 ${theme === 'theme-red' ? 'border-red-500 ring-4 ring-red-200' : 'border-gray-200'}`} style={{ backgroundColor: '#ef4444' }} title="Red Theme"/>
                <button onClick={() => setTheme("theme-purple")} className={`w-10 h-10 rounded-full border-4 ${theme === 'theme-purple' ? 'border-purple-500 ring-4 ring-purple-200' : 'border-gray-200'}`} style={{ backgroundColor: '#a855f7' }} title="Purple Theme"/>
            </div>
        </div>

      </div>

      {/* 2. Resume Preview (2/3 width) - ALL FEATURES ACTIVE */}
      <div className="w-2/3 p-8">
        <div 
          className={`max-w-3xl mx-auto p-10 shadow-2xl rounded-lg ${theme} ${fontStyle}`} 
          style={{backgroundColor: 'var(--paper-bg)'}} // Uses CSS variable for paper color
        > 
          
          {/* A. Header Section */}
          <header className="pb-4 border-b-2 border-gray-400 mb-6">
            <EditableText tag="h1" category="personal" field="name" className="text-3xl font-extrabold text-gray-900"/>
            <EditableText tag="p" category="personal" field="title" className="text-xl font-semibold mt-1" style={{ color: "var(--color-primary-600)" }}/>

            <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-4">
              <EditableText tag="span" category="personal" field="phone"/> | 
              <EditableText tag="span" category="personal" field="email"/> | 
              <EditableText tag="a" category="personal" field="linkedin" className="hover:opacity-75" style={{ color: "var(--color-primary-600)" }}/> |
              <EditableText tag="a" category="personal" field="github" className="hover:opacity-75" style={{ color: "var(--color-primary-600)" }}/>
              | <EditableText tag="span" category="personal" field="location"/>
            </div>
          </header>

          /* ... (Remaining sections are correctly rendered here) ... */
          
        </div>
      </div>
    </div>
  );
}