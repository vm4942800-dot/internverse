/* ══════════════════════════════════════════════════════════════════════════════
   internVerse — Smart Internship Finder (Web)
   Pure JS — no server, no dependencies. Runs entirely in the browser.
   ══════════════════════════════════════════════════════════════════════════════ */

// ─── STATE ──────────────────────────────────────────────────────────────────
let selectedSkills = [];
let currentResults = [];

// ═══════════════════════════════════════════════════════════════════════════════
//  INTERNSHIP DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

const INTERNSHIPS = [
    // ── CS/IT ──
    {
        id: 1, company: "Google", title: "Software Engineering Intern",
        stream: "CS/IT", eligible: ["CS/IT", "Electronics", "Data Science"],
        required: ["Python", "Data Structures"], preferred: ["Java", "C++", "Algorithms"],
        location: "Bangalore", remote: false, duration: 6, minCgpa: 7.0,
        stipend: "₹80,000/mo", url: "https://careers.google.com",
        desc: "Work on real Google products alongside senior engineers. Design, code, and test software.",
    },
    {
        id: 2, company: "Microsoft", title: "Software Engineering Intern",
        stream: "CS/IT", eligible: ["CS/IT", "Electronics"],
        required: ["C#", "Python", "Data Structures"], preferred: ["Azure", "JavaScript", "TypeScript"],
        location: "Hyderabad", remote: false, duration: 6, minCgpa: 7.5,
        stipend: "₹75,000/mo", url: "https://careers.microsoft.com",
        desc: "Build innovative solutions for Microsoft cloud and AI products.",
    },
    {
        id: 3, company: "Infosys", title: "Full Stack Developer Intern",
        stream: "CS/IT", eligible: ["CS/IT", "Electronics"],
        required: ["HTML", "CSS", "JavaScript"], preferred: ["React", "Node.js", "SQL"],
        location: "Pune", remote: false, duration: 3, minCgpa: 6.0,
        stipend: "₹15,000/mo", url: "https://www.infosys.com/careers",
        desc: "Develop end-to-end web applications using modern frameworks.",
    },
    {
        id: 4, company: "Stripe", title: "Data Engineering Intern",
        stream: "CS/IT", eligible: ["CS/IT", "Data Science", "Mathematics"],
        required: ["Python", "SQL"], preferred: ["Spark", "Hadoop", "ETL"],
        location: "Remote", remote: true, duration: 4, minCgpa: 7.0,
        stipend: "₹60,000/mo", url: "https://stripe.com/jobs",
        desc: "Build and maintain data pipelines that power Stripe's financial infrastructure.",
    },
    {
        id: 5, company: "TCS", title: "AI/ML Intern",
        stream: "CS/IT", eligible: ["CS/IT", "Data Science", "Electronics", "Mathematics"],
        required: ["Python", "Machine Learning"], preferred: ["TensorFlow", "PyTorch", "NLP"],
        location: "Chennai", remote: false, duration: 6, minCgpa: 6.5,
        stipend: "₹20,000/mo", url: "https://www.tcs.com/careers",
        desc: "Research and develop machine learning models for enterprise clients.",
    },

    // ── Mechanical ──
    {
        id: 6, company: "Tata Motors", title: "Mechanical Design Intern",
        stream: "Mechanical", eligible: ["Mechanical", "Automobile", "Industrial"],
        required: ["AutoCAD", "SolidWorks"], preferred: ["CATIA", "ANSYS", "MATLAB"],
        location: "Pune", remote: false, duration: 6, minCgpa: 6.5,
        stipend: "₹18,000/mo", url: "https://www.tatamotors.com/careers",
        desc: "Design and simulate automotive components using CAD/CAE tools.",
    },
    {
        id: 7, company: "L&T", title: "Manufacturing Engineering Intern",
        stream: "Mechanical", eligible: ["Mechanical", "Industrial", "Production"],
        required: ["CAD", "Manufacturing"], preferred: ["CNC", "Lean Manufacturing", "Six Sigma"],
        location: "Mumbai", remote: false, duration: 4, minCgpa: 6.0,
        stipend: "₹12,000/mo", url: "https://www.larsentoubro.com/careers",
        desc: "Optimize manufacturing processes and quality on the shop floor.",
    },
    {
        id: 8, company: "Boeing", title: "Aerospace Engineering Intern",
        stream: "Mechanical", eligible: ["Mechanical", "Aerospace"],
        required: ["MATLAB", "Python"], preferred: ["CFD", "FEA", "3D Modeling"],
        location: "Bangalore", remote: false, duration: 6, minCgpa: 7.5,
        stipend: "₹30,000/mo", url: "https://www.boeing.co.in/careers",
        desc: "Support aircraft design and analysis projects with simulation tools.",
    },

    // ── Civil ──
    {
        id: 9, company: "L&T Construction", title: "Site Engineering Intern",
        stream: "Civil", eligible: ["Civil", "Construction"],
        required: ["AutoCAD", "Structural Analysis"], preferred: ["STAAD Pro", "Revit", "Project Management"],
        location: "Delhi", remote: false, duration: 6, minCgpa: 6.0,
        stipend: "₹15,000/mo", url: "https://www.larsentoubro.com/careers",
        desc: "Supervise construction sites and prepare engineering drawings and estimates.",
    },
    {
        id: 10, company: "WSP Global", title: "Transportation Planning Intern",
        stream: "Civil", eligible: ["Civil", "Urban Planning", "Transportation"],
        required: ["AutoCAD", "Civil Engineering"], preferred: ["Traffic Simulation", "GIS", "Python"],
        location: "Mumbai", remote: false, duration: 4, minCgpa: 6.5,
        stipend: "₹14,000/mo", url: "https://www.wsp.com/careers",
        desc: "Assist in transportation modeling and infrastructure planning projects.",
    },

    // ── Electrical / ECE ──
    {
        id: 11, company: "Siemens", title: "Power Systems Intern",
        stream: "Electrical", eligible: ["Electrical", "Electronics", "ECE"],
        required: ["MATLAB", "Power Systems"], preferred: ["Simulink", "PLC", "SCADA"],
        location: "Bangalore", remote: false, duration: 6, minCgpa: 7.0,
        stipend: "₹22,000/mo", url: "https://www.siemens.co.in/careers",
        desc: "Work on smart grid and power automation projects.",
    },
    {
        id: 12, company: "Qualcomm", title: "VLSI Design Intern",
        stream: "Electronics", eligible: ["Electronics", "ECE", "Electrical"],
        required: ["Verilog", "VLSI"], preferred: ["SystemVerilog", "Cadence", "Tapeout"],
        location: "Hyderabad", remote: false, duration: 6, minCgpa: 7.5,
        stipend: "₹40,000/mo", url: "https://www.qualcomm.com/careers",
        desc: "Design and verify digital circuits for next-gen mobile chipsets.",
    },
    {
        id: 13, company: "Samsung R&D", title: "Embedded Systems Intern",
        stream: "Electronics", eligible: ["Electronics", "ECE", "CS/IT"],
        required: ["C", "Embedded C"], preferred: ["RTOS", "Linux Kernel", "ARM"],
        location: "Noida", remote: false, duration: 4, minCgpa: 7.0,
        stipend: "₹25,000/mo", url: "https://www.samsung.com/in/sris/careers",
        desc: "Develop firmware and drivers for consumer electronics products.",
    },

    // ── Commerce / Finance ──
    {
        id: 14, company: "Deloitte", title: "Audit & Assurance Intern",
        stream: "Commerce", eligible: ["Commerce", "Finance", "BBA"],
        required: ["Accounting", "MS Excel"], preferred: ["Tally", "SAP", "Financial Analysis"],
        location: "Mumbai", remote: false, duration: 6, minCgpa: 6.0,
        stipend: "₹18,000/mo", url: "https://www.deloitte.com/in/en/careers.html",
        desc: "Assist in auditing engagements and financial statement reviews.",
    },
    {
        id: 15, company: "Goldman Sachs", title: "Finance Intern",
        stream: "Commerce", eligible: ["Commerce", "Finance", "Economics", "Mathematics"],
        required: ["Financial Analysis", "MS Excel"], preferred: ["Python", "Bloomberg", "Valuation Modeling"],
        location: "Bangalore", remote: false, duration: 3, minCgpa: 8.0,
        stipend: "₹50,000/mo", url: "https://www.goldmansachs.com/careers",
        desc: "Support deal teams with research, analysis, and financial modeling.",
    },
    {
        id: 16, company: "PwC", title: "Consulting Intern",
        stream: "Commerce", eligible: ["Commerce", "BBA", "MBA", "Economics"],
        required: ["Business Analysis", "MS Office"], preferred: ["PowerPoint", "Data Analysis", "SQL"],
        location: "Delhi", remote: false, duration: 3, minCgpa: 6.5,
        stipend: "₹20,000/mo", url: "https://www.pwc.in/careers.html",
        desc: "Work with consulting teams on strategy and operations projects.",
    },

    // ── Arts / Design ──
    {
        id: 17, company: "Ogilvy", title: "Content & Copywriting Intern",
        stream: "Arts", eligible: ["Arts", "Journalism", "English", "Design", "Mass Communication"],
        required: ["Content Writing", "English"], preferred: ["SEO", "Social Media", "Copywriting"],
        location: "Mumbai", remote: true, duration: 3, minCgpa: 5.5,
        stipend: "₹12,000/mo", url: "https://www.ogilvy.com/careers",
        desc: "Create compelling content for brand campaigns across digital and print.",
    },
    {
        id: 18, company: "Zomato", title: "UX/UI Design Intern",
        stream: "Design", eligible: ["Design", "Arts", "CS/IT"],
        required: ["Figma", "UI Design"], preferred: ["Prototyping", "User Research", "Illustrator"],
        location: "Gurugram", remote: false, duration: 4, minCgpa: 6.0,
        stipend: "₹20,000/mo", url: "https://www.zomato.com/careers",
        desc: "Design intuitive interfaces for Zomato's consumer and partner products.",
    },
    {
        id: 19, company: "Google", title: "Digital Marketing Intern",
        stream: "Arts", eligible: ["Arts", "Commerce", "Mass Communication", "Marketing"],
        required: ["Digital Marketing", "Social Media"], preferred: ["Google Ads", "Analytics", "Content Strategy"],
        location: "Bangalore", remote: true, duration: 3, minCgpa: 6.0,
        stipend: "₹25,000/mo", url: "https://careers.google.com",
        desc: "Plan and execute digital marketing campaigns for Google's products.",
    },

    // ── Data Science ──
    {
        id: 20, company: "Flipkart", title: "Data Science Intern",
        stream: "Data Science", eligible: ["Data Science", "CS/IT", "Mathematics", "Statistics"],
        required: ["Python", "Statistics"], preferred: ["SQL", "Machine Learning", "Tableau"],
        location: "Bangalore", remote: false, duration: 6, minCgpa: 7.0,
        stipend: "₹40,000/mo", url: "https://www.flipkartcareers.com",
        desc: "Build recommendation and forecasting models for e-commerce.",
    },

    // ── Pharma ──
    {
        id: 21, company: "Dr. Reddy's", title: "Pharmaceutical Research Intern",
        stream: "Pharmacy", eligible: ["Pharmacy", "Biotechnology", "Chemistry"],
        required: ["Pharmacology", "Drug Analysis"], preferred: ["HPLC", "Mass Spectrometry", "Regulatory Affairs"],
        location: "Hyderabad", remote: false, duration: 6, minCgpa: 6.5,
        stipend: "₹16,000/mo", url: "https://www.drreddys.com/careers",
        desc: "Support drug development and quality testing in a pharma R&D lab.",
    },

    // ── Cross-stream ──
    {
        id: 22, company: "Amazon", title: "Operations Intern",
        stream: "Operations", eligible: ["CS/IT", "Mechanical", "Industrial", "Commerce", "BBA"],
        required: ["MS Excel", "Analytical Thinking"], preferred: ["SQL", "Python", "Supply Chain"],
        location: "Multiple Cities", remote: false, duration: 4, minCgpa: 6.5,
        stipend: "₹30,000/mo", url: "https://www.amazon.jobs",
        desc: "Optimize fulfillment and logistics operations for Amazon India.",
    },
    {
        id: 23, company: "Zoho", title: "Technical Writer Intern",
        stream: "CS/IT", eligible: ["CS/IT", "English", "Arts"],
        required: ["Technical Writing", "English"], preferred: ["API Docs", "Markdown", "Git"],
        location: "Chennai", remote: true, duration: 3, minCgpa: 6.0,
        stipend: "₹15,000/mo", url: "https://www.zoho.com/careers.html",
        desc: "Write clear documentation and user guides for Zoho products.",
    },
    {
        id: 24, company: "Freshworks", title: "HR Intern",
        stream: "BBA", eligible: ["BBA", "Commerce", "Psychology", "Arts"],
        required: ["Communication"], preferred: ["MS Excel", "Recruitment", "Employee Engagement"],
        location: "Chennai", remote: false, duration: 3, minCgpa: 5.5,
        stipend: "₹10,000/mo", url: "https://www.freshworks.com/careers",
        desc: "Support HR operations including recruitment, onboarding, and culture programs.",
    },
    {
        id: 25, company: "HDFC Bank", title: "Banking Intern",
        stream: "Commerce", eligible: ["Commerce", "Finance", "BBA", "Economics"],
        required: ["MS Excel", "Communication"], preferred: ["Financial Products", "CRM", "Banking Software"],
        location: "Multiple Cities", remote: false, duration: 3, minCgpa: 5.5,
        stipend: "₹12,000/mo", url: "https://www.hdfcbank.com/careers",
        desc: "Shadow banking professionals and assist in customer operations.",
    },
    // ── Additional entries ──
    {
        id: 26, company: "Adobe", title: "UI/UX Design Intern",
        stream: "Design", eligible: ["Design", "Arts", "CS/IT"],
        required: ["Figma", "UI Design"], preferred: ["Illustrator", "Prototyping", "User Research"],
        location: "Bangalore", remote: false, duration: 6, minCgpa: 7.0,
        stipend: "₹35,000/mo", url: "https://www.adobe.com/careers",
        desc: "Design world-class creative tools used by millions of designers worldwide.",
    },
    {
        id: 27, company: "Razorpay", title: "Software Development Intern",
        stream: "CS/IT", eligible: ["CS/IT", "Electronics"],
        required: ["Python", "JavaScript"], preferred: ["React", "Node.js", "SQL"],
        location: "Bangalore", remote: true, duration: 6, minCgpa: 6.5,
        stipend: "₹30,000/mo", url: "https://razorpay.com/careers",
        desc: "Build payment infrastructure powering India's digital economy.",
    },
    {
        id: 28, company: "Bajaj Auto", title: "Product Design Intern",
        stream: "Mechanical", eligible: ["Mechanical", "Automobile"],
        required: ["SolidWorks", "AutoCAD"], preferred: ["CATIA", "GD&T", "Prototyping"],
        location: "Pune", remote: false, duration: 6, minCgpa: 6.5,
        stipend: "₹20,000/mo", url: "https://www.bajajauto.com/careers",
        desc: "Design next-generation two-wheeler and three-wheeler components.",
    },
    {
        id: 29, company: "Deloitte", title: "Data Analytics Intern",
        stream: "Data Science", eligible: ["Data Science", "CS/IT", "Statistics", "Commerce"],
        required: ["Python", "SQL"], preferred: ["Tableau", "Power BI", "Excel"],
        location: "Mumbai", remote: false, duration: 6, minCgpa: 6.5,
        stipend: "₹22,000/mo", url: "https://www.deloitte.com/in/en/careers.html",
        desc: "Analyze business data and create dashboards for enterprise clients.",
    },
    {
        id: 30, company: "Naukri.com", title: "Content Marketing Intern",
        stream: "Arts", eligible: ["Arts", "English", "Journalism", "Mass Communication"],
        required: ["Content Writing", "English"], preferred: ["SEO", "Social Media", "Blogging"],
        location: "Gurugram", remote: true, duration: 3, minCgpa: 5.5,
        stipend: "₹15,000/mo", url: "https://www.naukri.com/careers",
        desc: "Create engaging content for India's largest job portal.",
    },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  SKILL SUGGESTIONS BY STREAM
// ═══════════════════════════════════════════════════════════════════════════════

const SKILL_SUGGESTIONS = {
    "CS/IT": ["Python", "Java", "C++", "JavaScript", "SQL", "Data Structures", "React", "Node.js", "Git", "AWS", "Machine Learning", "HTML", "CSS", "TypeScript", "Docker"],
    "Electronics": ["VLSI", "Verilog", "Embedded C", "MATLAB", "PCB Design", "Signal Processing", "C", "ARM", "Linux Kernel", "SystemVerilog", "Python", "CAD"],
    "Electrical": ["MATLAB", "Power Systems", "Simulink", "PLC", "SCADA", "Circuit Design", "Python", "AutoCAD", "Control Systems", "Embedded C", "Verilog", "VLSI"],
    "Mechanical": ["AutoCAD", "SolidWorks", "CATIA", "MATLAB", "ANSYS", "CNC", "Manufacturing", "GD&T", "Creo", "Python", "Thermodynamics", "Fluid Mechanics"],
    "Civil": ["AutoCAD", "STAAD Pro", "Revit", "Structural Analysis", "GIS", "Project Management", "ETABS", "Civil 3D", "MS Project", "Python", "Surveying", "Concrete Technology"],
    "Commerce": ["Accounting", "Tally", "SAP", "Financial Analysis", "MS Excel", "GST", "TDS", "Auditing", "Taxation", "QuickBooks", "ERP", "Credit Analysis"],
    "BBA": ["MS Excel", "Business Analysis", "Marketing", "HR", "PowerPoint", "MS Office", "Data Analysis", "Project Management", "Communication", "Leadership", "CRM", "ERP"],
    "Arts": ["Content Writing", "English", "Social Media", "SEO", "Copywriting", "Adobe Photoshop", "Video Editing", "Photography", "MS Word", "Blogging", "Social Media Marketing", "Canva"],
    "Design": ["Figma", "Adobe XD", "Illustrator", "Photoshop", "UI Design", "Prototyping", "Wireframing", "Sketch", "After Effects", "Blender", "CSS", "HTML"],
    "Data Science": ["Python", "Machine Learning", "SQL", "Tableau", "TensorFlow", "Statistics", "R", "Pandas", "Numpy", "Power BI", "Deep Learning", "NLP"],
    "default": ["MS Excel", "Communication", "Problem Solving", "Teamwork", "Time Management", "Leadership", "MS Office", "Project Management", "Data Analysis", "Report Writing", "Critical Thinking", "Adaptability"],
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MATCHING ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

const W_STREAM = 30, W_SKILLS = 30, W_CGPA = 15, W_LOCATION = 15, W_COMFORT = 10;

function matchInternship(internship, profile) {
    const reasons = [];
    const warnings = [];

    // 1. Stream score
    let s1 = 0;
    const profileStreamLower = profile.stream.toLowerCase();
    const eligibleLower = internship.eligible.map(s => s.toLowerCase());
    if (eligibleLower.includes(profileStreamLower)) {
        s1 = 100;
        reasons.push(`Your stream (${profile.stream}) is eligible`);
    } else {
        // Partial match
        const pWords = profileStreamLower.split(/\s*\/\s*|\s*&\s*|\s+/);
        const hasPartial = internship.eligible.some(e => {
            const eWords = e.toLowerCase().split(/\s*\/\s*|\s*&\s*|\s+/);
            return pWords.some(pw => eWords.includes(pw));
        });
        if (hasPartial) {
            s1 = 60;
            reasons.push("Partial stream match");
        } else {
            warnings.push(`Stream "${profile.stream}" is not listed as eligible`);
            s1 = 0;
        }
    }

    // 2. Skills score
    let s2 = 0;
    const studentSkillsLower = profile.skills.map(s => s.toLowerCase());
    const matchedReq = internship.required.filter(r => studentSkillsLower.includes(r.toLowerCase()));
    const matchedPref = internship.preferred.filter(p => studentSkillsLower.includes(p.toLowerCase()));

    if (internship.required.length > 0) {
        s2 += (matchedReq.length / internship.required.length) * 70;
    } else { s2 += 70; }

    if (internship.preferred.length > 0) {
        s2 += (matchedPref.length / internship.preferred.length) * 30;
    } else { s2 += 30; }

    s2 = Math.min(s2, 100);

    if (matchedReq.length > 0) {
        reasons.push(`Matches required: ${matchedReq.join(", ")}`);
    }
    if (matchedPref.length > 0) {
        reasons.push(`Matches preferred: ${matchedPref.join(", ")}`);
    }

    const missingReq = internship.required.filter(r => !studentSkillsLower.includes(r.toLowerCase()));
    if (missingReq.length > 0) {
        warnings.push(`Missing required: ${missingReq.join(", ")}`);
    }

    // 3. CGPA score
    let s3 = 60;
    if (profile.cgpa > 0) {
        if (profile.cgpa >= internship.minCgpa) {
            s3 = 100;
            reasons.push(`CGPA (${profile.cgpa}) meets requirement (${internship.minCgpa})`);
        } else {
            const gap = internship.minCgpa - profile.cgpa;
            s3 = Math.max(0, (1 - gap / 3)) * 40;
            warnings.push(`CGPA (${profile.cgpa}) below minimum (${internship.minCgpa})`);
        }
    } else {
        reasons.push("CGPA not provided");
    }

    // 4. Location score
    let s4 = 100;
    if (internship.remote && profile.remoteOk) {
        reasons.push("Remote-friendly match");
        s4 = 100;
    } else if (!profile.location || profile.location === "Any") {
        reasons.push("No location preference");
        s4 = 100;
    } else if (internship.location.toLowerCase().includes(profile.location.toLowerCase()) ||
               profile.location.toLowerCase().includes(internship.location.toLowerCase())) {
        reasons.push(`Location match: ${internship.location}`);
        s4 = 100;
    } else if (internship.location.toLowerCase().includes("multiple")) {
        reasons.push("Multiple locations available");
        s4 = 70;
    } else {
        warnings.push(`Location mismatch: you prefer "${profile.location}", this is "${internship.location}"`);
        s4 = 20;
    }

    // 5. Comfort score (duration)
    let s5 = 80;
    if (profile.duration > 0) {
        const diff = Math.abs(internship.duration - profile.duration);
        if (diff === 0) {
            reasons.push(`Duration matches preference (${internship.duration} months)`);
            s5 = 90;
        } else if (diff === 1) {
            reasons.push(`Duration close to preference (${internship.duration} vs ${profile.duration} months)`);
            s5 = 85;
        } else {
            warnings.push(`Duration is ${internship.duration} months (you preferred ${profile.duration})`);
            s5 = 60;
        }
    }

    // Weighted total
    const score = Math.round(
        (s1 * W_STREAM + s2 * W_SKILLS + s3 * W_CGPA + s4 * W_LOCATION + s5 * W_COMFORT) / 100
    );

    return { internship, score, reasons, warnings };
}

function findMatches(profile, topN = 10) {
    const results = INTERNSHIPS.map(i => matchInternship(i, profile));
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topN);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  UI LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

function scrollToForm() {
    document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
}

// Stream change → populate skill suggestions
document.getElementById('stream').addEventListener('change', function () {
    const stream = this.value;
    const grid = document.getElementById('skillsGrid');
    const suggestions = SKILL_SUGGESTIONS[stream] || SKILL_SUGGESTIONS["default"];

    grid.innerHTML = '';
    suggestions.forEach(skill => {
        const chip = document.createElement('span');
        chip.className = 'skill-chip' + (selectedSkills.includes(skill) ? ' selected' : '');
        chip.innerHTML = `<span class="check">✓</span> ${skill}`;
        chip.onclick = () => toggleSkill(skill, chip);
        grid.appendChild(chip);
    });
});

function toggleSkill(skill, chip) {
    if (selectedSkills.includes(skill)) {
        selectedSkills = selectedSkills.filter(s => s !== skill);
        chip.classList.remove('selected');
    } else {
        selectedSkills.push(skill);
        chip.classList.add('selected');
    }
    renderSelectedSkills();
}

function addCustomSkill() {
    const input = document.getElementById('customSkill');
    const skill = input.value.trim();
    if (skill && !selectedSkills.includes(skill)) {
        selectedSkills.push(skill);
        renderSelectedSkills();
        input.value = '';
    }
}

document.getElementById('customSkill').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addCustomSkill();
    }
});

