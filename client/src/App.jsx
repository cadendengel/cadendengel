import { Fragment, useEffect, useRef, useState } from 'react'
import './App.css'

const projects = [
  {
    id: 'fibersync',
    featured: true,
    title: 'FiberSync',
    summary: 'A real-time chat app with channels and DMs. Built with two classmates.',
    tech: ['React', 'Python', 'Flask', 'Socket.IO', 'MongoDB', 'Firebase Hosting', 'Render', 'Jest', 'Pytest'],
    keyFeatures: ['Messages show up for everyone in real time', 'Channels and DMs', 'Salted, hashed passwords', 'Tests on the frontend and backend'],
    challenge: 'We started with regular API calls and moved to WebSockets so updates showed up live. Keeping messages in order got tricky, and so did reconnecting after a dropped connection.',
    role: 'I set up the MongoDB backend and its hosting. I built login and sessions with salted password hashing. I also added message editing, live user status, and auto-reconnect, plus the backend tests.',
    demoLink: 'https://fibersync-fd2e2.web.app/',
    repoLink: 'https://github.com/cadendengel/FiberSync/',
    image: '/img/fibersync-preview.jpg'
  },
  {
    id: 'meal-prep-pantry',
    featured: true,
    title: 'Meal Prep Pantry',
    summary: 'A meal builder that tracks macros and cost using real grocery store product data.',
    tech: ['React', 'Vite', 'Node.js', 'Vercel Serverless', 'MongoDB Atlas', 'Tesseract.js', 'JWT', 'Vitest', 'Playwright'],
    keyFeatures: ['Save an ingredient once, reuse it in any meal', 'Scan a nutrition label or look up a barcode', 'Macros per meal and per serving', 'Tracks what each meal costs', 'Shopping list grouped by store'],
    challenge: 'Nutrition labels come in a lot of layouts, and OCR text comes out messy. Getting the right numbers out of all of them took a lot of parser work.',
    demoLink: 'https://meal-prep-pantry.vercel.app/',
    repoLink: 'https://github.com/cadendengel/meal-prep-pantry/',
    image: '/img/meal-prep-pantry-preview.jpg'
  },
  {
    id: 'visionary',
    featured: true,
    title: 'Visionary',
    summary: 'A camera on a pan/tilt mount that detects and tracks objects in real time with YOLOv8 and points a laser at them.',
    tech: ['Python', 'OpenCV', 'YOLOv8', 'DeepSORT', 'Arduino', 'Tkinter', 'OpenAI API', '3D Printing'],
    keyFeatures: ['Tracks multiple objects at once', 'Pan/tilt servos and a laser, run from an Arduino', 'Desktop control panel', 'Scene narration with the OpenAI API (never finished)'],
    challenge: 'Detection had to stay fast while the servos moved. If it lagged, the laser ended up behind the target.',
    role: 'I worked on the hardware side of the build. It was a four-person team project.',
    repoLink: 'https://github.com/CSC121-TXST/CS4398-Grp3-Visionary',
    image: '/img/visionary-preview.jpg'
  },
  {
    id: 'pricewatch',
    featured: true,
    title: 'PriceWatch',
    summary: 'A personal AI agent that checks PC part prices every hour during the day and keeps a live dashboard of the best ones.',
    tech: ['Claude Code', 'AI Agents', 'Python', 'eBay API', 'RSS', 'Claude Artifacts'],
    keyFeatures: ['Quick check every hour, full sweep once a day', 'Checks Slickdeals and eBay, plus retailers on the daily sweep', 'Throws out broken and bid-only listings', 'Live dashboard'],
    challenge: "Most deals aren't real deals. For-parts listings, ended auctions, out-of-stock items, and old parts all show up. I gave the agent strict rules so the dashboard only shows stuff worth buying.",
    image: '/img/pricewatch-preview.jpg'
  },
  {
    id: 'sonar',
    featured: true,
    title: 'Sonar',
    summary: 'A tool I built at work that pulls public government data to find companies worth contacting.',
    tech: ['Python', 'SQLite', 'Public APIs', 'Claude Code'],
    keyFeatures: ['Scores every lead and shows why', 'Flags companies that just started hiring engineers', 'Uses only free public data'],
    challenge: 'Public data rarely says whether a company needs help. I wrote clear rules for who qualifies. Companies with no data get marked as unjudged, not rejected.'
  },
  {
    id: 'mle',
    title: 'MLE Healthcare Extension',
    summary: 'Extended a research project that runs machine learning predictions on encrypted data, adding financial and academic datasets alongside healthcare.',
    tech: ['C#', '.NET', 'Microsoft SEAL', 'Windows Forms', 'Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    keyFeatures: ['Runs predictions without decrypting the data', 'Healthcare model plus two new ones (financial and academic)', 'Desktop app that walks through each step'],
    challenge: 'Encrypted data limits what a model can do. New datasets had to be normalized first, and the model had to stay simple enough to run on encrypted values.',
    role: 'I tested a lot of different models locally to find one that would work on encrypted data. We ended up going with logistic regression.',
    repoLink: 'https://github.com/A-J21/Healthcare-Security-Analysis-MLE-Extension'
  },
  {
    id: 'eng3303proj4',
    title: 'GitHub Accessibility Redesign',
    summary: "Rebuilt a GitHub repo page so it's easier to use with a keyboard or a screen reader.",
    tech: ['HTML', 'CSS', 'JavaScript', 'AWS S3', 'Web Accessibility'],
    keyFeatures: ['Full keyboard navigation', 'ARIA labels for screen readers', 'Better color contrast', 'Semantic HTML'],
    challenge: "You can't tell if a page works with a screen reader until you use one. Testing with assistive tech is what showed the real problems.",
    demoLink: 'https://eng3303proj4.s3.us-east-2.amazonaws.com/src/index.html'
  },
];

const featuredProjects = projects.filter((project) => project.featured);
const projectsById = Object.fromEntries(projects.map((project) => [project.id, project]));

const thenNow = {
  then: [
    { text: 'Built full-stack apps by hand in React, Node.js, Python, and MongoDB', projects: ['fibersync', 'meal-prep-pantry'] },
    { text: 'Built real-time object tracking in Python with YOLOv8 and Arduino', projects: ['visionary'] },
    { text: 'Added machine learning support to an encryption project in Python and C#', projects: ['mle'] },
    { text: 'Wrote C++ and Java for school and personal projects' },
    { text: 'Tested everything by hand and wrote every bug report myself' },
    { text: 'Deployed by hand and debugged with print statements' },
  ],
  now: [
    { text: 'Have AI agents write the code, then review all of it' },
    { text: 'Handle QA for every client project at work, around 150 tickets per month', highlight: true },
    { text: 'Build tools and plugins that help agents do real work' },
    { text: 'Build data tools that pull from dozens of public sources', projects: ['sonar'] },
    { text: 'Run AI agents that work for me in the background', projects: ['pricewatch'] },
    { text: 'Automate deploys with CI/CD, serverless, and infrastructure as code', link: { label: 'this site', href: 'https://github.com/cadendengel/cadendengel' } },
    { text: '*And much more!' },
  ],
};

const emailAddress = 'caden.d.dengel@gmail.com';
const mailtoLink = `mailto:${emailAddress}`;

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// Scrolls slower than the browser's built-in smooth scroll; resolves when it lands
const smoothScrollTo = (element, fixedDuration) => new Promise((resolve) => {
  if (!element) {
    resolve();
    return;
  }

  const startY = window.scrollY;
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  const targetY = Math.min(element.getBoundingClientRect().top + startY, maxY);
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) {
    window.scrollTo(0, targetY);
    resolve();
    return;
  }

  const duration = fixedDuration ?? Math.min(Math.max(Math.abs(distance) * 0.585, 675), 1170);
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      resolve();
    }
  };

  window.requestAnimationFrame(step);
});

