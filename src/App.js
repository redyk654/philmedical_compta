import './App.css';
import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';
import Comptable from './pages/Comptable';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="comptable" element={<Comptable />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
