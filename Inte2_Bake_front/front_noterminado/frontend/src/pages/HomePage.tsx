import React, { useState, useEffect } from 'react';
import { 
  School, 
  MapPin, 
  Navigation, 
  QrCode, 
  Target, 
  Mountain,
  Thermometer,
  Wind,
  Eye,
  Sun,
  Activity
} from 'lucide-react';

// Importa tus imágenes
import temperaturaImg from './image/tem.jpeg';

import vientoImg from './image/viento.jpeg';
import radiacionImg from './image/radiacion.jpeg';
import estacionImg from './image/IMAG3.jpg';


const HomePage = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sensors = [
    {
      name: 'Temperatura',
      icon: Thermometer,
      description: 'Sensor de temperatura ambiente',
      details: 'Sensor de flujo de calor HFP01-L. El HFP01-L es una placa de flujo de calor utilizada para medir la transferencia de calor a través del suelo.',
      image: temperaturaImg
    },
    {
      name: 'Velocidad del Viento',
      icon: Wind,
      description: 'Anemómetro digital',
      details: 'Anemómetro YOUNG 05103L (4–20 mA). Este sensor combina anemómetro y veleta para medir la velocidad y dirección del viento.',
      image: vientoImg
    },
    {
      name: 'Radiación Solar',
      icon: Sun,
      description: 'Piranómetro',
      details: 'Piranómetro LP02 (Hukseflux). Diseñado para medir la radiación solar en una superficie horizontal.',
      image: radiacionImg
    }
  ];

  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Sistema de Monitoreo Meteorológico UTD</h1>
            <p style={styles.subtitle}>Plataforma de datos climáticos en tiempo real</p>
            <br />
            <p style={styles.description}>
          Ubicado dentro del campus de la Universidad Tecnológica de Durango, este sistema está diseñado para la captura, procesamiento y visualización de datos ambientales en tiempo real. Su principal objetivo es apoyar proyectos de investigación académica, facilitar el análisis de condiciones climáticas locales y ofrecer servicios informativos a la comunidad universitaria y la sociedad en general.

Gracias a su infraestructura de sensores y su conexión a una base de datos activa, el sistema permite el estudio de variables como temperatura, velocidad del viento, radiación solar. Esta herramienta contribuye significativamente al desarrollo de soluciones tecnológicas.
        </p>
          </div>
          <img src={estacionImg} alt="Estación" style={styles.headerImage} />
        </div>
        
      </header>

      {/* Detalles de la estación */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Detalles de la Estación</h2>
        <div style={styles.detailsGrid}>
          <div style={styles.detailCard}>
            <Navigation size={24} color="#0A7764" />
            <span style={styles.detailLabel}>Ubicación</span>
            <span style={styles.detailValue}>Durango – Mezquital, Km. 4.5 Gabino Santillán. C.P. 34308, Durango, Dgo.</span>
          </div>
      
          <div style={styles.detailCard}>
            <Target size={24} color="#0A7764" />
            <span style={styles.detailLabel}>Coordenadas</span>
            <span style={styles.detailValue}>Latitud norte: de 22° 20' a 26° 50'
Longitud oeste: de 102° 28' a 107° 12'</span>
          </div>
          <div style={styles.detailCard}>
            <Mountain size={24} color="#0A7764" />
            <span style={styles.detailLabel}>Altitud</span>
            <span style={styles.detailValue}>1890 m</span>
          </div>
        </div>
      </section>

      {/* Acerca de la estación - Versión mejorada */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Acerca de la Estación</h2>
        <div style={styles.aboutGrid}>
          <div style={styles.aboutCard}>
            <div style={styles.aboutIcon}>
              <School size={32} color="#0A7764" />
            </div>
            <div>
              <h3 style={styles.aboutTitle}>Propósito Académico</h3>
              <p style={styles.aboutText}>
                La estación meteorológica forma parte del programa de investigación de la UTD, 
                proporcionando datos para estudios climáticos, proyectos de ingeniería y 
                formación de estudiantes en ciencias ambientales.
              </p>
            </div>
          </div>
          <div style={styles.aboutCard}>
            <div style={styles.aboutIcon}>
              <Eye size={32} color="#0A7764" />
            </div>
            <div>
              <h3 style={styles.aboutTitle}>Monitoreo Continuo</h3>
              <p style={styles.aboutText}>
                Operación 24/7 con transmisión de datos en tiempo real, almacenamiento 
                histórico y generación de reportes automáticos para análisis meteorológico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sensores instalados - Versión mejorada */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Sensores Instalados</h2>
        <div style={styles.sensorsGrid}>
          {sensors.map((sensor, index) => (
            <div key={index} style={styles.sensorCard}>
              <div style={styles.sensorHeader}>
                <sensor.icon size={24} color="#0A7764" />
                <h3 style={styles.sensorTitle}>{sensor.name}</h3>
              </div>
              <div style={styles.sensorContent}>
                <div style={styles.sensorInfo}>
                  <p style={styles.sensorDescription}>{sensor.description}</p>
                  <p style={styles.sensorDetails}>{sensor.details}</p>
                </div>
                <img src={sensor.image} alt={sensor.name} style={{ ...styles.sensorImage, ...(sensor.name === 'Temperatura' && styles.featuredImage) }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Estilos mejorados
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#F8F9FA'
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '15px',
    gap: '20px'
  },
  title: {
    fontSize: '26px',
    color: '#0A7764',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#5A5A5A',
    margin: 0
  },
  headerImage: {
    width: '920px',
    height: '700px',
    borderRadius: '10px',
    objectFit: 'cover'
  },
  description: {
    fontSize: '15px',
    color: '#5A5A5A',
    lineHeight: '1.6',
    margin: 0
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    fontSize: '22px',
    color: '#0A7764',
    textAlign: 'center',
    margin: '0 0 25px 0'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
  },
  detailCard: {
    backgroundColor: '#F0F4F3',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  detailLabel: {
    fontSize: '14px',
    color: '#5A5A5A',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2C2C2C'
  },
  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px'
  },
  aboutCard: {
    display: 'flex',
    gap: '20px',
    backgroundColor: '#F8F9FA',
    borderRadius: '10px',
    padding: '20px'
  },
  aboutIcon: {
    flexShrink: 0
  },
  aboutTitle: {
    fontSize: '18px',
    color: '#0A7764',
    margin: '0 0 10px 0'
  },
  aboutText: {
    fontSize: '14px',
    color: '#5A5A5A',
    lineHeight: '1.6',
    margin: 0
  },
  sensorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '25px'
  },
  sensorCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
  },
  sensorHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px'
  },
  sensorTitle: {
    fontSize: '18px',
    color: '#0A7764',
    margin: 0
  },
  sensorContent: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sensorInfo: {
    flex: 1
  },
  sensorDescription: {
    fontSize: '14px',
    color: '#5A5A5A',
    fontWeight: '500',
    margin: '0 0 10px 0'
  },
  sensorDetails: {
    fontSize: '13px',
    color: '#5A5A5A',
    lineHeight: '1.5',
    margin: 0
  },
  sensorImage: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  featuredImage: {
    width: '140px',
    height: '140px',
    transition: '0.3s ease'
  }
};

export default HomePage;
