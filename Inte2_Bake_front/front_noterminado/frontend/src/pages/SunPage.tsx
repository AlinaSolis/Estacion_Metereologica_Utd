import React, { useState } from 'react';
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
  fecha_hora: string;
}

const SunPage = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [currentPicker, setCurrentPicker] = useState<'start' | 'end'>('start');
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [solarData, setSolarData] = useState<Reading[]>([]);

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
      'Fecha y Hora': new Date(record.fecha_hora).toLocaleString('es-ES'),
      'Índice UV': record.uv_index,
      'Nivel UV': getUVDescription(record.uv_index || 0),
      'Radiación Solar (W/m²)': record.radiacion_solar,
      'Nivel Radiación': getRadiationDescription(record.radiacion_solar || 0),
      'Recomendación': (record.uv_index || 0) > 6 ? 'Usar protección' : 'Exposición segura'
    }));

    // Crear hoja de trabajo
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos Solares");
    
    // Generar archivo Excel
    XLSX.writeFile(wb, `datos_solares_${formatQueryDate(startDate)}_${formatQueryDate(endDate)}.xlsx`);
  };

  const getUVDescription = (uv: number) => {
    if (uv < 3) return 'Bajo';
    if (uv < 6) return 'Moderado';
    if (uv < 8) return 'Alto';
    if (uv < 11) return 'Muy Alto';
    return 'Extremo';
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
      const filteredSolar = allData.filter(d => d.uv_index !== undefined && d.radiacion_solar !== undefined);

      //ordenar por fecha ascendiente
      filteredSolar.sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime());

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
    { id_lectura: 1, uv_index: 1, radiacion_solar: 50, fecha_hora: '2025-07-17T06:00:00Z' },
    { id_lectura: 2, uv_index: 3, radiacion_solar: 200, fecha_hora: '2025-07-17T08:00:00Z' },
    { id_lectura: 3, uv_index: 6, radiacion_solar: 500, fecha_hora: '2025-07-17T10:00:00Z' },
    { id_lectura: 4, uv_index: 9, radiacion_solar: 850, fecha_hora: '2025-07-17T12:00:00Z' },
    { id_lectura: 5, uv_index: 10, radiacion_solar: 920, fecha_hora: '2025-07-17T14:00:00Z' },
    { id_lectura: 6, uv_index: 7, radiacion_solar: 650, fecha_hora: '2025-07-17T16:00:00Z' },
    { id_lectura: 7, uv_index: 4, radiacion_solar: 300, fecha_hora: '2025-07-17T18:00:00Z' },
    { id_lectura: 8, uv_index: 1, radiacion_solar: 80, fecha_hora: '2025-07-17T20:00:00Z' },
  ];

  const dataToUse = solarData.length > 0 ? solarData : fallbackSolarData;
  const currentSolar = dataToUse[Math.floor(dataToUse.length / 2)];

  const renderCurrentData = () => (
    <div className="current-data-grid fade-in">
      <div className="current-data-card">
        <Sun className="current-data-icon" size={32} />
        <div className="current-data-label">Índice UV</div>
        <div className="uv-meter">
          <div className="uv-meter-inner">
            <div className="uv-value">{currentSolar.uv_index}</div>
            <div className="uv-label">UV</div>
          </div>
        </div>
        <div className="current-data-description">
          {getUVDescription(currentSolar.uv_index || 0)}
        </div>
      </div>

      <div className="current-data-card">
        <Zap className="current-data-icon" size={32} />
        <div className="current-data-label">Radiación Solar</div>
        <div className="current-data-value">{currentSolar.radiacion_solar}</div>
        <div className="current-data-unit">W/m²</div>
        <div className="current-data-description">
          {getRadiationDescription(currentSolar.radiacion_solar || 0)}
        </div>
      </div>

      <div className="current-data-card">
        <Shield className="current-data-icon" size={32} />
        <div className="current-data-label">Recomendación</div>
        <div className="current-data-value" style={{ fontSize: '18px', lineHeight: '1.3' }}>
          {(currentSolar.uv_index || 0) > 6 ? 'Usar protección' : 'Exposición segura'}
        </div>
        <div className="current-data-description">
          {(currentSolar.uv_index || 0) > 6 ? 'Protector solar recomendado' : 'Condiciones normales'}
        </div>
      </div>
    </div>
  );

  const renderChart = () => (
    <div className="chart-container slide-up">
      <h3 className="chart-title">Índice UV</h3>
      <div className="chart-wrapper" style={{ height: 100 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dataToUse.map(d => ({
              time: new Date(d.fecha_hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              uv: d.uv_index,
            }))}
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
                backgroundColor: '#fff',
                border: '1px solid #d28c0c',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="uv"
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
      className="data-table fade-in"
      title="Datos de Radiación Solar"
      icon={Sun}
      data={dataToUse}
      columns={[
        { header: 'Fecha y Hora', accessor: (row: { fecha_hora: string | number | Date; }) => new Date(row.fecha_hora).toLocaleString('es-ES') },
        { header: 'Índice UV', accessor: (row: Reading) => row.uv_index !== undefined ? row.uv_index.toFixed(1) : 'N/A' },
          { header: 'Radiación Solar (W/m²)', accessor: (row: Reading) => row.radiacion_solar !== undefined ? row.radiacion_solar.toFixed(1) : 'N/A' },
         ]}
    />
  );

  return (
    <div className="container">
      <div className="content">
        <div className="header-container">
          <h1 className="page-title">Radiación Solar</h1>
          <button 
            className="download-button"
            onClick={downloadExcel}
            disabled={solarData.length === 0}
          >
            <Download size={18} />
            Descargar Excel
          </button>
        </div>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <div className="date-controls-wrapper">
            <div className="date-controls-grid">
              <div className="date-field">
                <label className="date-field-label">Fecha inicial</label>
                <div
                  className="date-input-wrapper"
                  onClick={(e) => handleOpenPicker(e as any, 'start')}
                >
                  <Calendar className="date-input-icon" size={20} />
                  <span className="date-input-text">{formatDate(startDate)}</span>
                  <span className="date-input-arrow">▼</span>
                </div>
              </div>

              <div className="date-field">
                <label className="date-field-label">Fecha final</label>
                <div
                  className="date-input-wrapper"
                  onClick={(e) => handleOpenPicker(e as any, 'end')}
                >
                  <Calendar className="date-input-icon" size={20} />
                  <span className="date-input-text">{formatDate(endDate)}</span>
                  <span className="date-input-arrow">▼</span>
                </div>
              </div>
            </div>

            <button className="search-button" onClick={handleSearch} disabled={isLoading}>
              <Search className="search-icon" size={20} />
              {isLoading ? 'Consultando...' : 'Consultar Datos'}
            </button>
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
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">Cargando datos de radiación solar...</p>
          </div>
        ) : showResults ? (
          <div className="results-container">
            {/* {renderCurrentData()} */}
            {renderChart()}
            {renderDataTable()}
          </div>
        ) : (
          <div className="empty-state">
            <Sun className="empty-state-icon" />
            <p className="empty-state-text">
              Selecciona un rango de fechas y presiona "Consultar Datos" para visualizar la información de radiación solar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SunPage;