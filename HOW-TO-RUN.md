# How to Run The Hezekiah Foundation Website

This is a static website (HTML, CSS, and JavaScript). No build step is required.

## Option 1: Simple HTTP server (recommended)

From the project folder, start a local server so the site is served correctly (paths and assets work as expected).

### Using Python 3

```bash
cd /home/powolabi/Desktop/hezekiah_foundation
python3 -m http.server 8000 --bind 0.0.0.0
```

Then open in your browser:

- **Same machine:** http://localhost:8000  
- **Another machine (e.g. after SSH):** http://YOUR_SERVER_IP:8000  

Stop the server with **Ctrl+C**.

### Using Python 2

```bash
cd /home/powolabi/Desktop/hezekiah_foundation
python -m SimpleHTTPServer 8000
```

Then open http://localhost:8000

---

## Option 2: Open the HTML file directly

You can open `index.html` directly in your browser (double-click or drag into the browser).

- **Limitation:** Some features (e.g. loading assets or links) may behave differently when using `file://` instead of `http://`. Prefer Option 1 if something doesn’t work.

---

## Option 3: Node.js (if you have Node installed)

```bash
cd /home/powolabi/Desktop/hezekiah_foundation
npx serve .
```

Or with `http-server`:

```bash
npx http-server . -p 8000
```

Then open http://localhost:8000 (or the port shown in the terminal).

---

## Pages

- **Home:** http://localhost:8000/ or http://localhost:8000/index.html  
- **Projects:** http://localhost:8000/projects.html  
- **Contact:** http://localhost:8000/contact.html  

---

## If you're on a remote server (SSH)

1. Start the server with **bind to all interfaces** so it’s reachable from your computer:

   ```bash
   python3 -m http.server 8000 --bind 0.0.0.0
   ```

2. Open in your browser: **http://YOUR_SERVER_IP:8000**  
   (Replace `YOUR_SERVER_IP` with the server’s IP or hostname.)

3. If you can’t connect, check that:
   - Port **8000** is allowed in the server firewall.
   - For cloud servers (e.g. AWS, GCP), the security group / firewall allows inbound TCP on port **8000**.

---

## Project structure

```
hezekiah_foundation/
├── index.html          # Home page
├── projects.html       # Projects page
├── contact.html        # Contact page
├── styles.css          # Styles
├── main.js             # Scripts (nav, form, videos)
├── icon.jpg            # Logo & favicon
├── assets/             # Images used by the site
│   ├── background.jpeg
│   ├── body-background-img.jpeg
│   └── tough.png
├── wintercareproject.mov   # Project video
├── flint-video.mov        # Project video
└── HOW-TO-RUN.md          # This file
```
