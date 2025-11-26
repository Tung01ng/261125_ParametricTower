# 261125_ParametricTower

Parametric tower generator that stacks procedural floor slabs in the browser, letting you explore twisting, scaling, and color gradients in real time through an interactive control panel. Built with Vite, Three.js, and Tweakpane so the structure updates instantly as you adjust the sliders.

## Features
- Interactive sliders for floor count, per-floor height, twist, tower rotation, and radial scale with independent minimum/maximum ranges.
- Smooth color gradient between customizable bottom/top colors so the tower transitions along its height.
- Orbit camera controls, soft lighting, and grid reference to inspect the form from any angle.
- Instant rebuild for every parameter change, enabling rapid iteration and form finding.

## Getting Started
1. Install dependencies: `npm install`
2. Launch the local dev server: `npm run dev`
3. Open the printed localhost URL (default http://localhost:5173) in a modern browser.

## Controls
- **Floor Count**: Number of stacked slabs (5–80).
- **Floor Height**: Vertical height of each slab.
- **Scale Min/Max**: Minimum and maximum slab radii to create tapering or bulging massing.
- **Twist Min/Max**: Degrees of rotation applied from base to top to achieve gradual twisting.
- **Tower Rotation**: Spins the entire tower for quick composition changes.
- **Color Bottom/Top**: Pick gradient endpoints for the slab materials.
