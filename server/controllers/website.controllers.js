import { generateResponse } from "../config/openRouter.js";
import { generateWithOllama } from "../config/ollama .js";
import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js";

// ─── AI GENERATION WITH FALLBACK ────────────────────────────────────────────
const smartGenerate = async (prompt) => {
    try {
        const result = await generateWithOllama(prompt);
        if (!result) throw new Error("Ollama returned empty response");
        return result;
    } catch (err) {
        console.warn("Ollama failed, falling back to OpenRouter:", err.message);
        return await generateResponse(prompt);
    }
};

// ─── RETRY WRAPPER ───────────────────────────────────────────────────────────
const generateWithRetry = async (prompt, maxAttempts = 3) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const raw = await smartGenerate(
                attempt === 1 ? prompt : prompt + "\n\nCRITICAL: RETURN ONLY RAW JSON. NO MARKDOWN. NO EXTRA TEXT."
            );
            const parsed = await extractJson(raw);
            if (parsed && parsed.code && parsed.message) return parsed;
            console.warn(`Attempt ${attempt}: Invalid JSON or missing fields. Retrying...`);
        } catch (err) {
            console.warn(`Attempt ${attempt} failed:`, err.message);
        }
    }
    return null;
};

// ─── MASTER PROMPT ───────────────────────────────────────────────────────────
const masterPrompt = `
You are an elite Principal Frontend Architect and Senior UI/UX Engineer
with 15+ years of experience building award-winning production websites.

Your task: Build a stunning, fully functional, client-ready website using ONLY
vanilla HTML, CSS, and JavaScript — no frameworks, no libraries, no excuses.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER REQUIREMENT:
{USER_PROMPT}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

══════════════════════════════════════════════════════
DESIGN PHILOSOPHY (NON-NEGOTIABLE)
══════════════════════════════════════════════════════
- Premium, modern aesthetic (2026–2027 design trends)
- Dark/light mode support using CSS variables
- Glassmorphism, neumorphism, or gradient accents where appropriate
- Micro-interactions on every interactive element
- Smooth fade/slide transitions between pages and sections
- Professional typography with clear visual hierarchy
- Real business content — NO lorem ipsum, NO placeholders
- Hero section with compelling headline, subtext, and CTA button
- Consistent color palette (pick 2–3 brand colors + neutrals)
- Subtle animations: fade-in on scroll, button ripple, hover lifts

══════════════════════════════════════════════════════
RESPONSIVE DESIGN — MANDATORY
══════════════════════════════════════════════════════
Implement a mobile-first approach with these exact breakpoints:
  • Mobile  : < 640px
  • Tablet  : 640px – 1024px
  • Desktop : > 1024px

Required responsive behaviors:
  ✔ Hamburger menu on mobile (animated toggle)
  ✔ Stacked single-column layout on mobile
  ✔ Multi-column grid on tablet/desktop
  ✔ Fluid typography using clamp()
  ✔ Images always max-width: 100% with object-fit: cover
  ✔ No horizontal scroll at any breakpoint
  ✔ Touch-friendly tap targets (min 44px)
  ✔ Readable font sizes (min 16px body on mobile)

══════════════════════════════════════════════════════
IMAGES — MANDATORY
══════════════════════════════════════════════════════
- Source: https://images.unsplash.com/ ONLY
- Every URL must end with: ?auto=format&fit=crop&w=1200&q=80
- Use contextually relevant images matching the website topic
- Lazy load all images: loading="lazy"
- Add alt text to every image

══════════════════════════════════════════════════════
TECHNICAL SPECIFICATIONS
══════════════════════════════════════════════════════
- Single HTML file output
- Exactly ONE <style> tag (all CSS inside)
- Exactly ONE <script> tag (all JS inside, at bottom of body)
- Zero external dependencies (no CDN links, no Google Fonts)
- System font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- CSS custom properties (variables) for all colors, spacing, radii
- iframe srcdoc compatible (no document.write, no location.reload)
- Smooth scrolling: scroll-behavior: smooth

══════════════════════════════════════════════════════
SPA NAVIGATION — MANDATORY
══════════════════════════════════════════════════════
Implement a JavaScript-powered SPA with these pages:
  1. Home     — Hero, features overview, testimonials/stats, CTA
  2. About    — Story, team/founder, mission, values
  3. Services — Cards for each service/feature with icons (SVG inline)
  4. Contact  — Form with full validation + success message

Navigation rules:
  ✔ All .page divs hidden by default (display: none)
  ✔ Active page shown (.page.active { display: block })
  ✔ Home page active on initial load
  ✔ Nav link clicks update active page AND active nav state
  ✔ Page transitions: opacity fade (0 → 1) over 300ms
  ✔ Mobile nav closes automatically after link click
  ✔ Active nav link has a distinct style (underline, color, or indicator)

══════════════════════════════════════════════════════
REQUIRED UI COMPONENTS
══════════════════════════════════════════════════════
NAVBAR:
  - Logo (text or SVG) on the left
  - Nav links on the right (desktop)
  - Hamburger icon on mobile (animated ☰ → ✕)
  - Sticky top with backdrop-blur glass effect
  - Shadow appears on scroll

HERO SECTION:
  - Full-width background image or gradient
  - Bold headline using clamp() font size
  - Subheadline paragraph
  - Two CTA buttons (primary filled, secondary outline)
  - Scroll-down indicator

FEATURES/SERVICES:
  - Grid of cards (3 on desktop, 2 on tablet, 1 on mobile)
  - Each card: inline SVG icon, title, description
  - Hover: lift shadow, slight scale transform

FOOTER:
  - Logo + tagline
  - Quick links
  - Social icons (SVG)
  - Copyright notice

══════════════════════════════════════════════════════
FORM VALIDATION (Contact Page)
══════════════════════════════════════════════════════
Fields: Name, Email, Subject, Message
Validation rules:
  - Name: required, min 2 chars
  - Email: required, valid format regex
  - Subject: required
  - Message: required, min 10 chars
On invalid: show red border + error message below field
On success: hide form, show animated success card
Prevent default form submission (no page reload)

══════════════════════════════════════════════════════
ANIMATION CHECKLIST
══════════════════════════════════════════════════════
  ✔ Page fade-in on load
  ✔ IntersectionObserver scroll-reveal on sections
  ✔ Button: hover scale + box-shadow transition
  ✔ Nav hamburger animated toggle
  ✔ Cards hover lift (translateY(-6px) + shadow)
  ✔ Form input focus glow ring
  ✔ Success message fade-in

══════════════════════════════════════════════════════
FINAL SELF-CHECK BEFORE RESPONDING
══════════════════════════════════════════════════════
□ Home page visible on load (no blank screen)
□ Hamburger menu works on mobile
□ All 4 pages navigate correctly
□ No horizontal scroll at 320px viewport width
□ All images load (valid Unsplash URLs)
□ Form validation fires on submit
□ Zero broken buttons or dead UI
□ CSS variables defined in :root
□ Only ONE <style> and ONE <script> tag

IF ANY BOX IS UNCHECKED → FIX IT BEFORE RESPONDING

══════════════════════════════════════════════════════
OUTPUT FORMAT — STRICT
══════════════════════════════════════════════════════
Return ONLY this raw JSON object. Nothing else:

{
  "message": "One professional sentence describing what was built",
  "code": "<COMPLETE VALID HTML DOCUMENT HERE>"
}

RULES:
- No markdown fences (\`\`\`)
- No explanations before or after JSON
- No comments outside the JSON
- Valid JSON only — escape all special characters inside strings
- The "code" value must be the full HTML document as a JSON string
`;

