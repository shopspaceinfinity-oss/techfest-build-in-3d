# TECHFEST 30 — Beyond the Possible

A responsive, 3D interactive concept website made for the Techfest “Build in 3D” web-development task.

## Features
- Live Three.js 3D energy sculpture with orbiting rings, particles, lighting, and drag-to-rotate interaction
- Responsive editorial landing page with animated reveals and mobile navigation
- Interactive Robotics / Space Tech / AI / Future Energy cards that reconfigure the 3D scene palette
- Scroll-based story sections, custom motion graphics, and reduced-motion support
- No build step and no local assets beyond the favicon; Three.js and fonts load from public CDNs

## Run locally
Because `script.js` uses JavaScript modules, serve this folder over HTTP rather than opening `index.html` directly.

### Quick option (Python)
From this folder, run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Browser requirements
A modern browser with WebGL and internet access is needed for the 3D scene and CDN imports. If WebGL is unavailable, the surrounding page remains readable, but the central 3D sculpture will not render.