function removeSkill(skill) {
    selectedSkills = selectedSkills.filter(s => s !== skill);
    renderSelectedSkills();
    // Update chips
    document.querySelectorAll('.skill-chip').forEach(chip => {
        if (chip.textContent.trim().endsWith(skill)) {
            chip.classList.remove('selected');
        }
    });
}

function renderSelectedSkills() {
    const container = document.getElementById('selectedSkills');
    container.innerHTML = selectedSkills.map(s =>
        `<span class="selected-skill-tag">${s} <span class="remove" onclick="removeSkill('${s}')">×</span></span>`
    ).join('');
}

// CGPA hint
document.getElementById('cgpa').addEventListener('input', function () {
    const val = parseFloat(this.value);
    const hint = document.getElementById('cgpaHint');
    if (isNaN(val)) { hint.textContent = ''; return; }
    if (val >= 8.5) hint.textContent = '🟢 Excellent — you qualify for top-tier internships';
    else if (val >= 7.0) hint.textContent = '🟡 Good — opens up most opportunities';
    else if (val >= 6.0) hint.textContent = '🟠 Average — focus on building strong skills';
    else hint.textContent = '🔴 Below 6.0 — consider cert courses and projects to compensate';
});

// ═══════════════════════════════════════════════════════════════════════════════
//  FORM SUBMIT
// ═══════════════════════════════════════════════════════════════════════════════

