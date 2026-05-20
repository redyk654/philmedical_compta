import React, { useContext } from 'react';
import { CustomContext } from '../../shared/contexts/CustomContext';
import { convertDate, formaterNombre } from '../../shared/functions/functions';

export default function PrintRapportPrescripteur({ mode, rubriquesData, prescripteur, totalGlobal }) {
  const { dateDebut, dateFin, heureDebut, heureFin } = useContext(CustomContext);
  const isCommission = mode === 'commission';
  const totalAvantCommission = rubriquesData.reduce(
    (acc, rubrique) => acc + rubrique.services.reduce((sum, service) => sum + parseFloat(service.total_net || 0), 0),
    0
  );
  const totalApresCommission = totalAvantCommission - totalGlobal;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>
        {isCommission ? 'Rapport commission prescripteur' : 'Rapport prescripteur'}
      </h2>
      <h3 style={{ textAlign: 'center', marginTop: 0 }}>
        {prescripteur?.designation || 'Prescripteur'}
      </h3>
      <p style={{ textAlign: 'center', marginBottom: '24px' }}>
        Période du {convertDate(dateDebut)} à {heureDebut} au {convertDate(dateFin)} à {heureFin}
      </p>

      {rubriquesData.map((rubrique) => {
        const totalRubrique = rubrique.services.reduce(
          (acc, service) => acc + parseFloat(service.montant_calcule || 0),
          0
        );

        return (
          <div key={rubrique.rubrique_id || rubrique.rubrique} style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '10px' }}>{String(rubrique.rubrique || '').toUpperCase()}</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={cellStyle}>Désignation</th>
                  <th style={cellStyle}>Quantité</th>
                  {isCommission && <th style={cellStyle}>Prix</th>}
                  <th style={cellStyle}>{isCommission ? 'Montant net' : 'Montant'}</th>
                  {isCommission && <th style={cellStyle}>Commission</th>}
                  {isCommission && <th style={cellStyle}>Montant calculé</th>}
                </tr>
              </thead>
              <tbody>
                {rubrique.services.map((service) => (
                  <tr key={service.id_service || service.designation}>
                    <td style={cellStyle}>{service.designation}</td>
                    <td style={cellStyle}>{formaterNombre(parseInt(service.total_qte || 0, 10))}</td>
                    {isCommission && (
                      <td style={cellStyle}>{formaterNombre(parseInt(service.prix || 0, 10))}</td>
                    )}
                    <td style={cellStyle}>
                      {formaterNombre(
                        Math.round(parseFloat(isCommission ? service.total_net || 0 : service.total_prix || 0))
                      )}
                    </td>
                    {isCommission && (
                      <td style={cellStyle}>
                        {service.type_valeur === 'montant_fixe'
                          ? formaterNombre(Math.round(parseFloat(service.valeur || 0)))
                          : `${service.valeur}%`}
                      </td>
                    )}
                    {isCommission && (
                      <td style={cellStyle}>{formaterNombre(Math.round(parseFloat(service.montant_calcule || 0)))}</td>
                    )}
                  </tr>
                ))}
                <tr>
                  <td style={cellStyle} colSpan={isCommission ? 5 : 2}>
                    <strong>Total rubrique</strong>
                  </td>
                  <td style={cellStyle}>
                    <strong>
                      {formaterNombre(
                        Math.round(
                          isCommission
                            ? totalRubrique
                            : rubrique.services.reduce(
                                (acc, service) => acc + parseFloat(service.total_prix || 0),
                                0
                              )
                        )
                      )}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}

      {isCommission ? (
        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <h3 style={{ margin: 0 }}>
            Total avant commission : {formaterNombre(Math.round(totalAvantCommission))}
          </h3>
          <h3 style={{ margin: 0 }}>
            Total commission : {formaterNombre(Math.round(totalGlobal))}
          </h3>
          <h3 style={{ margin: 0 }}>
            Total après commission : {formaterNombre(Math.round(totalApresCommission))}
          </h3>
        </div>
      ) : (
        <h3 style={{ textAlign: 'right', marginTop: '32px' }}>
          Total des actes : {formaterNombre(Math.round(totalGlobal))}
        </h3>
      )}
    </div>
  );
}

const cellStyle = {
  border: '1px solid #d9d9d9',
  padding: '8px',
  textAlign: 'left',
  fontSize: '13px'
};
