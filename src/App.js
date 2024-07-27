import './App.css';
import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';
import Comptable from './pages/Comptable';
import EditRubrique from './pages/EditRubrique';
import EditGrandGroupe from './pages/EditGrandGroupe';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="comptabilite" element={<Comptable />} />
      <Route path="comptabilite/editrubrique/:rubriqueId" element={<EditRubrique />} />
      <Route path="comptabilite/editgrandgroupe/:grandGroupeId" element={<EditGrandGroupe />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
