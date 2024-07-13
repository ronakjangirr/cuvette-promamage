import React, { useState, useEffect } from 'react'
import styles from './Style.module.css'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import axios from 'axios';
import { useNavigate } from "react-router"
import { baseUrl } from '../../apiConfig';

function Login({ emit }) {
    const [login, setLogin] = useState({
        email: "",
        password: "",
    })

    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    const handleChange = (e) => {
        let { name, value } = e.target;
        setLogin((prevLogin) => ({ ...prevLogin, [name]: value || '' }));
        console.log("Login", login);
    }

    const navigate = useNavigate();

    const formValidation = () => {
        let isValid = true;
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!login.email) {
            setErrorEmail("Invalid email");
            isValid = false;
        } else if (!emailRegex.test(login.email)) {
            setErrorEmail("Please enter valid email");
        }
        else {
            setErrorEmail('');
        }

        if (!login.password) {
            setErrorPassword("Invalid password");
            isValid = false;
        } else if (login.password.length < 4) {
            setErrorPassword('Weak Password (min 4 characters)');
            isValid = false;
        } else {
            setErrorPassword('');
        }
        return isValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // debugger
        // if (!register.name || !register.email || !register.password || !register.confirmPassword) {
        //     alert("Please fill all the data");
        //     return
        // }
        // console.log("register", register);

        try {
            if (formValidation()) {
                // const requestData = await axios.post('http://localhost:9090/api/auth/login', login);
                const requestData = await axios.post(`${baseUrl}api/auth/login`, login);

                // debugger
                if (requestData.status !== 200) {
                    throw new Error("Network error please try again later..")
                }
                const responseData = await requestData.data;
                console.log("responseData", responseData);
                // debugger

                window.localStorage.setItem("username", responseData.name);
                window.localStorage.setItem("token", responseData.token);

                const userName = window.localStorage.getItem('username');

                setLogin({
                    email: "",
                    password: "",
                });

                alert(`Congratulations! ${userName}🎉 You have been successfully logged in.`);
                navigate('/dashboard')

            }

        } catch (error) {
            console.error(error)
            alert("There is a problem with request, please again later");
        }
    }

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleRegister = () => {
        emit('register')
    }
    return (
        <>
            <div>
                <div className={styles.container}>
                    <h2 className={styles.heading}>Login</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <div className={styles.inputContainer}>
                                <EmailOutlinedIcon className={styles.icon} />
                                <input
                                    type="email"
                                    className={styles.inputField}
                                    placeholder="Email"
                                    name='email'
                                    value={login.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {<p className={styles.errorColor}>{errorEmail}</p>}

                        </div>
                        <div className={styles.formGroup}>
                            <div className={styles.inputContainer}>
                                <LockOutlinedIcon className={styles.icon} />
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    className={styles.inputField}
                                    placeholder="Password"
                                    name='password'
                                    value={login.password}
                                    onChange={handleChange}
                                />
                                {passwordVisible ?
                                    <RemoveRedEyeOutlinedIcon className={styles.icon} onClick={togglePasswordVisibility} /> :
                                    <VisibilityOffOutlinedIcon className={styles.icon} onClick={togglePasswordVisibility} />
                                }
                            </div>
                            {<p className={styles.errorColor}>{errorPassword}</p>}
                        </div>
                        <div className={styles.btnContainer}>
                            <button type="submit" className={styles.button}>Login</button>
                        </div>
                        <div className={styles.btnContainer}>
                            <p>Have no account yet?</p>
                            <button className={styles.outlineButton} onClick={handleRegister}>Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login