const getInitialTheme = () =>
  localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [emailNudgeKey, setEmailNudgeKey] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [rawPageLoadCount, setRawPageLoadCount] = useState(null);
  const [uniqueSessionCount, setUniqueSessionCount] = useState(null);
  const [isTrafficLoading, setIsTrafficLoading] = useState(true);
  const [showTrafficFallback, setShowTrafficFallback] = useState(false);
  const [trafficUpdatedAt, setTrafficUpdatedAt] = useState('');
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const modalPanelRef = useRef(null);
  const modalCloseRef = useRef(null);
  const lastFocusedElementRef = useRef(null);
  const uniqueTechCount = new Set(projects.flatMap((project) => project.tech)).size;
  const portfolioSnapshot = [
    { label: 'Projects', value: projects.length.toLocaleString() },
    { label: 'Technologies Used', value: uniqueTechCount.toLocaleString() },
  ];

  const closeProjectDetails = () => {
    setSelectedProject(null);
    const focusTarget = lastFocusedElementRef.current;
    if (focusTarget && typeof focusTarget.focus === 'function') {
      window.requestAnimationFrame(() => {
        focusTarget.focus();
      });
    }
  };

  const openProjectDetails = (project) => {
    lastFocusedElementRef.current = document.activeElement;
    setSelectedProject(project);
  };

  const handleModalKeyDown = (event) => {
    if (!selectedProject || event.key !== 'Tab') return;

    const panel = modalPanelRef.current;
    if (!panel) return;

    const focusable = panel.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  useEffect(() => {
    if (!selectedProject) return;

    modalCloseRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeProjectDetails();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  useEffect(() => {
    let isMounted = true;
    const counterNamespace = 'cadendengel-portfolio';
    const rawPageLoadCounterName = 'website-page-loads';
    const uniqueSessionCounterName = 'website-unique-sessions';
    const pageLoadGuardKey = '__cadendengelPortfolioRawLoadCounted__';
    const sessionTimestampStorageKey = '__cadendengelPortfolioSessionTimestamp__';
    const sessionWindowMs = 30 * 60 * 1000;
    const counterApiBase = '/api/counter';

    const requestCounter = async (counterName, shouldIncrement) => {
      const counterPath = shouldIncrement ? `${counterName}/up` : `${counterName}/`;
      const endpoint = `${counterApiBase}/v1/${counterNamespace}/${counterPath}`;

      const attemptRequest = async (url) => {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Counter request failed: ${response.status}`);
        }

        return response.json();
      };

      return attemptRequest(endpoint);
    };

    const parseCounterValue = (counterResponse) => {
      const rawValue = counterResponse?.value ?? counterResponse?.data ?? counterResponse?.count;
      const parsedValue = Number.parseInt(String(rawValue ?? ''), 10);
      return Number.isFinite(parsedValue) ? parsedValue : null;
    };

    const trackVisit = async () => {
      const hasCountedRawLoad = window[pageLoadGuardKey] === true;
      const shouldIncrementRawLoad = !hasCountedRawLoad;

      const now = Date.now();
      const previousSessionTimestamp = Number.parseInt(
        String(sessionStorage.getItem(sessionTimestampStorageKey) ?? ''),
        10
      );
      const hasActiveSession = Number.isFinite(previousSessionTimestamp)
        && now - previousSessionTimestamp < sessionWindowMs;
      const shouldIncrementUniqueSession = !hasActiveSession;

      if (shouldIncrementRawLoad) {
        window[pageLoadGuardKey] = true;
      }

      sessionStorage.setItem(sessionTimestampStorageKey, String(now));

      try {
        const [rawPageLoadResult, uniqueSessionResult] = await Promise.all([
          shouldIncrementRawLoad
            ? requestCounter(rawPageLoadCounterName, true)
            : requestCounter(rawPageLoadCounterName, false),
          shouldIncrementUniqueSession
            ? requestCounter(uniqueSessionCounterName, true)
            : requestCounter(uniqueSessionCounterName, false),
        ]);

        if (isMounted) {
          const parsedRawPageLoadCount = parseCounterValue(rawPageLoadResult);
          const parsedUniqueSessionCount = parseCounterValue(uniqueSessionResult);
          const shouldShowFallbackSnapshot = parsedRawPageLoadCount === null || parsedUniqueSessionCount === null;

          setRawPageLoadCount(parsedRawPageLoadCount);
          setUniqueSessionCount(parsedUniqueSessionCount);
          setTrafficUpdatedAt(shouldShowFallbackSnapshot ? '' : new Date().toLocaleString());
          setShowTrafficFallback(shouldShowFallbackSnapshot);
        }
      } catch {
        if (shouldIncrementRawLoad) {
          delete window[pageLoadGuardKey];
        }

        if (shouldIncrementUniqueSession) {
          sessionStorage.removeItem(sessionTimestampStorageKey);
        }

        if (isMounted) {
          setRawPageLoadCount(null);
          setUniqueSessionCount(null);
          setTrafficUpdatedAt('');
          setShowTrafficFallback(true);
        }
      } finally {
        if (isMounted) {
          setIsTrafficLoading(false);
        }
      }
    };

    trackVisit();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    let frameId = null;

    const updateScrollProgress = () => {
      const progress = Math.min(window.scrollY / 420, 1);
      setHeroScrollProgress(progress);
      frameId = null;
    };

    const handleScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateScrollProgress);
    };

    updateScrollProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleViewWorkClick = (e) => {
    e.preventDefault();
    smoothScrollTo(document.getElementById('projects'));
  };

  const handleGetInTouchClick = async (e) => {
    e.preventDefault();
    await smoothScrollTo(document.getElementById('contact'), 1000);
    setEmailNudgeKey((key) => key + 1);
  };

  const handleProjectLinkClick = (e, projectId) => {
    e.preventDefault();
    openProjectDetails(projectsById[projectId]);
  };

  const renderThenNowRefs = (item) => {
    if (item.link) {
      return (
        <span className="then-now-project">
          {' → '}
          <a href={item.link.href} target="_blank" rel="noreferrer">{item.link.label}</a>
        </span>
      );
    }
    if (!item.projects) return null;

    return (
      <span className="then-now-project">
        {' → '}
        {item.projects.map((projectId, i) => (
          <Fragment key={projectId}>
            {i > 0 && ', '}
            <a href={`#project-${projectId}`} onClick={(e) => handleProjectLinkClick(e, projectId)}>{projectsById[projectId].title}</a>
          </Fragment>
        ))}
      </span>
    );
  };

  return (
    <div className="site-wrap">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      <header className="site-header">
        <div className="container">
          <h1 className="brand">Caden Dengel</h1>
          <div className="controls">
            <a className="resume-link" href="/img/Caden_Dengel_Resume.pdf" download="Caden_Dengel_Resume.pdf">Download Resume</a>
            <button 
              className="theme-toggle" 
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" style={{ '--hero-scroll': heroScrollProgress }}>
          <div className="container hero-grid">
            <div className="hero-text">
              <p className="hero-kicker">Software Engineer &amp; QA</p>
              <h2 className="hero-headline">
                Hi, I&apos;m <span>Caden Dengel</span>.
                <br />
                I build and test software with AI agents.
              </h2>
              <p className="lead">I build full-stack apps and the infrastructure that runs them. These days I build most of it with AI agents, and then I make sure it actually works.</p>
              <p className="lead">At work I set up AI agents to help with QA testing. With them, I handle QA for all of our client projects, around 150 tickets per month. My estimated capacity is around 400 to 500 tickets per month.</p>
              <div className="hero-meta">
                <span className="location">San Antonio/Austin, TX Area</span>
              </div>
              <p>
                <a className="primary-btn" href="#projects" onClick={handleViewWorkClick}>View My Work</a>
                <a className="secondary-btn" href="#contact" onClick={handleGetInTouchClick}>Get In Touch</a>
              </p>
              <p className="socials">
                <a href="https://linkedin.com/in/cadendengel" target="_blank" rel="noreferrer">LinkedIn</a>
                {' '}•{' '}
                <a href="https://github.com/cadendengel" target="_blank" rel="noreferrer">GitHub</a>
              </p>
            </div>

            <div className="hero-image" style={{ transform: `translateY(${heroScrollProgress * -28}px)` }}>
              <div className="hero-image-shell">
                <img src="/img/Profile_Picture.jpg" alt="Caden Dengel professional headshot" loading="eager" />
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="container skills">
          <h3>How I Work</h3>
          <div className="then-now-grid">
            <div className="skill-category">
              <h4>Where I started</h4>
              <ul className="then-now-list">
                {thenNow.then.map(item => (
                  <li key={item.text}>
                    {item.text}
                    {renderThenNowRefs(item)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="skill-category">
              <h4>What I do now</h4>
              <ul className="then-now-list">
                {thenNow.now.map(item => (
                  <li key={item.text} className={item.highlight ? 'then-now-highlight' : undefined}>
                    {item.text}
                    {renderThenNowRefs(item)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="projects" className="container projects">
          <h3>Projects</h3>
          <div className="project-list">
            {featuredProjects.map(p => (
              <article key={p.id} id={`project-${p.id}`} className="project-card" onClick={() => openProjectDetails(p)}>
                <div className="project-image-wrap">
                  {p.image
                    ? <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" onError={(e) => e.target.style.display = 'none'} />
                    : <span className="project-image-placeholder">{p.title}</span>}
                  <div className="project-image-overlay">
                    <span>Project Preview</span>
                  </div>
                </div>
                <div className="project-card-body">
                  <h4 className="project-title">{p.title}</h4>
                  <p className="project-summary">{p.summary}</p>
                  <button className="project-details-btn" aria-label={`View details for ${p.title}`}>View Details →</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {selectedProject && (
          <div className="modal-overlay" onClick={closeProjectDetails}>
            <div
              className="modal-panel"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleModalKeyDown}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`project-modal-title-${selectedProject.id}`}
              ref={modalPanelRef}
            >
              <button ref={modalCloseRef} className="modal-close" onClick={closeProjectDetails} aria-label="Close details">✕</button>
              <h3 id={`project-modal-title-${selectedProject.id}`} className="modal-title">{selectedProject.title}</h3>
              <p className="modal-summary">{selectedProject.summary}</p>

              <div className="modal-section">
                <h4>Tech Stack</h4>
                <div className="project-tech">
                  {selectedProject.tech.map(t => <span key={t} className="tech-badge">{t}</span>)}
                </div>
              </div>

              <div className="modal-section">
                <h4>Key Features</h4>
                <ul className="project-features">
                  {selectedProject.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>

              <div className="modal-section">
                <h4>Challenge</h4>
                <p className="modal-challenge">{selectedProject.challenge}</p>
              </div>

              {selectedProject.role && (
                <div className="modal-section">
                  <h4>My Part</h4>
                  <p className="modal-challenge">{selectedProject.role}</p>
                </div>
              )}

              {(selectedProject.demoLink || selectedProject.repoLink) && (
                <div className="modal-section">
                  <h4>Links</h4>
                  <div className="modal-links">
                    {selectedProject.demoLink && (
                      <a href={selectedProject.demoLink} target="_blank" rel="noreferrer" className="modal-link-btn modal-link-demo">Live Demo →</a>
                    )}
                    {selectedProject.repoLink && (
                      <a href={selectedProject.repoLink} target="_blank" rel="noreferrer" className="modal-link-btn modal-link-github">GitHub →</a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <section className="about">
          <div className="container about-layout">
            <div className="about-content">
              <h3>About Me</h3>
              <p>I graduated from Texas State University with a CS degree in December 2025. I started out as a full-stack developer, mostly React, Node.js, Python, and MongoDB, plus C++ and Java from school and side projects.</p>
              <p>Now I&apos;m a software engineer focused on QA, and I don&apos;t write much code by hand anymore. Since I work with AI agents, I&apos;m not tied to one stack. I can work in whatever framework or language a project uses.</p>
              <p>I want to see how much I can hand off to agents, and I build whatever tools I need along the way. If something turns out useful, I clean it up and share it.</p>
              <p>Outside of work, I like building PCs and messing with hardware. I built PriceWatch to find deals on parts for my current PC. I also like to play guitar, work out, read, and cook.</p>
            </div>

            <aside className="traffic-card" aria-live="polite">
              <p className="traffic-label">{showTrafficFallback ? 'Portfolio Snapshot' : 'Website Traffic'}</p>
              {!showTrafficFallback && (
                <>
                  <div className="traffic-metrics">
                    <div className="traffic-metric">
                      <p className="traffic-metric-label">Raw Page Loads</p>
                      <p className="traffic-value">
                        {isTrafficLoading && 'Loading...'}
                        {!isTrafficLoading && rawPageLoadCount !== null && rawPageLoadCount.toLocaleString()}
                        {!isTrafficLoading && rawPageLoadCount === null && '--'}
                      </p>
                    </div>
                    <div className="traffic-metric">
                      <p className="traffic-metric-label">Unique Sessions</p>
                      <p className="traffic-value">
                        {isTrafficLoading && 'Loading...'}
                        {!isTrafficLoading && uniqueSessionCount !== null && uniqueSessionCount.toLocaleString()}
                        {!isTrafficLoading && uniqueSessionCount === null && '--'}
                      </p>
                    </div>
                  </div>
                  {!isTrafficLoading && trafficUpdatedAt && (
                    <p className="traffic-updated">Last updated: {trafficUpdatedAt}</p>
                  )}
                  <p className="traffic-caption">
                    Raw page loads track every load. Unique sessions increment once per 30-minute timestamp window per browser session.
                  </p>
                </>
              )}
              {showTrafficFallback && (
                <>
                  <div className="traffic-metrics traffic-metrics-fallback">
                    {portfolioSnapshot.map((item) => (
                      <div className="traffic-metric" key={item.label}>
                        <p className="traffic-metric-label">{item.label}</p>
                        <p className="traffic-value traffic-value-neutral">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="traffic-caption">
                    A quick look at my current portfolio highlights.
                  </p>
                </>
              )}
            </aside>
          </div>
        </section>

      </main>

      <footer className="site-footer" id="contact">
        <div className="container footer-content">
          <div className="footer-contact">
            <span className="footer-label">Get In Touch</span>
            <span className="footer-email-wrap">
              {emailNudgeKey > 0 && (
                <span
                  key={emailNudgeKey}
                  className="email-nudge"
                  role="status"
                  onAnimationEnd={(e) => {
                    if (e.animationName === 'email-nudge-life' || e.animationName === 'email-nudge-fade') setEmailNudgeKey(0);
                  }}
                >
                  Send me an email here!
                </span>
              )}
              <a className="footer-email" href={mailtoLink}>{emailAddress}</a>
            </span>
          </div>
          <div className="footer-location">
            San Antonio/Austin, TX Area
          </div>
          <small>© {new Date().getFullYear()} Caden Dengel. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

export default App
