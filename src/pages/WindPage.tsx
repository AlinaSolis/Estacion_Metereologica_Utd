import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, Wind, Navigation, Gauge, Download, TrendingUp } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Popover } from '@mui/material';
import { es } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import GenericTable from '../components/Table';
import './CSS/WindPage.css';

interface WindDataRecord {
  id_lectura: number;
  velocidad_viento: number;
  dir_viento: number;
  velocidad_viento_prom: number;
  timestamp: string;
}

const WindPage = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [currentPicker, setCurrentPicker] = useState<'start' | 'end'>('start');
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [windData, setWindData] = useState<WindDataRecord[]>([]);

  // Auto-abrir calendario al cargar el componente
  useEffect(() => {
    const timer = setTimeout(() => {
      const startButton = document.querySelector('[data-picker="start"]') as HTMLButtonElement;
      if (startButton) {
        handleOpenPicker({ currentTarget: startButton } as any, 'start');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenPicker = (event: React.MouseEvent<HTMLButtonElement>, pickerType: 'start' | 'end') => {
    setCurrentPicker(pickerType);
    setAnchorEl(event.currentTarget);
  };

  const handleClosePicker = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? 'date-picker-popover' : undefined;

  const formatDate = (date: Date) =>
    date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatQueryDate = (date: Date) => date.toISOString().slice(0, 10);

  const downloadExcel = () => {
    if (windData.length === 0) {
      alert('No hay datos para descargar. Por favor, realice una consulta primero.');
      return;
    }

    const data = windData.map(record => ({
      'Fecha y Hora': new Date(record.timestamp).toLocaleString('es-ES'),
      'Velocidad (km/h)': record.velocidad_viento.toFixed(1),
      'Dirección': degreeToDirection(record.dir_viento),
      'Ráfaga (km/h)': record.velocidad_viento_prom.toFixed(1),
      'Descripción': getWindDescription(record.velocidad_viento)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos del Viento");
    XLSX.writeFile(wb, `datos_viento_${formatQueryDate(startDate)}_${formatQueryDate(endDate)}.xlsx`);
  };

  const degreeToDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const getWindDescription = (speed: number) => {
    if (speed < 6) return 'Calma';
    if (speed < 12) return 'Brisa ligera';
    if (speed < 20) return 'Brisa moderada';
    if (speed < 29) return 'Brisa fuerte';
    return 'Viento fuerte';
  };

  const handleSearch = async () => {
    if (startDate > endDate) {
      alert('Error: La fecha final debe ser posterior o igual a la fecha inicial.');
      return;
    }

    setIsLoading(true);
    setShowResults(false);

    try {
      const response = await axios.get('/api/readings', {
        params: {
          start: formatQueryDate(startDate),
          end: formatQueryDate(endDate),
        },
      });

      const data = response.data.docs;
      data.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      setWindData(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error cargando datos del viento:', error);
      alert('No se pudieron cargar los datos. Intente más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateWindData = () => {
    return windData.map(r => ({
      time: new Date(r.timestamp).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      velocidad: r.velocidad_viento,
      direccion: r.dir_viento
    }));
  };

  const windChartData = generateWindData();

  const renderCurrentData = () => {
    if (windData.length === 0) return null;
    
    const currentWind = windData[Math.floor(windData.length / 2)];
    const avgSpeed = windData.reduce((sum, w) => sum + w.velocidad_viento, 0) / windData.length;
    const maxSpeed = Math.max(...windData.map(w => w.velocidad_viento));

    return (
      <div className="weather-data-grid fade-in">
        <div className="weather-data-card">
          <Wind className="weather-data-icon" size={32} />
          <div className="weather-data-label">Velocidad Actual</div>
          <div className="weather-data-value">{currentWind.velocidad_viento.toFixed(1)}</div>
          <div className="weather-data-unit">km/h</div>
          <div className="weather-data-description">
            {getWindDescription(currentWind.velocidad_viento)}
          </div>
        </div>

        <div className="weather-data-card">
          <Navigation className="weather-data-icon" size={32} />
          <div className="weather-data-label">Dirección</div>
          <div className="weather-data-value">{degreeToDirection(currentWind.dir_viento)}</div>
          <div className="weather-data-unit">{currentWind.dir_viento.toFixed(0)}°</div>
          <div className="weather-data-description">Dirección del viento</div>
        </div>

        <div className="weather-data-card">
          <Gauge className="weather-data-icon" size={32} />
          <div className="weather-data-label">Velocidad Promedio</div>
          <div className="weather-data-value">{avgSpeed.toFixed(1)}</div>
          <div className="weather-data-unit">km/h</div>
          <div className="weather-data-description">Promedio del período</div>
        </div>

        <div className="weather-data-card">
          <TrendingUp className="weather-data-icon" size={32} />
          <div className="weather-data-label">Ráfaga Máxima</div>
          <div className="weather-data-value">{maxSpeed.toFixed(1)}</div>
          <div className="weather-data-unit">km/h</div>
          <div className="weather-data-description">Velocidad máxima registrada</div>
        </div>
      </div>
    );
  };

  const renderChart = () => (
    <div className="weather-chart-container slide-up">
      <h3 className="weather-chart-title">Velocidad del Viento (km/h)</h3>
      <div className="weather-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={windChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              stroke="#7f8c8d"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#7f8c8d"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2c3e50',
                borderColor: '#27ae60',
                borderRadius: '8px',
                color: '#ffffff'
              }}
            />
            <Line
              type="monotone"
              dataKey="velocidad"
              stroke="#27ae60"
              strokeWidth={3}
              dot={{
                fill: '#27ae60',
                strokeWidth: 2,
                stroke: '#fff',
                r: 6,
              }}
              activeDot={{
                r: 8,
                stroke: '#27ae60',
                strokeWidth: 2,
                fill: '#fff',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderDataTable = () => (
    <GenericTable
      title="Resumen de Datos del Viento"
      data={windData}
      columns={[
        {
          header: 'Fecha y Hora',
          accessor: (row) => new Date(row.timestamp).toLocaleString('es-ES'),
        },
        {
          header: 'Velocidad (km/h)',
          accessor: (row) => row.velocidad_viento.toFixed(1),
        },
        {
          header: 'Dirección',
          accessor: (row) => degreeToDirection(row.dir_viento),
        },
        {
          header: 'Ráfaga (km/h)',
          accessor: (row) => row.velocidad_viento_prom.toFixed(1),
        },
      ]}
      emptyIcon={<Wind className="weather-table-empty-icon" />}
      emptyMessage="Los datos se cargarán aquí después de procesar la consulta."
    />
  );

  return (
    <div className="weather-container">
      <div className="weather-content">
        <div className="weather-header-container">
          <h1 className="weather-page-title">Datos del Viento</h1>
          <button 
            className="download-button"
            onClick={downloadExcel}
            disabled={windData.length === 0}
          >
            <Download size={18} />
            Descargar Excel
          </button>
        </div>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <div className="weather-controls-wrapper">
            <div className="weather-controls-grid">
              <div className="weather-date-field">
                <label className="weather-date-label">Fecha inicial</label>
                <div
                  className="weather-date-input"
                  data-picker="start"
                  onClick={(e) => handleOpenPicker(e as any, 'start')}
                >
                  <Calendar className="weather-date-icon" size={20} />
                  <span className="weather-date-text">{formatDate(startDate)}</span>
                  <span className="weather-date-arrow">▼</span>
                </div>
              </div>

              <div className="weather-date-field">
                <label className="weather-date-label">Fecha final</label>
                <div
                  className="weather-date-input"
                  onClick={(e) => handleOpenPicker(e as any, 'end')}
                >
                  <Calendar className="weather-date-icon" size={20} />
                  <span className="weather-date-text">{formatDate(endDate)}</span>
                  <span className="weather-date-arrow">▼</span>
                </div>
              </div>
            </div>

            <button
              className="weather-search-button"
              onClick={handleSearch}
              disabled={isLoading}
            >
              <Search className="weather-search-icon" size={20} />
              {isLoading ? 'Consultando...' : 'Consultar Datos'}
            </button>

            <p className="weather-instruction-text">
              Selecciona las fechas y presiona "Consultar Datos" para ver la información del viento
            </p>
          </div>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePicker}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              style: {
                marginTop: 8,
                borderRadius: 12,
                boxShadow: '0px 8px 32px rgba(0,0,0,0.12)'
              }
            }}
          >
            <DatePicker
              value={currentPicker === 'start' ? startDate : endDate}
              onChange={(newValue) => {
                if (newValue) {
                  if (currentPicker === 'start') {
                    setStartDate(newValue);
                    if (endDate < newValue) setEndDate(newValue);
                  } else {
                    setEndDate(newValue);
                  }
                }
                handleClosePicker();
              }}
              maxDate={new Date()}
              minDate={currentPicker === 'end' ? startDate : undefined}
              disableFuture
            />
          </Popover>
        </LocalizationProvider>

        {isLoading ? (
          <div className="weather-loading-state">
            <div className="weather-loading-spinner"></div>
            <p className="weather-loading-text">Cargando datos del viento...</p>
          </div>
        ) : showResults ? (
          <div className="weather-results-container">
            {renderCurrentData()}
            {renderChart()}
            {renderDataTable()}
          </div>
        ) : (
          <div className="weather-empty-state">
            <Wind className="weather-empty-icon" />
            <p className="weather-empty-text">
              Selecciona un rango de fechas y presiona "Consultar Datos" para visualizar la información del viento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WindPage;