document.getElementById('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect profile
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const stream = document.getElementById('stream').value;
    const cgpa = parseFloat(document.getElementById('cgpa').value) || 0;
    const location = document.getElementById('location').value;
    const remoteOk = document.getElementById('remoteOk').checked;
    const duration = parseInt(document.getElementById('duration').value) || 0;

    if (!name || !stream) {
        alert('Please fill in your name and stream.');
        return;
    }

    if (selectedSkills.length === 0) {
        alert('Please select at least one skill.');
        return;
    }

    const profile = { name, email, stream, cgpa, skills: selectedSkills, location, remoteOk, duration };

    // Show loading
    const btn = document.getElementById('findBtn');
    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.btn-loading').style.display = 'inline-flex';
    btn.disabled = true;

    // Simulate brief analysis
    setTimeout(() => {
        currentResults = findMatches(profile, 10);
        displayResults(profile, currentResults);

        btn.querySelector('.btn-text').style.display = 'inline';
        btn.querySelector('.btn-loading').style.display = 'none';
        btn.disabled = false;
    }, 800);
});

// ═══════════════════════════════════════════════════════════════════════════════
//  DISPLAY RESULTS
// ═══════════════════════════════════════════════════════════════════════════════

function getScoreClass(score) {
    if (score >= 75) return 'score-great';
    if (score >= 50) return 'score-good';
    if (score >= 30) return 'score-fair';
    return 'score-low';
}

