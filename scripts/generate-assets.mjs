// One-off generator for the static image assets committed to public/:
// favicons, the Open Graph card, and the blog cover illustrations.
// Run with `node scripts/generate-assets.mjs`. Rendering the OG card with the
// brand font requires Bricolage Grotesque to be installed for fontconfig.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const CREAM = '#FAF6EE';
const INK = '#1B1712';
const MUTED = '#6E6557';
const ACCENT = '#C94F1C';
const PEACH = '#E8A87C';
const BORDER = '#E6DECE';

const logo = await readFile(new URL('../public/images/logo.png', import.meta.url));

// --- Favicons -------------------------------------------------------------
// The logo is black-line art on a white square; multiply it over cream so the
// icon matches the site background.
async function favicon(size, out) {
  const base = sharp({
    create: { width: size, height: size, channels: 4, background: CREAM },
  });
  const scaled = await sharp(logo)
    .resize(size, size, { fit: 'cover' })
    .toBuffer();
  const png = await base
    .composite([{ input: scaled, blend: 'multiply' }])
    .png()
    .toBuffer();
  await writeFile(new URL(`../public/${out}`, import.meta.url), png);
  console.log('wrote', out);
}

await favicon(32, 'favicon-32.png');
await favicon(192, 'favicon-192.png');
await favicon(180, 'apple-touch-icon.png');

// --- Open Graph card --------------------------------------------------------
const logoDataUri = `data:image/png;base64,${logo.toString('base64')}`;

const ogSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${CREAM}"/>
  <!-- corner motif: record dot rings -->
  <circle cx="1090" cy="110" r="150" fill="none" stroke="${BORDER}" stroke-width="2"/>
  <circle cx="1090" cy="110" r="110" fill="none" stroke="${BORDER}" stroke-width="2"/>
  <circle cx="1090" cy="110" r="70" fill="none" stroke="${PEACH}" stroke-width="2.5"/>
  <circle cx="1090" cy="110" r="26" fill="${ACCENT}"/>
  <!-- brand -->
  <image href="${logoDataUri}" x="84" y="70" width="84" height="84" preserveAspectRatio="xMidYMid slice"/>
  <text x="184" y="127" font-family="Bricolage Grotesque" font-weight="700" font-size="42" letter-spacing="-1" fill="${INK}">Routinly</text>
  <!-- headline -->
  <text x="84" y="330" font-family="Bricolage Grotesque" font-weight="800" font-size="104" letter-spacing="-3.5" fill="${INK}">Hit record.</text>
  <text x="84" y="440" font-family="Bricolage Grotesque" font-weight="800" font-size="104" letter-spacing="-3.5" fill="${INK}">Get documentation.</text>
  <!-- subline -->
  <text x="84" y="536" font-family="Bricolage Grotesque" font-weight="500" font-size="30" fill="${MUTED}">Turn screen recordings into step-by-step SOPs with AI</text>
  <rect x="84" y="570" width="1032" height="4" fill="${ACCENT}"/>
