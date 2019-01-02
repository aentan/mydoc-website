# MyDoc Website Front-end Design

This repository uses:

- Hugo as static site generator
- Hugo Pipes for asset management + PostCSS
- NPM for package management
- Gulp for SVG sprites
- Adobe fonts (formerly Typekit)
- Include-media package (node package)

## Styling Methodology

The order of `@import` statements.

1. Adobe fonts
2. Include-media
3. Variables and mixins
4. Reset
5. Components, general layout, page-specific layouts

## Getting Started

Run `npm install` then run `hugo server` to start developing.
Also keep Gulp running with `gulp`.