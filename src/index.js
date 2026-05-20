import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import LoginScreen from './components/login';
import MainScreen from './components/main';
import { LANG_CONST } from './values/languageConstants';
import { authenticate, getCreds, setCreds, clearCreds, setToken, clearToken } from './api';

const t = LANG_CONST.ru;

// Mock profile fields until /user/{id} is wired up.
const profile = (extras) => ({ name: 'Иван', surname: 'Иванов', lastname: 'Иванович', ...extras });

function App() {
  const [user, setUser]       = React.useState(null);
  const [booting, setBooting] = React.useState(true);

  // Auto-login from saved creds (if any).
  React.useEffect(() => {
    const c = getCreds();
    if (!c) { setBooting(false); return; }
    authenticate(c.login, c.password, c.role)
      .then(({ token: tok }) => {
        setToken(tok);
        setUser(profile({ token: tok, role: c.role, login: c.login }));
      })
      .catch(() => clearCreds())
      .finally(() => setBooting(false));
  }, []);

  const handleLogin = ({ token: tok, role, login, password, remember }) => {
    setToken(tok);
    if (remember) setCreds({ login, password, role });
    else clearCreds();
    setUser(profile({ token: tok, role, login }));
  };

  const handleLogout = () => {
    clearToken();
    clearCreds();
    setUser(null);
  };

  if (booting) return null;

  return user
    ? <MainScreen t={t} user={user} onLogout={handleLogout} />
    : <LoginScreen t={t} onLogin={handleLogin} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);

reportWebVitals();
