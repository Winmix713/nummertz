import { useState, useEffect } from "react";

export type FileType = "html" | "css" | "javascript";

export interface ProjectFile {
  id: string;
  name: string;
  language: FileType;
  content: string;
}

const STORAGE_KEY = "nexus-project-files";

const INITIAL_FILES: ProjectFile[] = [
  {
    id: "index.html",
    name: "index.html",
    language: "html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexus Marketing | Liquid Glass Design</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
</head>
<body class="dark">
    <nav class="glass-nav">
        <div class="logo">Nexus<span>AI</span></div>
        <ul class="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><button class="glass-toggle"><svg class="toggle-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707"></path></svg></button></li>
        </ul>
    </nav>

    <main>
        <section class="hero">
            <div class="hero-content">
                <h1 class="gradient-text text-reveal">Design the Future with Intelligence</h1>
                <p>Experience the Liquid Glass design language, powered by Nexus AI's generative components.</p>
                <div class="cta-group">
                    <button class="primary-btn">Get Started</button>
                    <button class="secondary-btn">Watch Demo</button>
                </div>
            </div>
            <div class="hero-visual">
                <div class="glass-card">
                    <div class="card-inner"></div>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <p>Inspired by Apple's Liquid Glass Design Language</p>
    </footer>

    <script src="app.js"></script>
</body>
</html>`,
  },
  {
    id: "styles.css",
    name: "styles.css",
    language: "css",
    content: `:root {
    --primary: #6366f1;
    --bg: #09090b;
    --text: #fafafa;
    --glass: rgba(255, 255, 255, 0.03);
    --border: rgba(255, 255, 255, 0.08);
}

body {
    margin: 0;
    transition: 0.3s background-color, 0.3s color;
}

body.dark {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
}

body.light {
    background: #f4f4f5;
    color: #09090b;
    --glass: rgba(0, 0, 0, 0.03);
    --border: rgba(0, 0, 0, 0.08);
}

.glass-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 4rem;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
}

.logo { font-weight: 800; font-size: 1.5rem; }
.logo span { color: var(--primary); }

.nav-links { display: flex; list-style: none; gap: 2rem; align-items: center; }
.nav-links a { color: inherit; text-decoration: none; font-size: 0.9rem; opacity: 0.7; transition: 0.2s; }
.nav-links a:hover { opacity: 1; }

.glass-toggle {
    background: var(--glass);
    border: 1px solid var(--border);
    color: inherit;
    padding: 8px;
    border-radius: 12px;
    cursor: pointer;
}

.hero {
    display: flex;
    min-height: 80vh;
    padding: 4rem;
    align-items: center;
    gap: 4rem;
}

.hero-content { flex: 1.2; }
.hero-visual { flex: 1; display: flex; justify-content: center; }

.gradient-text {
    font-size: 4.5rem;
    line-height: 1.1;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: linear-gradient(to right, #fff, var(--primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1.5rem;
}

body.light .gradient-text {
    background: linear-gradient(to right, #000, var(--primary));
    -webkit-background-clip: text;
}

.cta-group { display: flex; gap: 1rem; margin-top: 2.5rem; }

.primary-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
}

.secondary-btn {
    background: var(--glass);
    border: 1px solid var(--border);
    color: inherit;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
}

.glass-card {
    width: 440px;
    height: 320px;
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 2.5rem;
    backdrop-filter: blur(40px);
    position: relative;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
}

.card-inner {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, var(--primary) 0%, transparent 70%);
    opacity: 0.15;
    animation: rotate 12s linear infinite;
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

footer {
    padding: 4rem;
    text-align: center;
    border-top: 1px solid var(--border);
    opacity: 0.5;
    font-size: 0.8rem;
}`,
  },
  {
    id: "app.js",
    name: "app.js",
    language: "javascript",
    content: `// Liquid Glass Interaction Logic
function toggleDarkMode() {
    const body = document.body;
    const toggle = document.querySelector('.glass-toggle');
    const icon = document.querySelector('.toggle-icon');

    body.classList.toggle('dark');
    body.classList.toggle('light');
    toggle.classList.toggle('active');

    if (body.classList.contains('dark')) {
        icon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707"></path>';
    } else {
        icon.innerHTML = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2m8-10h2M2 12H4m15.364-7.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636"></path>';
    }
}

document.querySelector('.glass-toggle')?.addEventListener('click', toggleDarkMode);

// Initialize as dark mode
if (!document.body.classList.contains('dark') && !document.body.classList.contains('light')) {
    document.body.classList.add('dark');
}`,
  },
];

export function useProjectFiles() {
  const [files, setFiles] = useState<ProjectFile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [activeFileId, setActiveFileId] = useState<string>(files[0].id);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  const updateFileContent = (id: string, content: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, content } : f)));
  };

  const resetProject = () => {
    setFiles(INITIAL_FILES);
    setActiveFileId(INITIAL_FILES[0].id);
  };

  return {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    updateFileContent,
    resetProject,
  };
}
