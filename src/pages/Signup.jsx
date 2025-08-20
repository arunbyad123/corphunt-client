import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import { signup } from '../services/authService';
import '../styles/globals.css';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: '', country: '', city: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');

  const change = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    try {
      await signup(form);
      alert("Signup successful! Please login.");
      nav('/login');
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="form-page">
      <AnimatedBackground />
      <Navbar />
      <main className="form-card">
        <h2>Create Your corpHunt Account</h2>
        <p className="helper">Sign up to search & track IT companies.</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit} className="form-grid">
          <div className="row">
            <div>
              <label>Full Name</label>
              <input value={form.name} onChange={e => change('name', e.target.value)} required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => change('email', e.target.value)} required />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Country</label>
              <input value={form.country} onChange={e => change('country', e.target.value)} required />
            </div>
            <div>
              <label>City</label>
              <input value={form.city} onChange={e => change('city', e.target.value)} required />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Password</label>
              <input type="password" value={form.password} onChange={e => change('password', e.target.value)} required />
            </div>
            <div>
              <label>Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={e => change('confirmPassword', e.target.value)} required />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn" type="submit">Create Account</button>
            <Link className="link" to="/login">I Already Have an Account</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
