# SkinScan Design System
**Versiune:** 1.0
**Data:** Noiembrie 2025

## 📐 Sistem Consolidat de Design Tokens

Acest design system fuzionează inteligent toate cele 6 configurații de referință într-un sistem coerent, profesional și minimal.

---

## 🎨 Paleta de Culori

### Principiul de Bază
**Un singur accent albastru profesional** - fără alte culori pentru grafice, progress bars sau metrici.

### Culori Principale

#### Light Mode (Default)
```css
/* Backgrounds */
--background: hsl(0, 0%, 100%)           /* Pure white */
--card: hsl(0, 0%, 100%)                 /* White cards */
--muted: hsl(210, 40%, 96%)              /* Gray-50 - subtle background */

/* Text */
--foreground: hsl(0, 0%, 11%)            /* Gray-900 - primary text */
--muted-foreground: hsl(0, 0%, 38%)      /* Gray-600 - secondary text */

/* Primary Blue - Single accent (#3b82f6) */
--primary: hsl(217, 91%, 60%)            /* Blue-500 */
--primary-foreground: hsl(0, 0%, 100%)   /* White on blue */

/* Borders */
--border: hsl(0, 0%, 90%)                /* Gray-200 */
--ring: hsl(217, 91%, 60%)               /* Blue-500 focus ring */
```

#### Dark Mode
```css
/* Backgrounds */
--background: hsl(0, 0%, 10%)            /* #1a1a1a - dark gray */
--card: hsl(0, 0%, 12%)                  /* Slightly lighter */
--muted: hsl(0, 0%, 17%)                 /* Subtle dark background */

/* Text */
--foreground: hsl(0, 0%, 92%)            /* Light gray text */
--muted-foreground: hsl(0, 0%, 60%)      /* Medium gray */

/* Primary - Same blue accent */
--primary: hsl(217, 91%, 60%)            /* Blue-500 consistent */
```

---

## 🔤 Tipografie

### Font Families

```css
/* Display font - for headings, scores, prominent text */
font-family: 'Space Grotesk', sans-serif;
Weights: 300, 400, 500, 600, 700

/* Body font - for general text */
font-family: 'Inter', system-ui, sans-serif;
```

### Hierarchy

```css
/* Large scores/numbers */
.text-score {
  font-family: 'Space Grotesk';
  font-size: 3rem;          /* text-5xl */
  font-weight: 700;         /* font-bold */
  color: hsl(217, 91%, 60%); /* Blue-500 ONLY */
}

/* Headings */
.heading-primary {
  font-family: 'Space Grotesk';
  font-size: 1.5rem;        /* text-2xl */
  font-weight: 700;
  color: hsl(0, 0%, 11%);   /* Gray-900 */
}

/* Body text */
.text-body {
  font-family: 'Inter';
  font-size: 1rem;          /* text-base */
  color: hsl(0, 0%, 11%);   /* Gray-900 */
}

/* Secondary/labels */
.text-label {
  font-family: 'Inter';
  font-size: 0.875rem;      /* text-sm */
  color: hsl(0, 0%, 38%);   /* Gray-600 */
}
```

---

## 📏 Spacing & Layout

### Border Radius

```css
--radius: 0.75rem;          /* Default - rounded-xl */

/* Variants */
rounded-sm:   0.125rem
rounded:      0.25rem
rounded-md:   0.375rem
rounded-lg:   0.5rem
rounded-xl:   0.75rem       /* Primary */
rounded-2xl:  1rem          /* Cards */
rounded-full: 9999px        /* Circles */
```

### Spacing Scale
```css
/* Generous padding for airy design */
p-4:  1rem
p-6:  1.5rem
p-8:  2rem              /* Primary card padding */

/* Gaps between elements */
gap-4: 1rem
gap-6: 1.5rem           /* Primary grid gap */
gap-8: 2rem

/* Margins */
mb-8:  2rem
mb-12: 3rem
mb-16: 4rem             /* Section spacing */
```

---

## 🎭 Components

### Cards

```tsx
<Card className="p-8 bg-white border-gray-200 rounded-2xl shadow-md">
  {/* Content */}
</Card>
```

