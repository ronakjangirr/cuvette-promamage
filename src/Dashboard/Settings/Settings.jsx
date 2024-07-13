import React, { useState, useEffect } from 'react'
import styles from './Style.module.css'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import axios from 'axios';
import { baseUrl } from '../../apiConfig';

function Settings() {
  const [setting, setSetting] = useState({
    name: "",
    oldPassword: '',
    newPassword: '',
  })

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisibleConfirm, setPasswordVisibleConfirm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // debugger
        // const response = await axios.get('http://localhost:9090/api/auth/settings', {
          const response = await axios.get(`${baseUrl}api/auth/settings`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const userData = response.data;
        setSetting({
          name: userData.user.name,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
  }, [setting])

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }

  const togglePasswordVisibilityConfirm = () => {
    setPasswordVisibleConfirm(!passwordVisibleConfirm);
  }

  const handleChange = (e) => {
    let { name, value } = e.target;
    setSetting((prevSetting) => ({ ...prevSetting, [name]: value || '' }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const requestData = await axios.put('http://localhost:9090/api/auth/update', setting, {
        const requestData = await axios.put(`${baseUrl}api/auth/update`, setting, {

        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (requestData.status !== 200) {
        throw new Error('Network error. Please try again later.');
      }
      alert('Your information has been successfully updated.');

      setSetting({
        oldPassword: '',
        newPassword: '',
      })
    } catch (error) {
      console.error(error)
      alert("There is a problem with request, please try again later");
    }
  }

  return (
    <>
      <div className={styles.main}>
        <div>
          <h2 className={styles.heading}>Settings</h2>
        </div>
        <div className={styles.container}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <div className={styles.inputContainer}>
                <PersonOutlineOutlinedIcon className={styles.icon} />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Name"
                  name='name'
                  value={setting.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <div className={styles.inputContainer}>
                <LockOutlinedIcon className={styles.icon} />
                <input
                  type={passwordVisible ? "text" : "password"}
                  className={styles.inputField}
                  placeholder="Old Password"
                  name='oldPassword'
                  value={setting.oldPassword}
                  onChange={handleChange}
                />
                {passwordVisible ?
                  <RemoveRedEyeOutlinedIcon className={styles.icon} onClick={togglePasswordVisibility} /> :
                  <VisibilityOffOutlinedIcon className={styles.icon} onClick={togglePasswordVisibility} />
                }
              </div>
            </div>
            <div className={styles.formGroup}>
              <div className={styles.inputContainer}>
                <LockOutlinedIcon className={styles.icon} />
                <input
                  type={passwordVisibleConfirm ? "text" : "password"}
                  className={styles.inputField}
                  placeholder="New Password"
                  name='newPassword'
                  value={setting.newPassword}
                  onChange={handleChange}
                />
                {passwordVisibleConfirm ?
                  <RemoveRedEyeOutlinedIcon className={styles.icon} onClick={togglePasswordVisibilityConfirm} /> :
                  <VisibilityOffOutlinedIcon className={styles.icon} onClick={togglePasswordVisibilityConfirm} />
                }
              </div>
            </div>
            <div className={styles.btnContainer}>
              <button type="submit" className={styles.button}>Update</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Settings