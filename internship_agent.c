/*
 * ══════════════════════════════════════════════════════════════════════════════
 *  internVerse — Find the best internships for ALL streams
 * ══════════════════════════════════════════════════════════════════════════════
 *
 *  Usage:  gcc -o internverse internship_agent.c -lm
 *          ./internverse
 *
 *  The agent collects basic student info (name, stream, skills, CGPA, etc.)
 *  and intelligently matches against a database of 25+ internships across
 *  all academic streams using a weighted scoring algorithm.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

/* ═══════════════════════════════════════════════════════════════════════════════
   CONSTANTS & LIMITS
   ═══════════════════════════════════════════════════════════════════════════════ */

#define MAX_INTERNSHIPS   80
#define MAX_MATCHES       10
#define MAX_SKILLS        10
#define MAX_NAME_LEN      100
#define MAX_STR_LEN       200
#define MAX_DESC_LEN      400
#define MAX_INPUT_LEN     500

/* ═══════════════════════════════════════════════════════════════════════════════
   TERMINAL COLORS (ANSI)
   ═══════════════════════════════════════════════════════════════════════════════ */

#define RESET    "\033[0m"
#define BOLD     "\033[1m"
#define DIM      "\033[2m"
#define RED      "\033[31m"
#define GREEN    "\033[32m"
#define YELLOW   "\033[33m"
#define BLUE     "\033[34m"
#define MAGENTA  "\033[35m"
#define CYAN     "\033[36m"
#define WHITE    "\033[37m"
#define BG_BLUE  "\033[44m"
#define BG_GREEN "\033[42m"

/* ═══════════════════════════════════════════════════════════════════════════════
   DATA STRUCTURES
   ═══════════════════════════════════════════════════════════════════════════════ */

typedef struct {
    char name[MAX_NAME_LEN];
    char email[MAX_STR_LEN];
    char phone[MAX_STR_LEN];
    char stream[MAX_STR_LEN];
    char college[MAX_STR_LEN];
    int  grad_year;
    float cgpa;
    char skills[MAX_SKILLS][50];
    int  skill_count;
    char location_pref[MAX_STR_LEN];
    int  remote_ok;
    int  duration_pref;     /* months, 0 = no preference */
    int  stipend_min;       /* ₹/month, 0 = no preference */
} StudentProfile;

typedef struct {
    char required[MAX_SKILLS][50];
    int  req_count;
    char preferred[MAX_SKILLS][50];
    int  pref_count;
} SkillSet;

typedef struct {
    int  id;
    char company[MAX_STR_LEN];
    char title[MAX_STR_LEN];
    char stream[MAX_STR_LEN];
    char eligible_streams[5][50];
    int  eligible_count;
    SkillSet skills;
    char location[MAX_STR_LEN];
    int  is_remote;
    int  duration_months;
    float min_cgpa;
    char stipend[50];
    char url[MAX_STR_LEN];
    char description[MAX_DESC_LEN];
} Internship;

typedef struct {
    int  internship_id;
    float score;
    char reasons[8][MAX_STR_LEN];
    int  reason_count;
    char warnings[5][MAX_STR_LEN];
    int  warning_count;
} MatchResult;

/* ═══════════════════════════════════════════════════════════════════════════════
   INTERNSHIP DATABASE
   ═══════════════════════════════════════════════════════════════════════════════ */

static Internship database[MAX_INTERNSHIPS];
static int db_count = 0;

