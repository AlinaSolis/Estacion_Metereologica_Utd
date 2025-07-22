import React from 'react';
import '../pages/CSS/TemperaturePage.css'; // Puedes renombrar este CSS a "GenericTable.css" si lo vas a reutilizar

interface GenericTableProps<T> {
  data: T[];
  columns: { header: string; accessor: (item: T) => React.ReactNode }[];
  emptyIcon?: React.ReactNode;
  emptyMessage?: string;
  title?: string;
}

function GenericTable<T>({
  data,
  columns,
  emptyIcon,
  emptyMessage = 'No hay datos disponibles.',
  title = 'Tabla de Datos',
}: GenericTableProps<T>) {
  return (
    <div className="weather-table-container slide-up">
      <div className="weather-table-header">
        <h3 className="weather-table-title">{title}</h3>
      </div>

      <div className="weather-table-columns">
        {columns.map((col, index) => (
          <div key={index} className="weather-table-column">
            {col.header}
          </div>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="weather-table-empty">
          {emptyIcon}
          <p className="weather-table-empty-text">{emptyMessage}</p>
        </div>
      ) : (
        data.map((item, rowIndex) => (
          <div key={rowIndex} className="weather-table-row">
            {columns.map((col, colIndex) => (
              <div key={colIndex} className="weather-table-cell">
                {col.accessor(item)}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default GenericTable;