</svg>`;

await writeFile(
  new URL('../public/og.png', import.meta.url),
  await sharp(Buffer.from(ogSvg), { density: 96 }).png().toBuffer()
);
console.log('wrote og.png');

// --- Blog covers ------------------------------------------------------------
// Text-free geometric compositions (SVG <img> can't load web fonts), one
// distinct motif per post, all in the brand palette.
const covers = {
  // record dot + three step bars: video → steps
  'how-to-write-an-sop-in-5-minutes': `
    <circle cx="200" cy="240" r="96" fill="${ACCENT}"/>
    <circle cx="200" cy="240" r="130" fill="none" stroke="${PEACH}" stroke-width="3"/>
    <rect x="392" y="150" width="290" height="42" rx="21" fill="${INK}"/>
    <rect x="392" y="219" width="230" height="42" rx="21" fill="${INK}" opacity="0.75"/>
    <rect x="392" y="288" width="260" height="42" rx="21" fill="${INK}" opacity="0.5"/>`,
  // stacked coins/cost blocks sliding off
  'real-cost-of-undocumented-processes': `
    <rect x="150" y="290" width="200" height="44" rx="10" fill="${INK}"/>
    <rect x="170" y="238" width="200" height="44" rx="10" fill="${INK}" opacity="0.8"/>
    <rect x="196" y="186" width="200" height="44" rx="10" fill="${INK}" opacity="0.6"/>
    <rect x="232" y="134" width="200" height="44" rx="10" fill="${ACCENT}" transform="rotate(6 332 156)"/>
    <circle cx="580" cy="160" r="56" fill="none" stroke="${PEACH}" stroke-width="3"/>
    <circle cx="580" cy="160" r="20" fill="${PEACH}"/>`,
  // two parallel tracks, one shorter: onboarding time halved
  'onboard-new-hires-twice-as-fast': `
    <rect x="140" y="170" width="480" height="40" rx="20" fill="${BORDER}"/>
    <rect x="140" y="170" width="480" height="40" rx="20" fill="none" stroke="${INK}" stroke-width="2"/>
    <rect x="140" y="270" width="240" height="40" rx="20" fill="${ACCENT}"/>
    <path d="M 430 290 h 130 m -28 -22 l 28 22 l -28 22" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  // three distinct document shapes side by side
  'sop-vs-process-doc-vs-runbook': `
    <rect x="128" y="130" width="150" height="210" rx="14" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/>
    <circle cx="158" cy="176" r="10" fill="${ACCENT}"/><rect x="180" y="170" width="70" height="12" rx="6" fill="${BORDER}"/>
    <circle cx="158" cy="216" r="10" fill="${ACCENT}"/><rect x="180" y="210" width="60" height="12" rx="6" fill="${BORDER}"/>
    <circle cx="158" cy="256" r="10" fill="${ACCENT}"/><rect x="180" y="250" width="66" height="12" rx="6" fill="${BORDER}"/>
    <rect x="306" y="130" width="150" height="210" rx="14" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/>
    <rect x="330" y="164" width="44" height="30" rx="8" fill="${PEACH}"/>
    <path d="M 374 179 h 34" stroke="${INK}" stroke-width="3"/>
    <rect x="408" y="164" width="30" height="30" rx="8" fill="${BORDER}"/>
    <rect x="330" y="240" width="30" height="30" rx="8" fill="${BORDER}"/>
    <path d="M 360 255 h 40" stroke="${INK}" stroke-width="3"/>
    <rect x="400" y="240" width="38" height="30" rx="8" fill="${PEACH}"/>
    <rect x="484" y="130" width="150" height="210" rx="14" fill="${INK}"/>
    <path d="M 512 180 l 20 18 l -20 18" stroke="${PEACH}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="544" y="192" width="60" height="10" rx="5" fill="${CREAM}" opacity="0.7"/>
    <rect x="512" y="240" width="92" height="10" rx="5" fill="${CREAM}" opacity="0.4"/>`,
  // speech-bubble tone waves
  'custom-writing-tone': `
    <rect x="140" y="130" width="330" height="160" rx="26" fill="${INK}"/>
    <path d="M 200 290 v 44 l 52 -44 Z" fill="${INK}"/>
    <rect x="176" y="176" width="180" height="14" rx="7" fill="${PEACH}"/>
    <rect x="176" y="212" width="240" height="14" rx="7" fill="${CREAM}" opacity="0.55"/>
    <circle cx="560" cy="300" r="72" fill="${ACCENT}"/>
    <path d="M 532 300 q 14 -26 28 0 q 14 26 28 0" stroke="${CREAM}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  // play button → document lines
  'youtube-tutorials-into-written-guides': `
    <rect x="140" y="150" width="270" height="180" rx="24" fill="${INK}"/>
    <path d="M 252 205 l 62 35 l -62 35 Z" fill="${ACCENT}"/>
    <path d="M 440 240 h 84 m -22 -20 l 22 20 l -22 20" stroke="${MUTED}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="548" y="166" width="112" height="16" rx="8" fill="${INK}"/>
    <rect x="548" y="202" width="90" height="16" rx="8" fill="${ACCENT}"/>
    <rect x="548" y="238" width="104" height="16" rx="8" fill="${INK}" opacity="0.6"/>
    <rect x="548" y="274" width="76" height="16" rx="8" fill="${INK}" opacity="0.35"/>`,
  // gear leaving a trail of documents: byproduct
  'documentation-byproduct-not-project': `
    <circle cx="220" cy="240" r="86" fill="none" stroke="${INK}" stroke-width="26" stroke-dasharray="30 22"/>
    <circle cx="220" cy="240" r="30" fill="${ACCENT}"/>
    <rect x="380" y="196" width="64" height="88" rx="10" fill="#FFFFFF" stroke="${INK}" stroke-width="3"/>
    <rect x="472" y="196" width="64" height="88" rx="10" fill="#FFFFFF" stroke="${INK}" stroke-width="3" opacity="0.7"/>
    <rect x="564" y="196" width="64" height="88" rx="10" fill="#FFFFFF" stroke="${INK}" stroke-width="3" opacity="0.4"/>
    <rect x="392" y="214" width="40" height="8" rx="4" fill="${ACCENT}"/>
    <rect x="392" y="232" width="32" height="8" rx="4" fill="${BORDER}"/>`,
};

await mkdir(new URL('../public/images/blog', import.meta.url), { recursive: true });
for (const [slug, motif] of Object.entries(covers)) {
  const svg = `<svg width="760" height="480" viewBox="0 0 760 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
  <rect width="760" height="480" fill="${CREAM}"/>
  <circle cx="700" cy="428" r="120" fill="${PEACH}" opacity="0.22"/>
  <circle cx="52" cy="40" r="90" fill="${BORDER}" opacity="0.35"/>
${motif}
</svg>`;
  await writeFile(new URL(`../public/images/blog/${slug}.svg`, import.meta.url), svg);
  console.log('wrote images/blog/' + slug + '.svg');
}