static void init_database(void) {
    db_count = 0;

    /* ── CS/IT Internships ── */

    /* 0: Google */
    {
        Internship *i = &database[db_count++];
        i->id = 1;
        strcpy(i->company, "Google");
        strcpy(i->title, "Software Engineering Intern");
        strcpy(i->stream, "CS/IT");
        strcpy(i->eligible_streams[0], "CS/IT");
        strcpy(i->eligible_streams[1], "Electronics");
        strcpy(i->eligible_streams[2], "Data Science");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "python");
        strcpy(i->skills.required[1], "data structures");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "java");
        strcpy(i->skills.preferred[1], "c++");
        strcpy(i->skills.preferred[2], "algorithms");
        strcpy(i->location, "Bangalore");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 7.0;
        strcpy(i->stipend, "Rs.80,000/month");
        strcpy(i->url, "https://careers.google.com");
        strcpy(i->description, "Work on real Google products alongside senior engineers.");
    }

    /* 1: Microsoft */
    {
        Internship *i = &database[db_count++];
        i->id = 2;
        strcpy(i->company, "Microsoft");
        strcpy(i->title, "Software Engineering Intern");
        strcpy(i->stream, "CS/IT");
        strcpy(i->eligible_streams[0], "CS/IT");
        strcpy(i->eligible_streams[1], "Electronics");
        i->eligible_count = 2;
        i->skills.req_count = 3;
        strcpy(i->skills.required[0], "c#");
        strcpy(i->skills.required[1], "python");
        strcpy(i->skills.required[2], "data structures");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "azure");
        strcpy(i->skills.preferred[1], "javascript");
        strcpy(i->skills.preferred[2], "typescript");
        strcpy(i->location, "Hyderabad");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 7.5;
        strcpy(i->stipend, "Rs.75,000/month");
        strcpy(i->url, "https://careers.microsoft.com");
        strcpy(i->description, "Build innovative solutions for Microsoft cloud and AI products.");
    }

    /* 2: Infosys */
    {
        Internship *i = &database[db_count++];
        i->id = 3;
        strcpy(i->company, "Infosys");
        strcpy(i->title, "Full Stack Developer Intern");
        strcpy(i->stream, "CS/IT");
        strcpy(i->eligible_streams[0], "CS/IT");
        strcpy(i->eligible_streams[1], "IT");
        strcpy(i->eligible_streams[2], "Electronics");
        i->eligible_count = 3;
        i->skills.req_count = 3;
        strcpy(i->skills.required[0], "html");
        strcpy(i->skills.required[1], "css");
        strcpy(i->skills.required[2], "javascript");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "react");
        strcpy(i->skills.preferred[1], "node.js");
        strcpy(i->skills.preferred[2], "sql");
        strcpy(i->location, "Pune");
        i->is_remote = 0;
        i->duration_months = 3;
        i->min_cgpa = 6.0;
        strcpy(i->stipend, "Rs.15,000/month");
        strcpy(i->url, "https://www.infosys.com/careers");
        strcpy(i->description, "Develop end-to-end web applications using modern frameworks.");
    }

    /* 3: Stripe */
    {
        Internship *i = &database[db_count++];
        i->id = 4;
        strcpy(i->company, "Stripe");
        strcpy(i->title, "Data Engineering Intern");
        strcpy(i->stream, "CS/IT");
        strcpy(i->eligible_streams[0], "CS/IT");
        strcpy(i->eligible_streams[1], "Data Science");
        strcpy(i->eligible_streams[2], "Mathematics");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "python");
        strcpy(i->skills.required[1], "sql");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "spark");
        strcpy(i->skills.preferred[1], "hadoop");
        strcpy(i->skills.preferred[2], "etl");
        strcpy(i->location, "Remote");
        i->is_remote = 1;
        i->duration_months = 4;
        i->min_cgpa = 7.0;
        strcpy(i->stipend, "Rs.60,000/month");
        strcpy(i->url, "https://stripe.com/jobs");
        strcpy(i->description, "Build and maintain data pipelines for financial infrastructure.");
    }

    /* 4: TCS AI/ML */
    {
        Internship *i = &database[db_count++];
        i->id = 5;
        strcpy(i->company, "TCS");
        strcpy(i->title, "AI/ML Intern");
        strcpy(i->stream, "CS/IT");
        strcpy(i->eligible_streams[0], "CS/IT");
        strcpy(i->eligible_streams[1], "Data Science");
        strcpy(i->eligible_streams[2], "Electronics");
        strcpy(i->eligible_streams[3], "Mathematics");
        i->eligible_count = 4;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "python");
        strcpy(i->skills.required[1], "machine learning");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "tensorflow");
        strcpy(i->skills.preferred[1], "pytorch");
        strcpy(i->skills.preferred[2], "nlp");
        strcpy(i->location, "Chennai");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 6.5;
        strcpy(i->stipend, "Rs.20,000/month");
        strcpy(i->url, "https://www.tcs.com/careers");
        strcpy(i->description, "Research and develop machine learning models for enterprise clients.");
    }

    /* ── Mechanical ── */

    /* 5: Tata Motors */
    {
        Internship *i = &database[db_count++];
        i->id = 6;
        strcpy(i->company, "Tata Motors");
        strcpy(i->title, "Mechanical Design Intern");
        strcpy(i->stream, "Mechanical");
        strcpy(i->eligible_streams[0], "Mechanical");
        strcpy(i->eligible_streams[1], "Automobile");
        strcpy(i->eligible_streams[2], "Industrial");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "autocad");
        strcpy(i->skills.required[1], "solidworks");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "catia");
        strcpy(i->skills.preferred[1], "ansys");
        strcpy(i->skills.preferred[2], "matlab");
        strcpy(i->location, "Pune");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 6.5;
        strcpy(i->stipend, "Rs.18,000/month");
        strcpy(i->url, "https://www.tatamotors.com/careers");
        strcpy(i->description, "Design and simulate automotive components using CAD/CAE tools.");
    }

    /* 6: L&T */
    {
        Internship *i = &database[db_count++];
        i->id = 7;
        strcpy(i->company, "L&T");
        strcpy(i->title, "Manufacturing Engineering Intern");
        strcpy(i->stream, "Mechanical");
        strcpy(i->eligible_streams[0], "Mechanical");
        strcpy(i->eligible_streams[1], "Industrial");
        strcpy(i->eligible_streams[2], "Production");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "cad");
        strcpy(i->skills.required[1], "manufacturing");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "cnc");
        strcpy(i->skills.preferred[1], "lean manufacturing");
        strcpy(i->skills.preferred[2], "six sigma");
        strcpy(i->location, "Mumbai");
        i->is_remote = 0;
        i->duration_months = 4;
        i->min_cgpa = 6.0;
        strcpy(i->stipend, "Rs.12,000/month");
        strcpy(i->url, "https://www.larsentoubro.com/careers");
        strcpy(i->description, "Optimize manufacturing processes and quality on the shop floor.");
    }

    /* 7: Boeing */
    {
        Internship *i = &database[db_count++];
        i->id = 8;
        strcpy(i->company, "Boeing");
        strcpy(i->title, "Aerospace Engineering Intern");
        strcpy(i->stream, "Mechanical");
        strcpy(i->eligible_streams[0], "Mechanical");
        strcpy(i->eligible_streams[1], "Aerospace");
        i->eligible_count = 2;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "matlab");
        strcpy(i->skills.required[1], "python");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "cfd");
        strcpy(i->skills.preferred[1], "fea");
        strcpy(i->skills.preferred[2], "3d modeling");
        strcpy(i->location, "Bangalore");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 7.5;
        strcpy(i->stipend, "Rs.30,000/month");
        strcpy(i->url, "https://www.boeing.co.in/careers");
        strcpy(i->description, "Support aircraft design and analysis with simulation tools.");
    }

    /* ── Civil ── */

    /* 8: L&T Construction */
    {
        Internship *i = &database[db_count++];
        i->id = 9;
        strcpy(i->company, "L&T Construction");
        strcpy(i->title, "Site Engineering Intern");
        strcpy(i->stream, "Civil");
        strcpy(i->eligible_streams[0], "Civil");
        strcpy(i->eligible_streams[1], "Construction");
        i->eligible_count = 2;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "autocad");
        strcpy(i->skills.required[1], "structural analysis");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "staad pro");
        strcpy(i->skills.preferred[1], "revit");
        strcpy(i->skills.preferred[2], "project management");
        strcpy(i->location, "Delhi");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 6.0;
        strcpy(i->stipend, "Rs.15,000/month");
        strcpy(i->url, "https://www.larsentoubro.com/careers");
        strcpy(i->description, "Supervise construction sites and prepare engineering drawings.");
    }

    /* 9: WSP Global */
    {
        Internship *i = &database[db_count++];
        i->id = 10;
        strcpy(i->company, "WSP Global");
        strcpy(i->title, "Transportation Planning Intern");
        strcpy(i->stream, "Civil");
        strcpy(i->eligible_streams[0], "Civil");
        strcpy(i->eligible_streams[1], "Urban Planning");
        strcpy(i->eligible_streams[2], "Transportation");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "autocad");
        strcpy(i->skills.required[1], "civil engineering");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "traffic simulation");
        strcpy(i->skills.preferred[1], "gis");
        strcpy(i->skills.preferred[2], "python");
        strcpy(i->location, "Mumbai");
        i->is_remote = 0;
        i->duration_months = 4;
        i->min_cgpa = 6.5;
        strcpy(i->stipend, "Rs.14,000/month");
        strcpy(i->url, "https://www.wsp.com/careers");
        strcpy(i->description, "Assist in transportation modeling and infrastructure planning.");
    }

    /* ── Electrical / ECE ── */

    /* 10: Siemens */
    {
        Internship *i = &database[db_count++];
        i->id = 11;
        strcpy(i->company, "Siemens");
        strcpy(i->title, "Power Systems Intern");
        strcpy(i->stream, "Electrical");
        strcpy(i->eligible_streams[0], "Electrical");
        strcpy(i->eligible_streams[1], "Electronics");
        strcpy(i->eligible_streams[2], "ECE");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "matlab");
        strcpy(i->skills.required[1], "power systems");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "simulink");
        strcpy(i->skills.preferred[1], "plc");
        strcpy(i->skills.preferred[2], "scada");
        strcpy(i->location, "Bangalore");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 7.0;
        strcpy(i->stipend, "Rs.22,000/month");
        strcpy(i->url, "https://www.siemens.co.in/careers");
        strcpy(i->description, "Work on smart grid and power automation projects.");
    }

    /* 11: Qualcomm */
    {
        Internship *i = &database[db_count++];
        i->id = 12;
        strcpy(i->company, "Qualcomm");
        strcpy(i->title, "VLSI Design Intern");
        strcpy(i->stream, "Electronics");
        strcpy(i->eligible_streams[0], "Electronics");
        strcpy(i->eligible_streams[1], "ECE");
        strcpy(i->eligible_streams[2], "Electrical");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "verilog");
        strcpy(i->skills.required[1], "vlsi");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "systemverilog");
        strcpy(i->skills.preferred[1], "cadence");
        strcpy(i->skills.preferred[2], "tapeout");
        strcpy(i->location, "Hyderabad");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 7.5;
        strcpy(i->stipend, "Rs.40,000/month");
        strcpy(i->url, "https://www.qualcomm.com/careers");
        strcpy(i->description, "Design and verify digital circuits for mobile chipsets.");
    }

    /* 12: Samsung R&D */
    {
        Internship *i = &database[db_count++];
        i->id = 13;
        strcpy(i->company, "Samsung R&D");
        strcpy(i->title, "Embedded Systems Intern");
        strcpy(i->stream, "Electronics");
        strcpy(i->eligible_streams[0], "Electronics");
        strcpy(i->eligible_streams[1], "ECE");
        strcpy(i->eligible_streams[2], "CS/IT");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "c");
        strcpy(i->skills.required[1], "embedded c");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "rtos");
        strcpy(i->skills.preferred[1], "linux kernel");
        strcpy(i->skills.preferred[2], "arm");
        strcpy(i->location, "Noida");
        i->is_remote = 0;
        i->duration_months = 4;
        i->min_cgpa = 7.0;
        strcpy(i->stipend, "Rs.25,000/month");
        strcpy(i->url, "https://www.samsung.com/in/sris/careers");
        strcpy(i->description, "Develop firmware and drivers for consumer electronics.");
    }

    /* ── Commerce / Finance ── */

    /* 13: Deloitte */
    {
        Internship *i = &database[db_count++];
        i->id = 14;
        strcpy(i->company, "Deloitte");
        strcpy(i->title, "Audit & Assurance Intern");
        strcpy(i->stream, "Commerce");
        strcpy(i->eligible_streams[0], "Commerce");
        strcpy(i->eligible_streams[1], "Finance");
        strcpy(i->eligible_streams[2], "BBA");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "accounting");
        strcpy(i->skills.required[1], "ms excel");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "tally");
        strcpy(i->skills.preferred[1], "sap");
        strcpy(i->skills.preferred[2], "financial analysis");
        strcpy(i->location, "Mumbai");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 6.0;
        strcpy(i->stipend, "Rs.18,000/month");
        strcpy(i->url, "https://www.deloitte.com/in/en/careers.html");
        strcpy(i->description, "Assist in auditing engagements and financial statement reviews.");
    }

    /* 14: Goldman Sachs */
    {
        Internship *i = &database[db_count++];
        i->id = 15;
        strcpy(i->company, "Goldman Sachs");
        strcpy(i->title, "Finance Intern");
        strcpy(i->stream, "Commerce");
        strcpy(i->eligible_streams[0], "Commerce");
        strcpy(i->eligible_streams[1], "Finance");
        strcpy(i->eligible_streams[2], "Economics");
        strcpy(i->eligible_streams[3], "Mathematics");
        i->eligible_count = 4;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "financial analysis");
        strcpy(i->skills.required[1], "ms excel");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "python");
        strcpy(i->skills.preferred[1], "bloomberg");
        strcpy(i->skills.preferred[2], "valuation modeling");
        strcpy(i->location, "Bangalore");
        i->is_remote = 0;
        i->duration_months = 3;
        i->min_cgpa = 8.0;
        strcpy(i->stipend, "Rs.50,000/month");
        strcpy(i->url, "https://www.goldmansachs.com/careers");
        strcpy(i->description, "Support deal teams with research, analysis, and financial modeling.");
    }

    /* 15: PwC */
    {
        Internship *i = &database[db_count++];
        i->id = 16;
        strcpy(i->company, "PwC");
        strcpy(i->title, "Consulting Intern");
        strcpy(i->stream, "Commerce");
        strcpy(i->eligible_streams[0], "Commerce");
        strcpy(i->eligible_streams[1], "BBA");
        strcpy(i->eligible_streams[2], "MBA");
        strcpy(i->eligible_streams[3], "Economics");
        i->eligible_count = 4;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "business analysis");
        strcpy(i->skills.required[1], "ms office");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "powerpoint");
        strcpy(i->skills.preferred[1], "data analysis");
        strcpy(i->skills.preferred[2], "sql");
        strcpy(i->location, "Delhi");
        i->is_remote = 0;
        i->duration_months = 3;
        i->min_cgpa = 6.5;
        strcpy(i->stipend, "Rs.20,000/month");
        strcpy(i->url, "https://www.pwc.in/careers.html");
        strcpy(i->description, "Work with consulting teams on strategy and operations projects.");
    }

    /* ── Arts / Design ── */

    /* 16: Ogilvy */
    {
        Internship *i = &database[db_count++];
        i->id = 17;
        strcpy(i->company, "Ogilvy");
        strcpy(i->title, "Content & Copywriting Intern");
        strcpy(i->stream, "Arts");
        strcpy(i->eligible_streams[0], "Arts");
        strcpy(i->eligible_streams[1], "Journalism");
        strcpy(i->eligible_streams[2], "English");
        strcpy(i->eligible_streams[3], "Design");
        strcpy(i->eligible_streams[4], "Mass Communication");
        i->eligible_count = 5;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "content writing");
        strcpy(i->skills.required[1], "english");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "seo");
        strcpy(i->skills.preferred[1], "social media");
        strcpy(i->skills.preferred[2], "copywriting");
        strcpy(i->location, "Mumbai");
        i->is_remote = 1;
        i->duration_months = 3;
        i->min_cgpa = 5.5;
        strcpy(i->stipend, "Rs.12,000/month");
        strcpy(i->url, "https://www.ogilvy.com/careers");
        strcpy(i->description, "Create compelling content for brand campaigns across digital and print.");
    }

    /* 17: Zomato */
    {
        Internship *i = &database[db_count++];
        i->id = 18;
        strcpy(i->company, "Zomato");
        strcpy(i->title, "UX/UI Design Intern");
        strcpy(i->stream, "Design");
        strcpy(i->eligible_streams[0], "Design");
        strcpy(i->eligible_streams[1], "Arts");
        strcpy(i->eligible_streams[2], "CS/IT");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "figma");
        strcpy(i->skills.required[1], "ui design");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "prototyping");
        strcpy(i->skills.preferred[1], "user research");
        strcpy(i->skills.preferred[2], "illustrator");
        strcpy(i->location, "Gurugram");
        i->is_remote = 0;
        i->duration_months = 4;
        i->min_cgpa = 6.0;
        strcpy(i->stipend, "Rs.20,000/month");
        strcpy(i->url, "https://www.zomato.com/careers");
        strcpy(i->description, "Design intuitive interfaces for Zomato's consumer products.");
    }

    /* 18: Google Marketing */
    {
        Internship *i = &database[db_count++];
        i->id = 19;
        strcpy(i->company, "Google");
        strcpy(i->title, "Digital Marketing Intern");
        strcpy(i->stream, "Arts");
        strcpy(i->eligible_streams[0], "Arts");
        strcpy(i->eligible_streams[1], "Commerce");
        strcpy(i->eligible_streams[2], "Mass Communication");
        strcpy(i->eligible_streams[3], "Marketing");
        i->eligible_count = 4;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "digital marketing");
        strcpy(i->skills.required[1], "social media");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "google ads");
        strcpy(i->skills.preferred[1], "analytics");
        strcpy(i->skills.preferred[2], "content strategy");
        strcpy(i->location, "Bangalore");
        i->is_remote = 1;
        i->duration_months = 3;
        i->min_cgpa = 6.0;
        strcpy(i->stipend, "Rs.25,000/month");
        strcpy(i->url, "https://careers.google.com");
        strcpy(i->description, "Plan and execute digital marketing campaigns for Google products.");
    }

    /* ── Data Science ── */

    /* 19: Flipkart */
    {
        Internship *i = &database[db_count++];
        i->id = 20;
        strcpy(i->company, "Flipkart");
        strcpy(i->title, "Data Science Intern");
        strcpy(i->stream, "Data Science");
        strcpy(i->eligible_streams[0], "Data Science");
        strcpy(i->eligible_streams[1], "CS/IT");
        strcpy(i->eligible_streams[2], "Mathematics");
        strcpy(i->eligible_streams[3], "Statistics");
        i->eligible_count = 4;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "python");
        strcpy(i->skills.required[1], "statistics");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "sql");
        strcpy(i->skills.preferred[1], "machine learning");
        strcpy(i->skills.preferred[2], "tableau");
        strcpy(i->location, "Bangalore");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 7.0;
        strcpy(i->stipend, "Rs.40,000/month");
        strcpy(i->url, "https://www.flipkartcareers.com");
        strcpy(i->description, "Build recommendation and forecasting models for e-commerce.");
    }

    /* ── Pharma ── */

    /* 20: Dr. Reddy's */
    {
        Internship *i = &database[db_count++];
        i->id = 21;
        strcpy(i->company, "Dr. Reddy's");
        strcpy(i->title, "Pharmaceutical Research Intern");
        strcpy(i->stream, "Pharmacy");
        strcpy(i->eligible_streams[0], "Pharmacy");
        strcpy(i->eligible_streams[1], "Biotechnology");
        strcpy(i->eligible_streams[2], "Chemistry");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "pharmacology");
        strcpy(i->skills.required[1], "drug analysis");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "hplc");
        strcpy(i->skills.preferred[1], "mass spectrometry");
        strcpy(i->skills.preferred[2], "regulatory affairs");
        strcpy(i->location, "Hyderabad");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 6.5;
        strcpy(i->stipend, "Rs.16,000/month");
        strcpy(i->url, "https://www.drreddys.com/careers");
        strcpy(i->description, "Support drug development and quality testing in pharma R&D.");
    }

    /* ── Cross-stream ── */

    /* 21: Amazon */
    {
        Internship *i = &database[db_count++];
        i->id = 22;
        strcpy(i->company, "Amazon");
        strcpy(i->title, "Operations Intern");
        strcpy(i->stream, "Operations");
        strcpy(i->eligible_streams[0], "CS/IT");
        strcpy(i->eligible_streams[1], "Mechanical");
        strcpy(i->eligible_streams[2], "Industrial");
        strcpy(i->eligible_streams[3], "Commerce");
        strcpy(i->eligible_streams[4], "BBA");
        i->eligible_count = 5;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "excel");
        strcpy(i->skills.required[1], "analytical thinking");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "sql");
        strcpy(i->skills.preferred[1], "python");
        strcpy(i->skills.preferred[2], "supply chain");
        strcpy(i->location, "Multiple Cities");
        i->is_remote = 0;
        i->duration_months = 4;
        i->min_cgpa = 6.5;
        strcpy(i->stipend, "Rs.30,000/month");
        strcpy(i->url, "https://www.amazon.jobs");
        strcpy(i->description, "Optimize fulfillment and logistics operations for Amazon India.");
    }

    /* 22: Zoho */
    {
        Internship *i = &database[db_count++];
        i->id = 23;
        strcpy(i->company, "Zoho");
        strcpy(i->title, "Technical Writer Intern");
        strcpy(i->stream, "CS/IT");
        strcpy(i->eligible_streams[0], "CS/IT");
        strcpy(i->eligible_streams[1], "English");
        strcpy(i->eligible_streams[2], "Arts");
        strcpy(i->eligible_streams[3], "Communication");
        i->eligible_count = 4;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "technical writing");
        strcpy(i->skills.required[1], "english");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "api docs");
        strcpy(i->skills.preferred[1], "markdown");
        strcpy(i->skills.preferred[2], "git");
        strcpy(i->location, "Chennai");
        i->is_remote = 1;
        i->duration_months = 3;
        i->min_cgpa = 6.0;
        strcpy(i->stipend, "Rs.15,000/month");
        strcpy(i->url, "https://www.zoho.com/careers.html");
        strcpy(i->description, "Write clear documentation and user guides for Zoho products.");
    }

    /* 23: Freshworks */
    {
        Internship *i = &database[db_count++];
        i->id = 24;
        strcpy(i->company, "Freshworks");
        strcpy(i->title, "HR Intern");
        strcpy(i->stream, "BBA");
        strcpy(i->eligible_streams[0], "BBA");
        strcpy(i->eligible_streams[1], "Commerce");
        strcpy(i->eligible_streams[2], "Psychology");
        strcpy(i->eligible_streams[3], "Arts");
        i->eligible_count = 4;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "hr fundamentals");
        strcpy(i->skills.required[1], "communication");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "ms excel");
        strcpy(i->skills.preferred[1], "recruitment");
        strcpy(i->skills.preferred[2], "employee engagement");
        strcpy(i->location, "Chennai");
        i->is_remote = 0;
        i->duration_months = 3;
        i->min_cgpa = 5.5;
        strcpy(i->stipend, "Rs.10,000/month");
        strcpy(i->url, "https://www.freshworks.com/careers");
        strcpy(i->description, "Support HR operations including recruitment and culture programs.");
    }

    /* 24: HDFC Bank */
    {
        Internship *i = &database[db_count++];
        i->id = 25;
        strcpy(i->company, "HDFC Bank");
        strcpy(i->title, "Banking Intern");
        strcpy(i->stream, "Commerce");
        strcpy(i->eligible_streams[0], "Commerce");
        strcpy(i->eligible_streams[1], "Finance");
        strcpy(i->eligible_streams[2], "BBA");
        strcpy(i->eligible_streams[3], "Economics");
        i->eligible_count = 4;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "ms excel");
        strcpy(i->skills.required[1], "communication");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "financial products");
        strcpy(i->skills.preferred[1], "crm");
        strcpy(i->skills.preferred[2], "banking software");
        strcpy(i->location, "Multiple Cities");
        i->is_remote = 0;
        i->duration_months = 3;
        i->min_cgpa = 5.5;
        strcpy(i->stipend, "Rs.12,000/month");
        strcpy(i->url, "https://www.hdfcbank.com/careers");
        strcpy(i->description, "Shadow banking professionals and assist in customer operations.");
    }

    /* ── MBA / Management ── */

    /* 25: BCG */
    {
        Internship *i = &database[db_count++];
        i->id = 26;
        strcpy(i->company, "BCG");
        strcpy(i->title, "Strategy Consulting Intern");
        strcpy(i->stream, "MBA");
        strcpy(i->eligible_streams[0], "MBA");
        strcpy(i->eligible_streams[1], "BBA");
        strcpy(i->eligible_streams[2], "Commerce");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "business analysis");
        strcpy(i->skills.required[1], "powerpoint");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "financial modeling");
        strcpy(i->skills.preferred[1], "data analysis");
        strcpy(i->skills.preferred[2], "strategy");
        strcpy(i->location, "Delhi");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 8.0;
        strcpy(i->stipend, "Rs.60,000/month");
        strcpy(i->url, "https://careers.bcg.com");
        strcpy(i->description, "Work with Fortune 500 clients on strategic transformation projects.");
    }

    /* 26: McKinsey */
    {
        Internship *i = &database[db_count++];
        i->id = 27;
        strcpy(i->company, "McKinsey");
        strcpy(i->title, "Business Analyst Intern");
        strcpy(i->stream, "MBA");
        strcpy(i->eligible_streams[0], "MBA");
        strcpy(i->eligible_streams[1], "Economics");
        strcpy(i->eligible_streams[2], "Finance");
        strcpy(i->eligible_streams[3], "Mathematics");
        i->eligible_count = 4;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "data analysis");
        strcpy(i->skills.required[1], "powerpoint");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "sql");
        strcpy(i->skills.preferred[1], "python");
        strcpy(i->skills.preferred[2], "financial modeling");
        strcpy(i->location, "Mumbai");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 8.5;
        strcpy(i->stipend, "Rs.70,000/month");
        strcpy(i->url, "https://www.mckinsey.com/careers");
        strcpy(i->description, "Solve complex business problems with data-driven insights for top clients.");
    }

    /* 27: Flipkart PM */
    {
        Internship *i = &database[db_count++];
        i->id = 28;
        strcpy(i->company, "Flipkart");
        strcpy(i->title, "Product Management Intern");
        strcpy(i->stream, "MBA");
        strcpy(i->eligible_streams[0], "MBA");
        strcpy(i->eligible_streams[1], "BBA");
        strcpy(i->eligible_streams[2], "CS/IT");
        strcpy(i->eligible_streams[3], "Design");
        i->eligible_count = 4;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "ms excel");
        strcpy(i->skills.required[1], "communication");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "sql");
        strcpy(i->skills.preferred[1], "data analysis");
        strcpy(i->skills.preferred[2], "user research");
        strcpy(i->location, "Bangalore");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 7.0;
        strcpy(i->stipend, "Rs.45,000/month");
        strcpy(i->url, "https://www.flipkartcareers.com");
        strcpy(i->description, "Drive product strategy and execution for Flipkart core features.");
    }

    /* ── Psychology ── */

    /* 28: Practo */
    {
        Internship *i = &database[db_count++];
        i->id = 29;
        strcpy(i->company, "Practo");
        strcpy(i->title, "Mental Health Content Intern");
        strcpy(i->stream, "Psychology");
        strcpy(i->eligible_streams[0], "Psychology");
        strcpy(i->eligible_streams[1], "Arts");
        strcpy(i->eligible_streams[2], "English");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "content writing");
        strcpy(i->skills.required[1], "psychology");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "research");
        strcpy(i->skills.preferred[1], "empathy");
        strcpy(i->skills.preferred[2], "communication");
        strcpy(i->location, "Bangalore");
        i->is_remote = 1;
        i->duration_months = 3;
        i->min_cgpa = 5.5;
        strcpy(i->stipend, "Rs.12,000/month");
        strcpy(i->url, "https://www.practo.com/careers");
        strcpy(i->description, "Create mental health content and wellness resources for millions.");
    }

    /* 29: YourDOST */
    {
        Internship *i = &database[db_count++];
        i->id = 30;
        strcpy(i->company, "YourDOST");
        strcpy(i->title, "Counseling Intern");
        strcpy(i->stream, "Psychology");
        strcpy(i->eligible_streams[0], "Psychology");
        strcpy(i->eligible_streams[1], "Social Work");
        i->eligible_count = 2;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "psychology");
        strcpy(i->skills.required[1], "active listening");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "cbt");
        strcpy(i->skills.preferred[1], "empathy");
        strcpy(i->skills.preferred[2], "behavioral therapy");
        strcpy(i->location, "Delhi");
        i->is_remote = 1;
        i->duration_months = 6;
        i->min_cgpa = 6.0;
        strcpy(i->stipend, "Rs.10,000/month");
        strcpy(i->url, "https://www.yourdost.com");
        strcpy(i->description, "Provide online mental health support and emotional wellness coaching.");
    }

    /* ── Economics ── */

    /* 30: RBI */
    {
        Internship *i = &database[db_count++];
        i->id = 31;
        strcpy(i->company, "RBI");
        strcpy(i->title, "Research Intern - Economics");
        strcpy(i->stream, "Economics");
        strcpy(i->eligible_streams[0], "Economics");
        strcpy(i->eligible_streams[1], "Finance");
        strcpy(i->eligible_streams[2], "Mathematics");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "economic analysis");
        strcpy(i->skills.required[1], "ms excel");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "stata");
        strcpy(i->skills.preferred[1], "econometrics");
        strcpy(i->skills.preferred[2], "r");
        strcpy(i->location, "Mumbai");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 8.0;
        strcpy(i->stipend, "Rs.30,000/month");
        strcpy(i->url, "https://www.rbi.org.in");
        strcpy(i->description, "Conduct monetary policy research and macroeconomic analysis.");
    }

    /* ── Mass Communication ── */

    /* 31: NDTV */
    {
        Internship *i = &database[db_count++];
        i->id = 32;
        strcpy(i->company, "NDTV");
        strcpy(i->title, "Broadcast Journalism Intern");
        strcpy(i->stream, "Mass Communication");
        strcpy(i->eligible_streams[0], "Mass Communication");
        strcpy(i->eligible_streams[1], "Journalism");
        strcpy(i->eligible_streams[2], "English");
        i->eligible_count = 3;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "content writing");
        strcpy(i->skills.required[1], "research");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "video editing");
        strcpy(i->skills.preferred[1], "social media");
        strcpy(i->skills.preferred[2], "news writing");
        strcpy(i->location, "Delhi");
        i->is_remote = 0;
        i->duration_months = 3;
        i->min_cgpa = 5.5;
        strcpy(i->stipend, "Rs.10,000/month");
        strcpy(i->url, "https://www.ndtv.com/careers");
        strcpy(i->description, "Research and produce news segments for prime-time broadcasts.");
    }

    /* ── More CS/IT ── */

    /* 32: Razorpay */
    {
        Internship *i = &database[db_count++];
        i->id = 33;
        strcpy(i->company, "Razorpay");
        strcpy(i->title, "Software Development Intern");
        strcpy(i->stream, "CS/IT");
        strcpy(i->eligible_streams[0], "CS/IT");
        strcpy(i->eligible_streams[1], "Electronics");
        i->eligible_count = 2;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "python");
        strcpy(i->skills.required[1], "javascript");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "react");
        strcpy(i->skills.preferred[1], "node.js");
        strcpy(i->skills.preferred[2], "sql");
        strcpy(i->location, "Bangalore");
        i->is_remote = 1;
        i->duration_months = 6;
        i->min_cgpa = 6.5;
        strcpy(i->stipend, "Rs.30,000/month");
        strcpy(i->url, "https://razorpay.com/careers");
        strcpy(i->description, "Build payment infrastructure powering India's digital economy.");
    }

    /* 33: Cred */
    {
        Internship *i = &database[db_count++];
        i->id = 34;
        strcpy(i->company, "Cred");
        strcpy(i->title, "Frontend Engineering Intern");
        strcpy(i->stream, "CS/IT");
        strcpy(i->eligible_streams[0], "CS/IT");
        i->eligible_count = 1;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "javascript");
        strcpy(i->skills.required[1], "react");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "typescript");
        strcpy(i->skills.preferred[1], "css");
        strcpy(i->skills.preferred[2], "graphql");
        strcpy(i->location, "Bangalore");
        i->is_remote = 0;
        i->duration_months = 6;
        i->min_cgpa = 7.0;
        strcpy(i->stipend, "Rs.50,000/month");
        strcpy(i->url, "https://cred.club/careers");
        strcpy(i->description, "Craft premium user experiences for India's most exclusive credit platform.");
    }

    /* 34: Atlassian */
    {
        Internship *i = &database[db_count++];
        i->id = 35;
        strcpy(i->company, "Atlassian");
        strcpy(i->title, "Backend Engineering Intern");
        strcpy(i->stream, "CS/IT");
        strcpy(i->eligible_streams[0], "CS/IT");
        strcpy(i->eligible_streams[1], "Electronics");
        i->eligible_count = 2;
        i->skills.req_count = 2;
        strcpy(i->skills.required[0], "java");
        strcpy(i->skills.required[1], "sql");
        i->skills.pref_count = 3;
        strcpy(i->skills.preferred[0], "python");
        strcpy(i->skills.preferred[1], "aws");
        strcpy(i->skills.preferred[2], "rest apis");
        strcpy(i->location, "Bangalore");
        i->is_remote = 1;
        i->duration_months = 6;
        i->min_cgpa = 7.0;
        strcpy(i->stipend, "Rs.45,000/month");
        strcpy(i->url, "https://www.atlassian.com/company/careers");
        strcpy(i->description, "Build scalable backend services for Jira and Confluence products.");
    }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════════ */

