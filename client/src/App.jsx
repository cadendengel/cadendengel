import { useEffect, useState } from 'react'

function App(){
  const [projects] = useState([
    {
      id: 'eng3303proj4',
      title: 'ENG3303Proj4',
      description: 'Course project hosted on Amazon AWS. Displays a redesign of the GitHub repo page.',
      link: 'https://eng3303proj4.s3.us-east-2.amazonaws.com/src/index.html'
    },
    {
      id: 'fibersync',
      title: 'FiberSync',
      description: 'A full-stack web messenger application that uses its own Mongo server to store and retrieve messages, built with React, Node.js, and MongoDB.',
      link: 'https://fibersync-fd2e2.web.app/'
    }
  ]);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  function handleContactSubmit(e){
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const subject = encodeURIComponent(form.subject.value.trim() || 'Website contact');
    const message = encodeURIComponent(`Name: ${name}%0D%0A%0D%0A` + form.message.value.trim());
    const mailto = `mailto:caden.d.dengel@gmail.com?subject=${subject}&body=${message}`;
    window.location.href = mailto;
  }

  return (
    <div className="site-wrap">
      <header className="site-header">
        <div className="container">
          <h1 className="brand">Caden Dengel</h1>
          <div className="controls">
            <a className="resume-link" href="/img/Caden_Dengel_Resume.pdf" download>Download Resume</a>
            <button className="theme-toggle" onClick={()=>setTheme(t => t==='light' ? 'dark' : 'light')}>
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
              <p className="lead">I&apos;m Caden, a Computer Science graduate pursuing a web developer role. I build full-stack projects and enjoy making responsive, accessible web apps.</p>
              <p>
                <a className="primary-btn" href="#projects">Projects</a>
                <a className="secondary-btn" href="#contact">Contact</a>
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
          <p>I am graduating with my B.S. in Computer Science from Texas State University. I am looking for web development roles. I enjoy building modular projects with REACT, Node.js, Python, and other useful, modern technologies.</p>
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
                  <a href={p.link} target="_blank" rel="noreferrer">Open project</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="container contact">
          <h3>Contact</h3>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <label>Name<input name="name" type="text" placeholder="Your name" /></label>
            <label>Subject<input name="subject" type="text" placeholder="Subject" /></label>
            <label>Message<textarea name="message" rows="6" placeholder="Write a short message"></textarea></label>
            <div className="form-actions">
              <button type="submit" className="primary-btn">Send</button>
            </div>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <small>© {new Date().getFullYear()} Caden Dengel — <a href="mailto:caden.d.dengel@gmail.com">caden.d.dengel@gmail.com</a></small>
        </div>
      </footer>
    </div>
  );
}

export default App
