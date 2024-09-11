import { dnsPath } from "../shared/constants/constants";
import { postRequest } from "./postRequests";

export const fetchDetailsRubrique = async (rubriqueId, dateDebut, dateFin, heureDebut, heureFin) => {
    const debut = dateDebut + ' ' + heureDebut;
    const fin = dateFin + ' ' + heureFin;
    const data = {
        id: rubriqueId,
        debut: debut,
        fin: fin
    }

    const url = `${dnsPath}gestion_rubriques.php?details_rubrique`;

    try {
        const response = await postRequest(url, data);
        return await new Promise((resolve, reject) => {
            if (response) {
                resolve(response);
            } else {
                reject([]);
            }
        })
    } catch (error) {
        console.error('Error fetching rubrique details:', error)
        return []
    }
}