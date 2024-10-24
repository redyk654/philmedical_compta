import React, { useRef } from 'react'
import { Container } from '@mui/material'
import LoginForm from '../shared/components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { dnsPath, pathsOfUrls } from '../shared/constants/constants';

export default function SignIn() {

    const navigate = useNavigate();
    
    const registerFormRef = useRef(null);

    const handleSubmit = () => {
        registerFormRef.current.setHelperTextEmail("");
        registerFormRef.current.setHelperTextPassword("");
        const data = new FormData();
        data.append('nom', registerFormRef.current.getEmailValue());
        data.append('mdp', registerFormRef.current.getPasswordValue());

        const req = new XMLHttpRequest();
        req.open('POST', `${dnsPath}connexion_caisse.php`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                registerFormRef.current.setisHandlingSubmitValue(false);
                if (req.responseText == "identifiant ou mot de passe incorrect") {
                    registerFormRef.current.setHelperTextEmail(req.responseText);
                    registerFormRef.current.setHelperTextPassword(req.responseText);
                } else {
                    const result = JSON.parse(req.responseText);
                    if (result.rol.toLowerCase() === "compta") {
                        navigate(`${pathsOfUrls.layoutNavBar}/${pathsOfUrls.comptable}`);
                    } else {
                        registerFormRef.current.setHelperTextEmail("identifiant ou mot de passe incorrect");
                        registerFormRef.current.setHelperTextPassword("identifiant ou mot de passe incorrect");
                    }

                }
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            registerFormRef.current.setisHandlingSubmitValue(false);
            registerFormRef.current.setHelperTextPassword('Erreur réseau');
            registerFormRef.current.setHelperTextEmail('Erreur réseau');
        });

        req.send(data)
    }

  return (
    <Container
        className='pt-4'
    >
      <div>
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
