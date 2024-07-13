import React, { useState } from 'react'
import styles from './Style.module.css'
import mainImage from '/home/user/Vue_Dev/VUE PRACTICE PROJECTS/Vue_Rnotes/Cuvette projects/New Project/pro_manage/client-pro-manage/src/assets/images/mainImage.jpeg';
import Register from '../Register/Register';
import Login from '../Login/Login';

function AuthPanel() {
  const [selected, setSelected] = useState('register')

  const handleShowSignIn = (value) => {
    setSelected(value)
  }

  const handleRegister = (value) => {
    setSelected(value)
  }
  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.imageContainer} ${styles.col8}`}>
          <div className={styles.imageContent}>
            <img src={mainImage} alt="Auth Image" className={styles.image} />
            <h2>Welcome aboard my friend </h2>
            <p>just a couple of clicks and we start</p>
          </div>
        </div>
        <div className={`${styles.formContainer} ${styles.col4}`}>
          {selected === "signIn" && <Login emit={handleRegister} />}
          {selected === "register" && <Register emit={handleShowSignIn} />}
        </div>
      </div>
    </>
  )
}

export default AuthPanel
