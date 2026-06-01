import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div style={{ color: 'white', background: 'black', padding: '20px' }}>SNIPR works!</div>} />
    </Routes>
  );
}
