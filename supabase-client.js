// Shared Supabase Auth + Database client for internVerse (app.html & index.html).
// Paste your Supabase Project URL and Publishable / anon key below.
const SUPABASE_URL = "https://jotkdkvasldckxdmphgw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_sPkHojKq-S2cRMF3tJWvNA_6WUTZJNF";

function isSupabaseConfigured() {
    return (
        typeof window !== "undefined" &&
        Boolean(window.supabase) &&
        SUPABASE_URL.startsWith("https://") &&
        !SUPABASE_URL.includes("YOUR_PROJECT_REF") &&
        !SUPABASE_ANON_KEY.includes("YOUR_")
    );
}

function getSupabaseClient() {
    if (!isSupabaseConfigured()) return null;
    if (!window._ivSupabase) {
        window._ivSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        });
    }
    return window._ivSupabase;
}

function normalizePhoneNumber(rawPhone) {
    const cleaned = String(rawPhone || "").replace(/[\s\-()]/g, "");
    if (!cleaned) return "";
    if (cleaned.startsWith("+")) return cleaned;
    if (/^\d{10}$/.test(cleaned)) return "+91" + cleaned;
    if (/^91\d{10}$/.test(cleaned)) return "+" + cleaned;
    return "+" + cleaned;
}

function getRedirectUrl() {
    if (window.location.protocol === "file:") {
        return null;
    }
    return window.location.origin + window.location.pathname;
}

// ── Auth Helpers ─────────────────────────────────────────────────────────────

async function getAuthSession() {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data, error } = await client.auth.getSession();
    if (error) return null;
    return data?.session || null;
}

function onAuthStateChange(callback) {
    const client = getSupabaseClient();
    if (!client) return () => {};
    const { data } = client.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
    return () => data?.subscription?.unsubscribe();
}

async function signInWithGoogle() {
    const client = getSupabaseClient();
    if (!client) {
        return { error: "Supabase keys are not configured in supabase-client.js yet." };
    }
    const redirectTo = getRedirectUrl();
    if (!redirectTo) {
        return {
            error:
                "Google Sign-In requires an http://localhost or https:// URL (not file://). Run: python -m http.server 8000",
        };
    }
    const { data, error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo,
            queryParams: { access_type: "offline", prompt: "select_account" },
        },
    });
    if (error) return { error: error.message };
    return { data };
}

async function sendPhoneOtp(rawPhone) {
    const client = getSupabaseClient();
    if (!client) {
        return { error: "Supabase keys are not configured in supabase-client.js yet." };
    }
    const phone = normalizePhoneNumber(rawPhone);
    if (!/^\+\d{8,15}$/.test(phone)) {
        return { error: "Enter a valid mobile number (e.g. 9876543210 or +919876543210)." };
    }
    const { data, error } = await client.auth.signInWithOtp({ phone });
    if (error) {
        if (/unsupported phone provider|phone provider/i.test(error.message)) {
            return {
                error:
                    "Mobile OTP is not configured in Supabase yet. Go to Supabase Dashboard → Authentication → Sign In / Providers → Phone, enable an SMS provider (and optionally add Test Phone Numbers like 919876543210=123456).",
            };
        }
        return { error: error.message };
    }
    return { data, phone };
}

async function verifyPhoneOtp(rawPhone, token) {
    const client = getSupabaseClient();
    if (!client) {
        return { error: "Supabase keys are not configured in supabase-client.js yet." };
    }
    const phone = normalizePhoneNumber(rawPhone);
    const code = String(token || "").trim();
    if (!/^\d{4,8}$/.test(code)) {
        return { error: "Enter the 6-digit OTP code sent to your mobile." };
    }
    const { data, error } = await client.auth.verifyOtp({
        phone,
        token: code,
        type: "sms",
    });
    if (error) return { error: error.message };
    return { data };
}

async function signUpWithEmail({ name, email, password, phone }) {
    const client = getSupabaseClient();
    if (!client) {
        return { error: "Supabase keys are not configured in supabase-client.js yet." };
    }
    const cleanPhone = phone ? normalizePhoneNumber(phone) : "";
    const { data, error } = await client.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
            data: {
                full_name: name.trim(),
                phone: cleanPhone,
            },
        },
    });
    if (error) return { error: error.message };
    return { data };
}

async function signInWithEmail(email, password) {
    const client = getSupabaseClient();
    if (!client) {
        return { error: "Supabase keys are not configured in supabase-client.js yet." };
    }
    const { data, error } = await client.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
    });
    if (error) return { error: error.message };
    return { data };
}

async function signOutSupabase() {
    const client = getSupabaseClient();
    if (!client) return;
    await client.auth.signOut();
}

// ── Internships Sync ─────────────────────────────────────────────────────────

async function syncInternshipsFromSupabase(targetDb) {
    const client = getSupabaseClient();
    if (!client || !Array.isArray(targetDb)) return false;

    const { data, error } = await client.from("internships").select("*");
    if (error || !data || data.length === 0) {
        if (error) console.warn("Supabase internships fetch failed, using local DB:", error.message);
        return false;
    }

    const mapped = data.map((row) => ({
        id: row.id,
        co: row.company,
        ti: row.title,
        el: row.eligible_streams || [],
        rq: row.skills_required || [],
        pf: row.skills_preferred || [],
        loc: row.location,
        rem: row.is_remote ? 1 : 0,
        dur: row.duration_months,
        cg: Number(row.min_cgpa || 0),
        st: row.stipend,
        url: row.application_url,
        desc: row.description,
    }));

    targetDb.length = 0;
    targetDb.push(...mapped);
    console.log("Loaded " + targetDb.length + " internships from Supabase.");
    return true;
}

