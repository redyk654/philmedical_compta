import './App.css';
import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';
import Comptable from './pages/Comptable';
import EditRubrique from './pages/EditRubrique';
import EditGrandGroupe from './pages/EditGrandGroupe';
import NavbarLayout from './layouts/NavbarLayout';
import { pathsOfUrls } from './shared/constants/constants';
import Prescripteurs from './pages/Prescripteurs';
import Prestataires from './pages/Prestataires';
import DetailsPrescripteur from './pages/DetailsPrescripteur';

function App() {
  return (
    <Routes>
      <Route path="/philmedical/compta/signin" element={<SignIn />} />
      <Route path={`${pathsOfUrls.layoutNavBar}`}element={<NavbarLayout />}>
        <Route path={`${pathsOfUrls.comptable}`} element={<Comptable />} />
        <Route path={`${pathsOfUrls.editRubrique}`} element={<EditRubrique />} />
        <Route path={`${pathsOfUrls.editGrandGroupe}`} element={<EditGrandGroupe />} />
        <Route path={`${pathsOfUrls.prescripteurs}`} element={<Prescripteurs />} />
        <Route path={`${pathsOfUrls.prescripteurs}/${pathsOfUrls.detailsPrescriber}`} element={<DetailsPrescripteur />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