static void to_lower(char *dst, const char *src) {
    int i;
    for (i = 0; src[i]; i++)
        dst[i] = (src[i] >= 'A' && src[i] <= 'Z') ? src[i] + 32 : src[i];
    dst[i] = '\0';
}

static int str_contains_ci(const char *haystack, const char *needle) {
    char h[MAX_STR_LEN], n[MAX_STR_LEN];
    to_lower(h, haystack);
    to_lower(n, needle);
    return strstr(h, n) != NULL;
}

static int skill_in_list(const char *skill, const char list[][50], int count) {
    char sl[MAX_STR_LEN];
    to_lower(sl, skill);
    for (int i = 0; i < count; i++) {
        char ll[MAX_STR_LEN];
        to_lower(ll, list[i]);
        if (strcmp(sl, ll) == 0) return 1;
    }
    return 0;
}

static void read_line(const char *prompt, char *buf, int max) {
    printf("  %s", prompt);
    fflush(stdout);
    if (fgets(buf, max, stdin)) {
        int len = strlen(buf);
        if (len > 0 && buf[len-1] == '\n') buf[len-1] = '\0';
    }
}

static int read_int(const char *prompt, int def) {
    char buf[50];
    read_line(prompt, buf, sizeof(buf));
    if (buf[0] == '\0') return def;
    return atoi(buf);
}

