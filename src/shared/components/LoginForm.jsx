import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Grid, IconButton, InputAdornment, TextField } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import LoginButton from './LoginButton';

const LoginForm = forwardRef(({ handleSubmit, register }, ref) => {

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [showPassword, setShowPassword] = useState(false);
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [helperTextEmail, setHelperTextEmail] = useState('');
    const [helperTextPassword, setHelperTextPassword] = useState('');
    const [isHandlingSubmit, setIsHandlingSubmit] = useState(false);

    useImperativeHandle(ref, () => ({
        getEmailValue: () => emailRef.current.value,
        getPasswordValue: () => passwordRef.current.value,
        setisHandlingSubmitValue: (value) => setIsHandlingSubmit(value),
        clearForm: () => clearForm(),
        setHelperTextEmail: (value) => setHelperTextEmail(value),
        setHelperTextPassword: (value) => setHelperTextPassword(value)
    }));

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setPseudo(newEmail);
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const clearForm = () => {
        setPseudo('');
        setPassword('');
    }

    const thisHandleSubmit = async (e) => {
        e.preventDefault();
        setIsHandlingSubmit(true);
        await handleSubmit();
    }

    // const handleSubmit = async () => {
    //     setIsHandlingSubmit(true);
    //     await handleSubmit();
    // }

  return (
    <form onSubmit={thisHandleSubmit}>
        <Grid container spacing={3} className='mt-3'>
            <Grid item xs={12}>
                <div className=''>
                    <TextField
                        required
                        inputRef={emailRef}
                        value={pseudo}
                        onChange={handleEmailChange}
                        error={helperTextEmail !== ''}
                        helperText={helperTextEmail}
                        id="pseudo"
                        name='pseudo'
                        label="pseudo"
                        type="pseudo"
                        variant="outlined"
                        autoComplete='off'
                        fullWidth
                    />
                </div>
            </Grid>
            <Grid item xs={12}>
                <div className=''>
                    <TextField
                        required
                        inputRef={passwordRef}
                        value={password}
                        onChange={handlePasswordChange}
                        error={helperTextPassword !== ''}
                        helperText={helperTextPassword}
                        id="password"
                        name='password'
                        label="mot de passe"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        autoComplete='off'
                        fullWidth
                        InputProps={{
                            endAdornment : (
                                <InputAdornment position="start">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="start"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
            </Grid>
            <Grid item xs={12}>
                <LoginButton isHandlingSubmit={isHandlingSubmit}>
                    {register ? "S'inscrire" : "Se connecter"}
                </LoginButton>
            </Grid>
        </Grid>
    </form>
  )
});

export default LoginForm
