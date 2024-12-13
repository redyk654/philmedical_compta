import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomTitle from '../shared/components/CustomTitle';
import { Box, Button, Container, Grid, Link, Modal, TextField, Typography } from '@mui/material';
import { dnsPath } from '../shared/constants/constants';
import { getRequest } from '../apis/getRequests';
import { intersection, not, union } from '../shared/functions/functions';
import CustomList from '../components/EditRubrique/CustomList';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { postRequest } from '../apis/postRequests';
import CustomizedLoader from '../shared/components/CustomizedLoader';
import CustomButton from '../shared/components/CustomButton';
import CustomTitleH2 from '../shared/components/CustomTitleH2';
import { modalStyle } from '../shared/styles/CustomStyles';
import LoginButton from '../shared/components/LoginButton';
import BackToHome from '../shared/components/BackToHome';

export default function EditRubrique() {

    const { rubriqueId } = useParams();
    const rubriqueInfo = rubriqueId.split('-');

    const navigate = useNavigate();

    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [listeDesActes, setListeDesActes] = useState([]);
    const [actesModifes, setActesModifes] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isHandlingSubmit, setIsHandlingSubmit] = useState(false);
    const [searchLeft, setSearchLeft] = useState('');
    const [searchRight, setSearchRight] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newActe, setNewActe] = useState({ designation: '', prix: 0 });
    const [helperError, setHelperError] = useState('');
    const [isModalDelete, setIsModalDelete] = useState(false);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const filteredLeft = left.filter(acte => acte.designation.toLowerCase().includes(searchLeft.toLowerCase()));
    const filteredRight = right.filter(acte => acte.designation.toLowerCase().includes(searchRight.toLowerCase()));

    const handleChangeDesignation = (e) => {
        setNewActe({ ...newActe, designation: e.target.value });
    }

    const handleChangePrix = (e) => {
        setNewActe({ ...newActe, prix: e.target.value });
    }

    const addNewActe = async (e) => {
        setHelperError('');
        e.preventDefault();
        const acte = {
            designation: newActe.designation,
            prix: newActe.prix,
            id_rubrique: 0
        }

        const url = `${dnsPath}gestion_rubriques.php?add_acte`;
        try {
            const res = await postRequest(url, acte);
            if (res.message === 'success') {
                fetchListeActes();
                setNewActe({ designation: '', prix: 0 });
                handleCloseModal();
            } else {
                setHelperError("Cet acte existe déjà");
            }
        } catch (error) {
            console.error('Error adding acte:', error);
        }
    }

    const handleOpenModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewActe({ designation: '', prix: 0 });
        setHelperError('');
    }

    const handleOpenModalDelete = () => {
        setIsModalDelete(true)
    }

    const handleCloseModalDelete = () => {
        setIsModalDelete(false)
    }

    useEffect(() => {
        fetchListeActes();
    }, []);

    const handleSearch = (e, isLeft) => {
        if (isLeft) {
            setSearchLeft(e.target.value);
        } else {
            setSearchRight(e.target.value);
        }
    }

    const fetchListeActes = async () => {
        setIsLoadingData(true);
        const url = `${dnsPath}recuperer_services.php`;
        try {
            const data = await getRequest(url);
            setListeDesActes(data);
            initialiserListes(data);
            setIsLoadingData(false);
        } catch (error) {
            setIsLoadingData(false);
            console.error('Error fetching actes:', error);
        }
    }

    const initialiserListes = (listeActes) => {
        setLeft(listeActes.filter(acte => parseInt(acte.id_rubrique) === parseInt(rubriqueInfo[0])));
        setRight(listeActes.filter(acte => parseInt(acte.id_rubrique) === 0));
    }

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        changeRubrique(leftChecked, false);
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        changeRubrique(rightChecked, true);
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const changeRubrique = (liste, isLeft) => {
        let actes = [];
        if (isLeft) {
            actes = liste.map(acte => ({
                id: acte.id,
                id_rubrique: parseInt(rubriqueInfo[0]),
                designation: acte.designation,
                prix: acte.prix
            }));
        } else {
            actes = liste.map(acte => ({
                id: acte.id,
                id_rubrique: 0,
                designation: acte.designation,
                prix: acte.prix
            }));
        }

        const removedDoublons = actesModifes.filter(acte =>
                                    actes.findIndex(a =>
                                        parseInt(a.id) === parseInt(acte.id)) === -1);
        const interMediaire = [...removedDoublons, ...actes];
        const removedActesNonModifies = interMediaire.filter(acte =>
                                            listeDesActes.findIndex(a =>
                                                parseInt(a.id) === parseInt(acte.id) && parseInt(a.id_rubrique) === parseInt(acte.id_rubrique)) === -1);
        setActesModifes(removedActesNonModifies);
    }

    const updateRubrique = async () => {
        setIsHandlingSubmit(true);
        const url = `${dnsPath}gestion_rubriques.php?update_rubrique`;
        const data = {
            actes: actesModifes
        }
        try {
            const res = await postRequest(url, data);
            if (res.message === 'success') {
                setActesModifes([]);
                setIsHandlingSubmit(false);
            }
        } catch (error) {
            setIsHandlingSubmit(false);
            console.error("Erreur lors de la modification de la rubrique", error);
        }
    }

    const deleteActe = async (id) => {
        const url = `${dnsPath}gestion_rubriques.php?delete_acte&id=${id}`;
        try {
            const res = await postRequest(url);
            if (res.message === 'success') {
                fetchListeActes();
            }
        } catch (error) {
            console.error('Error deleting acte:', error);
        }
    }

    const buttonIsDisabled = () => {
        return actesModifes.length === 0 || isHandlingSubmit;
    }

    const deleteRubrique =  async () => {        
        const url = `${dnsPath}gestion_rubriques.php?delete_rubrique&id=${rubriqueInfo[0]}`;
        try {
            const res = await postRequest(url);
            if (res.message === 'success') {
                navigate('/philmedical/compta/layoutnav/comptable');
            }
        } catch (error) {
            console.error('Error deleting rubrique:', error);
        }
    }

  return (
    <Container>
        <div className='p-2'>
            <BackToHome />
        </div>
        <CustomTitle text={`Editer ${rubriqueInfo[1]}`} />
        <Button color='error' onClick={handleOpenModalDelete}>
            Supprimer la rubrique
        </Button>
        {isLoadingData && <CustomizedLoader />}
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>
                <div className='mb-3'>
                    <TextField
                        placeholder="Rechercher"
                        fullWidth
                        variant="outlined"
                        value={searchLeft}
                        onChange={(e) => handleSearch(e, true)}
                    />
                </div>
                <CustomList
                    title={rubriqueInfo[1]}
                    items={filteredLeft}
                    checked={checked}
                    handleToggle={handleToggle}
                    handleToggleAll={handleToggleAll}
                    numberOfChecked={numberOfChecked}
                    deleteActe={deleteActe}
                />
            </Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        <KeyboardArrowRightIcon />
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        <KeyboardArrowLeftIcon />
                    </Button>
                </Grid>
            </Grid>
            <Grid item>
                <div className='mb-3'>
                    <TextField
                        placeholder="Rechercher"
                        fullWidth
                        variant="outlined"
                        value={searchRight}
                        onChange={(e) => handleSearch(e, false)}
                    />
                </div>
                <Link component='a' href='#' underline='none' onClick={handleOpenModal}>
                    Ajouter un acte
                </Link>
                <CustomList
                    title="Non affectés"
                    items={filteredRight}
                    checked={checked}
                    handleToggle={handleToggle}
                    handleToggleAll={handleToggleAll}
                    numberOfChecked={numberOfChecked}
                    deleteActe={deleteActe}
                />
            </Grid>
        </Grid>
        <Container className='d-flex justify-content-center'>
            <CustomButton
                title="Enregistrer les modifications"
                handleClick={updateRubrique}
                buttonIsDisabled={buttonIsDisabled}
                isHandlingSubmit={isHandlingSubmit}
            />
        </Container>
        <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-acte"
            aria-describedby="modal-modal-acte"
        >
            <Box sx={modalStyle}>
                <CustomTitleH2>
                    Ajouter un acte
                </CustomTitleH2>
                <form onSubmit={addNewActe}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                value={newActe.designation}
                                onChange={handleChangeDesignation}
                                id="designation"
                                name='designation'
                                label="Designation"
                                type="text"
                                variant="outlined"
                                autoComplete='off'
                                error={helperError !== ''}
                                helperText={helperError}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                value={newActe.prix}
                                onChange={handleChangePrix}
                                id="prix"
                                name='prix'
                                label="Prix"
                                type="number"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LoginButton isHandlingSubmit={isHandlingSubmit}>
                                Ajouter l'acte
                            </LoginButton>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
        <Modal
            open={isModalDelete}
            onClose={handleCloseModalDelete}
        >
            <Box sx={modalStyle}>
                <CustomTitleH2>
                    ALERTE
                </CustomTitleH2>
                <p>
                    La suppression d'une rubrique est irreversible. Voulez-vous continuez ?
                </p>
                <Box component='div' className='d-flex justify-content-around align-items-center'>
                    <Button color='primary' onClick={handleCloseModalDelete} size='large'>Annuler</Button>
                    <Button color='error' variant='contained' onClick={deleteRubrique}>Supprimer</Button>
                </Box>
            </Box>
        </Modal>
    </Container>
  );
}

