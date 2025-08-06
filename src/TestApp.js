import React from 'react';

function TestApp() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      minHeight: '100vh',
      color: '#ffffff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🛢️ DRILL BABY DRILL EMPIRE 🛢️</h1>
        <p>Basic React app is working!</p>
      </div>
    </div>
  );
}

export default TestApp;
