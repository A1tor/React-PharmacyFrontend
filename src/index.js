import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import LoginScreen from './components/login';
import MainScreen from './components/main';
import { LANG_CONST } from './values/languageConstants';
import { getAuth, setAuth, clearAuth } from './api';

const t = LANG_CONST.ru;

function App() {
  const [user, setUser] = React.useState(() => getAuth());

  const handleLogin = ({ token, role, login, remember }) => {
    // Mock profile fields until /user/{id} is wired up.
    const u = { token, role, login, name: 'Иван', surname: 'Иванов', lastname: 'Иванович' };
    setAuth(u, remember);
    setUser(u);
  };

  const handleLogout = () => { clearAuth(); setUser(null); };

  return user
    ? <MainScreen t={t} user={user} onLogout={handleLogout} />
    : <LoginScreen t={t} onLogin={handleLogin} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);

reportWebVitals();
