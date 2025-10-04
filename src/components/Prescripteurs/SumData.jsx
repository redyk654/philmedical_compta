import { TableCell, TableRow } from '@mui/material';
import React from 'react'
import { formaterNombre } from '../../shared/functions/functions';

export default function SumData({ data, percentages = {} }) {

    const totalQte = data.reduce((acc, item) => acc + (parseInt(item.qte) || 0), 0);
    const totalAmount = data.reduce((acc, item) => {
        const t = parseFloat(String(item.total).replace(',', '.')) || 0;
        return acc + t;
    }, 0);
    const totalNet = data.reduce((acc, item) => {
        const t = parseFloat(String(item.total).replace(',', '.')) || 0;
        const p = parseFloat(String(percentages[item.id_medecin] || 0)) || 0;
        return acc + (t * p / 100);
    }, 0);

  return (
    <TableRow>
        <TableCell><strong>Somme</strong></TableCell>
        <TableCell align='center'><strong>{formaterNombre(totalQte)}</strong></TableCell>
        <TableCell align='center'><strong>{formaterNombre(totalAmount)}</strong></TableCell>
        <TableCell></TableCell>
        <TableCell align='center'><strong>{formaterNombre(totalNet)}</strong></TableCell>
    </TableRow>
  )
}
