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

## Deploy with GitHub Pages
1. Create a public GitHub repository, for example `techfest-build-in-3d`.
2. Upload `index.html`, `styles.css`, `script.js`, `README.md`, and the `assets/` folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Wait for the published URL to appear. Test it on desktop and mobile before submitting.

## Submission note
The task accepts either a screen recording of the working website (Drive link with viewer access) or the GitHub link to the project. A deployed live link is a useful extra, but do not paste a placeholder URL: submit the real repository or recording link after you have created it.

## Browser requirements
A modern browser with WebGL and internet access is needed for the 3D scene and CDN imports. If WebGL is unavailable, the surrounding page remains readable, but the central 3D sculpture will not render.