**Properties:**
- Background: `bg-white`
- Border: `border-gray-200` (subtle)
- Border radius: `rounded-2xl` (1rem)
- Shadow: `shadow-md` (subtle elevation)
- Padding: `p-8` (generous, airy)

### Progress Rings (GlowScore, CircularProgress)

```tsx
// All rings use ONLY blue-500
stroke="#3b82f6"           // Blue-500 for progress
stroke="#e5e7eb"           // Gray-200 for background

// Text inside
className="text-blue-600"  // Scores
className="text-gray-500"  // Labels
```

**Rule:** NO color variations based on score. Always blue.

### Progress Bars

```tsx
<div className="h-2 bg-gray-100 rounded-full">
  <div
    className="h-full bg-blue-500 rounded-full"
    style={{ width: `${score}%` }}
  />
</div>
```

**Properties:**
- Background track: `bg-gray-100`
- Fill: `bg-blue-500` (always, regardless of score)
- Height: `h-2` (8px)
- Rounded ends: `rounded-full`

### Buttons

```tsx
/* Primary action */
<Button className="bg-blue-500 text-white hover:bg-blue-600">
  Analyze
</Button>

/* Secondary action */
<Button variant="outline" className="border-gray-200 text-gray-900">
  Cancel
</Button>
```

### Icons

```tsx
/* Blue accent icons */
<CheckCircle className="w-6 h-6 text-blue-500" />

/* Neutral icons */
<Target className="w-6 h-6 text-gray-500" />
```

---

## 🌈 Gradients & Shadows

### Gradients

```css
/* Blue glow gradient */
--gradient-glow: linear-gradient(135deg,
  hsl(217, 91%, 60%) 0%,
  hsl(217, 91%, 50%) 100%
);

/* Subtle background gradient */
--gradient-subtle: linear-gradient(180deg,
  hsl(0, 0%, 100%) 0%,
  hsl(0, 0%, 98%) 100%
);
```

### Shadows

```css
/* Standard card shadow */
--shadow-card: 0 4px 20px -4px hsl(0, 0%, 0% / 0.08);

/* Blue glow effect */
--shadow-glow: 0 10px 40px -10px hsl(217, 91%, 60% / 0.2);

/* Premium shadow */
--shadow-premium: 0 20px 60px -10px hsl(217, 91%, 60% / 0.3);
```

**Usage:**
```tsx
<Card className="shadow-md">      {/* Standard */}
<Card className="shadow-glow">    {/* Blue glow */}
<Card className="shadow-premium"> {/* Premium effect */}
```

---

## 📱 Responsive Grid

### 2x2 Metric Cards Layout

```tsx
<div className="grid grid-cols-2 gap-6">
  {metrics.map(metric => (
    <Card key={metric.id} className="p-6">
      {/* Metric content */}
    </Card>
  ))}
</div>
```

**Properties:**
- Desktop/Tablet: `grid-cols-2` (always 2 columns)
- Mobile: Same (keeps 2x2)
- Gap: `gap-6` (1.5rem spacing)

---

## 🎯 Design Principles

