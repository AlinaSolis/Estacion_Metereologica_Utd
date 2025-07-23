import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, Sun, Zap, Shield, TrendingUp, Download } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Popover } from '@mui/material';
import { es } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import "./CSS/SunPage.css";
import GenericTable from '../components/Table';

interface Reading {
  id_lectura: number;
  temperatura?: number;
  velocidad_viento?: number;
  direccion_viento?: string;
  uv_index?: number;
  radiacion_solar?: number;
  radiacion_solar_prom?: number;
  fecha_hora?: string;
  timestamp?: string;
}

const SunPage = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [currentPicker, setCurrentPicker] = useState<'start' | 'end'>('start');
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [solarData, setSolarData] = useState<Reading[]>([]);

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

  // Función para descargar los datos en Excel
  const downloadExcel = () => {
    const dataToDownload = solarData.length > 0 ? solarData : fallbackSolarData;
    
    if (dataToDownload.length === 0) {
      alert('No hay datos para descargar. Por favor, realice una consulta primero.');
      return;
    }

    // Preparar los datos para Excel
    const data = dataToDownload.map(record => ({
      'Fecha y Hora': new Date(record.timestamp || record.fecha_hora || '').toLocaleString('es-ES'),
      'Radiación Solar (W/m²)': record.radiacion_solar_prom || record.radiacion_solar || 0,
      'Nivel Radiación': getRadiationDescription(record.radiacion_solar_prom || record.radiacion_solar || 0),
      'Recomendación': (record.radiacion_solar_prom || record.radiacion_solar || 0) > 600 ? 'Usar protección' : 'Exposición segura'
    }));

    // Crear hoja de trabajo
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos Solares");
    
    // Generar archivo Excel
    XLSX.writeFile(wb, `datos_solares_${formatQueryDate(startDate)}_${formatQueryDate(endDate)}.xlsx`);
  };

  const getRadiationDescription = (radiation: number) => {
    if (radiation < 200) return 'Baja';
    if (radiation < 600) return 'Moderada';
    if (radiation < 800) return 'Alta';
    return 'Muy Alta';
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

      const allData: Reading[] = response.data.docs;

      //filtrar lecturas que solo tengan de radiacion solar
      const filteredSolar = allData.filter(d => d.radiacion_solar_prom !== undefined);

      //ordenar por fecha ascendiente
      filteredSolar.sort((a, b) => new Date(a.timestamp || '').getTime() - new Date(b.timestamp || '').getTime());

      setSolarData(filteredSolar);
      setShowResults(true);
    } catch (error) {
      console.error('Error cargando datos solares:', error);
      alert('No se pudieron cargar los datos. Intente más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  //Fallback datos simulados si no hay datos reales
  const fallbackSolarData: Reading[] = [
    { id_lectura: 1, radiacion_solar_prom: 50, timestamp: '2025-07-17T06:00:00Z' },
    { id_lectura: 2, radiacion_solar_prom: 200, timestamp: '2025-07-17T08:00:00Z' },
    { id_lectura: 3, radiacion_solar_prom: 500, timestamp: '2025-07-17T10:00:00Z' },
    { id_lectura: 4, radiacion_solar_prom: 850, timestamp: '2025-07-17T12:00:00Z' },
    { id_lectura: 5, radiacion_solar_prom: 920, timestamp: '2025-07-17T14:00:00Z' },
    { id_lectura: 6, radiacion_solar_prom: 650, timestamp: '2025-07-17T16:00:00Z' },
    { id_lectura: 7, radiacion_solar_prom: 300, timestamp: '2025-07-17T18:00:00Z' },
    { id_lectura: 8, radiacion_solar_prom: 80, timestamp: '2025-07-17T20:00:00Z' },
  ];

  const dataToUse = solarData.length > 0 ? solarData : fallbackSolarData;

  const generateSolarData = () => {
    return dataToUse.map(r => ({
      time: new Date(r.timestamp || r.fecha_hora || '').toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      radiacion: r.radiacion_solar_prom || r.radiacion_solar || 0
    }));
  };

  const solarChartData = generateSolarData();

  const renderCurrentData = () => {
    if (dataToUse.length === 0) return null;
    
    const currentSolar = dataToUse[Math.floor(dataToUse.length / 2)];
    const avgRadiation = dataToUse.reduce((sum, s) => sum + (s.radiacion_solar_prom || s.radiacion_solar || 0), 0) / dataToUse.length;
    const maxRadiation = Math.max(...dataToUse.map(s => s.radiacion_solar_prom || s.radiacion_solar || 0));

    return (
      <div className="weather-data-grid fade-in">
        <div className="weather-data-card">
          <Sun className="weather-data-icon" size={32} />
          <div className="weather-data-label">Radiación Actual</div>
          <div className="weather-data-value">{(currentSolar.radiacion_solar_prom || currentSolar.radiacion_solar || 0).toFixed(1)}</div>
          <div className="weather-data-unit">W/m²</div>
          <div className="weather-data-description">
            {getRadiationDescription(currentSolar.radiacion_solar_prom || currentSolar.radiacion_solar || 0)}
          </div>
        </div>

        <div className="weather-data-card">
          <TrendingUp className="weather-data-icon" size={32} />
          <div className="weather-data-label">Promedio</div>
          <div className="weather-data-value">{avgRadiation.toFixed(1)}</div>
          <div className="weather-data-unit">W/m²</div>
          <div className="weather-data-description">Promedio del período</div>
        </div>

        <div className="weather-data-card">
          <Zap className="weather-data-icon" size={32} />
          <div className="weather-data-label">Máxima</div>
          <div className="weather-data-value">{maxRadiation.toFixed(1)}</div>
          <div className="weather-data-unit">W/m²</div>
          <div className="weather-data-description">Radiación máxima registrada</div>
        </div>

        <div className="weather-data-card">
          <Shield className="weather-data-icon" size={32} />
          <div className="weather-data-label">Recomendación</div>
          <div className="weather-data-value" style={{ fontSize: '18px', lineHeight: '1.3' }}>
            {(currentSolar.radiacion_solar_prom || currentSolar.radiacion_solar || 0) > 600 ? 'Usar protección' : 'Exposición segura'}
          </div>
          <div className="weather-data-description">
            {(currentSolar.radiacion_solar_prom || currentSolar.radiacion_solar || 0) > 600 ? 'Protector solar recomendado' : 'Condiciones normales'}
          </div>
        </div>
      </div>
    );
  };

  const renderChart = () => (
    <div className="weather-chart-container slide-up">
      <h3 className="weather-chart-title">Radiación Solar (W/m²)</h3>
      <div className="weather-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={solarChartData}
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
                borderColor: '#d28c0c',
                borderRadius: '8px',
                color: '#ffffff'
              }}
            />
            <Line
              type="monotone"
              dataKey="radiacion"
              stroke="#d28c0c"
              strokeWidth={3}
              dot={{
                fill: '#d28c0c',
                strokeWidth: 2,
                stroke: '#fff',
                r: 6,
              }}
              activeDot={{
                r: 8,
                stroke: '#d28c0c',
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
      title="Resumen de Radiación Solar"
      data={dataToUse}
      columns={[
        {
          header: 'Fecha y Hora',
          accessor: (row) => new Date(row.timestamp || row.fecha_hora || '').toLocaleString('es-ES'),
        },
        {
          header: 'Radiación Solar (W/m²)',
          accessor: (row) => (row.radiacion_solar_prom || row.radiacion_solar || 0).toFixed(1),
        },
        {
          header: 'Nivel',
          accessor: (row) => getRadiationDescription(row.radiacion_solar_prom || row.radiacion_solar || 0),
        },
      ]}
      emptyIcon={<Sun className="weather-table-empty-icon" />}
      emptyMessage="Los datos se cargarán aquí después de procesar la consulta."
    />
  );

  return (
    <div className="weather-container">
      <div className="weather-content">
        <div className="weather-header-container">
          <h1 className="weather-page-title">Radiación Solar</h1>
          <button 
            className="download-button"
            onClick={downloadExcel}
            disabled={dataToUse.length === 0}
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
              Selecciona las fechas y presiona "Consultar Datos" para ver la información de radiación solar
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
                boxShadow: '0px 8px 32px rgba(0,0,0,0.12)',
              },
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
            <p className="weather-loading-text">Cargando datos de radiación solar...</p>
          </div>
        ) : showResults ? (
          <div className="weather-results-container">
            {renderCurrentData()}
            {renderChart()}
            {renderDataTable()}
          </div>
        ) : (
          <div className="weather-empty-state">
            <Sun className="weather-empty-icon" />
            <p className="weather-empty-text">
              Selecciona un rango de fechas y presiona "Consultar Datos" para visualizar la información de radiación solar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SunPage;