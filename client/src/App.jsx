import { useEffect, useState } from 'react'

function App() {
  const [projects] = useState([
    {
      id: 'fibersync',
      title: 'FiberSync',
      description: 'A full-stack web messenger application hosted on Firebase. It uses its own Mongo server to store and retrieve messages, and it is built with React, Node.js, and MongoDB.',
      link: 'https://fibersync-fd2e2.web.app/'
    },
    {
      id: 'visionary',
      title: 'Visionary',
      description: 'An OpenCV-based video processing application based in Python that uses a pre-trained YOLOv5 model to detect and track objects with a laser pointer in real-time using servos.',
      link: 'https://github.com/CSC121-TXST/CS4398-Grp3-Visionary'
    },
    {
      id: 'mle-healthcare-extension',
      title: 'MLE Healthcare Extension',
      description: 'An extension of an healthcare encryption algorithm that is modified to be compatible with different datasets. It is built with C# and python, using pandas, numpy, and scikit-learn for dataset training.',
      link: 'https://github.com/A-J21/Healthcare-Security-Analysis-MLE-Extension'
    },
    {
      id: 'eng3303proj4',
      title: 'Github Accessibility Redesign',
      description: 'Course project hosted on Amazon AWS. Displays a redesign of the GitHub repo page.',
      link: 'https://eng3303proj4.s3.us-east-2.amazonaws.com/src/index.html'
    }
  ]);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const emailAddress = 'caden.d.dengel@gmail.com';
  const mailSubject = encodeURIComponent('');
  const mailBody = encodeURIComponent('');
  const mailtoLink = `mailto:${emailAddress}?subject=${mailSubject}&body=${mailBody}`;
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}&su=${mailSubject}&body=${mailBody}`;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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
      <header className="site-header">
        <div className="container">
          <h1 className="brand">Caden Dengel</h1>
          <div className="controls">
            <a className="resume-link" href="/img/Caden_Dengel_Resume.pdf" download>Download Resume</a>
            <button className="theme-toggle" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-text">
              <h2>Web Developer & Student</h2>
              <p className="lead">Hi, I&apos;m Caden, a Computer Science graduate pursuing a web developer role. I enjoy building web apps, working with databases, and learning new technologies. In my free time, I like to play guitar, relax while fishing, and go to the gym. Life has taught me many things, but some of the relevant core values that I hold high are integrity, perseverance, kindness.</p>
              <p>
                <a className="primary-btn" href="#projects">Projects</a>
                <a className="secondary-btn" href="#contact">Contact Me</a>
              </p>
              <p className="socials">
                <a href="https://linkedin.com/in/cadendengel" target="_blank" rel="noreferrer">LinkedIn</a>
                {' '}•{' '}
                <a href="https://github.com/cadendengel" target="_blank" rel="noreferrer">GitHub</a>
              </p>
            </div>

            <div className="hero-image">
              <img src="/img/Profile_Picture.jpg" alt="Profile" />
            </div>
          </div>
        </section>

        <section id="about" className="container about">
          <h3>About</h3>
          <p>I recently graduated with my B.S. in Computer Science from Texas State University. I am looking for web development roles, although I am open to other opportunities. Throughout high school and college, I enjoyed building modular web projects with REACT, Node.js, Python, and other useful, modern technologies. I also have some experience working with C, C++, and Java, including experience in a game development project. However, I do enjoy web design and development, as you can see from some of my projects listed below.</p>
        </section>

        <section id="projects" className="container projects">
          <h3>Projects</h3>
          <div className="project-list">
            {projects.map(p => (
              <article key={p.id} className="project-card">
                <div className="project-content">
                  <h4>{p.title}</h4>
                  <p>{p.description}</p>
                </div>
                <div className="project-actions">
                  <a href={p.link} target="_blank" rel="noreferrer">View project</a>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      <footer className="site-footer" id="contact">
        <div className="container footer-content">
          <div className="footer-contact">
            <span className="footer-label">Contact Me @</span>
            <a className="footer-email" href={gmailLink} onClick={handleContactClick}>caden.d.dengel@gmail.com</a>
          </div>
          <small>© {new Date().getFullYear()} Caden Dengel</small>
        </div>
      </footer>
    </div>
  );
}

export default App