function getScoreLabel(score) {
    if (score >= 75) return 'Excellent Match';
    if (score >= 50) return 'Good Match';
    if (score >= 30) return 'Fair Match';
    return 'Low Match';
}

function displayResults(profile, results) {
    const section = document.getElementById('resultsSection');
    section.style.display = 'block';

    // Scroll to results
    setTimeout(() => section.scrollIntoView({ behavior: 'smooth' }), 100);

    // Summary
    document.getElementById('resultsSummary').innerHTML =
        `Found <strong>${results.length} internships</strong> matched for <strong>${profile.name}</strong> (${profile.stream})`;

    // Overview stats
    const greatMatches = results.filter(r => r.score >= 75).length;
    const avgScore = results.length > 0 ? Math.round(results.reduce((a, b) => a + b.score, 0) / results.length) : 0;
    document.getElementById('resultsOverview').innerHTML = `
        <div class="overview-stat">
            <div class="big-num">${results.length}</div>
            <div class="label">Matches Found</div>
        </div>
        <div class="overview-stat">
            <div class="big-num">${greatMatches}</div>
            <div class="label">Excellent Matches</div>
        </div>
        <div class="overview-stat">
            <div class="big-num">${avgScore}%</div>
            <div class="label">Average Score</div>
        </div>
        <div class="overview-stat">
            <div class="big-num">${results[0]?.score || 0}%</div>
            <div class="label">Best Match</div>
        </div>
    `;

    // Match cards
    const grid = document.getElementById('matchesGrid');
    grid.innerHTML = '';

    results.forEach((result, idx) => {
        const i = result.internship;
        const cls = getScoreClass(result.score);

        const card = document.createElement('div');
        card.className = `match-card ${cls} fade-in`;
        card.style.animationDelay = `${idx * 0.08}s`;
        card.onclick = () => card.classList.toggle('expanded');

        card.innerHTML = `
            <div class="match-header">
                <div class="match-header-left">
                    <span class="match-company">${i.company}</span>
                    <h3>${i.title}</h3>
                </div>
                <div class="match-header-right">
                    <div class="match-score ${cls}">${result.score}%</div>
                    <div class="match-label">${getScoreLabel(result.score)}</div>
                </div>
            </div>

            <div class="score-bar-container">
                <div class="score-bar">
                    <div class="score-bar-fill ${cls}" style="width: 0%"></div>
                </div>
            </div>

            <div class="match-meta">
                <span>📍 ${i.location}${i.remote ? ' (Remote)' : ''}</span>
                <span>⏱ ${i.duration} months</span>
                <span>💰 ${i.stipend}</span>
            </div>

            <div class="match-description">${i.desc}</div>

            <div class="match-details">
                <div class="match-skills">
                    ${i.required.map(s => `<span class="skill-tag required">${s}</span>`).join('')}
                    ${i.preferred.map(s => `<span class="skill-tag preferred">${s}</span>`).join('')}
                </div>

                <div class="match-reasons">
                    ${result.reasons.map(r => `<div class="reason">✅ ${r}</div>`).join('')}
                    ${result.warnings.map(w => `<div class="warning">⚠️ ${w}</div>`).join('')}
                </div>

                <div class="match-footer">
                    <a href="${i.url}" target="_blank" class="match-url" onclick="event.stopPropagation()">🔗 Apply at ${i.url.replace(/https?:\/\//, '').split('/')[0]}</a>
                    <span class="match-eligible">Eligible: ${i.eligible.join(", ")} | Min CGPA: ${i.minCgpa}</span>
                </div>
            </div>

            <div class="expand-hint">Click to see details</div>
        `;

        grid.appendChild(card);
    });

    // Animate score bars
    setTimeout(() => {
        document.querySelectorAll('.score-bar-fill').forEach((bar, i) => {
            bar.style.width = results[i].score + '%';
        });
    }, 300);

    // Tips
    displayTips(results);
}

