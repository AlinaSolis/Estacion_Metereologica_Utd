import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
//import AppRoutes from './routes/AppRoutes';
import AppNavigator from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppNavigator />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