### 1. **Monotone Accent**
- ✅ Use ONLY blue-500 (#3b82f6) for all data visualization
- ❌ NO green for high scores, red for low scores
- Reasoning: Professional, clinical, consistent

### 2. **Generous Whitespace**
```tsx
/* Airy, minimal design */
p-8    // Large padding
gap-6  // Generous gaps
mb-16  // Big section margins
```

### 3. **Clear Hierarchy**
```tsx
/* Visual weight through size and color only */
text-3xl font-bold text-gray-900  // Primary
text-base text-gray-900            // Body
text-sm text-gray-500              // Secondary
```

### 4. **Subtle Elevation**
```tsx
/* No dramatic shadows */
shadow-sm   // Very subtle
shadow-md   // Standard (primary)
shadow-lg   // Maximum elevation
```

### 5. **Consistent Rounding**
```tsx
/* Cards and containers */
rounded-xl   // Standard
rounded-2xl  // Large cards
rounded-full // Progress bars, icons
```

---

## 🔧 Implementation

### Tailwind Classes Reference

#### Backgrounds
```css
bg-white         /* Pure white */
bg-gray-50       /* Subtle gray */
bg-gray-100      /* Progress bar background */
bg-blue-500      /* Primary accent */
```

#### Text
```css
text-gray-900    /* Primary headings */
text-gray-600    /* Body text */
text-gray-500    /* Labels, secondary */
text-blue-600    /* Accent text, scores */
```

#### Borders
```css
border-gray-200  /* Standard borders */
border-blue-500  /* Accent borders */
```

#### Spacing
```css
p-6, p-8         /* Card padding */
gap-4, gap-6     /* Grid gaps */
mb-8, mb-16      /* Section margins */
```

---

## 📦 File Structure

```
src/
├── index.css              # Design tokens (CSS variables)
├── tailwind.config.ts     # Tailwind configuration
├── components/
│   ├── GlowScore.tsx      # Score ring (blue-500 only)
│   ├── CircularProgress.tsx
│   └── ui/
│       └── card.tsx       # Base card component
└── pages/
    ├── Results.tsx        # 2x2 grid layout
    └── Index.tsx
```

---

## ✅ Migration Checklist

When updating components:

- [ ] Replace all color-based conditionals with single blue accent
- [ ] Use `text-blue-600` for ALL scores/metrics
- [ ] Use `bg-blue-500` for ALL progress fills
- [ ] Use `text-gray-900` for primary text
- [ ] Use `text-gray-500` for secondary text/labels
- [ ] Apply `p-8` padding to cards for airy feel
- [ ] Use `rounded-2xl` for large cards
- [ ] Apply `shadow-md` for subtle elevation
- [ ] Ensure `font-display` (Space Grotesk) for scores/headings

---

## 🎨 Color Usage Matrix

| Element | Color | Tailwind Class | HSL Value |
|---------|-------|----------------|-----------|
| **Backgrounds** ||||
| Page background | White/Light gray | `bg-white`, `bg-gray-50` | `hsl(0, 0%, 100%)` |
| Card background | White | `bg-white` | `hsl(0, 0%, 100%)` |
| Subtle background | Light gray | `bg-gray-100` | `hsl(0, 0%, 96%)` |
| **Text** ||||
| Primary headings | Dark gray | `text-gray-900` | `hsl(0, 0%, 11%)` |
| Body text | Dark gray | `text-gray-600` | `hsl(0, 0%, 38%)` |
| Labels/secondary | Medium gray | `text-gray-500` | `hsl(0, 0%, 62%)` |
| Scores/metrics | **Blue** | `text-blue-600` | `hsl(217, 91%, 53%)` |
| **Accents** ||||
| Primary accent | **Blue** | `bg-blue-500` | `hsl(217, 91%, 60%)` |
| Focus rings | Blue | `ring-blue-500` | `hsl(217, 91%, 60%)` |
| Progress fills | **Blue** | `bg-blue-500` | `hsl(217, 91%, 60%)` |
| **Borders** ||||
| Standard | Light gray | `border-gray-200` | `hsl(0, 0%, 90%)` |
| Focus | Blue | `border-blue-500` | `hsl(217, 91%, 60%)` |

---

## 🚀 Quick Start

### 1. Import Fonts (index.css)
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
```

### 2. Use Design Tokens
```tsx
// Instead of conditional colors:
❌ const color = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';

// Use single accent:
✅ const color = 'blue-600'; // Always

// For components:
✅ className="text-blue-600 font-bold text-3xl"  // Scores
✅ className="text-gray-900 font-semibold"       // Headings
✅ className="text-gray-500 text-sm"             // Labels
```

### 3. Apply to Cards
```tsx
<Card className="p-8 bg-white border-gray-200 rounded-2xl shadow-md">
  <h3 className="text-lg font-semibold text-gray-900">Title</h3>
  <p className="text-3xl font-bold text-blue-600">{score}</p>
  <p className="text-sm text-gray-500">Label</p>
</Card>
```

---

## 📞 Support

For questions about the design system:
- Check this document first
- Review implementation in `Results.tsx` (reference)
- Verify CSS variables in `index.css`

**Last Updated:** Noiembrie 2025
**Design System Version:** 1.0
**Status:** ✅ Production Ready