// ─── UPDATE PROMPT ───────────────────────────────────────────────────────────
const buildUpdatePrompt = (currentCode, userRequest, conversation) => {
    const historyText = conversation
        .slice(-6) // last 3 exchanges for context
        .map(m => `[${m.role.toUpperCase()}]: ${m.content}`)
        .join("\n");

    return `
You are an expert frontend developer. Update the provided HTML website exactly as requested.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONVERSATION HISTORY (for context):
${historyText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USER REQUEST:
${userRequest}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT HTML CODE:
${currentCode}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RULES FOR UPDATING:
- Apply ONLY the changes the user requested
- Preserve all existing functionality and styles
- Keep the code clean and production-ready
- Do NOT remove features unless explicitly asked
- Maintain responsiveness after changes
- Return the COMPLETE updated HTML file

OUTPUT: Return ONLY this raw JSON. No markdown, no explanations:
{
  "message": "One sentence confirming what was changed",
  "code": "<COMPLETE UPDATED HTML DOCUMENT>"
}
`;
};

// ─── CONTROLLERS ─────────────────────────────────────────────────────────────

export const generateWebsite = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim().length < 5) {
            return res.status(400).json({ message: "A valid prompt is required (min 5 characters)" });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.credits < 50) {
            return res.status(403).json({ message: "Insufficient credits. You need at least 50 credits to generate a website." });
        }

        const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt.trim());
        const parsed = await generateWithRetry(finalPrompt);

        if (!parsed || !parsed.code) {
            return res.status(502).json({ message: "AI failed to generate a valid website. Please try again." });
        }

        const website = await Website.create({
            user: user._id,
            title: prompt.trim().slice(0, 60),
            latestCode: parsed.code,
            conversation: [
                { role: "user", content: prompt.trim() },
                { role: "ai",   content: parsed.message },
            ],
        });

        user.credits -= 50;
        await user.save();

        return res.status(201).json({
            websiteId: website._id,
            message: parsed.message,
            remainingCredits: user.credits,
        });

    } catch (error) {
        console.error("generateWebsite error:", error);
        return res.status(500).json({ message: `Failed to generate website: ${error.message}` });
    }
};

