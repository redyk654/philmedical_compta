import React, { useCallback, useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Box, Container, Drawer } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DrawerList from '../components/Comptable/DrawerList';
import TopBar from '../components/Comptable/TopBar';
import CustomTitle from '../shared/components/CustomTitle';
import CustomTitleH2 from '../shared/components/CustomTitleH2';
import ModalRubrique from '../components/Comptable/ModalRubrique';
import { dnsPath } from '../shared/constants/constants';
import { postRequest } from '../apis/postRequests';
import CustomizedLoader from '../shared/components/CustomizedLoader';
import PeriodForm from '../components/Comptable/PeriodForm';
import RubriqueTable from '../components/Comptable/RubriqueTable';
import { CustomContext } from '../shared/contexts/CustomContext';

export default function Comptable() {

    const { dateDebut,
            handleDateDebut,
            dateFin,
            handleDateFin,
            heureDebut,
            handleHeureDebut,
            heureFin,
            handleHeureFin
        } = useContext(CustomContext);

    // const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [designationRubrique, setDesignationRubrique] = useState('')
    const [isModal, setIsModal] = useState(false);
    const [isHandlingSubmit, setIsHandlingSubmit] = useState(false);
    const [rubriques, setRubriques] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isModalGrandGroupe, setIsModalGrandGroupe] = useState(false);

    const handleOpenModalGrandGroupe = () => setIsModalGrandGroupe(true);

    const handleCloseModalGrandGroupe = () => {
        setIsModalGrandGroupe(false);
        setIsHandlingSubmit(false);
        setDesignationRubrique('');
    }

    const handleOpenModal = () => setIsModal(true);

    const handleCloseModal = () => {
        setIsModal(false);
        setIsHandlingSubmit(false);
        setDesignationRubrique('');
    }

    const handleChangeRubrique = (e) => {
        setDesignationRubrique(e.target.value)
    }

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const fetchAmountRubrique = useCallback(async () => {
        setIsLoadingData(true)
        const debut = dateDebut + ' ' + heureDebut;
        const fin = dateFin + ' ' + heureFin;
        const data = {
            debut: debut,
            fin: fin
        }
        const url = `${dnsPath}gestion_rubriques.php?montant_rubriques`;
        try {
            const response = await postRequest(url, data);
            if (response) {
                setRubriques(response);
                setIsLoadingData(false);
            }
        } catch (error) {
            console.error("erreur lors de la recupération des rubrique", error)
        }
    }, [dateDebut, dateFin, heureDebut, heureFin])

    useEffect(() => {
        
        if (dateDebut && heureDebut && dateFin && heureFin)
            fetchAmountRubrique();

    }, [dateDebut, dateFin, heureDebut, heureFin, fetchAmountRubrique])

    const ajouterNouvelleRubrique = async (e) => {
        e.preventDefault();
        setIsHandlingSubmit(true);
        // Ajouter la rubrique
        const url = `${dnsPath}gestion_rubriques.php?add_rubrique`;
        const data = {
            designation: designationRubrique
        }
        try {
            const res = await postRequest(url, data);
            if (res.message === 'success') {
                console.log("Rubrique ajoutée avec succès");
            }
            fetchAmountRubrique();
            handleCloseModal();
        } catch (error) {
            console.error("Erreur lors de l'ajout de la rubrique", error);
        }
    }

    const ajouterNouveauGrandGroupe = async (e) => {
        e.preventDefault();
        setIsHandlingSubmit(true);
        // Ajouter le grand groupe
        const url = `${dnsPath}gestion_rubriques.php?add_grand_groupe`;
        const data = {
            designation: designationRubrique
        }
        try {
            const res = await postRequest(url, data);
            if (res.message === 'success') {
                console.log("Grand groupe ajouté avec succès");
            }
            handleCloseModalGrandGroupe();
        } catch (error) {
            console.error("Erreur lors de l'ajout du grand groupe", error);
        }
    }
    
    return (
        <Box sx={{ padding: 0 }}>
            <TopBar toggleDrawer={toggleDrawer} />
            <Container>
                <CustomTitle text='Comptabilité' />
                <PeriodForm
                    dateDebut={dateDebut}
                    dateFin={dateFin}
                    heureDebut={heureDebut}
                    heureFin={heureFin}
                    handleDateDebut={handleDateDebut}
                    handleDateFin={handleDateFin}
                    handleHeureDebut={handleHeureDebut}
                    handleHeureFin={handleHeureFin}
                />
                <CustomTitleH2>
                    Rubrique
                    <AddCircleIcon
                        onClick={handleOpenModal}
                        role="button"
                        fontSize='medium'
                    />
                </CustomTitleH2>
                {isLoadingData ? (
                    <CustomizedLoader />
                ) : (
                    <RubriqueTable rubriques={rubriques} />
                )}
                <CustomTitleH2>
                    Grand Groupe
                    <AddCircleIcon
                        onClick={handleOpenModalGrandGroupe}
                        role="button"
                        fontSize='medium'
                    />
                </CustomTitleH2>
            </Container>
            <ModalRubrique
                title="Ajouter une rubrique"
                isModal={isModal}
                handleCloseModal={handleCloseModal}
                designationRubrique={designationRubrique}
                handleChangeRubrique={handleChangeRubrique}
                thisHandleSubmit={ajouterNouvelleRubrique}
                isHandlingSubmit={isHandlingSubmit}
            />
            <ModalRubrique
                title="Ajouter un grand groupe"
                isModal={isModalGrandGroupe}
                handleCloseModal={handleCloseModalGrandGroupe}
                designationRubrique={designationRubrique}
                handleChangeRubrique={handleChangeRubrique}
                thisHandleSubmit={ajouterNouveauGrandGroupe}
                isHandlingSubmit={isHandlingSubmit}
            />
            <Drawer open={open} onClose={toggleDrawer(false)}>
                <DrawerList toggleDrawer={toggleDrawer} />
            </Drawer>
        </Box>
    );
}