function displayTips(results) {
    const tips = [];
    const missing = new Set();

    results.forEach(r => {
        r.warnings.forEach(w => {
            if (w.startsWith('Missing required:')) {
                w.replace('Missing required: ', '').split(', ').forEach(s => missing.add(s));
            }
        });
    });

    if (missing.size > 0) {
        tips.push({
            icon: '📚',
            text: `Consider learning: ${[...missing].join(", ")}`,
            type: 'warning',
        });
    }

    const hasCgpaWarning = results.some(r => r.warnings.some(w => w.includes('CGPA')));
    if (hasCgpaWarning) {
        tips.push({
            icon: '📊',
            text: 'Your CGPA is below some requirements — compensate with strong skills & projects.',
            type: 'warning',
        });
    }

    tips.push({ icon: '🎯', text: 'Apply to at least 10-15 internships for the best chances.', type: 'normal' });
    tips.push({ icon: '📝', text: 'Customize your resume for each application — highlight relevant skills.', type: 'normal' });
    tips.push({ icon: '🔗', text: 'Connect with employees on LinkedIn before applying for referrals.', type: 'normal' });
    tips.push({ icon: '💡', text: 'Build 2-3 projects demonstrating the skills listed in job descriptions.', type: 'normal' });

    document.getElementById('tipsContent').innerHTML = tips.map(t =>
        `<div class="tip-item ${t.type === 'warning' ? 'warning' : ''}">
            <span class="tip-icon">${t.icon}</span>
            <span>${t.text}</span>
        </div>`
    ).join('');
}

