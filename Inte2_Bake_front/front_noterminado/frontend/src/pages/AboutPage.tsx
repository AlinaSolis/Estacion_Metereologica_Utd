import React, { useState, useEffect } from 'react';
import {
  MdSchool,
  MdCloud,
  MdGroups,
  MdContactMail,
  MdEmail,
  MdPhone,
  MdLocationOn,
} from 'react-icons/md';
import './CSS/AboutScreen.css';

const AboutPage = () => {
  const [isWeb, setIsWeb] = useState(window.innerWidth > 768);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsWeb(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <div className="about-container">
      {/* Header principal */}
      <div className="about-header-content">
        <h1 className="about-title">Sobre Nosotros</h1>
        <p className="about-section-subtitle">
          Un sistema desarrollado con tecnología de vanguardia para el monitoreo meteorológico
        </p>
      </div>

      <section className="about-grid-container">
        <article className={`about-card ${isWeb ? 'about-card-web' : ''}`}>
          <header className="about-card-header">
            <MdSchool size={28} color="#0A7764" className="about-card-icon" />
            <h3 className="about-section-title">Universidad Tecnológica de Durango</h3>
          </header>
          <p className="about-text">
            La Universidad Tecnológica de Durango es una institución comprometida con la excelencia académica
            y la formación de profesionales capaces de enfrentar los retos del mundo actual.
          </p>
        </article>

        <article className={`about-card ${isWeb ? 'about-card-web' : ''}`}>
          <header className="about-card-header">
            <MdCloud size={28} color="#0A7764" className="about-card-icon" />
            <h3 className="about-section-title">Sistema Meteorológico</h3>
          </header>
          <p className="about-text">
            Este sistema fue desarrollado por estudiantes y profesores de la UTD para monitorear las condiciones
            climáticas en tiempo real y proporcionar datos históricos para investigación y análisis.
          </p>
        </article>

        <article id="equipo" className={`about-card ${isWeb ? 'about-card-web' : ''}`}>
          <header className="about-card-header">
            <MdGroups size={28} color="#0A7764" className="about-card-icon" />
            <h3 className="about-section-title">Equipo de Desarrollo</h3>
          </header>
          <div className="about-team-list">
            {[
              'Solís Guereca Alina Alecxandra',
              'Sosa Villa Leslie Joselin',
              'Robles Quezada Jacqueline',
              'González Espino Marco Antonio',
              'Delgado Cabrera Miguel Angel',
            ].map((member) => (
              <div className="about-team-member" key={member}>
                <div
                  className="about-member-avatar"
                  aria-label={`Avatar de ${member}`}
                  role="img"
                >
                  {member.split(' ')[0].charAt(0)}
                  {member.split(' ')[1]?.charAt(0) || ''}
                </div>
                <div className="about-member-info">
                  <p className="about-member-name">{member}</p>
                  <p className="about-member-role">Desarrollador</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article id="contacto" className={`about-card ${isWeb ? 'about-card-web' : ''}`}>
  <header className="about-card-header">
    <MdContactMail size={28} color="#0A7764" className="about-card-icon" />
    <h3 className="about-section-title">Contacto</h3>
  </header>
  <div className="about-contact-list">
    <div className="about-contact-description">
      <p className="about-contact-text">
        Estamos disponibles para responder tus consultas sobre el sistema meteorológico. 
        ¡No dudes en ponerte en contacto con nuestro equipo!
      </p>
    </div>
    
    <div className="about-contact-item">
      <MdEmail size={24} color="#0A7764" className="about-contact-icon" />
      <div className="about-contact-content">
        <p className="about-contact-label">Correo Electrónico</p>
        <a
          href="mailto:meteorologia@utd.edu.mx"
          className="about-contact-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          meteorologia@utd.edu.mx
        </a>
        <p className="about-contact-note">
          Respuesta en un plazo máximo de 48 horas hábiles
        </p>
      </div>
    </div>
    
    <div className="about-contact-item">
      <MdPhone size={24} color="#0A7764" className="about-contact-icon" />
      <div className="about-contact-content">
        <p className="about-contact-label">Teléfono</p>
        <a
          href="tel:+526181689465"
          className="about-contact-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          +52 618 168 9465
        </a>
        <div className="about-contact-schedule">
          <p className="about-contact-label">Horario de atención:</p>
          <p className="about-contact-text">Lunes a Viernes: 9:00 AM - 5:00 PM</p>
          <p className="about-contact-text">Sábados: 9:00 AM - 1:00 PM</p>
        </div>
      </div>
    </div>
    
    <div className="about-contact-item">
      <MdLocationOn size={24} color="#0A7764" className="about-contact-icon" />
      <div className="about-contact-content">
        <p className="about-contact-label">Dirección</p>
        <address className="about-contact-text">
          Universidad Tecnológica de Durango<br />
          Gabino Santillán, Durango - Mezquital<br />
          Código Postal: 34308<br />
          Durango, México
        </address>
        
      </div>
    </div>
    
   
  </div>
</article>
    </section>
  </div>
  );
};

export default AboutPage;