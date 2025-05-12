// src/components/common/Header.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores/authStore';

const Header = observer(() => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded hover:bg-blue-600 hover:text-white ${
      isActive ? 'bg-blue-500 text-white' : 'text-blue-700'
    }`;

  return (
    <header className="bg-white border-b shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-700">Inventorix</h1>
      {authStore.isAuthenticated && (
        <nav className="flex gap-4 items-center">
          <NavLink to="/inventory" className={linkClass}>
            Инвентарь
          </NavLink>
          <NavLink to="/history" className={linkClass}>
            История
          </NavLink>
          <NavLink to="/cameras" className={linkClass}>
            Камеры
          </NavLink>
          <NavLink to="/printers" className={linkClass}>
            Принтеры
          </NavLink>
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Выйти
          </button>
        </nav>
      )}
    </header>
  );
});

export default Header;
