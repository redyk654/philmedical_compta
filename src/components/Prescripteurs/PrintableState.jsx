import React, { useContext } from 'react'
import TableStatesPrescribers from './TableStatesPrescribers'
import { CustomContext } from '../../shared/contexts/CustomContext';
import { convertDate } from '../../shared/functions/functions';

export default function PrintableState(props) {

  return (
    <div ref={props.innerRef}>
        {/* <div style={{ margin: '25px' }}>
            <h1>
                Etat des prescripteurs des 
                <strong>{" " + props.rubriqueSelected}</strong>
            </h1>
            <h3 style={{ margin: '10px' }}>
                Période du
                {" " + convertDate(dateDebut) + " "}
                à
                {" " + heureDebut + " "}
                au
                {" " + convertDate(dateFin) + " "}
                à
                {" " + heureFin  + " "}
            </h3>
        </div> */}
        <TableStatesPrescribers data={props.data} />
    </div>
  )
}
