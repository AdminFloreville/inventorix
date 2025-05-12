import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Inventory from './pages/Inventory/Inventory';
import History from './pages/History/History';
import Cameras from './pages/Cameras/Cameras';
import Header from './components/common/Header';
import PrivateRoute from './components/common/PrivateRoute';
import Printers from './pages/Printers/Printers';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Публичные */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Защищённые */}
        <Route element={<PrivateRoute />}>
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/history" element={<History />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/printers" element={<Printers />} />
        </Route>

        {/* Редирект по умолчанию */}
        <Route path="*" element={<Navigate to="/inventory" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
