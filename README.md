# Profile Card Generator

A small web app that generates profile cards from user input.

## Features
- Generate profile cards from name, role, and image input.

- Customizable color themes for cards.

- Download profile card as PNG.

- Responsive layout for mobile and desktop.

- Import from social profiles (e.g., LinkedIn).

- Shareable public link for each card.

- Keyboard accessible with ARIA support.

- Save templates locally for reuse.

- Export/import JSON for batch generation.

### Details & Examples

- Generate profile cards from name, role, and image input: enter a name and role in the form and upload or paste an image; the card preview updates live.

- Customizable color themes for cards: pick from preset palettes or enter a hex code; try the "Dark Night" and "Sunset" themes in the theme selector.

- Download profile card as PNG: click the "Download" button to save a high-resolution PNG suitable for sharing or printing.

- Responsive layout for mobile and desktop: card layout adapts using CSS grid/flex; works well on phone screens and widescreen monitors.

- Import from social profiles (e.g., LinkedIn): paste a public profile URL to pre-fill name, role, and avatar fields (requires OAuth for private data).

- Shareable public link for each card: generate a short, shareable URL to view the card without editing access.

- Keyboard accessible with ARIA support: navigate the form and controls via keyboard; semantic ARIA labels are included for screen readers.

- Save templates locally for reuse: save a JSON template of the current card to your browser storage and reapply later.

- Export/import JSON for batch generation: export multiple profiles to a JSON file and import to create many cards at once (example format included in `/examples/profiles.json`).

## Quick start
1. Install dependencies:

```bash
npm install
```

2. Run the app:

```bash
node server.js
```

3. Open http://localhost:3000 in your browser.

---

Added one feature point as requested.