// ═══════════════════════════════════════════════════════════════════════════════
//  EXPORT & RESET
// ═══════════════════════════════════════════════════════════════════════════════

function exportResults() {
    if (currentResults.length === 0) return;

    const name = document.getElementById('name').value || 'Student';
    const stream = document.getElementById('stream').value || '';

    let text = '='.repeat(60) + '\n';
    text += `  internVerse — Internship Matches\n`;
    text += `  For: ${name} | Stream: ${stream}\n`;
    text += '='.repeat(60) + '\n\n';

    currentResults.forEach((r, idx) => {
        const i = r.internship;
        text += `#${idx + 1}  ${i.company} — ${i.title}  (Score: ${r.score}%)\n`;
        text += `    ${i.desc}\n`;
        text += `    📍 ${i.location} | ⏱ ${i.duration} months | 💰 ${i.stipend}\n`;
        text += `    🔗 ${i.url}\n`;
        text += `    Required: ${i.required.join(", ")}\n`;
        text += `    Preferred: ${i.preferred.join(", ")}\n`;
        text += `    Reasons: ${r.reasons.join("; ")}\n`;
        if (r.warnings.length > 0) text += `    Warnings: ${r.warnings.join("; ")}\n`;
        text += '\n';
    });

    text += 'Generated by internVerse 🎓\n';

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `internverse_matches_${name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function resetForm() {
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
}

// ── Initialize on load ──
console.log('🎓 internVerse loaded — ' + INTERNSHIPS.length + ' internships in database');
