import './App.css';
import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';
import Comptable from './pages/Comptable';
import EditRubrique from './pages/EditRubrique';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="comptabilite" element={<Comptable />} />
      <Route path="comptabilite/:rubriqueId" element={<EditRubrique />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