// ── Student Profile Sync ─────────────────────────────────────────────────────

async function loadUserProfileFromSupabase() {
    const client = getSupabaseClient();
    if (!client) return null;
    const session = await getAuthSession();
    if (!session?.user) return null;

    const { data, error } = await client
        .from("student_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

    if (error || !data) return null;
    return data;
}

async function saveStudentProfileToSupabase(profile) {
    const client = getSupabaseClient();
    if (!client || !profile) return false;

    const session = await getAuthSession();
    const user = session?.user || null;

    const payload = {
        name: profile.name || user?.user_metadata?.full_name || user?.user_metadata?.name || "",
        email: (profile.email || user?.email || "").trim().toLowerCase() || null,
        phone: profile.phone || user?.phone || "",
        stream: profile.stream || "",
        college: profile.college || "",
        graduation_year: Number(profile.gradYear || 0),
        cgpa: Number(profile.cgpa || 0),
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        location_preference: profile.location || "",
        remote_ok: profile.remoteOk !== 0 && profile.remoteOk !== false,
        stipend_expectation: Number(profile.stipendMin || 0),
        bio: profile.bio || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        projects: Array.isArray(profile.projects) ? profile.projects : [],
        updated_at: new Date().toISOString(),
    };

    if (user) {
        payload.user_id = user.id;
        payload.avatar_url = user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
        payload.auth_provider = user.app_metadata?.provider || "email";
        const { error } = await client
            .from("student_profiles")
            .upsert([payload], { onConflict: "user_id" });
        if (error) {
            console.warn("Could not save profile to Supabase:", error.message);
            return false;
        }
        return true;
    }

    if (!payload.email) return false;
    const { error } = await client.from("student_profiles").insert([payload]);
    if (error) {
        console.warn("Could not save guest profile to Supabase:", error.message);
        return false;
    }
    return true;
}

// ── Applications & Search History Sync ───────────────────────────────────────

async function loadApplicationsFromSupabase() {
    const client = getSupabaseClient();
    const session = await getAuthSession();
    if (!client || !session?.user) return null;

    const { data, error } = await client
        .from("applications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false });

    if (error || !data) return null;
    return data.map((a) => ({
        id: a.id,
        internshipId: a.internship_id,
        company: a.company,
        role: a.role,
        score: a.score,
        date: new Date(a.created_at).getTime(),
        status: a.status,
        url: a.url,
        stipend: a.stipend,
        duration: a.duration,
        location: a.location,
        remote: a.is_remote ? 1 : 0,
    }));
}

async function saveApplicationToSupabase(appItem) {
    const client = getSupabaseClient();
    const session = await getAuthSession();
    if (!client || !session?.user || !appItem) return null;

    const payload = {
        user_id: session.user.id,
        internship_id: String(appItem.internshipId || ""),
        company: appItem.company,
        role: appItem.role,
        score: Number(appItem.score || 0),
        status: appItem.status || "applied",
        url: appItem.url || "",
        stipend: appItem.stipend || "",
        duration: Number(appItem.duration || 0),
        location: appItem.location || "",
        is_remote: Boolean(appItem.remote),
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
        .from("applications")
        .upsert([payload], { onConflict: "user_id,company,role" })
        .select()
        .maybeSingle();

    if (error) {
        console.warn("Could not save application:", error.message);
        return null;
    }
    return data;
}

async function updateApplicationStatusInSupabase(company, role, status) {
    const client = getSupabaseClient();
    const session = await getAuthSession();
    if (!client || !session?.user) return false;

    const { error } = await client
        .from("applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("user_id", session.user.id)
        .eq("company", company)
        .eq("role", role);

    return !error;
}

async function deleteApplicationFromSupabase(company, role) {
    const client = getSupabaseClient();
    const session = await getAuthSession();
    if (!client || !session?.user) return false;

    const { error } = await client
        .from("applications")
        .delete()
        .eq("user_id", session.user.id)
        .eq("company", company)
        .eq("role", role);

    return !error;
}

async function loadSearchHistoryFromSupabase() {
    const client = getSupabaseClient();
    const session = await getAuthSession();
    if (!client || !session?.user) return null;

    const { data, error } = await client
        .from("search_history")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(20);

    if (error || !data) return null;
    return data.map((h) => ({
        date: new Date(h.created_at).getTime(),
        profile: h.profile_snapshot || {},
        results: h.results_snapshot || [],
    }));
}

async function saveSearchHistoryToSupabase(entry) {
    const client = getSupabaseClient();
    const session = await getAuthSession();
    if (!client || !session?.user || !entry) return false;

    const { error } = await client.from("search_history").insert([
        {
            user_id: session.user.id,
            profile_snapshot: entry.profile || {},
            results_snapshot: entry.results || [],
        },
    ]);
    return !error;
}

window.IVSupabase = {
    isConfigured: isSupabaseConfigured,
    getClient: getSupabaseClient,
    normalizePhoneNumber,
    getAuthSession,
    onAuthStateChange,
    signInWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    signUpWithEmail,
    signInWithEmail,
    signOut: signOutSupabase,
    syncInternships: syncInternshipsFromSupabase,
    loadProfile: loadUserProfileFromSupabase,
    saveProfile: saveStudentProfileToSupabase,
    loadApplications: loadApplicationsFromSupabase,
    saveApplication: saveApplicationToSupabase,
    updateApplicationStatus: updateApplicationStatusInSupabase,
    deleteApplication: deleteApplicationFromSupabase,
    loadSearchHistory: loadSearchHistoryFromSupabase,
    saveSearchHistory: saveSearchHistoryToSupabase,
};
