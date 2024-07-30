import React, { useRef } from 'react'
import { Container } from '@mui/material'
import BackToHome from '../shared/components/BackToHome';
import LoginForm from '../shared/components/LoginForm';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {

    const navigate = useNavigate();
  
  const registerFormRef = useRef(null);

  const handleSubmit = () => {
    navigate('/comptabilite');
  }

  return (
    <Container
        className='pt-4'
    >
      <div>
        <BackToHome />
        <h1>Connexion</h1>
      </div>
      <LoginForm
        handleSubmit={handleSubmit}
        register={false}
        ref={registerFormRef}
      />
    </Container>
  )
}