// ─────────────────────────────────────────────────────────────────────────────

export const getWebsiteById = async (req, res) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!website) return res.status(404).json({ message: "Website not found" });

        return res.status(200).json(website);

    } catch (error) {
        console.error("getWebsiteById error:", error);
        return res.status(500).json({ message: `Failed to fetch website: ${error.message}` });
    }
};

// ─────────────────────────────────────────────────────────────────────────────

export const changes = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim().length < 3) {
            return res.status(400).json({ message: "A valid change request is required" });
        }

        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!website) return res.status(404).json({ message: "Website not found" });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.credits < 25) {
            return res.status(403).json({ message: "Insufficient credits. You need at least 25 credits to update a website." });
        }

        const updatePrompt = buildUpdatePrompt(
            website.latestCode,
            prompt.trim(),
            website.conversation
        );

        const parsed = await generateWithRetry(updatePrompt);

        if (!parsed || !parsed.code) {
            return res.status(502).json({ message: "AI failed to apply changes. Please try again." });
        }

        website.conversation.push(
            { role: "user", content: prompt.trim() },
            { role: "ai",   content: parsed.message },
        );
        website.latestCode = parsed.code;
        await website.save();

        user.credits -= 25;
        await user.save();

        return res.status(200).json({
            message: parsed.message,
            code: parsed.code,
            remainingCredits: user.credits,
        });

    } catch (error) {
        console.error("changes error:", error);
        return res.status(500).json({ message: `Failed to update website: ${error.message}` });
    }
};

// ─────────────────────────────────────────────────────────────────────────────

export const getAll = async (req, res) => {
    try {
        const websites = await Website.find({ user: req.user._id })
            .select("-latestCode") // don't send full HTML for listing
            .sort({ createdAt: -1 });

        return res.status(200).json(websites);

    } catch (error) {
        console.error("getAll error:", error);
        return res.status(500).json({ message: `Failed to fetch websites: ${error.message}` });
    }
};

// ─────────────────────────────────────────────────────────────────────────────

export const deploy = async (req, res) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!website) return res.status(404).json({ message: "Website not found" });

        if (!website.slug) {
            const baseSlug = website.title
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .trim()
                .replace(/\s+/g, "-")
                .slice(0, 55);
            website.slug = `${baseSlug}-${website._id.toString().slice(-5)}`;
        }

        const baseUrl = process.env.FRONTEND_URL?.replace(/\/$/, ""); // strip trailing slash
        website.deployed = true;
        website.deployUrl = `${baseUrl}/site/${website.slug}`;
        await website.save();

        return res.status(200).json({
            url: website.deployUrl,
            slug: website.slug,
        });

    } catch (error) {
        console.error("deploy error:", error);
        return res.status(500).json({ message: `Failed to deploy website: ${error.message}` });
    }
};

// ─────────────────────────────────────────────────────────────────────────────

export const getBySlug = async (req, res) => {
    try {
        const website = await Website.findOne({ slug: req.params.slug });

        if (!website) return res.status(404).json({ message: "Website not found" });

        return res.status(200).json(website);

    } catch (error) {
        console.error("getBySlug error:", error);
        return res.status(500).json({ message: `Failed to fetch website: ${error.message}` });
    }
};