static float read_float(const char *prompt, float def) {
    char buf[50];
    read_line(prompt, buf, sizeof(buf));
    if (buf[0] == '\0') return def;
    return (float)atof(buf);
}

static void print_separator(void) {
    printf(DIM "──────────────────────────────────────────────────────────────────────────" RESET "\n");
}


static void print_score_bar(float score) {
    int filled = (int)(score / 5.0);
    printf("  ");
    for (int j = 0; j < 20; j++) {
        if (j < filled) {
            if (score >= 75) printf(GREEN "█" RESET);
            else if (score >= 50) printf(YELLOW "█" RESET);
            else if (score >= 30) printf(YELLOW "░" RESET);
            else printf(RED "░" RESET);
        } else {
            printf(DIM "░" RESET);
        }
    }
    if (score >= 75) printf(" " GREEN BOLD "%.0f/100" RESET " " GREEN "(Great)" RESET, score);
    else if (score >= 50) printf(" " YELLOW BOLD "%.0f/100" RESET " " YELLOW "(Good)" RESET, score);
    else if (score >= 30) printf(" " YELLOW "%.0f/100" RESET " " YELLOW "(Fair)" RESET, score);
    else printf(" " RED "%.0f/100" RESET " " RED "(Low)" RESET, score);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PROFILE COLLECTION
   ═══════════════════════════════════════════════════════════════════════════════ */

typedef struct {
    const char *name;
    const char *code;
} StreamOption;

static const StreamOption STREAMS[] = {
    {"CS/IT",             "CS/IT"},
    {"Electronics",       "Electronics"},
    {"Electrical",        "Electrical"},
    {"Mechanical",        "Mechanical"},
    {"Civil",              "Civil"},
    {"Commerce",          "Commerce"},
    {"Finance",           "Finance"},
    {"BBA",               "BBA"},
    {"Arts",              "Arts"},
    {"Design",            "Design"},
    {"Data Science",      "Data Science"},
    {"Mathematics",       "Mathematics"},
    {"Statistics",        "Statistics"},
    {"Economics",         "Economics"},
    {"Pharmacy",          "Pharmacy"},
    {"Biotechnology",     "Biotechnology"},
    {"Chemistry",         "Chemistry"},
    {"Mass Communication","Mass Communication"},
    {"Journalism",        "Journalism"},
    {"English",           "English"},
    {"Automobile",        "Automobile"},
    {"Industrial",        "Industrial"},
    {"Production",        "Production"},
    {"Construction",      "Construction"},
    {"MBA",               "MBA"},
    {"Marketing",         "Marketing"},
    {"Psychology",        "Psychology"},
};
#define NUM_STREAMS (int)(sizeof(STREAMS) / sizeof(STREAMS[0]))

static const char *SKILL_SUGGESTIONS[][12] = {
    /* CS/IT */           {"Python","Java","C++","JavaScript","SQL","Data Structures","React","Node.js","Git","AWS","Machine Learning","HTML"},
    /* Electronics */     {"VLSI","Verilog","Embedded C","MATLAB","PCB Design","Signal Processing","C","ARM","Linux Kernel","SystemVerilog","CAD","Python"},
    /* Electrical */      {"MATLAB","Power Systems","Simulink","PLC","SCADA","Circuit Design","Python","AutoCAD","Control Systems","Embedded C","Verilog","VLSI"},
    /* Mechanical */      {"AutoCAD","SolidWorks","CATIA","MATLAB","ANSYS","CNC","Manufacturing","GD&T","Creo","Python","Thermodynamics","Fluid Mechanics"},
    /* Civil */           {"AutoCAD","STAAD Pro","Revit","Structural Analysis","GIS","Project Management","ETABS","Civil 3D","MS Project","Python","Surveying","Concrete Technology"},
    /* Commerce */        {"Accounting","Tally","SAP","Financial Analysis","MS Excel","GST","TDS","Auditing","Taxation","QuickBooks","ERP","Credit Analysis"},
    /* BBA */             {"MS Excel","Business Analysis","Marketing","HR","PowerPoint","MS Office","Data Analysis","Project Management","Communication","Leadership","CRM","ERP"},
    /* Arts */            {"Content Writing","English","Social Media","SEO","Copywriting","Adobe Photoshop","Video Editing","Photography","MS Word","Blog Writing","Social Media Marketing","Canva"},
    /* Design */          {"Figma","Adobe XD","Illustrator","Photoshop","UI Design","Prototyping","Wireframing","Sketch","After Effects","Blender","CSS","HTML"},
    /* Data Science */    {"Python","Machine Learning","SQL","Tableau","TensorFlow","Statistics","R","Pandas","Numpy","Power BI","Deep Learning","NLP"},
    /* Pharmacy */        {"Pharmacology","Drug Analysis","HPLC","Mass Spectrometry","Regulatory Affairs","Medicinal Chemistry","Clinical Research","Pharmacovigilance","GMP","GLP","Microbiology","Biochemistry"},
    /* Biotechnology */   {"Bioinformatics","PCR","Cell Culture","DNA Extraction","Protein Purification","Python","MATLAB","Microbiology","Immunology","Molecular Biology","Statistics","ELISA"},
    /* default */         {"MS Excel","Communication","Problem Solving","Teamwork","Time Management","Leadership","MS Office","Project Management","Data Analysis","Report Writing","Critical Thinking","Adaptability"},
};

static const char *get_skill_suggestion_set(const char *stream) {
    if (str_contains_ci(stream, "cs") || str_contains_ci(stream, "it")) return "CS/IT";
    if (str_contains_ci(stream, "elec")) return "Electronics";
    if (str_contains_ci(stream, "mech")) return "Mechanical";
    if (str_contains_ci(stream, "civil")) return "Civil";
    if (str_contains_ci(stream, "commerc")) return "Commerce";
    if (str_contains_ci(stream, "bba")) return "BBA";
    if (str_contains_ci(stream, "art")) return "Arts";
    if (str_contains_ci(stream, "design")) return "Design";
    if (str_contains_ci(stream, "data sci")) return "Data Science";
    if (str_contains_ci(stream, "pharm")) return "Pharmacy";
    if (str_contains_ci(stream, "biotech")) return "Biotechnology";
    return "default";
}

static int get_skill_suggestions(const char *stream, const char **out) {
    const char *key = get_skill_suggestion_set(stream);
    int idx = 0;
    if (strcmp(key, "CS/IT") == 0) idx = 0;
    else if (strcmp(key, "Electronics") == 0) idx = 1;
    else if (strcmp(key, "Mechanical") == 0) idx = 3;
    else if (strcmp(key, "Civil") == 0) idx = 4;
    else if (strcmp(key, "Commerce") == 0) idx = 5;
    else if (strcmp(key, "BBA") == 0) idx = 6;
    else if (strcmp(key, "Arts") == 0) idx = 7;
    else if (strcmp(key, "Design") == 0) idx = 8;
    else if (strcmp(key, "Data Science") == 0) idx = 9;
    else if (strcmp(key, "Pharmacy") == 0) idx = 10;
    else if (strcmp(key, "Biotechnology") == 0) idx = 11;
    else idx = 12;

    for (int i = 0; i < 12; i++) {
        out[i] = SKILL_SUGGESTIONS[idx][i];
    }
    return 12;
}

static void collect_profile(StudentProfile *p) {
    char buf[MAX_INPUT_LEN];

    memset(p, 0, sizeof(StudentProfile));

    printf("\n");
    printf(BOLD BG_BLUE "                                                           " RESET "\n");
    printf(BOLD BG_BLUE "     " BOLD WHITE "  internVerse  " RESET BG_BLUE "     " RESET "\n");
    printf(BOLD BG_BLUE "     " DIM "  Smart internship matching for ALL streams  " RESET BG_BLUE " " RESET "\n");
    printf(BOLD BG_BLUE "                                                           " RESET "\n");
    printf(DIM "\n  I'll collect a few details and match you with the best\n  internships from top companies across India.\n\n" RESET);

    /* Basic Info */
    printf(BOLD "  BASIC INFORMATION\n" RESET);
    print_separator();
    read_line("Full name: ", p->name, MAX_NAME_LEN);
    read_line("Email: ", p->email, MAX_STR_LEN);
    read_line("Phone (optional): ", p->phone, MAX_STR_LEN);

    /* Stream */
    printf("\n" BOLD "  EDUCATION\n" RESET);
    print_separator();
    printf("  Available streams:\n");
    for (int i = 0; i < NUM_STREAMS; i++) {
        if (i % 3 == 0) printf("    ");
        printf(BOLD "%2d" RESET ". %-18s", i + 1, STREAMS[i].name);
        if (i % 3 == 2) printf("\n");
    }
    if (NUM_STREAMS % 3 != 0) printf("\n");

    read_line("\n  Your stream (number or name): ", buf, MAX_INPUT_LEN);
    int num = atoi(buf);
    if (num >= 1 && num <= NUM_STREAMS) {
        strcpy(p->stream, STREAMS[num - 1].code);
    } else {
        strcpy(p->stream, buf);
    }
    printf("    -> " GREEN BOLD "%s" RESET "\n", p->stream);

    read_line("  College / University: ", p->college, MAX_STR_LEN);
    p->grad_year = read_int("  Graduation year (e.g. 2026): ", 2026);
    p->cgpa = read_float("  CGPA (out of 10): ", 0.0f);
    if (p->cgpa > 10.0f) p->cgpa /= 10.0f;

    /* Skills */
    printf("\n" BOLD "  SKILLS\n" RESET);
    print_separator();
    const char *suggestions[12];
    int num_suggestions = get_skill_suggestions(p->stream, suggestions);

    printf("  Suggested skills for %s:\n", p->stream);
    for (int i = 0; i < num_suggestions; i++) {
        if (i % 4 == 0) printf("    ");
        printf(BOLD "%2d" RESET ". %-16s", i + 1, suggestions[i]);
        if (i % 4 == 3) printf("\n");
    }
    printf("\n");

    read_line("  Pick skills (numbers comma-separated) or type your own: ", buf, MAX_INPUT_LEN);
    p->skill_count = 0;

    /* Parse comma-separated input */
    char *token = strtok(buf, ",");
    while (token && p->skill_count < MAX_SKILLS) {
        /* Trim spaces */
        while (*token == ' ') token++;
        int len = strlen(token);
        while (len > 0 && token[len-1] == ' ') { token[len-1] = '\0'; len--; }

        if (len > 0) {
            int num2 = atoi(token);
            if (num2 >= 1 && num2 <= num_suggestions) {
                strcpy(p->skills[p->skill_count], suggestions[num2 - 1]);
            } else {
                /* Capitalize first letter */
                strcpy(p->skills[p->skill_count], token);
                if (p->skills[p->skill_count][0] >= 'a' && p->skills[p->skill_count][0] <= 'z') {
                    p->skills[p->skill_count][0] -= 32;
                }
            }
            p->skill_count++;
        }
        token = strtok(NULL, ",");
    }
    printf("    -> Skills: " GREEN);
    for (int i = 0; i < p->skill_count; i++) {
        printf("%s%s", i > 0 ? ", " : "", p->skills[i]);
    }
    printf(RESET "\n");

    /* Preferences */
    printf("\n" BOLD "  PREFERENCES\n" RESET);
    print_separator();
    read_line("  Preferred location (or 'Any' / 'Remote'): ", p->location_pref, MAX_STR_LEN);
    read_line("  Open to remote? (y/n): ", buf, MAX_INPUT_LEN);
    p->remote_ok = (buf[0] == 'y' || buf[0] == 'Y');
    p->duration_pref = read_int("  Preferred duration in months (0 = any): ", 0);
    p->stipend_min = read_int("  Minimum stipend Rs./month (0 = any): ", 0);

    /* Summary */
    printf("\n");
    print_separator();
    printf(BOLD GREEN "  PROFILE COMPLETE!" RESET "\n\n");
    printf("  Name:     " BOLD "%s" RESET "\n", p->name);
    printf("  Stream:   " CYAN "%s" RESET "\n", p->stream);
    printf("  CGPA:     %.1f\n", p->cgpa);
    printf("  Skills:   ");
    for (int i = 0; i < p->skill_count; i++)
        printf("%s%s", i > 0 ? ", " : "", p->skills[i]);
    printf("\n");
    printf("  Location: %s  |  Remote: %s\n",
           p->location_pref[0] ? p->location_pref : "Any",
           p->remote_ok ? "Yes" : "No");
    print_separator();
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MATCHING ENGINE (Weighted Scoring)
   ═══════════════════════════════════════════════════════════════════════════════ */

/* Weights */
#define W_STREAM   30.0f
#define W_SKILLS   30.0f
#define W_CGPA     15.0f
#define W_LOCATION 15.0f
#define W_COMFORT  10.0f

static float score_stream(const Internship *i, const StudentProfile *p, MatchResult *m) {
    char stream_lower[MAX_STR_LEN];
    to_lower(stream_lower, p->stream);

    for (int j = 0; j < i->eligible_count; j++) {
        char eligible_lower[MAX_STR_LEN];
        to_lower(eligible_lower, i->eligible_streams[j]);
        if (strcmp(stream_lower, eligible_lower) == 0) {
            snprintf(m->reasons[m->reason_count++], MAX_STR_LEN,
                     "Your stream (%s) matches eligible stream", p->stream);
            return 100.0f;
        }
        /* Partial match */
        if (strstr(stream_lower, eligible_lower) || strstr(eligible_lower, stream_lower)) {
            snprintf(m->reasons[m->reason_count++], MAX_STR_LEN,
                     "Partial stream match with '%s'", i->eligible_streams[j]);
            return 60.0f;
        }
    }

    snprintf(m->warnings[m->warning_count++], MAX_STR_LEN,
             "Stream '%s' not listed as eligible", p->stream);
    return 0.0f;
}

static float score_skills(const Internship *i, const StudentProfile *p, MatchResult *m) {
    int matched_req = 0, matched_pref = 0;
    int total_req = i->skills.req_count;
    int total_pref = i->skills.pref_count;

    for (int j = 0; j < p->skill_count; j++) {
        if (skill_in_list(p->skills[j], i->skills.required, total_req)) matched_req++;
        if (skill_in_list(p->skills[j], i->skills.preferred, total_pref)) matched_pref++;
    }

    float req_score = total_req > 0 ? (float)matched_req / total_req * 70.0f : 70.0f;
    float pref_score = total_pref > 0 ? (float)matched_pref / total_pref * 30.0f : 30.0f;

    if (matched_req > 0) {
        /* List matched required skills */
        char matched_str[200] = "";
        int first = 1;
        for (int j = 0; j < p->skill_count; j++) {
            if (skill_in_list(p->skills[j], i->skills.required, total_req)) {
                if (!first) strcat(matched_str, ", ");
                strcat(matched_str, p->skills[j]);
                first = 0;
            }
        }
        snprintf(m->reasons[m->reason_count++], MAX_STR_LEN,
                 "Matches required skills: %s", matched_str);
    }

    /* Warnings for missing required skills */
    char missing_str[200] = "";
    int first_missing = 1;
    for (int j = 0; j < total_req; j++) {
        int found = 0;
        for (int k = 0; k < p->skill_count; k++) {
            if (skill_in_list(p->skills[k], &i->skills.required[j], 1)) { found = 1; break; }
        }
        if (!found) {
            if (!first_missing) strcat(missing_str, ", ");
            strcat(missing_str, i->skills.required[j]);
            first_missing = 0;
        }
    }
    if (missing_str[0]) {
        snprintf(m->warnings[m->warning_count++], MAX_STR_LEN,
                 "Missing required skills: %s", missing_str);
    }

    return fminf(req_score + pref_score, 100.0f);
}

static float score_cgpa(const Internship *i, const StudentProfile *p, MatchResult *m) {
    if (p->cgpa <= 0.0f) {
        snprintf(m->reasons[m->reason_count++], MAX_STR_LEN, "CGPA not provided");
        return 60.0f;
    }

    if (p->cgpa >= i->min_cgpa) {
        snprintf(m->reasons[m->reason_count++], MAX_STR_LEN,
                 "CGPA (%.1f) meets requirement (%.1f)", p->cgpa, i->min_cgpa);
        return 100.0f;
    } else {
        float gap = i->min_cgpa - p->cgpa;
        snprintf(m->warnings[m->warning_count++], MAX_STR_LEN,
                 "CGPA (%.1f) below minimum (%.1f)", p->cgpa, i->min_cgpa);
        float score = fmaxf(0.0f, (1.0f - gap / 3.0f)) * 40.0f;
        return score;
    }
}

static float score_location(const Internship *i, const StudentProfile *p, MatchResult *m) {
    if (i->is_remote && p->remote_ok) {
        snprintf(m->reasons[m->reason_count++], MAX_STR_LEN, "Remote-friendly match");
        return 100.0f;
    }

    if (p->location_pref[0] == '\0' || str_contains_ci(p->location_pref, "any")) {
        snprintf(m->reasons[m->reason_count++], MAX_STR_LEN, "No location preference");
        return 100.0f;
    }

    if (str_contains_ci(i->location, p->location_pref) ||
        str_contains_ci(p->location_pref, i->location)) {
        snprintf(m->reasons[m->reason_count++], MAX_STR_LEN,
                 "Location match: %s", i->location);
        return 100.0f;
    }

    if (str_contains_ci(i->location, "multiple")) {
        snprintf(m->reasons[m->reason_count++], MAX_STR_LEN, "Multiple locations available");
        return 70.0f;
    }

    snprintf(m->warnings[m->warning_count++], MAX_STR_LEN,
             "Location mismatch: you prefer '%s', this is '%s'",
             p->location_pref, i->location);
    return 20.0f;
}

static float score_comfort(const Internship *i, const StudentProfile *p, MatchResult *m) {
    float score = 80.0f;

    if (p->duration_pref > 0) {
        int diff = abs(i->duration_months - p->duration_pref);
        if (diff == 0) {
            snprintf(m->reasons[m->reason_count++], MAX_STR_LEN,
                     "Duration matches preference (%d months)", i->duration_months);
            score += 10.0f;
        } else if (diff == 1) {
            snprintf(m->reasons[m->reason_count++], MAX_STR_LEN,
                     "Duration close to preference (%d vs %d months)", i->duration_months, p->duration_pref);
            score += 5.0f;
        } else {
            snprintf(m->warnings[m->warning_count++], MAX_STR_LEN,
                     "Duration is %d months (you preferred %d)", i->duration_months, p->duration_pref);
        }
    }

    return fminf(score, 100.0f);
}

static void compute_match(const Internship *i, const StudentProfile *p, MatchResult *m) {
    m->internship_id = i->id;
    m->reason_count = 0;
    m->warning_count = 0;

    float s1 = score_stream(i, p, m);
    float s2 = score_skills(i, p, m);
    float s3 = score_cgpa(i, p, m);
    float s4 = score_location(i, p, m);
    float s5 = score_comfort(i, p, m);

    m->score = (s1 * W_STREAM + s2 * W_SKILLS + s3 * W_CGPA + s4 * W_LOCATION + s5 * W_COMFORT)
               / (W_STREAM + W_SKILLS + W_CGPA + W_LOCATION + W_COMFORT);

    /* Round to 1 decimal */
    m->score = (float)((int)(m->score * 10.0f + 0.5f)) / 10.0f;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DISPLAY RESULTS
   ═══════════════════════════════════════════════════════════════════════════════ */

static void display_results(MatchResult *results, int count) {
    printf("\n");
    printf(BOLD BG_BLUE "  TARGET: TOP %d INTERNSHIP MATCHES                                    " RESET "\n", count);
    printf(DIM "  Scored on: Stream, Skills, CGPA, Location & Preferences\n\n" RESET);

    /* Table header */
    printf(BOLD "  #   %-15s %-28s %-14s %-5s %-16s  %s" RESET "\n",
           "COMPANY", "ROLE", "LOCATION", "DUR", "STIPEND", "MATCH");
    print_separator();

    for (int idx = 0; idx < count; idx++) {
        int id = results[idx].internship_id;
        Internship *i = &database[id - 1];
        float score = results[idx].score;

        char color[20];
        if (score >= 75) strcpy(color, GREEN);
        else if (score >= 50) strcpy(color, YELLOW);
        else if (score >= 30) strcpy(color, YELLOW);
        else strcpy(color, RED);

        printf("  " BOLD "%2d" RESET "  %-15s %-28s %-14s %2dm  %-16s  ",
               idx + 1, i->company, i->title, i->location, i->duration_months, i->stipend);
        print_score_bar(score);
        printf("\n");
    }

    /* Detailed breakdown */
    printf("\n");
    printf(BOLD "  DETAILED BREAKDOWN\n" RESET);
    print_separator();

    for (int idx = 0; idx < count; idx++) {
        int id = results[idx].internship_id;
        Internship *i = &database[id - 1];
        MatchResult *m = &results[idx];

        char border_color[20];
        if (m->score >= 70) strcpy(border_color, CYAN);
        else if (m->score >= 40) strcpy(border_color, YELLOW);
        else strcpy(border_color, DIM);

        printf("\n%s" BOLD "  #%d  %s" RESET " — %s\n", border_color, idx + 1, i->company, i->title);
        printf(DIM "  %s\n" RESET, i->description);
        printf("  Location: %s %s | Duration: %d months | Stipend: %s\n",
               i->location, i->is_remote ? "(Remote)" : "", i->duration_months, i->stipend);
        printf("  Apply: " CYAN "%s" RESET "\n", i->url);

        /* Skills */
        printf("  Required: ");
        for (int j = 0; j < i->skills.req_count; j++)
            printf("%s%s", j > 0 ? ", " : "", i->skills.required[j]);
        printf("\n  Preferred: ");
        for (int j = 0; j < i->skills.pref_count; j++)
            printf("%s%s", j > 0 ? ", " : "", i->skills.preferred[j]);
        printf("\n");

        /* Match reasons */
        if (m->reason_count > 0) {
            printf("  " GREEN "Why this matches:" RESET "\n");
            for (int j = 0; j < m->reason_count; j++)
                printf("    " GREEN "+" RESET " %s\n", m->reasons[j]);
        }

        /* Warnings */
        if (m->warning_count > 0) {
            printf("  " YELLOW "Things to note:" RESET "\n");
            for (int j = 0; j < m->warning_count; j++)
                printf("    " YELLOW "!" RESET " %s\n", m->warnings[j]);
        }

        /* Eligible streams */
        printf(DIM "  Eligible streams: ");
        for (int j = 0; j < i->eligible_count; j++)
            printf("%s%s", j > 0 ? ", " : "", i->eligible_streams[j]);
        printf("  |  Min CGPA: %.1f\n" RESET, i->min_cgpa);
    }
}

static void display_tips(MatchResult *results, int count) {
    printf("\n");
    printf(BOLD "  QUICK TIPS TO IMPROVE YOUR CHANCES\n" RESET);
    print_separator();

    /* Find all missing skills across top matches */
    char missing_skills[500] = "";
    for (int idx = 0; idx < count; idx++) {
        for (int j = 0; j < results[idx].warning_count; j++) {
            if (strstr(results[idx].warnings[j], "Missing required skills")) {
                const char *skills_part = strstr(results[idx].warnings[j], ": ");
                if (skills_part) {
                    skills_part += 2;
                    if (strstr(missing_skills, skills_part) == NULL) {
                        if (missing_skills[0]) strcat(missing_skills, ", ");
                        strcat(missing_skills, skills_part);
                    }
                }
            }
        }
    }
    if (missing_skills[0]) {
        printf("  " YELLOW "* Consider learning: %s\n" RESET, missing_skills);
    }

    int has_cgpa_warning = 0;
    for (int idx = 0; idx < count; idx++) {
        for (int j = 0; j < results[idx].warning_count; j++) {
            if (strstr(results[idx].warnings[j], "CGPA")) has_cgpa_warning = 1;
        }
    }
    if (has_cgpa_warning) {
        printf("  " YELLOW "* Your CGPA is below some requirements — compensate with strong skills & projects.\n" RESET);
    }

    printf("  " GREEN "* Apply to at least 10-15 internships for the best chances.\n" RESET);
    printf("  " GREEN "* Customize your resume for each application — highlight relevant skills.\n" RESET);
    printf("  " GREEN "* Build projects that demonstrate the skills listed in job descriptions.\n" RESET);
    printf("  " GREEN "* Follow up with HR 1 week after applying.\n" RESET);
    print_separator();
}

/* ═══════════════════════════════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════════════════════════════ */

static void export_results(const StudentProfile *p, MatchResult *results, int count) {
    char filename[200];
    char name_lower[MAX_NAME_LEN];
    to_lower(name_lower, p->name);
    /* Replace spaces with underscores */
    for (int i = 0; name_lower[i]; i++)
        if (name_lower[i] == ' ') name_lower[i] = '_';
    snprintf(filename, sizeof(filename), "internship_matches_%s.txt", name_lower);

    FILE *f = fopen(filename, "w");
    if (!f) {
        printf(RED "  Error: Could not create file %s\n" RESET, filename);
        return;
    }

    fprintf(f, "======================================================================\n");
    fprintf(f, "INTERNSHIP MATCHES FOR %s\n", p->name);
    fprintf(f, "Stream: %s | CGPA: %.1f | Skills: ", p->stream, p->cgpa);
    for (int i = 0; i < p->skill_count; i++)
        fprintf(f, "%s%s", i > 0 ? ", " : "", p->skills[i]);
    fprintf(f, "\n======================================================================\n\n");

    for (int idx = 0; idx < count; idx++) {
        int id = results[idx].internship_id;
        Internship *i = &database[id - 1];
        fprintf(f, "#%d  %s — %s  (Score: %.0f/100)\n", idx + 1, i->company, i->title, results[idx].score);
        fprintf(f, "    %s\n", i->description);
        fprintf(f, "    Location: %s | Duration: %d months | Stipend: %s\n", i->location, i->duration_months, i->stipend);
        fprintf(f, "    Apply: %s\n", i->url);
        fprintf(f, "    Required: ");
        for (int j = 0; j < i->skills.req_count; j++)
            fprintf(f, "%s%s", j > 0 ? ", " : "", i->skills.required[j]);
        fprintf(f, "\n");
        for (int j = 0; j < results[idx].reason_count; j++)
            fprintf(f, "    + %s\n", results[idx].reasons[j]);
        for (int j = 0; j < results[idx].warning_count; j++)
            fprintf(f, "    ! %s\n", results[idx].warnings[j]);
        fprintf(f, "\n");
    }

    fclose(f);
    printf(GREEN BOLD "\n  Results exported to: %s\n\n" RESET, filename);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════════════════════ */

int main(void) {
    StudentProfile profile;
    MatchResult results[MAX_MATCHES];
    char buf[50];

    init_database();

    printf("\n" BOLD CYAN "  Database loaded: %d internships across all streams\n" RESET, db_count);

    /* Collect profile */
    collect_profile(&profile);

    /* Score all internships */
    printf("\n" BOLD CYAN "  Searching for the best matches...\n" RESET "\n");

    int total = db_count < MAX_MATCHES ? db_count : MAX_MATCHES;
    for (int i = 0; i < db_count && i < MAX_MATCHES; i++) {
        compute_match(&database[i], &profile, &results[i]);
    }
    total = db_count > MAX_MATCHES ? MAX_MATCHES : db_count;

    /* Sort by score (simple bubble sort, descending) */
    for (int i = 0; i < total - 1; i++) {
        for (int j = 0; j < total - i - 1; j++) {
            if (results[j].score < results[j + 1].score) {
                MatchResult tmp = results[j];
                results[j] = results[j + 1];
                results[j + 1] = tmp;
            }
        }
    }

    /* Display */
    display_results(results, total);
    display_tips(results, total);

    /* Follow-up */
    printf(BOLD "  What would you like to do?\n" RESET);
    printf("    " BOLD "1" RESET ". " GREEN "Export results to file" RESET "\n");
    printf("    " BOLD "2" RESET ". " YELLOW "Update profile and re-search" RESET "\n");
    printf("    " BOLD "3" RESET ". " DIM "Exit" RESET "\n");
    read_line("\n  Your choice: ", buf, sizeof(buf));

    if (buf[0] == '1') {
        export_results(&profile, results, total);
    } else if (buf[0] == '2') {
        /* Re-run */
        main();
    }

    printf(BOLD GREEN "\n  Good luck with your internship search! 🎯\n\n" RESET);
    return 0;
}
