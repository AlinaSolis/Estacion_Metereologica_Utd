const BASE_URL = '/api/readings';

export interface Reading {
  id_lectura: number;             
  flujo_energia: number;          
  dir_viento: number;             
  dir_viento_prom: number;        
  velocidad_viento: number;       
  velocidad_viento_prom: number;  
  energia: number;                
  radiacion_solar_prom: number;  
  temp_prom: number;              
  timestamp: string;              
}

export interface ListResponse {
  docs: Reading[];
  total: number;
  page: number;
  pages: number;
}

export async function getReadings(
  page = 1,
  limit = 20,
  startDate?: string,
  endDate?: string
): Promise<ListResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Error al obtener las lecturas');
  }
  return res.json();
}

//obtener lectura mas reciente
export async function getLatestReading(): Promise<Reading> {
  const res = await fetch(`${BASE_URL}/latest`);
  if (!res.ok) {
    throw new Error('Error al obtener la lectura más reciente');
  }
  return res.json();
}

//lectura por id
export async function getReadingById(id: string): Promise<Reading> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error(`Error al obtener la lectura con id ${id}`);
  }
  return res.json();
}

//crear lectura
export async function postReading(data: Omit<Reading, 'id_lectura' | 'timestamp'>, apiKey: string): Promise<Reading> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Error al crear la lectura');
  }
  return res.json();
}

//actualizar lectura
export async function updateReading(id: string, data: Partial<Omit<Reading, 'id_lectura' | 'timestamp'>>, apiKey: string): Promise<Reading> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Error al actualizar la lectura con id ${id}`);
  }
  return res.json();
}

//eliminar lectura
export async function deleteReading(id: string, apiKey: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'x-api-key': apiKey,
    },
  });
  if (!res.ok) {
    throw new Error(`Error al eliminar la lectura con id ${id}`);
  }
}
