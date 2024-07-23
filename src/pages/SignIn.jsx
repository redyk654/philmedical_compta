import React, { useRef } from 'react'
import { Container } from '@mui/material'
import BackToHome from '../shared/components/BackToHome';
import LoginForm from '../shared/components/LoginForm';

export default function SignIn() {
  
  const registerFormRef = useRef(null);

  return (
    <Container
        className='pt-4'
    >
      <div>
        <BackToHome />
        <h1>Connexion</h1>
      </div>
      <LoginForm
        register={false}
        ref={registerFormRef}
      />
    </Container>
  )
}
