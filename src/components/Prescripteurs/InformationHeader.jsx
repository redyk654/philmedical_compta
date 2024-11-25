import React, { useContext } from 'react'
import { CustomContext } from '../../shared/contexts/CustomContext';
import { convertDate } from '../../shared/functions/functions';

export default function InformationHeader({ rubriqueSelected }) {

    const { dateDebut,
        dateFin,
        heureDebut,
        heureFin,
      } = useContext(CustomContext);

  return (
    <div style={{ margin: '25px'}}>
        {rubriqueSelected !== '' && <h1>Etat des prescripteurs de <strong>{rubriqueSelected}</strong></h1>}
        {/* <h1>
            Etat des prescripteurs de
            <strong>{" " + rubriqueSelected}</strong>
        </h1> */}
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
    </div>
  )
}
