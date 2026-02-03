# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static personal landing page/portfolio website for Marwan Magdy, a System Engineer and GUC graduate. The site has no build process - it's pure HTML/CSS/JavaScript that can be served directly.

## File Structure

- `index.html` - Main HTML structure with inline JavaScript for navigation interactions
- `style.css` - All styling using CSS custom properties for the dark theme

## Development

To view the site locally, simply open `index.html` in a browser or use any static file server:

```bash
# Python 3
python -m http.server 8000

# Node.js (if http-server is installed)
npx http-server
```

No build step, compilation, or dependency installation is required.

## Design System

The site uses a dark theme with cyan/blue accents. CSS custom properties are defined in `:root`:

- **Colors**: `--bg-primary`, `--bg-secondary`, `--text-primary`, `--accent-primary` (cyan #00d4ff)
- **Typography**: `--font-mono` (SF Mono, Fira Code, Consolas) and `--font-sans` (Inter)
- **Spacing**: `--section-spacing` (6rem default), `--container-max` (1100px)

The theme uses code/terminal aesthetics (`> Building scalable systems` typing effect, monospace fonts, `/Section/` title formatting) reflecting the system engineering focus.

## Architecture Notes

- **Navigation**: Fixed navbar with smooth scrolling to anchor-based sections (#hero, #about, #education, #experience, #skills, #contact)
- **Active State**: JavaScript tracks scroll position to highlight the current section in the nav
- **Responsive**: Breakpoints at 768px (mobile) and 480px (small mobile)
- **Animations**: Blinking cursor effect in hero, fadeInUp animation on page load, hover transitions on interactive elements
