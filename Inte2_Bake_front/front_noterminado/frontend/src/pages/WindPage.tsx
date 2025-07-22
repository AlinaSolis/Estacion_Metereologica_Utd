import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Search, Wind, Navigation, Gauge, Download } from 'lucide-react';
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

  const renderDataTable = () => (
    <GenericTable
      title="Resumen de Datos Registrados"
      icon={Wind}
      data={windData}
      columns={[
        { header: 'Fecha y Hora', accessor: (row) => new Date(row.timestamp).toLocaleString('es-ES') },
        { header: 'Vel (km/h)', accessor: (row) => row.velocidad_viento.toFixed(1) },
        { header: 'Dirección', accessor: (row) => degreeToDirection(row.dir_viento) },
        { header: 'Ráfaga', accessor: (row) => row.velocidad_viento_prom.toFixed(1) },
      ]}
    />
  );

  return (
    <div className="container">
      <div className="content">
        <div className="header-container">
          <h1 className="page-title">Datos del Viento</h1>
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
          <div className="date-controls-wrapper">
            <div className="date-controls-grid">
              <div className="date-field">
                <label className="date-field-label">Fecha inicial</label>
                <div className="date-input-wrapper" onClick={(e) => handleOpenPicker(e as any, 'start')}>
                  <Calendar className="date-input-icon" size={20} />
                  <span className="date-input-text">{formatDate(startDate)}</span>
                  <span className="date-input-arrow">▼</span>
                </div>
              </div>

              <div className="date-field">
                <label className="date-field-label">Fecha final</label>
                <div className="date-input-wrapper" onClick={(e) => handleOpenPicker(e as any, 'end')}>
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
            PaperProps={{ style: { marginTop: 8, borderRadius: 12, boxShadow: '0px 8px 32px rgba(0,0,0,0.12)' } }}
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
            <p className="loading-text">Cargando datos del viento...</p>
          </div>
        ) : showResults ? (
          <div className="results-container">
            {renderDataTable()}
          </div>
        ) : (
          <div className="empty-state">
            <Wind className="empty-state-icon" />
            <p className="empty-state-text">
              Selecciona un rango de fechas y presiona "Consultar Datos" para visualizar la información del viento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WindPage;
