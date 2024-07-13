import React, { useState, useEffect } from 'react'
import styles from './Style.module.css'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import axios from 'axios';
import { useNavigate } from "react-router"
import { baseUrl } from '../../apiConfig';

function Register({ emit }) {
    const [register, setRegister] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [errorName, setErrorName] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisibleConfirm, setPasswordVisibleConfirm] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const togglePasswordVisibilityConfirm = () => {
        setPasswordVisibleConfirm(!passwordVisibleConfirm);
    }

    const handleSignIn = () => {
        emit('signIn')
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        setRegister((prevRegister) => ({ ...prevRegister, [name]: value || '' }));
        console.log("Register", register);
    }

    const navigate = useNavigate();

    const formValidation = () => {

        let isValid = true;

        if (!register.name) {
            setErrorName("Invalid name");
            isValid = false;
        } else {
            setErrorName('');
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!register.email) {
            setErrorEmail("Invalid email");
            isValid = false;
        } else if (!emailRegex.test(register.email)) {
            setErrorEmail("Please enter valid email");
        }
        else {
            setErrorEmail('');
        }

        if (!register.password) {
            setErrorPassword("Invalid password");
            isValid = false;
        } else if (register.password.length < 4) {
            setErrorPassword('Weak Password (min 4 characters)');
            isValid = false;
        } else {
            setErrorPassword('');
        }

        if (!register.confirmPassword) {
            setErrorConfirmPassword("Invalid confirm password");
            isValid = false;
        } else if (register.password !== register.confirmPassword) {
            alert("Passwords does'nt match");
            isValid = false;
        } else {
            setErrorConfirmPassword('');
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
                // const requestData = await axios.post('http://localhost:9090/api/auth/register', register);
                const requestData = await axios.post(`${baseUrl}api/auth/register`, register);

                // debugger
                if (requestData.status !== 200) {
                    throw new Error("Network error please try again later..")
                }

                const responseData = await requestData.data;
                console.log("responseData", responseData);
                // debugger

                window.localStorage.setItem("username", responseData.user);
                window.localStorage.setItem("token", responseData.token);

                let userName = window.localStorage.getItem('username');

                setRegister({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });

                alert(`Congratulations! 🎉 ${userName} You have been successfully registered.`);
                navigate('/dashboard')
            }

        } catch (error) {
            console.error(error)
            alert("There is a problem with request, please again later");
        }
    }

    return (
        <>
            <div>
                <div className={styles.container}>
                    <h2 className={styles.heading}>Register</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <div className={styles.inputContainer}>
                                <PersonOutlineOutlinedIcon className={styles.icon} />
                                <input
                                    type="text"
                                    className={styles.inputField}
                                    placeholder="Name"
                                    name='name'
                                    value={register.name}
                                    onChange={handleChange}
                                />
                            </div>
                            {<p className={styles.errorColor}>{errorName}</p>}

                        </div>
                        <div className={styles.formGroup}>
                            <div className={styles.inputContainer}>
                                <EmailOutlinedIcon className={styles.icon} />
                                <input
                                    type="email"
                                    className={styles.inputField}
                                    placeholder="Email"
                                    name='email'
                                    value={register.email}
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
                                    value={register.password}
                                    onChange={handleChange}
                                />
                                {passwordVisible ?
                                    <RemoveRedEyeOutlinedIcon className={styles.icon} onClick={togglePasswordVisibility} /> :
                                    <VisibilityOffOutlinedIcon className={styles.icon} onClick={togglePasswordVisibility} />
                                }
                            </div>
                            {<p className={styles.errorColor}>{errorPassword}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <div className={styles.inputContainer}>
                                <LockOutlinedIcon className={styles.icon} />
                                <input
                                    type={passwordVisibleConfirm ? "text" : "password"}
                                    className={styles.inputField}
                                    placeholder="Confirm Password"
                                    name='confirmPassword'
                                    value={register.confirmPassword}
                                    onChange={handleChange}
                                />
                                {passwordVisibleConfirm ?
                                    <RemoveRedEyeOutlinedIcon className={styles.icon} onClick={togglePasswordVisibilityConfirm} /> :
                                    <VisibilityOffOutlinedIcon className={styles.icon} onClick={togglePasswordVisibilityConfirm} />
                                }
                            </div>
                            {<p className={styles.errorColor}>{errorConfirmPassword}</p>}

                        </div>
                        <div className={styles.btnContainer}>
                            <button type="submit" className={styles.button}>Register</button>
                        </div>
                        <div className={styles.btnContainer}>
                            <p>Have an account?</p>
                            <button className={styles.outlineButton} onClick={handleSignIn}>Login</button>
                        </div>
                    </form>

                </div>
            </div>
        </>
    )
}

export default Register