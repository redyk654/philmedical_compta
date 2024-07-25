import React , {createContext, useState} from 'react';

/*
    - Context pour gerer l'état du loader
*/

export const CustomContext = createContext();

const CustomProvider = (props) => {
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [heureDebut, setHeureDebut] = useState('');
    const [heureFin, setHeureFin] = useState('');

    const handleDateDebut = (e) => {
        setDateDebut(e.target.value)
    }

    const handleDateFin = (e) => {
        setDateFin(e.target.value)
    }

    const handleHeureDebut = (e) => {
        setHeureDebut(e.target.value)
    }

    const handleHeureFin = (e) => {
        setHeureFin(e.target.value)
    }
    
    return (
        <CustomContext.Provider value={{dateDebut, handleDateDebut, dateFin, handleDateFin, heureDebut, handleHeureDebut, heureFin, handleHeureFin}}>
            {props.children}
        </CustomContext.Provider>
    )
}

export default CustomProvider;