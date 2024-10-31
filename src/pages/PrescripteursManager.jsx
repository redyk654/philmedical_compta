import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem,
  Container
} from '@mui/material';
import { dnsPath } from '../shared/constants/constants';

const PrescripteursManager = () => {
    const [prescripteurs, setPrescripteurs] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPrescripteur, setSelectedPrescripteur] = useState(null);
    const [newPrescripteur, setNewPrescripteur] = useState('');
    const [mergePrescripteur, setMergePrescripteur] = useState({ mainId: '', mergeId: '' });

    // Fetch prescripteurs on mount
    useEffect(() => {
        fetchPrescripteurs();
    }, []);

    const fetchPrescripteurs = async () => {
        const response = await fetch(`${dnsPath}gestion_prescripteurs.php?liste`);
        const data = await response.json();
        // console.log(data);
        
        if(!data) {
            setPrescripteurs([]);
            return;
        }
        setPrescripteurs(data);
    };

    const handleCreate = async () => {
        await fetch(`${dnsPath}gestion_prescripteurs.php?action=create`, {
            method: 'POST',
            body: new URLSearchParams({ designation: newPrescripteur })
        });
        setNewPrescripteur('');
        setOpenModal(false);
        fetchPrescripteurs();
    };

    const handleUpdate = async (id, designation) => {
        await fetch(`${dnsPath}gestion_prescripteurs.php?action=update`, {
            method: 'POST',
            body: new URLSearchParams({ id, designation })
        });
        fetchPrescripteurs();
    };

    const handleDelete = async (id) => {
        await fetch(`${dnsPath}gestion_prescripteurs.php?action=delete`, {
            method: 'POST',
            body: new URLSearchParams({ id })
        });
        fetchPrescripteurs();
    };

    const handleMerge = async () => {
        await fetch(`${dnsPath}gestion_prescripteurs.php?action=merge`, {
            method: 'POST',
            body: new URLSearchParams({ main_id: mergePrescripteur.mainId, merge_id: mergePrescripteur.mergeId })
        });
        setMergePrescripteur({ mainId: '', mergeId: '' });
        fetchPrescripteurs();
    };

    return (
        <Container sx={{ marginTop: 5 }}>
            <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                Créer un prescripteur
            </Button>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Designation</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prescripteurs.length > 0 && prescripteurs.map((prescripteur) => (
                            <TableRow key={prescripteur.id}>
                                <TableCell>
                                    <TextField
                                        value={prescripteur.designation}
                                        onChange={(e) =>
                                            handleUpdate(prescripteur.id, e.target.value)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(prescripteur.id)}
                                    >
                                        Supprimer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Créer un Prescripteur</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Designation"
                        fullWidth
                        value={newPrescripteur}
                        onChange={(e) => setNewPrescripteur(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary">Annuler</Button>
                    <Button onClick={handleCreate} color="primary">Créer</Button>
                </DialogActions>
            </Dialog>

            <div style={{ marginTop: '20px' }}>
                <Select
                    value={mergePrescripteur.mainId}
                    onChange={(e) => setMergePrescripteur({ ...mergePrescripteur, mainId: e.target.value })}
                    displayEmpty
                    style={{ marginRight: '10px' }}
                >
                    <MenuItem value="" disabled>Prescripteur à garder</MenuItem>
                    {prescripteurs.map(p => (
                        <MenuItem key={p.id} value={p.id}>{p.designation}</MenuItem>
                    ))}
                </Select>
                <Select
                    value={mergePrescripteur.mergeId}
                    onChange={(e) => setMergePrescripteur({ ...mergePrescripteur, mergeId: e.target.value })}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Prescripteur à fusionner</MenuItem>
                    {prescripteurs.map(p => (
                        <MenuItem key={p.id} value={p.id}>{p.designation}</MenuItem>
                    ))}
                </Select>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleMerge}
                    disabled={!mergePrescripteur.mainId || !mergePrescripteur.mergeId}
                >
                    Fusionner
                </Button>
            </div>
        </Container>
    );
};

export default PrescripteursManager;
