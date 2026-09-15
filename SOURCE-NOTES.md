# Bodhisattwa Dhara — Portfolio

A responsive personal portfolio. The authored files under `dist/` can be served by any static host, including GitHub Pages. No package installation or build step is required.

## Content sources

- Current experience and professional project summaries: the supplied `Bodhi_Resume_2026(1).pdf`.
- Portrait and background: the user's `bodhi12496/personal_porfolio` repository.
- Personal projects: README files in `music_chatbot`, `stock_prediction`, `motion_manipulators`, and `Parachute_model_optimiser`.
- Publication: https://pubmed.ncbi.nlm.nih.gov/40417494/. The AMIA 2024 collection was published May 22, 2025.
- LinkedIn: profile URL extracted from the résumé. Its page content was unavailable and was not used to add facts.

The mathematical surface and project charts are explicitly illustrative. No client data or invented performance metrics are included. MusePred is described as a work-in-progress concept, and the stock modelling study's limitations are retained.

## Editing

- `dist/index.html`: semantic page content and native expandable project and experience details.
- `dist/styles.css`: visual design, responsive layout, keyboard focus and print styles.
- `dist/script.js`: interactive mathematical surface, mobile navigation, reading progress and email copying.
- `dist/assets/`: original portrait, supplied résumé, locally served DM Sans and DM Mono fonts, favicon.

Replace `dist/assets/Bodhisattwa_Dhara_Resume_2026.pdf` when updating the CV. JavaScript syntax can be checked with `node --check dist/script.js`.

The model supports drag, arrow keys, pause/play, and reset. It stops when offscreen or in a hidden tab and respects reduced-motion preferences. Core content and native details work without JavaScript.

Preserve `.openai/hosting.json` and its `project_id` for future updates to the same Site. Public hosting or migration to the user's existing GitHub Pages website can be performed separately when requested.
