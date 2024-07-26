import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomTitle from '../shared/components/CustomTitle';
import { Button, Container, Grid } from '@mui/material';
import { dnsPath } from '../shared/constants/constants';
import { getRequest } from '../apis/getRequests';
import { intersection, not, union } from '../shared/functions/functions';
import CustomList from '../components/EditRubrique/CustomList';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { postRequest } from '../apis/postRequests';
import CustomizedLoader from '../shared/components/CustomizedLoader';
import CustomButton from '../shared/components/CustomButton';

export default function EditRubrique() {

    const { rubriqueId } = useParams();
    const rubriqueInfo = rubriqueId.split('-');

    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [listeDesActes, setListeDesActes] = useState([]);
    const [actesModifes, setActesModifes] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isHandlingSubmit, setIsHandlingSubmit] = useState(false);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(() => {
        fetchListeActes();
    }, []);

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
        setRight(listeActes.filter(acte => parseInt(acte.id_rubrique) !== parseInt(rubriqueInfo[0])));
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
                console.log("Rubrique modifiée avec succès");
            }
        } catch (error) {
            setIsHandlingSubmit(false);
            console.error("Erreur lors de la modification de la rubrique", error);
        }
    }

    const buttonIsDisabled = () => {
        return actesModifes.length === 0 || isHandlingSubmit;
    }

  return (
    <Container>
        <CustomTitle text={`Editer ${rubriqueInfo[1]}`} />
        {isLoadingData && <CustomizedLoader />}
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>
                <CustomList
                    title={rubriqueInfo[1]}
                    items={left}
                    checked={checked}
                    handleToggle={handleToggle}
                    handleToggleAll={handleToggleAll}
                    numberOfChecked={numberOfChecked}
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
                <CustomList
                    title="Toutes les rubriques"
                    items={right}
                    checked={checked}
                    handleToggle={handleToggle}
                    handleToggleAll={handleToggleAll}
                    numberOfChecked={numberOfChecked}
                />
            </Grid>
        </Grid>
        <Container className='d-flex justify-content-center'>
            <CustomButton
                title="Enregistrer les modifications"
                updateRubrique={updateRubrique}
                buttonIsDisabled={buttonIsDisabled}
                isHandlingSubmit={isHandlingSubmit}
            />
        </Container>
    </Container>
  );
}

