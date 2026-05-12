import { generateResponse } from "../config/openRouter.js";
import { generateWithOllama } from "../config/ollama .js";
import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js";

// ─────────────────────────────────────────────────────────────────────────────
// SMART AI GENERATOR — Ollama first, fallback to OpenRouter
// ─────────────────────────────────────────────────────────────────────────────
const smartGenerate = async (prompt) => {
    try {
        console.log("[AI] Trying Ollama...");
        const result = await generateWithOllama(prompt);
        if (!result || result.trim().length < 50) {
            throw new Error("Ollama returned empty or too short response");
        }
        console.log("[AI] Ollama succeeded ✅");
        return result;
    } catch (err) {
        console.log("[AI] Ollama failed:", err.message, "→ Switching to OpenRouter");
        const result = await generateResponse(prompt);
        if (!result || result.trim().length < 50) {
            throw new Error("OpenRouter also returned empty response");
        }
        console.log("[AI] OpenRouter succeeded ✅");
        return result;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RETRY WRAPPER — up to maxAttempts tries with escalating strictness
// ─────────────────────────────────────────────────────────────────────────────
const generateWithRetry = async (prompt, maxAttempts = 3) => {
    let raw = "";
    let parsed = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`[AI] Generation attempt ${attempt}/${maxAttempts}...`);
        try {
            const attemptPrompt =
                attempt === 1
                    ? prompt
                    : attempt === 2
                    ? prompt +
                      "\n\n⚠️ YOUR PREVIOUS RESPONSE WAS INVALID. Return ONLY raw JSON. No markdown. No explanation. Start directly with { and end with }."
                    : prompt +
                      "\n\n🚨 CRITICAL FINAL ATTEMPT: Return ONLY this exact format with absolutely no other text:\n{\"message\":\"...\",\"code\":\"...\"}";

            raw = await smartGenerate(attemptPrompt);
            parsed = await extractJson(raw);

            if (parsed && parsed.code && parsed.code.trim().length > 200) {
                console.log(`[AI] ✅ Valid response received on attempt ${attempt}`);
                return { raw, parsed };
            }

            console.log(`[AI] Attempt ${attempt} returned invalid/empty code. Retrying...`);
            parsed = null;
        } catch (err) {
            console.log(`[AI] Attempt ${attempt} threw error:`, err.message);
        }

        // Small delay before retry to avoid rate limiting
        if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
        }
    }

    console.log("[AI] ❌ All attempts exhausted. Generation failed.");
    return { raw, parsed: null };
};

