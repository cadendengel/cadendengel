import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [projects] = useState([
    {
      id: 'fibersync',
      title: 'FiberSync',
      summary: 'A full-stack, real-time web messenger application with secure authentication and message persistence.',
      tech: ['React', 'Node.js', 'MongoDB', 'Firebase', 'WebSockets', 'Jest'],
      keyFeatures: ['Real-time messaging', 'User authentication', 'Message persistence', 'WebSocket integration', 'Unit testing'],
      challenge: 'Handling concurrent WebSocket connections while maintaining message order and ensuring reliable delivery across device-specific network interruptions required careful state management and reconnection logic.',
      demoLink: 'https://fibersync-fd2e2.web.app/',
      repoLink: 'https://github.com/cadendengel/FiberSync/',
      image: '/img/fibersync-preview.jpg'
    },
    {
      id: 'meal-prep-pantry',
      title: 'Meal Prep Pantry',
      summary: 'A full-stack web application that automates meal planning using grocery store product data.',
      tech: ['React', 'Node.js', 'MongoDB', 'Tesseract.js', 'Vercel'],
      keyFeatures: ['Recipe storage', 'Ingredient tracking', 'OCR processing', 'Cost calculation', 'Macro tracking'],
      challenge: 'Handling OCR on different websites with different file/text formats for storing nutrition labels required building a flexible parsing system that could adapt to various label layouts and data structures depending on the source.',
      demoLink: 'https://meal-prep-pantry.vercel.app/',
      repoLink: 'https://github.com/cadendengel/meal-prep-pantry/',
      image: '/img/meal-prep-pantry-preview.jpg'
    },
    {
      id: 'visionary',
      title: 'Visionary',
      summary: 'Computer vision system utilizing YOLOv5 for real-time object detection and tracking with servo-controlled laser pointer.',
      tech: ['Python', 'OpenCV', 'YOLOv5', '3D Printing', 'Arduino'],
      keyFeatures: ['Real-time object detection', 'Servo motor control', 'Video stream processing', 'Multi-object tracking', 'Hardware integration'],
      challenge: 'Achieving real-time detection while simultaneously controlling servo motors required optimizing the inference pipeline and implementing precise timing mechanisms to sync vision processing with hardware commands.',
      repoLink: 'https://github.com/CSC121-TXST/CS4398-Grp3-Visionary',
      image: '/img/visionary-preview.jpg'
    },
    {
      id: 'mle-healthcare-extension',
      title: 'MLE Healthcare Extension',
      summary: 'Extended healthcare data encryption algorithm with machine learning compatibility for multiple datasets.',
      tech: ['Python', 'C#', 'Pandas', 'NumPy', 'Scikit-learn'],
      keyFeatures: ['Multi-dataset compatibility', 'Data encryption', 'ML model integration', 'Security analysis', 'Statistical validation'],
      challenge: 'Extending existing encryption algorithms to maintain compatibility with machine learning models while preserving security properties required the careful interfacing of machine learning data formats with cryptographic techniques in order to retrain model performance without exposing vulnerabilities.',
      repoLink: 'https://github.com/A-J21/Healthcare-Security-Analysis-MLE-Extension',
      image: '/img/mle-preview.jpg'
    },
    {
      id: 'eng3303proj4',
      title: 'GitHub Accessibility Redesign',
      summary: 'Redesigned GitHub repository page with enhanced accessibility features following some of the WCAG standards.',
      tech: ['HTML', 'CSS', 'JavaScript', 'AWS S3', 'Web Accessibility'],
      keyFeatures: ['WCAG compliance', 'Keyboard navigation', 'Screen reader support', 'Improved color contrast', 'Semantic HTML'],
      challenge: 'Implementing comprehensive accessibility improvements required understanding diverse user needs and testing with actual assistive technologies to ensure real-world usability.',
      demoLink: 'https://eng3303proj4.s3.us-east-2.amazonaws.com/src/index.html',
      image: '/img/github-redesign-preview.jpg'
    },
  ]);

  const skills = {
    frontend: ['React', 'JavaScript', 'HTML5', 'CSS', 'Vite'],
    backend: ['Node.js', 'Express', 'MongoDB', 'Firebase', 'REST APIs'],
    languages: ['JavaScript', 'Python', 'C++', 'C', 'Java', 'C#'],
    tools: ['Git', 'GitHub', 'VS Code', 'Visual Studio', 'npm', 'AWS']
  };

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [highlightContact, setHighlightContact] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [rawPageLoadCount, setRawPageLoadCount] = useState(null);
  const [uniqueSessionCount, setUniqueSessionCount] = useState(null);
  const [isTrafficLoading, setIsTrafficLoading] = useState(true);
  const [trafficError, setTrafficError] = useState('');
  const [trafficUpdatedAt, setTrafficUpdatedAt] = useState('');
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const modalPanelRef = useRef(null);
  const modalCloseRef = useRef(null);
  const lastFocusedElementRef = useRef(null);

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
    const counterApiBase = import.meta.env.DEV ? '/api/counter' : 'https://api.counterapi.dev';

    const requestCounter = async (counterName, shouldIncrement) => {
      const counterPath = shouldIncrement ? `${counterName}/up` : `${counterName}/`;
      const endpoint = `${counterApiBase}/v1/${counterNamespace}/${counterPath}`;
      const proxyEndpoint = `https://api.allorigins.win/raw?url=${encodeURIComponent(endpoint)}`;

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

      if (import.meta.env.DEV) {
        return attemptRequest(endpoint);
      }

      try {
        return await attemptRequest(endpoint);
      } catch {
        return attemptRequest(proxyEndpoint);
      }
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
          setRawPageLoadCount(parseCounterValue(rawPageLoadResult));
          setUniqueSessionCount(parseCounterValue(uniqueSessionResult));
          setTrafficUpdatedAt(new Date().toLocaleString());
          setTrafficError('');
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
          setTrafficError('Traffic counter is temporarily unavailable. Try again in a moment.');
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
  const emailAddress = 'caden.d.dengel@gmail.com';
  const mailSubject = encodeURIComponent('');
  const mailBody = encodeURIComponent('');
  const mailtoLink = `mailto:${emailAddress}?subject=${mailSubject}&body=${mailBody}`;

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

  const handleGetInTouchClick = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
    
    // Wait for scroll to complete before triggering highlight
    setTimeout(() => {
      setHighlightContact(true);
      setTimeout(() => setHighlightContact(false), 2000);
    }, 800);
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
              <p className="hero-kicker">Full-Stack Developer</p>
              <h2 className="hero-headline">
                Hi, I&apos;m <span>Caden Dengel</span>.
                <br />
                I build web applications and the infrastructure that runs them.
              </h2>
              <p className="lead">My projects focus on solving practical problems, like automating personal tasks, building full-stack tools, and deploying software using modern cloud infrastructure.</p>
              <p className="lead">I enjoy working across the stack: designing APIs, building intuitive interfaces, and figuring out how to deploy systems reliably.</p>
              <div className="hero-meta">
                <span className="location">San Marcos/Kyle/South Austin, TX Area</span>
                <span className="separator">•</span>
                <span className="availability">Currently available for hire remote or in-person</span>
              </div>
              <p>
                <a className="primary-btn" href="#projects">View My Work</a>
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
          <h3>Technical Skills</h3>
          <div className="skills-grid">
            <div className="skill-category">
              <h4>Frontend</h4>
              <div className="skill-tags">
                {skills.frontend.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            <div className="skill-category">
              <h4>Backend</h4>
              <div className="skill-tags">
                {skills.backend.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            <div className="skill-category">
              <h4>Languages</h4>
              <div className="skill-tags">
                {skills.languages.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            <div className="skill-category">
              <h4>Tools & Platforms</h4>
              <div className="skill-tags">
                {skills.tools.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="container projects">
          <h3>Projects</h3>
          <div className="project-list">
            {projects.map(p => (
              <article key={p.id} className="project-card">
                <div className="project-image-wrap">
                  <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" onError={(e) => e.target.style.display = 'none'} />
                  <div className="project-image-overlay">
                    <span>Project Preview</span>
                  </div>
                </div>
                <div className="project-card-body">
                  <h4 className="project-title">{p.title}</h4>
                  <p className="project-summary">{p.summary}</p>
                  <button className="project-details-btn" onClick={() => openProjectDetails(p)} aria-label={`View details for ${p.title}`}>View Details →</button>
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
            </div>
          </div>
        )}

        <section className="about">
          <div className="container about-layout">
            <div className="about-content">
              <h3>About Me</h3>
              <p>I&apos;m a Computer Science graduate from Texas State University (December 2025). I&apos;m a full-stack developer with hands-on experience building modern web applications using React, Node.js, and MongoDB. Throughout my academic journey and personal projects, I&apos;ve built multiple deployed applications, including a real-time messaging platform and computer vision systems.</p>
              <p>My approach combines strong problem-solving skills with attention to detail, whether I&apos;m designing intuitive user interfaces or building scalable backend systems. Beyond web development, I have experience with Python for machine learning projects, C++ for systems programming, and Java for object-oriented design.</p>
            </div>

            <aside className="traffic-card" aria-live="polite">
              <p className="traffic-label">Website Traffic</p>
              <div className="traffic-metrics">
                <div className="traffic-metric">
                  <p className="traffic-metric-label">Raw Page Loads</p>
                  <p className="traffic-value">
                    {isTrafficLoading && 'Loading...'}
                    {!isTrafficLoading && !trafficError && rawPageLoadCount !== null && rawPageLoadCount.toLocaleString()}
                    {!isTrafficLoading && !trafficError && rawPageLoadCount === null && '--'}
                    {!isTrafficLoading && trafficError && '--'}
                  </p>
                </div>
                <div className="traffic-metric">
                  <p className="traffic-metric-label">Unique Sessions</p>
                  <p className="traffic-value">
                    {isTrafficLoading && 'Loading...'}
                    {!isTrafficLoading && !trafficError && uniqueSessionCount !== null && uniqueSessionCount.toLocaleString()}
                    {!isTrafficLoading && !trafficError && uniqueSessionCount === null && '--'}
                    {!isTrafficLoading && trafficError && '--'}
                  </p>
                </div>
              </div>
              {!isTrafficLoading && !trafficError && trafficUpdatedAt && (
                <p className="traffic-updated">Last updated: {trafficUpdatedAt}</p>
              )}
              <p className="traffic-caption">
                Raw page loads track every load. Unique sessions increment once per 30-minute timestamp window per browser session.
              </p>
              {trafficError && <p className="traffic-error">{trafficError}</p>}
            </aside>
          </div>
        </section>

      </main>

      <footer className={`site-footer ${highlightContact ? 'highlight' : ''}`} id="contact">
        <div className="container footer-content">
          <div className="footer-contact">
            <span className="footer-label">Get In Touch</span>
            <a className="footer-email" href={mailtoLink}>caden.d.dengel@gmail.com</a>
          </div>
          <div className="footer-location">
            San Marcos/Kyle/South Austin, TX Area • Available for Full-Time & Contract Work
          </div>
          <small>© {new Date().getFullYear()} Caden Dengel. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

export default App
