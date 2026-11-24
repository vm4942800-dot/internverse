// ═══ NEW INTERNSHIPS — All University Streams ═══
// Append these to the DB array in index.html

const NEW_INTERNSHIPS = [
// ── Agriculture & Food Science ──
{id:81,co:"NABARD",ti:"Agricultural Finance Intern",el:["Agriculture","Agricultural Economics","Commerce"],rq:["MS Excel","Research"],pf:["Rural Development","Financial Analysis","Agricultural Policy"],loc:"Mumbai",rem:0,dur:6,cg:6.5,st:"₹18,000/mo",url:"https://www.nabard.org",desc:"Research agricultural financing schemes and rural development programs."},
{id:82,co:"ICAR",ti:"Crop Research Intern",el:["Agriculture","Agronomy","Biotechnology"],rq:["Research","Lab Techniques"],pf:["Data Analysis","MATLAB","MS Excel"],loc:"New Delhi",rem:0,dur:6,cg:7.0,st:"₹15,000/mo",url:"https://icar.org.in",desc:"Conduct crop improvement research and field trials at premier agricultural institute."},
{id:83,co:"ITC Agri Business",ti:"Agri-Supply Chain Intern",el:["Agriculture","Food Science","Commerce"],rq:["MS Excel","Analytical Thinking"],pf:["Supply Chain","SAP","Data Analysis"],loc:"Bangalore",rem:0,dur:6,cg:6.5,st:"₹20,000/mo",url:"https://www.itcportal.com",desc:"Optimize agricultural supply chain from farm to factory for ITC's agri division."},
{id:84,co:"Nestle India",ti:"Food Technology Intern",el:["Food Science","Food Technology","Chemistry"],rq:["Food Chemistry","Lab Techniques"],pf:["Quality Control","HACCP","MS Excel"],loc:"Mumbai",rem:0,dur:4,cg:6.5,st:"₹16,000/mo",url:"https://www.nestle.in",desc:"Work on food product development, quality assurance, and nutrition analysis."},
{id:85,co:"Amul",ti:"Dairy Science Intern",el:["Dairy Science","Food Science","Agriculture"],rq:["Food Science","Lab Techniques"],pf:["Quality Control","Dairy Technology","MS Excel"],loc:"Gujarat",rem:0,dur:4,cg:6.0,st:"₹12,000/mo",url:"https://www.amul.com",desc:"Assist in dairy product quality testing and new product development at Amul."},

// ── Law ──
{id:86,co:"Cyril Amarchand Mangaldas",ti:"Corporate Law Intern",el:["Law","LLB","Corporate Law"],rq:["Legal Research","MS Word"],pf:["Contract Drafting","Corporate Law","Due Diligence"],loc:"Mumbai",rem:0,dur:6,cg:7.0,st:"₹20,000/mo",url:"https://www.cyrilshroff.com",desc:"Assist senior partners in corporate mergers, acquisitions, and regulatory compliance."},
{id:87,co:"AZB & Partners",ti:"IP Law Intern",el:["Law","LLB","IPR"],rq:["Legal Research","MS Word"],pf:["Patent Law","Trademark","Copyright"],loc:"Mumbai",rem:0,dur:6,cg:7.0,st:"₹18,000/mo",url:"https://www.azbpartners.com",desc:"Research intellectual property cases and assist in patent/trademark filings."},
{id:88,co:"NLU Internship Cell",ti:"Constitutional Law Intern",el:["Law","LLB","Political Science"],rq:["Legal Research","English"],pf:["Constitutional Law","Court Proceedings","MS Word"],loc:"Delhi",rem:0,dur:3,cg:6.5,st:"₹10,000/mo",url:"https://nludelhi.ac.in",desc:"Assist in constitutional law research and prepare case summaries."},
{id:89,co:"NPCI",ti:"Legal & Compliance Intern",el:["Law","Finance","Commerce"],rq:["Legal Research","MS Excel"],pf:["Fintech Regulations","RBI Guidelines","Compliance"],loc:"Mumbai",rem:0,dur:6,cg:7.0,st:"₹22,000/mo",url:"https://www.npci.org.in",desc:"Work on payment system regulations and legal compliance for digital payments."},

// ── Nursing & Paramedical ──
{id:90,co:"AIIMS",ti:"Nursing Research Intern",el:["Nursing","Healthcare"],rq:["Clinical Skills","Patient Care"],pf:["Research","Medical Terminology","Documentation"],loc:"Delhi",rem:0,dur:6,cg:6.0,st:"₹12,000/mo",url:"https://www.aiims.edu",desc:"Conduct nursing research and assist in patient care documentation at AIIMS."},
{id:91,co:"Apollo Hospitals",ti:"Physiotherapy Intern",el:["Physiotherapy","Sports Science"],rq:["Physiotherapy","Exercise Therapy"],pf:["Rehabilitation","Manual Therapy","Patient Assessment"],loc:"Chennai",rem:0,dur:6,cg:6.0,st:"₹10,000/mo",url:"https://www.apollohospitals.com",desc:"Assist in patient rehabilitation and physiotherapy treatment planning."},
{id:92,co:"Fortis Healthcare",ti:"Public Health Intern",el:["Public Health","Nursing","Biostatistics"],rq:["Research","MS Excel"],pf:["Epidemiology","Health Policy","Data Analysis"],loc:"Gurugram",rem:0,dur:4,cg:6.5,st:"₹15,000/mo",url:"https://www.fortishealthcare.com",desc:"Analyze public health data and assist in healthcare program evaluation."},

// ── BCA / MCA / IT Applications ──
{id:93,co:"Freshworks",ti:"BCA Developer Intern",el:["BCA","MCA","CS/IT"],rq:["JavaScript","HTML"],pf:["React","Node.js","Git"],loc:"Chennai",rem:0,dur:6,cg:6.0,st:"₹18,000/mo",url:"https://www.freshworks.com/careers",desc:"Build and maintain web applications for Freshworks SaaS products."},
{id:94,co:"Zoho",ti:"MCA Software Intern",el:["BCA","MCA","CS/IT"],rq:["Python","SQL"],pf:["Django","React","AWS"],loc:"Chennai",rem:0,dur:6,cg:6.5,st:"₹20,000/mo",url:"https://www.zoho.com/careers.html",desc:"Develop full-stack features for Zoho's suite of business applications."},
{id:95,co:"TCS",ti:"BCA IT Support Intern",el:["BCA","MCA","IT"],rq:["Networking","MS Office"],pf:["Linux","Windows Server","SQL"],loc:"Multiple Cities",rem:0,dur:3,cg:5.5,st:"₹12,000/mo",url:"https://www.tcs.com/careers",desc:"Provide IT support and system administration for enterprise clients."},

// ── Physical Education & Sports ──
{id:96,co:"Sports Authority of India",ti:"Sports Science Intern",el:["Physical Education","Sports Science"],rq:["Sports Training","Exercise Physiology"],pf:["Data Analysis","Nutrition","Sports Psychology"],loc:"Delhi",rem:0,dur:6,cg:6.0,st:"₹12,000/mo",url:"https://www.sportsauthorityofindia.nic.in",desc:"Assist in athlete performance analysis and sports science research."},
{id:97,co:"JSW Sports",ti:"Athlete Performance Intern",el:["Physical Education","Sports Science","Kinesiology"],rq:["Exercise Science","Data Collection"],pf:["Wearable Tech","Performance Analytics","Coaching"],loc:"Mumbai",rem:0,dur:4,cg:6.0,st:"₹15,000/mo",url:"https://www.jsw.in/sports",desc:"Monitor and analyze athlete performance data for Olympic-level training programs."},

// ── Library Science ──
{id:98,co:"National Library of India",ti:"Library Science Intern",el:["Library Science","Information Science"],rq:["Library Management","Cataloging"],pf:["Digital Archives","MS Excel","Database Management"],loc:"Kolkata",rem:0,dur:3,cg:6.0,st:"₹8,000/mo",url:"https://nl.main.gov.in",desc:"Assist in cataloging, digital archiving, and library management operations."},
{id:99,co:"Infosys",ti:"Knowledge Management Intern",el:["Library Science","CS/IT","Information Science"],rq:["Research","MS Office"],pf:["Knowledge Bases","Wiki Systems","Documentation"],loc:"Bangalore",rem:1,dur:3,cg:6.0,st:"₹12,000/mo",url:"https://www.infosys.com/careers",desc:"Build and maintain internal knowledge management systems for Infosys."},

// ── Fine Arts & Design ──
{id:100,co:"Flipkart",ti:"Visual Design Intern",el:["Fine Arts","Design","Visual Communication"],rq:["Photoshop","Illustrator"],pf:["Figma","Motion Graphics","UI Design"],loc:"Bangalore",rem:0,dur:3,cg:5.5,st:"₹15,000/mo",url:"https://www.flipkartcareers.com",desc:"Design visual assets and creative campaigns for Flipkart's marketing team."},
{id:101,co:"Wipro",ti:"Brand Design Intern",el:["Fine Arts","Graphic Design","Design"],rq:["Adobe Photoshop","Illustrator"],pf:["Brand Guidelines","Motion Graphics","Canva"],loc:"Bangalore",rem:0,dur:3,cg:5.5,st:"₹12,000/mo",url:"https://www.wipro.com/careers",desc:"Create brand materials and visual content for Wipro's corporate identity."},
{id:102,co:"National Institute of Design",ti:"Interior Design Research",el:["Interior Design","Architecture","Design"],rq:["AutoCAD","SketchUp"],pf:["Revit","3D Visualization","Vastu"],loc:"Ahmedabad",rem:0,dur:6,cg:7.0,st:"₹12,000/mo",url:"https://www.nid.edu",desc:"Research sustainable interior design solutions and spatial planning."},

// ── Fashion Design ──
{id:103,co:"FabIndia",ti:"Fashion Design Intern",el:["Fashion Design","Textile Design"],rq:["Adobe Illustrator","Fashion Sketching"],pf:["Textile Design","Pattern Making","Sustainability"],loc:"Delhi",rem:0,dur:3,cg:5.5,st:"₹10,000/mo",url:"https://www.fabindia.com",desc:"Assist in design collection development and textile sourcing."},
{id:104,co:"Myntra",ti:"Fashion Tech Intern",el:["Fashion Design","Design","CS/IT"],rq:["Fashion Knowledge","MS Excel"],pf:["Visual Merchandising","Trend Analysis","Photoshop"],loc:"Bangalore",rem:0,dur:4,cg:6.0,st:"₹18,000/mo",url:"https://www.myntra.com/about/careers",desc:"Combine fashion expertise with technology to enhance Myntra's product catalog."},

// ── Performing Arts ──
{id:105,co:"Netflix India",ti:"Content Development Intern",el:["Performing Arts","Film Studies","Mass Communication"],rq:["Research","Content Writing"],pf:["Screenwriting","Story Development","Script Analysis"],loc:"Mumbai",rem:0,dur:3,cg:5.5,st:"₹20,000/mo",url:"https://jobs.netflix.com",desc:"Assist in content development and script analysis for Netflix India originals."},
{id:106,co:"NDTV",ti:"Production Intern",el:["Performing Arts","Film Studies","Journalism"],rq:["Video Editing","Content Creation"],pf:["Premiere Pro","After Effects","Camera Operation"],loc:"Delhi",rem:0,dur:3,cg:5.5,st:"₹10,000/mo",url:"https://www.ndtv.com/careers",desc:"Assist in television production, video editing, and studio operations."},

// ── Animation & VFX ──
{id:107,co:"Prana Studios",ti:"VFX Artist Intern",el:["Animation","VFX","Film Studies"],rq:["After Effects","Nuke"],pf:["Maya","Houdini","Compositing"],loc:"Mumbai",rem:0,dur:6,cg:6.0,st:"₹15,000/mo",url:"https://www.pranastudios.com",desc:"Create visual effects for Bollywood and Hollywood films and TV shows."},
{id:108,co:"Disney+ Hotstar",ti:"Motion Graphics Intern",el:["Animation","VFX","Design"],rq:["After Effects","Adobe Premiere"],pf:["Cinema 4D","Blender","Illustrator"],loc:"Mumbai",rem:0,dur:3,cg:5.5,st:"₹18,000/mo",url:"https://www.hotstar.com/in/careers",desc:"Design motion graphics and animations for Disney+ Hotstar marketing campaigns."},

// ── Environmental Science ──
{id:109,co:"CPCB",ti:"Environmental Monitoring Intern",el:["Environmental Science","Chemistry","Geology"],rq:["Research","MS Excel"],pf:["Pollution Monitoring","GIS","Data Analysis"],loc:"Delhi",rem:0,dur:6,cg:6.5,st:"₹14,000/mo",url:"https://cpcb.gov.in",desc:"Monitor air and water quality data and assist in environmental compliance."},
{id:110,co:"WWF India",ti:"Conservation Research Intern",el:["Environmental Science","Biology","Geography"],rq:["Research","Data Collection"],pf:["GIS","Wildlife Biology","Conservation"],loc:"Multiple Cities",rem:0,dur:6,cg:6.0,st:"₹10,000/mo",url:"https://www.wwfindia.org",desc:"Conduct biodiversity assessments and conservation research projects."},
{id:111,co:"TERI",ti:"Sustainability Intern",el:["Environmental Science","Energy","Engineering"],rq:["Research","MS Excel"],pf:["Sustainability Reporting","Energy Analysis","Carbon Footprint"],loc:"Delhi",rem:0,dur:6,cg:7.0,st:"₹15,000/mo",url:"https://www.teriin.org",desc:"Research renewable energy solutions and sustainability frameworks."},

// ── Forensic Science ──
{id:112,co:"CFSL",ti:"Forensic Science Intern",el:["Forensic Science","Chemistry","Biology"],rq:["Lab Techniques","Chemistry"],pf:["DNA Analysis","Fingerprint Analysis","Digital Forensics"],loc:"Delhi",rem:0,dur:6,cg:7.0,st:"₹12,000/mo",url:"https://www.cfsl.gov.in",desc:"Assist forensic experts in crime scene analysis and evidence testing."},
{id:113,co:"NCRB",ti:"Criminal Data Analytics Intern",el:["Forensic Science","CS/IT","Statistics"],rq:["Data Analysis","MS Excel"],pf:["Python","SQL","Crime Statistics"],loc:"Delhi",rem:0,dur:4,cg:6.5,st:"₹14,000/mo",url:"https://ncrb.gov.in",desc:"Analyze criminal data and assist in crime pattern research."},

// ── Social Work & NGO ──
{id:114,co:"UNICEF India",ti:"Social Development Intern",el:["Social Work","Sociology","Psychology"],rq:["Research","MS Office"],pf:["Community Development","Data Collection","Report Writing"],loc:"Delhi",rem:0,dur:6,cg:7.0,st:"₹18,000/mo",url:"https://www.unicef.org/india",desc:"Support child welfare programs and conduct community needs assessments."},
{id:115,co:"Teach For India",ti:"Education Fellow Intern",el:["Social Work","Education","Psychology"],rq:["Communication","Teaching"],pf:["Curriculum Design","Community Outreach","Leadership"],loc:"Multiple Cities",rem:0,dur:12,cg:6.0,st:"₹15,000/mo",url:"https://www.teachforindia.org",desc:"Teach underprivileged children and develop innovative educational programs."},
{id:116,co:"CRY",ti:"Child Rights Intern",el:["Social Work","Law","Psychology"],rq:["Research","Communication"],pf:["Child Rights","Advocacy","Community Work"],loc:"Mumbai",rem:0,dur:6,cg:5.5,st:"₹8,000/mo",url:"https://www.cry.org",desc:"Advocate for child rights and support grassroots community programs."},

// ── Hotel Management & Tourism ──
{id:117,co:"Taj Hotels",ti:"Hotel Operations Intern",el:["Hotel Management","Hospitality","Tourism"],rq:["Customer Service","MS Office"],pf:["Revenue Management","F&B Operations","Event Planning"],loc:"Multiple Cities",rem:0,dur:6,cg:6.0,st:"₹12,000/mo",url:"https://www.ihcltata.com/careers",desc:"Learn hotel operations across front office, housekeeping, and food & beverage."},
{id:118,co:"MakeMyTrip",ti:"Travel Product Intern",el:["Tourism","Hotel Management","BBA"],rq:["MS Excel","Communication"],pf:["Travel Industry","Product Knowledge","Analytics"],loc:"Gurugram",rem:0,dur:4,cg:6.0,st:"₹15,000/mo",url:"https://www.makemytrip.com/careers",desc:"Assist in travel product development and partner management."},
{id:119,co:"ITC Hotels",ti:"Culinary Arts Intern",el:["Hotel Management","Culinary Arts"],rq:["Culinary Skills","Food Safety"],pf:["Menu Planning","Kitchen Management","HACCP"],loc:"Multiple Cities",rem:0,dur:6,cg:5.5,st:"₹10,000/mo",url:"https://www.itchotels.in",desc:"Work alongside master chefs in kitchen operations and menu development."},

// ── Cybersecurity ──
{id:120,co:"Quick Heal",ti:"Cybersecurity Research Intern",el:["CS/IT","Cybersecurity","Electronics"],rq:["Networking","Python"],pf:["Linux","Penetration Testing","SIEM"],loc:"Pune",rem:0,dur:6,cg:6.5,st:"₹18,000/mo",url:"https://www.quickheal.co.in",desc:"Research new cyber threats and develop security solutions for enterprise clients."},
{id:121,co:"TAC Security",ti:"Ethical Hacking Intern",el:["CS/IT","Cybersecurity"],rq:["Networking","Linux"],pf:["Python","Penetration Testing","Vulnerability Assessment"],loc:"Delhi",rem:0,dur:6,cg:6.5,st:"₹20,000/mo",url:"https://www.tacsecurity.com",desc:"Conduct penetration testing and vulnerability assessments for clients."},

// ── Geology & Mining ──
{id:122,co:"GSI",ti:"Geological Survey Intern",el:["Geology","Mining","Earth Science"],rq:["Field Work","Geological Mapping"],pf:["GIS","Remote Sensing","MS Excel"],loc:"Multiple Cities",rem:0,dur:6,cg:6.5,st:"₹14,000/mo",url:"https://www.geologicalsurvayofindia.gov.in",desc:"Conduct geological surveys and mineral exploration fieldwork."},
{id:123,co:"Tata Steel Mining",ti:"Mining Engineering Intern",el:["Mining","Geology","Mechanical"],rq:["Mining Methods","Safety"],pf:["Ventilation","Blasting","MS Excel"],loc:"Jharkhand",rem:0,dur:6,cg:6.0,st:"₹16,000/mo",url:"https://www.tatasteel.com/careers",desc:"Assist in mining operations and safety compliance at Tata Steel mines."},

// ── Physics & Chemistry ──
{id:124,co:"DRDO",ti:"Physics Research Intern",el:["Physics","Electronics","Aerospace"],rq:["MATLAB","Research"],pf:["Optics","Quantum Mechanics","Simulation"],loc:"Delhi",rem:0,dur:6,cg:7.5,st:"₹20,000/mo",url:"https://drdo.gov.in",desc:"Conduct defense-related physics research and prototype development."},
{id:125,co:"IISc Bangalore",ti:"Chemistry Research Intern",el:["Chemistry","Pharmacy","Materials Science"],rq:["Chemistry","Lab Techniques"],pf:["Spectroscopy","Organic Synthesis","HPLC"],loc:"Bangalore",rem:0,dur:6,cg:7.5,st:"₹16,000/mo",url:"https://www.iisc.ac.in",desc:"Conduct cutting-edge chemistry research at India's premier research institute."},
{id:126,co:"NTPC",ti:"Power Plant Chemistry Intern",el:["Chemistry","Chemical Engineering"],rq:["Chemistry","Lab Techniques"],pf:["Water Treatment","Boiler Chemistry","MS Excel"],loc:"Multiple Cities",rem:0,dur:6,cg:6.0,st:"₹15,000/mo",url:"https://www.ntpc.co.in",desc:"Perform water and boiler chemistry analysis for thermal power plants."},

// ── Biology / Zoology / Botany ──
{id:127,co:"ZSI",ti:"Zoological Research Intern",el:["Zoology","Biology","Wildlife Science"],rq:["Research","Lab Techniques"],pf:["Biodiversity","Taxonomy","Field Work"],loc:"Kolkata",rem:0,dur:6,cg:6.5,st:"₹12,000/mo",url:"https://www.zsi.gov.in",desc:"Conduct wildlife surveys and biodiversity documentation research."},
{id:128,co:"BOTANICAL SURVEY OF INDIA",ti:"Botany Research Intern",el:["Botany","Biology","Environmental Science"],rq:["Research","Plant Identification"],pf:["Herbarium","Field Work","MS Excel"],loc:"Kolkata",rem:0,dur:6,cg:6.5,st:"₹12,000/mo",url:"https://bsidocuments.gov.in",desc:"Document plant species and conduct taxonomic research."},
{id:129,co:"Bharat Biotech",ti:"Microbiology Intern",el:["Microbiology","Biology","Biotechnology"],rq:["Lab Techniques","Microbiology"],pf:["Cell Culture","PCR","Sterile Techniques"],loc:"Hyderabad",rem:0,dur:6,cg:6.5,st:"₹14,000/mo",url:"https://www.bharatbiotech.com",desc:"Assist in vaccine development and microbiological research labs."},

// ── Statistics & Mathematics ──
{id:130,co:"ISI",ti:"Statistical Research Intern",el:["Statistics","Mathematics","Data Science"],rq:["R","Statistics"],pf:["Python","Bayesian Analysis","Stata"],loc:"Kolkata",rem:0,dur:6,cg:8.0,st:"₹18,000/mo",url:"https://www.isical.ac.in",desc:"Conduct statistical research at India's premier statistics institute."},
{id:131,co:"Actuarial Society of India",ti:"Actuarial Intern",el:["Statistics","Mathematics","Finance"],rq:["Probability","MS Excel"],pf:["R","Actuarial Modeling","Financial Mathematics"],loc:"Mumbai",rem:0,dur:6,cg:8.0,st:"₹25,000/mo",url:"https://www.actuariesindia.org",desc:"Develop actuarial models for insurance and pension risk assessment."},

// ── Anthropology & Archaeology ──
{id:132,co:"ASI",ti:"Archaeological Research Intern",el:["Archaeology","History","Anthropology"],rq:["Research","MS Office"],pf:["Excavation","Artifact Analysis","Survey"],loc:"Multiple Cities",rem:0,dur:6,cg:6.5,st:"₹10,000/mo",url:"https://asi.nic.in",desc:"Assist in archaeological excavations and heritage documentation."},
{id:133,co:"Anthropological Survey of India",ti:"Anthropology Research Intern",el:["Anthropology","Sociology","Social Work"],rq:["Research","Field Work"],pf:["Ethnography","Data Collection","Report Writing"],loc:"Kolkata",rem:0,dur:6,cg:6.5,st:"₹12,000/mo",url:"https://www.ansi.gov.in",desc:"Conduct anthropological fieldwork and document tribal cultures."},

// ── Defense & Disaster ──
{id:134,co:"IDSA",ti:"Defense Studies Intern",el:["Defense Studies","Political Science","International Relations"],rq:["Research","MS Office"],pf:["Policy Analysis","Geopolitics","Report Writing"],loc:"Delhi",rem:0,dur:6,cg:7.0,st:"₹15,000/mo",url:"https://www.idsa.in",desc:"Research defense and strategic studies for India's premier think tank."},
{id:135,co:"NDRF",ti:"Disaster Management Intern",el:["Disaster Management","Public Administration","Social Work"],rq:["Emergency Response","MS Office"],pf:["First Aid","Crisis Communication","Planning"],loc:"Multiple Cities",rem:0,dur:4,cg:6.0,st:"₹10,000/mo",url:"https://ndrf.gov.in",desc:"Assist in disaster preparedness planning and emergency response training."},

// ── Education ──
{id:136,co:"CBSE",ti:"Education Research Intern",el:["Education","Psychology","English"],rq:["Research","MS Office"],pf:["Curriculum Design","Assessment","Data Analysis"],loc:"Delhi",rem:0,dur:6,cg:7.0,st:"₹14,000/mo",url:"https://cbse.gov.in",desc:"Research education policies and assist in curriculum development."},
{id:137,co:"Byju's",ti:"Ed-Tech Content Intern",el:["Education","Mathematics","CS/IT"],rq:["Content Writing","Subject Knowledge"],pf:["Video Editing","MS PowerPoint","MS Excel"],loc:"Bangalore",rem:1,dur:3,cg:6.0,st:"₹15,000/mo",url:"https://byjus.com/careers",desc:"Create educational content and interactive learning modules."},

// ── Women's Studies / Gender ──
{id:138,co:"UN Women India",ti:"Gender Research Intern",el:["Women's Studies","Sociology","Social Work"],rq:["Research","MS Office"],pf:["Gender Analysis","Policy Research","Report Writing"],loc:"Delhi",rem:0,dur:6,cg:7.0,st:"₹16,000/mo",url:"https://india.unwomen.org",desc:"Research gender equality policies and assist in women's empowerment programs."},
];
