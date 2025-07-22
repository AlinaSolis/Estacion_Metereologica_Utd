import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import './CSS/SensorsPage.css';
import {
  MdMenu,
  MdDeviceThermostat,
  MdAir,
  MdWbSunny,
  MdSensors,
  MdCheckCircle,
  MdError,
} from 'react-icons/md';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Sensor {
  id: number;
  nombre: string;
  modelo: string;
  type: string;
  parametros: string;
  precision_sensor: string;
  voltaje: string;
  lastReading: string;
  lastUpdate: string;
  activo: boolean;
}

const SensorsPage: React.FC = () => {
  const { token, isLoggedIn } = useAuth();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [error, setError] = useState<string | null>(null);

  const iconMap: Record<string, JSX.Element> = {
    temperature: <MdDeviceThermostat size={28} color="#D78909" />,
    wind: <MdAir size={28} color="#0A7764" />,
    solar: <MdWbSunny size={28} color="#F39C12" />,
  };

  const colorMap: Record<string, string> = {
    temperature: '#D78909',
    wind: '#0A7764',
    solar: '#F39C12',
  };

  const fetchSensors = async () => {
    if (!token) {
      setError('No autorizado: Falta token de autenticación');
      return;
    }
    try {
      const res = await axios.get('http://localhost:4000/api/sensores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredSensors = res.data.filter((s: Sensor) =>
        ['temperature', 'wind', 'solar'].includes(s.type)
      );
      setSensors(filteredSensors);
      setError(null);
    } catch (err: any) {
      console.error('Error al obtener sensores', err);
      setError('Error al obtener sensores');
    }
  };

  const toggleSensor = async (id: number, activo: boolean) => {
    const confirmMsg = activo
      ? '¿Estás seguro de que quieres desactivar este sensor?'
      : '¿Estás seguro de que quieres activar este sensor?';

    const confirmed = await Swal.fire({
      title: 'Confirmar acción',
      text: confirmMsg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    });

    if (!confirmed) return;

    if (!token) {
      setError('No autorizado: Falta token de autenticación');
      return;
    }
    try {
      await axios.put(`http://localhost:4000/api/sensores/${id}/toggle`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSensors();
    } catch (err) {
      console.error('Error al cambiar estado del sensor', err);
      setError('Error al cambiar estado del sensor');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchSensors();
    }
  }, [isLoggedIn, token]);

  if (!isLoggedIn)
    return (
      <p style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
        Acceso denegado. Por favor inicia sesión.
      </p>
    );

  return (
    <div className="container">
      <header className="header">
        <button className="menuButton" onClick={() => Swal.fire('Abrir menú')}>
          <MdMenu size={28} color="#FFFFFF" />
        </button>
        <h1 className="title">Sensores IoT</h1>
      </header>

      <main className="scrollContainer">
        <section className="content">
          <div className="summaryCard">
            <h2 className="sectionTitle">Resumen del Sistema</h2>
            <div className="summaryGrid">
              <div className="summaryItem">
                <MdSensors size={24} color="#0A7764" />
                <p className="summaryNumber">{sensors.length}</p>
                <p className="summaryLabel">Sensores</p>
              </div>
              <div className="summaryItem">
                <MdCheckCircle size={24} color="#2ECC71" />
                <p className="summaryNumber success">{sensors.filter(s => s.activo).length}</p>
                <p className="summaryLabel">Activos</p>
              </div>
              <div className="summaryItem">
                <MdError size={24} color="#E74C3C" />
                <p className="summaryNumber error">{sensors.filter(s => !s.activo).length}</p>
                <p className="summaryLabel">Inactivos</p>
              </div>
            </div>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {sensors.map(sensor => {
            const icon = iconMap[sensor.type] || <MdSensors size={28} />;
            const color = colorMap[sensor.type] || '#666';

            return (
              <div
                key={sensor.id}
                className="card"
                style={{
                  borderLeft: `4px solid ${color}`,
                  backgroundColor: sensor.activo ? '#FDFDFD' : '#F5F5F5'
                }}
              >
                <div className="sensorHeader">
                  {icon}
                  <div className="sensorTitleContainer">
                    <p className="sensorName" style={{ color }}>{sensor.nombre}</p>
                    <p className="sensorModel">{sensor.modelo}</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={sensor.activo}
                      onChange={() => toggleSensor(sensor.id, sensor.activo)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="sensorDetails">
                  <div className="detailRow">
                    <span className="detailLabel">Parámetros:</span>
                    <span className="detailValue">{sensor.parametros}</span>
                  </div>
                  <div className="detailRow">
                    <span className="detailLabel">Precisión:</span>
                    <span className="detailValue">{sensor.precision_sensor}</span>
                  </div>
                  <div className="detailRow">
                    <span className="detailLabel">Voltaje:</span>
                    <span className="detailValue">{sensor.voltaje}</span>
                  </div>
                  <div className="detailRow">
                    <span className="detailLabel">Última lectura:</span>
                    <span className="detailValue bold" style={{ color }}>
                      {sensor.lastReading}
                    </span>
                  </div>
                  <div className="detailRow">
                    <span className="detailLabel">Estado:</span>
                    <div
                      className="statusBadge"
                      style={{
                        backgroundColor: sensor.activo ? '#2ECC71' : '#E74C3C'
                      }}
                    >
                      <span className="statusText">
                        {sensor.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default SensorsPage;
