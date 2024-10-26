import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { dnsPath } from '../shared/constants/constants';

export default function Prescripteurs() {

  const [data, setData] = useState([]);
  const [prescripteurs, setPrescripteurs] = useState([]);

  useEffect(() => {
    fetch(`${dnsPath}gestion_prescripteurs.php?stats`)
      .then(response => response.json())
      .then(response => {
        console.log('Data fetched:', response);
        
        const fetchedData = response
        setData(fetchedData);

        // Extraire les prescripteurs uniques pour les colonnes
        const allPrescripteurs = new Set();
        Object.values(fetchedData).forEach(row => {
            Object.keys(row).forEach(prescripteur => {
                allPrescripteurs.add(prescripteur);
            });
        });
        setPrescripteurs([...allPrescripteurs]);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
              <TableRow>
                  <TableCell>Rubrique</TableCell>
                  {prescripteurs.map((prescripteur, index) => (
                      <TableCell key={index} align="center">{prescripteur}</TableCell>
                  ))}
              </TableRow>
          </TableHead>
          <TableBody>
              {Object.entries(data).map(([rubrique, totals], index) => (
                  <TableRow key={index}>
                      <TableCell>{rubrique}</TableCell>
                      {prescripteurs.map((prescripteur, idx) => (
                          <TableCell key={idx} align="center">
                              {totals[prescripteur] || 0}
                          </TableCell>
                      ))}
                  </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
