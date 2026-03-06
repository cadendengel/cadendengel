import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [projects] = useState([
    {
      id: 'fibersync',
      title: 'FiberSync',
      description: 'A full-stack, real-time web messenger application with secure authentication and message persistence. Handles real-time messaging with WebSocket integration.',
      link: 'https://fibersync-fd2e2.web.app/',
      tech: ['React', 'Node.js', 'MongoDB', 'Firebase', 'Render', 'WebSockets', 'Python Unittest', 'Jest', 'Python'],
      date: '2025',
      role: 'Full-Stack Developer',
      image: '/img/fibersync-preview.jpg'
    },
    {
      id: 'visionary',
      title: 'Visionary',
      description: 'Computer vision system utilizing YOLOv5 for real-time object detection and tracking with servo-controlled laser pointer.',
      link: 'https://github.com/CSC121-TXST/CS4398-Grp3-Visionary',
      tech: ['Python', 'OpenCV', 'YOLOv5', '3D Printing', 'Hardware Integration'],
      date: '2025',
      role: 'Backend Developer, Hardware Engineer',
      image: '/img/visionary-preview.jpg'
    },
    {
      id: 'mle-healthcare-extension',
      title: 'MLE Healthcare Extension',
      description: 'Extended healthcare data encryption algorithm with machine learning compatibility for multiple datasets.',
      link: 'https://github.com/A-J21/Healthcare-Security-Analysis-MLE-Extension',
      tech: ['Python', 'C#', 'Pandas', 'NumPy', 'Scikit-learn'],
      date: '2025',
      role: 'ML Engineer',
      image: '/img/mle-preview.jpg'
    },
    {
      id: 'eng3303proj4',
      title: 'Github Accessibility Redesign',
      description: 'Redesigned GitHub repository page with enhanced accessibility features, loosely guided by WCAG 2.1 AA compliance, and improved user experience. Deployed on AWS S3.',
      link: 'https://eng3303proj4.s3.us-east-2.amazonaws.com/src/index.html',
      tech: ['HTML', 'CSS', 'JavaScript', 'AWS S3', 'Accessibility'],
      date: '2025',
      role: 'Frontend Developer',
      image: '/img/github-redesign-preview.jpg'
    },
    {
      id: 'cadendengel_portfolio',
      title: 'Personal Portfolio Website',
      description: 'This personal portfolio website, which I built with React and Vite, showcases my projects, skills, and experience as a full-stack web developer.',
      link: 'https://cadendengel.com',
      tech: ['React', 'Vite', 'CSS', 'Responsive Design'],
      date: '2026',
      role: 'Full-Stack Developer',
      image: '/img/portfolio-preview.jpg'
    },
    {
      id: 'meal-prep-pantry',
      title: 'Meal Prep Pantry',
      description: 'Full-stack meal planning app designed for my girlfriend, built in under 2 days with AI assistants. Features recipe, macronutrient, user authentication features. Hosted with Vercel.',
      link: 'https://meal-prep-pantry.vercel.app/',
      tech: ['React', 'Node.js', 'MongoDB', 'Vercel', 'Tesseract.js', 'AI Integration'],
      date: '2026',
      role: 'Full-Stack Developer',
      image: '/img/meal-prep-pantry-preview.jpg'
    }
  ]);

  const skills = {
    frontend: ['React', 'JavaScript', 'HTML5', 'CSS', 'Vite', 'Responsive Design'],
    backend: ['Node.js', 'Express', 'MongoDB', 'Firebase', 'REST APIs'],
    languages: ['JavaScript', 'Python', 'C++', 'C', 'Java', 'C#'],
    tools: ['Git', 'GitHub', 'VS Code', 'Visual Studio', 'npm', 'AWS', 'Postman']
  };

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [highlightContact, setHighlightContact] = useState(false);
  const emailAddress = 'caden.d.dengel@gmail.com';
  const mailSubject = encodeURIComponent('');
  const mailBody = encodeURIComponent('');
  const mailtoLink = `mailto:${emailAddress}?subject=${mailSubject}&body=${mailBody}`;
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}&su=${mailSubject}&body=${mailBody}`;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const handleContactClick = async (event) => {
    event.preventDefault();

    const popup = window.open(gmailLink, '_blank', 'noopener,noreferrer');
    if (!popup) {
      window.location.href = mailtoLink;
    }

    setTimeout(() => {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(emailAddress).catch(() => {});
      }
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
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-text">
              <h2>Full-Stack Web Developer</h2>
              <p className="lead">Hi, I&apos;m Caden, a Computer Science graduate from Texas State University (December 2025). I&apos;m a full-stack developer with hands-on experience building modern web applications using React, Node.js, and MongoDB. Throughout my academic journey and personal projects, I&apos;ve developed 4+ production-ready applications, including a real-time messaging platform and computer vision systems.</p>
              <p className="lead">My approach combines strong problem-solving skills with attention to detail, whether I&apos;m designing intuitive user interfaces or building up scalable backend systems. Beyond web development, I have experience with Python for machine learning projects, C++ for systems programming, and Java for object-oriented design.</p>
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

            <div className="hero-image">
              <img src="/img/Profile_Picture.jpg" alt="Caden Dengel professional headshot" loading="eager" />
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
                <div className="project-image-placeholder">
                  <img src={p.image} alt={`${p.title} project screenshot`} loading="lazy" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <div className="project-content">
                  <div className="project-header">
                    <h4>{p.title}</h4>
                    <span className="project-meta">{p.date} • {p.role}</span>
                  </div>
                  <p>{p.description}</p>
                  <div className="project-tech">
                    {p.tech.map(tech => (
                      <span key={tech} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="project-actions">
                  <a href={p.link} target="_blank" rel="noreferrer">View Project →</a>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      <footer className={`site-footer ${highlightContact ? 'highlight' : ''}`} id="contact">
        <div className="container footer-content">
          <div className="footer-contact">
            <span className="footer-label">Get In Touch</span>
            <a className="footer-email" href={gmailLink} onClick={handleContactClick}>caden.d.dengel@gmail.com</a>
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
