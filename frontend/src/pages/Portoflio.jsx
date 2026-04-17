import React, { useState, useEffect } from 'react';

const PortofolioFuturistik = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('HOME');

  // Efek buat gerakin background ngikutin mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --- STYLING OBJECTS (Kekuatan JS dalam CSS) ---
  const styles = {
    container: {
      backgroundColor: '#050505',
      color: '#fff',
      minHeight: '100vh',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    // Background interaktif yang lu mau
    glow: {
      position: 'absolute',
      width: '600px',
      height: '600px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(0, 150, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
      top: mousePos.y - 300,
      left: mousePos.x - 300,
      pointerEvents: 'none',
      transition: 'transform 0.1s ease-out',
      zIndex: 1,
    },
    grid: {
      position: 'absolute',
      inset: 0,
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
      backgroundSize: '50px 50px',
      maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
      zIndex: 0,
    },
    card: {
      background: 'rgba(20, 20, 20, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '3rem',
      borderRadius: '40px',
      textAlign: 'center',
      zIndex: 2,
      maxWidth: '600px',
      width: '90%',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
    nav: {
      display: 'flex',
      gap: '20px',
      marginBottom: '2rem',
      justifyContent: 'center',
    },
    navItem: (active) => ({
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '900',
      letterSpacing: '2px',
      color: active ? '#00d4ff' : '#666',
      transition: 'all 0.3s',
      borderBottom: active ? '2px solid #00d4ff' : '2px solid transparent',
      paddingBottom: '5px',
    }),
    title: {
      fontSize: '4rem',
      fontWeight: '900',
      margin: '0',
      background: 'linear-gradient(to right, #fff, #444)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontStyle: 'italic',
      letterSpacing: '-2px',
    },
    status: {
      display: 'inline-block',
      padding: '5px 15px',
      borderRadius: '100px',
      border: '1px solid #00ff88',
      color: '#00ff88',
      fontSize: '10px',
      fontWeight: 'bold',
      marginTop: '1rem',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    }
  };

  return (
    <div style={styles.container}>
      {/* Visual Effects */}
      <div style={styles.grid}></div>
      <div style={styles.glow}></div>

      {/* Main UI */}
      <div style={styles.card}>
        <nav style={styles.nav}>
          {['HOME', 'PROJECTS', 'CONTACT'].map((t) => (
            <div 
              key={t} 
              onClick={() => setActiveTab(t)}
              style={styles.navItem(activeTab === t)}
            >
              {t}
            </div>
          ))}
        </nav>

        {activeTab === 'HOME' && (
          <div className="fade-in">
            <h1 style={styles.title}>HANAN_DEV</h1>
            <p style={{ color: '#888', lineHeight: '1.6', marginTop: '1.5rem' }}>
              Software and Game Developer based in Ende. 
              Crafting immersive digital experiences with modern tech stacks.
            </p>
            <div style={styles.status}>● Available for Internship</div>
          </div>
        )}

        {activeTab === 'PROJECTS' && (
          <div style={{ display: 'grid', gap: '15px', marginTop: '1rem' }}>
            {['Inventory System', 'E-Library', 'Portfolio v1'].map((p) => (
              <div key={p} style={{
                padding: '15px', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '15px',
                border: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'left',
                cursor: 'pointer'
              }}>
                <h4 style={{ margin: 0, fontSize: '14px' }}>{p}</h4>
                <span style={{ fontSize: '10px', color: '#555' }}>VIEW SOURCE CODE _</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'CONTACT' && (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ fontSize: '12px', color: '#888' }}>ESTABLISHED_2026</p>
            <h2 style={{ fontSize: '24px', letterSpacing: '2px' }}>hanan@pplg.dev</h2>
          </div>
        )}
      </div>

      {/* Footer Specs */}
      <div style={{ 
        position: 'absolute', 
        bottom: '30px', 
        fontSize: '10px', 
        color: '#333', 
        fontWeight: 'bold',
        letterSpacing: '5px' 
      }}>
        CORE_V2 / REACT_ENGINE_ONLY
      </div>
    </div>
  );
};

export default PortofolioFuturistik;