import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import '../styles/navbar.css';
import { getCurrentUser, logout } from '../services/authService';

export default function Navbar({ value, onChange, language, onLanguage }) {
  const nav = useNavigate();
  const user = getCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingCities, setLoadingCities] = useState(false);
  const [citiesCache, setCitiesCache] = useState({}); // cache cities per state

  // Fetch states if user is logged in
  useEffect(() => {
    if (user) {
      axios
        .get('https://api.countrystatecity.in/v1/countries/IN/states', {
          headers: { 'X-CSCAPI-KEY': 'OGhKUXVSenF3Z0JHcXhBZHBGVXA2bFk4d0VFczExVkZaVWcxSTZNaQ==' },
        })
        .then(res => setStates(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  // Fetch or load cities from cache for selected state
  useEffect(() => {
    if (selectedState && user) {
      if (citiesCache[selectedState]) {
        // Load from cache
        setCities(citiesCache[selectedState]);
        setLoadingCities(false);
      } else {
        setLoadingCities(true);
        axios
          .get(`https://api.countrystatecity.in/v1/countries/IN/states/${selectedState}/cities`, {
            headers: { 'X-CSCAPI-KEY': 'OGhKUXVSenF3Z0JHcXhBZHBGVXA2bFk4d0VFczExVkZaVWcxSTZNaQ==' },
          })
          .then(res => {
            setCities(res.data);
            setCitiesCache(prev => ({ ...prev, [selectedState]: res.data })); // cache cities
            setLoadingCities(false);
          })
          .catch(err => {
            console.error(err);
            setCities([]);
            setLoadingCities(false);
          });
      }
    } else {
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedState, user, citiesCache]);

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <header className="navbar">
      <div className="brand" onClick={() => nav('/')} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="corpHunt Logo" style={{ width: '160px', height: '100px' }} />
      </div>

      <div className="nav-center">
        <div className="nav-search">
          <input
            placeholder="Search IT companies..."
            value={value}
            onChange={e => onChange?.(e.target.value)}
          />
          <select value={language} onChange={e => onLanguage?.(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="tl">Telugu</option>
          </select>
          <button className="btn" onClick={() => nav('/')} aria-label="Search">
            Search
          </button>
        </div>
      </div>

      <div className="nav-actions">
        {user && (
          <div className="location-dropdowns">
            <select
              value={selectedState}
              onChange={e => {
                setSelectedState(e.target.value);
                setSelectedCity(''); // reset city when state changes
              }}
              className="state-dropdown"
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.iso2} value={state.iso2}>
                  {state.name}
                </option>
              ))}
            </select>

            {selectedState && (
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="city-dropdown"
                disabled={loadingCities || cities.length === 0}
              >
                {loadingCities ? (
                  <option>Loading cities...</option>
                ) : (
                  <>
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.id || city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            )}
          </div>
        )}

        {user ? (
          <div className="user-dropdown">
            <button className="btn" onClick={() => setMenuOpen(!menuOpen)}>
              {user.name} ▼
            </button>
            {menuOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link className="link" to="/login">
              Login
            </Link>
            <Link className="link" to="/signup">
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