// ─────────────────────────────────────────────────────────────────────────────
// MASTER PROMPT — Full detailed prompt for generating brand-new websites
// ─────────────────────────────────────────────────────────────────────────────
const masterPrompt = `
YOU ARE A WORLD-CLASS PRINCIPAL FRONTEND ARCHITECT
AND AN AWARD-WINNING SENIOR UI/UX ENGINEER
SPECIALIZED IN BUILDING ULTRA-PREMIUM, RESPONSIVE, PRODUCTION-GRADE WEBSITES.

YOUR MISSION:
Build a high-end, real-world, visually stunning website using ONLY pure HTML, CSS, and Vanilla JavaScript.
The output must be client-deliverable without ANY modification whatsoever.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER REQUIREMENT:
{USER_PROMPT}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ ABSOLUTELY FORBIDDEN — INSTANT DISQUALIFICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✗ React, Vue, Angular, or ANY JavaScript framework
✗ Bootstrap, Tailwind, or ANY CSS library
✗ External CDN links for fonts, icons, or scripts
✗ Lorem ipsum or any placeholder text
✗ Non-responsive or fixed-width layouts
✗ Basic, template-looking, or amateur designs
✗ Broken buttons or dead interactive elements
✗ Horizontal scroll on mobile devices
✗ Markdown code blocks in output
✗ Any text outside the JSON response

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VISUAL DESIGN EXCELLENCE (NON-NEGOTIABLE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Build a website that looks like it was crafted by a top-tier design agency:

AESTHETICS & STYLE:
- Ultra-modern 2025–2026 design language
- Rich, carefully chosen color palette defined with CSS variables at :root level
- Deep contrast ratios — dark/dramatic OR clean white with bold typography
- Glassmorphism cards: backdrop-filter: blur(16px), semi-transparent backgrounds with border
- Subtle gradient mesh backgrounds and overlay effects
- Layered visual depth using box-shadows, z-index, and overlapping elements
- Custom geometric shapes or SVG blob backgrounds where appropriate
- Grain/noise texture overlays for premium feel (CSS-based)

CSS ANIMATIONS & MICRO-INTERACTIONS:
- Custom @keyframes: fadeInUp, slideInLeft, float, pulse, shimmer, gradientShift
- All interactive elements transition smoothly (0.2s–0.4s cubic-bezier)
- Hover effects: scale transforms, color shifts, glows, underline slides, icon rotations
- Button hover: transform scale + box-shadow glow + background gradient shift
- Card hover: translateY(-8px) + enhanced shadow + subtle border color animation
- Navbar: sticky with backdrop-filter blur, background opacity change on scroll via JS
- Scroll-triggered fade-in animations using IntersectionObserver API
- Hero elements: staggered entrance animations with animation-delay
- Loading shimmer effect on skeleton elements if needed

TYPOGRAPHY SYSTEM:
- System font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif
- Clear 5-level hierarchy: display (4rem+), h1, h2, h3, body, caption
- Tight letter-spacing for headings: -0.02em to -0.05em
- Generous line-height for body: 1.6 to 1.8
- Mixed font-weights throughout: 300 (light), 400 (regular), 600 (semibold), 700 (bold), 800/900 (black)
- Fluid/responsive typography using clamp(): clamp(1.5rem, 4vw, 3rem)
- Gradient text for hero headlines using background-clip: text

LAYOUT & SPACING SYSTEM:
- 8px base spacing unit — all spacing in multiples of 8px
- Generous sections: min 80px–120px vertical padding
- Max-width containers: 1200px or 1400px centered with auto margins
- Consistent horizontal padding: clamp(1rem, 5vw, 4rem)
- Asymmetric layouts and overlapping sections for visual interest
- Full-width sections with contained inner content
- Z-index layering for depth: backgrounds (-1), content (1), overlays (10), navbar (100)

COMPONENTS TO BUILD (choose based on user requirement):
✔ Sticky glassmorphism navbar with logo, nav links, CTA button, mobile hamburger
✔ Full-viewport hero: large headline + subtitle + dual CTA buttons + hero image/visual
✔ Feature/service cards grid with icons (CSS-drawn or Unicode emoji), descriptions, hover effects
✔ Statistics section: large bold animated numbers with labels
✔ Testimonials/reviews section with avatar initials, star ratings, quote cards
✔ Image gallery or portfolio grid with overlay effects
✔ Team section with cards, role badges, social links
✔ Pricing cards with feature lists, recommended badge, CTA buttons
✔ Timeline or process steps section
✔ Call-to-action banner with gradient background and button
✔ Newsletter/contact form with proper validation
✔ Footer: logo, links columns, social icons (Unicode), copyright, bottom bar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSIVE DESIGN — ABSOLUTE REQUIREMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THIS WEBSITE MUST LOOK AND WORK PERFECTLY ON ALL SCREEN SIZES.
If it is not responsive, the response is completely invalid.

BREAKPOINTS — MOBILE FIRST:
- Base styles: mobile (320px and up)
- @media (min-width: 480px) — large mobile
- @media (min-width: 768px) — tablet
- @media (min-width: 1024px) — small desktop
- @media (min-width: 1280px) — large desktop

REQUIRED TECHNIQUES:
✔ Write base styles for mobile FIRST, then enhance for larger screens
✔ CSS Grid: grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) for fluid grids
✔ Flexbox with flex-wrap: wrap for flexible containers
✔ Fluid typography: clamp(minSize, preferredVW, maxSize) everywhere
✔ Relative units: %, rem, em, vw, vh — avoid px for layout
✔ max-width on containers, never fixed width on sections

MOBILE-SPECIFIC REQUIREMENTS (max-width: 768px):
✔ Hamburger menu icon (☰ open / ✕ close) visible, fully functional with JS
✔ Mobile nav: full-width dropdown panel, large tap targets minimum 48px height each link
✔ All CSS Grid columns collapse to 1 column
✔ Hero: stacked layout, smaller font sizes, adjusted padding
✔ Stats: 2-column grid on mobile, single on very small screens
✔ Cards: full-width on mobile, proper spacing
✔ Images: max-width: 100%; height: auto; object-fit: cover
✔ Absolutely zero horizontal overflow (overflow-x: hidden on body)
✔ Buttons: minimum 48px height, 100% width on mobile where appropriate
✔ Font sizes reduced appropriately for mobile readability

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMAGES — MANDATORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- ONLY use images from: https://images.unsplash.com/
- EVERY single image URL MUST end with: ?auto=format&fit=crop&w=1200&q=80
- Choose images that are DIRECTLY and SPECIFICALLY relevant to the content and industry
- Use MULTIPLE images throughout: hero background, about section, service cards, team, gallery
- All images must be: max-width: 100%; height: auto; display: block;
- Use object-fit: cover for fixed-height image containers
- Image containers: overflow: hidden; border-radius for clean edges
- Add semi-transparent gradient overlays on hero images for text readability
- Never use images as backgrounds unless with proper overlay for text contrast

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECHNICAL SPECIFICATIONS — CRITICAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE STRUCTURE:
- ONE complete standalone HTML5 file (<!DOCTYPE html>)
- ONE <style> block inside <head> containing ALL CSS
- ONE <script> block at the very end of <body> containing ALL JavaScript
- NO external stylesheet links
- NO external script src links  
- NO Google Fonts or any CDN
- NO inline style attributes (except dynamic JS-controlled styles)
- Must work perfectly inside an iframe with srcdoc attribute
- Must NOT use window.location changes, window.open, or anything that breaks iframe

CSS ARCHITECTURE:
:root {
  /* Color system */
  --primary: #your-primary;
  --primary-dark: #darker;
  --secondary: #your-secondary;
  --accent: #your-accent;
  --bg-primary: #your-bg;
  --bg-secondary: #your-bg-2;
  --bg-card: #your-card-bg;
  --text-primary: #your-text;
  --text-secondary: #your-muted;
  --border: #your-border;
  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 5rem;
  /* Sizing */
  --max-width: 1200px;
  --border-radius: 12px;
  --border-radius-lg: 24px;
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.1);
  --shadow-md: 0 8px 32px rgba(0,0,0,0.15);
  --shadow-lg: 0 20px 60px rgba(0,0,0,0.2);
  /* Transitions */
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

CSS ORGANIZATION ORDER:
1. :root variables
2. CSS reset (*, box-sizing, margin, padding)
3. Base styles (body, html, images, links)
4. Utility classes
5. Layout (containers, grids)
6. Navbar component
7. Hero section
8. Each content section
9. Footer
10. @keyframes animations
11. @media queries (mobile-first, all breakpoints)

JAVASCRIPT REQUIREMENTS:
- showPage(pageId) function for SPA navigation
- Each page wrapped in: <section id="home" class="page active"> (home gets active by default)
- All other pages: <section id="about" class="page"> (no active class initially)
- CSS: .page { display: none; } and .page.active { display: block; }
- updateActiveNav(pageId) — removes/adds active class on nav links
- Mobile hamburger toggle: toggleMobileMenu()
- Navbar scroll effect: window.addEventListener('scroll', ...) adds 'scrolled' class
- IntersectionObserver for scroll animations: adds 'animate-in' class to elements with 'animate' class
- Form validation: validateForm() — checks required fields, email format, shows error messages inline
- No alert(), confirm(), or prompt() — use DOM error messages
- Smooth scroll behavior via CSS: html { scroll-behavior: smooth; }
- Close mobile menu when nav link is clicked
- Prevent default on all form submissions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPA PAGE STRUCTURE — MANDATORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED 4 PAGES — ALL must be present and fully functional:

1. HOME PAGE (id="home"):
   - Full-viewport hero section with compelling headline, subtitle, 2 CTA buttons
   - Brief features/highlights preview (3-4 cards)
   - Statistics bar with impressive numbers
   - Testimonials/social proof section
   - Call-to-action banner section

2. ABOUT PAGE (id="about"):
   - Brand story section with image and text
   - Mission and values section (icon cards)
   - Team member cards with names, roles, initials avatar
   - Company timeline or milestones section

3. SERVICES PAGE (id="services"):
   - Services/features grid (6+ cards with icons, titles, descriptions)
   - Detailed feature breakdown section
   - Process/how-it-works steps
   - Pricing or packages section with feature lists

4. CONTACT PAGE (id="contact"):
   - Contact form: name, email, phone, subject, message fields with validation
   - Contact info cards: address, phone, email, hours
   - FAQ section with expand/collapse accordion
   - Social media links section

NAVIGATION BEHAVIOR:
- Home page must have class="page active" on load
- All other pages: class="page" (no active)
- Clicking any nav link calls showPage(id) which:
  1. Removes 'active' from ALL .page elements
  2. Adds 'active' to target page element
  3. Scrolls window to top
  4. Updates active nav link styling
  5. Closes mobile menu if open
- Active nav link: add class 'active' to current, remove from others

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT QUALITY REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write real, professional, business-ready content tailored precisely to the user's request:
- Compelling action-driven headlines that speak to the target audience
- Benefit-focused copy (focus on what users gain, not just features)
- Real-sounding company name, professional tagline, consistent brand voice
- Specific credible statistics: "10,000+ satisfied clients", "98.7% uptime", "$2.4M saved"
- Realistic full team member names with specific job titles and short bios
- Professional contact details: real-format email, phone, full address
- Industry-specific language, terminology, and value propositions
- Detailed testimonials: full names, company names, job titles, specific feedback
- Real service/feature descriptions with actual benefits explained
- NO generic filler — every word must feel intentional and professional

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY FINAL SELF-CHECK — DO THIS BEFORE GENERATING OUTPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mentally verify EVERY single item before writing your response:

RESPONSIVE CHECK:
□ Looks and works perfectly on 320px mobile
□ Looks and works perfectly on 768px tablet
□ Looks and works perfectly on 1440px desktop
□ Zero horizontal scrollbar on any screen size
□ All images scale correctly and don't overflow
□ Text is readable and not overflowing on mobile
□ Hamburger menu is visible on mobile and functional
□ Mobile nav links are tap-friendly (min 48px height)

DESIGN CHECK:
□ Color palette is cohesive, professional, and uses CSS variables
□ Typography hierarchy is clear with 5 distinct levels
□ All hover effects are smooth and work on every interactive element
□ Animations are smooth, subtle, and enhance not distract
□ Cards and sections have proper shadows and visual depth
□ Hero section is impressive and full-viewport
□ Overall design looks agency-quality, not template quality

FUNCTIONAL CHECK:
□ Home page is visible immediately on load (has 'active' class)
□ About, Services, Contact pages all exist and switch correctly
□ Active nav link updates when switching pages
□ Form shows inline validation errors (no alerts)
□ All buttons have visible hover AND active/press states
□ Mobile menu opens and closes correctly
□ IntersectionObserver triggers on scroll
□ Page scrolls to top when switching pages

CODE QUALITY CHECK:
□ Valid HTML5 with proper DOCTYPE and meta tags
□ Exactly ONE <style> block, no external CSS links
□ Exactly ONE <script> block at bottom of body
□ No external CDN references anywhere
□ No JavaScript errors in logic
□ CSS variables defined at :root
□ All @keyframes animations defined
□ All media queries present and properly organized

IF ANY SINGLE ITEM ABOVE IS NOT MET → FIX IT BEFORE RESPONDING

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT — STRICTLY ENFORCED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY and EXACTLY this JSON structure. Nothing before. Nothing after.

{
  "message": "One professional sentence describing what was built",
  "code": "<complete valid HTML5 document as a single string>"
}

⛔ DO NOT wrap in markdown code blocks (\`\`\`json or \`\`\`)
⛔ DO NOT add any text, comments, or explanation before the opening {
⛔ DO NOT add any text, comments, or explanation after the closing }
⛔ DO NOT use comments inside JSON
⛔ The "code" value must be a single properly escaped string
⛔ Invalid JSON structure = completely invalid response = total failure
`;

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PROMPT BUILDER — surgical changes to existing websites
// ─────────────────────────────────────────────────────────────────────────────
const buildUpdatePrompt = (currentCode, userRequest, conversationHistory) => `
YOU ARE A SENIOR FRONTEND DEVELOPER performing a precise surgical update
to an existing production website. Your job is to apply ONLY the requested changes
while keeping everything else exactly as it is.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONVERSATION HISTORY (For context of previous changes):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${conversationHistory}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW USER REQUEST:
${userRequest}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CURRENT WEBSITE CODE:
${currentCode}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT RULES FOR UPDATING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✔ Apply ONLY the specific changes the user requested — nothing more
✔ Preserve ALL existing sections, pages, components not mentioned in request
✔ Maintain the existing design language, color palette, and typography completely
✔ Keep all responsive behavior fully intact — test all breakpoints mentally
✔ Keep all CSS animations and transitions working exactly as before
✔ Keep the SPA navigation system working perfectly
✔ Keep the mobile hamburger menu functional
✔ Keep all form validation working

CHANGE TYPES — HOW TO HANDLE:
- "Add a section" → Add it seamlessly matching the existing design style perfectly
- "Change color/theme" → Update CSS variables in :root AND all hardcoded instances
- "Change content/text" → Update ONLY that specific text, keep layout intact
- "Remove something" → Remove cleanly without breaking surrounding layout
- "Add a page" → Add new .page section AND add nav link for it
- "Fix something" → Identify and fix the specific issue without touching unrelated code
- "Make it more [adjective]" → Apply targeted style changes that achieve the described feel

✔ Return the COMPLETE updated HTML file — not partial, not just the changed section
✔ The returned code must be fully functional and complete on its own

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT — STRICTLY ENFORCED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY this raw JSON. No text before. No text after. No markdown.

{
  "message": "One sentence describing exactly what was changed",
  "code": "<complete updated HTML document as a single properly escaped string>"
}

⛔ No markdown, no code blocks, no explanations — ONLY raw JSON
`;

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: Generate a Brand New Website
// POST /api/website/generate
// ─────────────────────────────────────────────────────────────────────────────
export const generateWebsite = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.credits < 50) {
            return res.status(403).json({
                message: "You don't have enough credits to generate a website. You need at least 50 credits.",
            });
        }

        console.log(`[generateWebsite] Starting for user: ${user._id} | Prompt: "${prompt.slice(0, 80)}..."`);

        const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt.trim());
        const { raw, parsed } = await generateWithRetry(finalPrompt, 3);

        if (!parsed || !parsed.code || parsed.code.trim().length < 200) {
            console.error("[generateWebsite] ❌ All attempts failed. Raw sample:", raw?.slice(0, 400));
            return res.status(422).json({
                message:
                    "The AI failed to generate a valid website after multiple attempts. Please try rephrasing your prompt with more specific details.",
            });
        }

        const website = await Website.create({
            user: user._id,
            title: prompt.trim().slice(0, 60),
            latestCode: parsed.code,
            conversation: [
                { role: "user", content: prompt.trim() },
                { role: "ai", content: parsed.message || "Website generated successfully." },
            ],
        });

        user.credits = user.credits - 50;
        await user.save();

        console.log(
            `[generateWebsite] ✅ Website created: ${website._id} | Credits remaining: ${user.credits}`
        );

        return res.status(201).json({
            websiteId: website._id,
            message: parsed.message,
            remainingCredits: user.credits,
        });
    } catch (error) {
        console.error("[generateWebsite] Unexpected server error:", error);
        return res.status(500).json({
            message: `Server error while generating website: ${error.message}`,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: Get Single Website by ID (owner only)
// GET /api/website/get/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getWebsiteById = async (req, res) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }

        return res.status(200).json(website);
    } catch (error) {
        console.error("[getWebsiteById] Error:", error);
        return res.status(500).json({
            message: `Server error: ${error.message}`,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: Apply Changes / Updates to Existing Website
// POST /api/website/update/:id
// ─────────────────────────────────────────────────────────────────────────────
export const changes = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.credits < 25) {
            return res.status(403).json({
                message:
                    "You don't have enough credits to update this website. You need at least 25 credits.",
            });
        }

        console.log(
            `[changes] Updating website: ${website._id} for user: ${user._id} | Request: "${prompt.slice(0, 80)}..."`
        );

        // Build conversation history string for AI context (last 6 messages = 3 exchanges)
        const conversationHistory = website.conversation
            .slice(-6)
            .map((c) => `${c.role.toUpperCase()}: ${c.content}`)
            .join("\n");

        const updatePrompt = buildUpdatePrompt(
            website.latestCode,
            prompt.trim(),
            conversationHistory
        );

        const { raw, parsed } = await generateWithRetry(updatePrompt, 3);

        if (!parsed || !parsed.code || parsed.code.trim().length < 200) {
            console.error("[changes] ❌ All attempts failed. Raw sample:", raw?.slice(0, 400));
            return res.status(422).json({
                message:
                    "The AI failed to apply the requested changes. Please try rephrasing your request more clearly.",
            });
        }

        website.conversation.push(
            { role: "user", content: prompt.trim() },
            { role: "ai", content: parsed.message || "Changes applied successfully." }
        );

        website.latestCode = parsed.code;
        user.credits = user.credits - 25;

        await Promise.all([website.save(), user.save()]);

        console.log(
            `[changes] ✅ Website updated: ${website._id} | Credits remaining: ${user.credits}`
        );

        return res.status(200).json({
            message: parsed.message,
            code: parsed.code,
            remainingCredits: user.credits,
        });
    } catch (error) {
        console.error("[changes] Unexpected server error:", error);
        return res.status(500).json({
            message: `Server error while updating website: ${error.message}`,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: Get All Websites for Logged-in User
// GET /api/website/get-all
// ─────────────────────────────────────────────────────────────────────────────
export const getAll = async (req, res) => {
    try {
        const websites = await Website.find({ user: req.user._id })
            .sort({ updatedAt: -1 })
            .select("_id title deployed deployUrl latestCode updatedAt createdAt");

        return res.status(200).json(websites);
    } catch (error) {
        console.error("[getAll] Error:", error);
        return res.status(500).json({
            message: `Server error: ${error.message}`,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: Deploy Website — Generate Public Shareable URL
// GET /api/website/deploy/:id
// ─────────────────────────────────────────────────────────────────────────────
export const deploy = async (req, res) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }

        // Generate clean URL-safe slug only if not already set
        if (!website.slug) {
            const baseSlug = website.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")   // remove special chars except hyphens
                .trim()
                .replace(/\s+/g, "-")             // spaces → hyphens
                .replace(/-+/g, "-")              // collapse multiple consecutive hyphens
                .slice(0, 50);                    // max 50 chars for readability

            const uniqueSuffix = website._id.toString().slice(-6);
            website.slug = `${baseSlug}-${uniqueSuffix}`;
        }

        website.deployed = true;
        website.deployUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`;

        await website.save();

        console.log(`[deploy] ✅ Website deployed: ${website._id} → ${website.deployUrl}`);

        return res.status(200).json({
            url: website.deployUrl,
            slug: website.slug,
        });
    } catch (error) {
        console.error("[deploy] Error:", error);
        return res.status(500).json({
            message: `Server error: ${error.message}`,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: Get Website by Public Slug (for LiveSite / public view)
// GET /api/website/get-by-slug/:slug
// ─────────────────────────────────────────────────────────────────────────────
export const getBySlug = async (req, res) => {
    try {
        const website = await Website.findOne({ slug: req.params.slug }).select(
            "latestCode title deployUrl slug updatedAt"
        );

        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }

        return res.status(200).json(website);
    } catch (error) {
        console.error("[getBySlug] Error:", error);
        return res.status(500).json({
            message: `Server error: ${error.message}`,
        });
    }
};
