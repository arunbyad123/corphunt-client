import { useState } from "react";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import { getCurrentUser } from "../services/authService";
import "../styles/globals.css";

export default function Home() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("en");
  const user = getCurrentUser();

  return (
    <div style={{ minHeight: "100vh" }}>
      <AnimatedBackground />
      <Navbar value={query} onChange={setQuery} language={lang} onLanguage={setLang} />

      <main className="container" style={{ paddingTop: "84px", paddingBottom: "60px" }}>
        {user && (
          <h2 className="welcome-message">
            Welcome, {user.name}!

          </h2>
        )}

        <h1 className="hero">Search for IT Companies</h1>

        <div className="search-wrap">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a company, tech stack, or city…"
          />
          <button className="btn">Search</button>
        </div>

        <section style={{ marginTop: '2rem' }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,.12)',
            padding: '1rem',
            borderRadius: '14px'
          }}>
            <strong>Searching:</strong> {query || '—'}
          </div>
        </section>
      </main>
    </div>
  );
}
