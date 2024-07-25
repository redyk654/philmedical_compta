import React from 'react';
import { useParams } from 'react-router-dom';

export default function EditRubrique() {

    const { rubriqueId } = useParams();

  return (
    <div>
        <h1>Modifier la rubrique {rubriqueId}</h1>
    </div>
  )
}
