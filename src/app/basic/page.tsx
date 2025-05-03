export default function BasicPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#111',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Basic Test Page</h1>
        <p>This page has no client-side functionality.</p>
        <p>It's a test to verify basic Next.js functionality.</p>
      </div>
    </div>
  );
} 