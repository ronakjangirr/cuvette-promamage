import React, { useState } from 'react'
import styles from './Style.module.css'
import { useNavigate } from 'react-router-dom'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CancelScheduleSendOutlinedIcon from '@mui/icons-material/CancelScheduleSendOutlined';
import logoOne from '/home/user/Vue_Dev/VUE PRACTICE PROJECTS/Vue_Rnotes/Cuvette projects/New Project/pro_manage/client-pro-manage/src/assets/images/logoOne.jpeg';

function SideBar({ sendToParent, showPopUp, updateAnalytics }) {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const navigate = useNavigate();

  const handleClick = (value) => {
    // debugger
    sendToParent(value)
    if (value === 'analytics') {
      updateAnalytics();
    }
  }

  const handlePopUp = (flag) => {
    showPopUp(flag)
  }

  const handleLogout = () => {
    window.localStorage.clear();
    navigate('/');
  }

  const handleConfirmLogout = () => {
    handleLogout();
    setShowLogoutPopup(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };
  return (
    <>
      <div className={styles.sideBarContainer}>
        <div className={styles.logo}>
          <div className={styles.header}>
            <img src={logoOne} alt="Auth Image" className={styles.image} />
            <h1>Pro Manage</h1>
          </div>
          <div className={styles.btnContainer}>
            <button className={styles.customButton} onClick={() => handleClick('dashboard')}><SpaceDashboardOutlinedIcon className={styles.icon} />Board</button>
            <button className={styles.customButton} onClick={() => handleClick('analytics')}><FindInPageOutlinedIcon className={styles.icon} />Analytics</button>
            <button className={styles.customButton} onClick={() => handleClick('settings')}><SettingsOutlinedIcon className={styles.icon} />Settings</button>
          </div>
        </div>
        <div className={styles.logoutContainer}>
          <button className={styles.logoutButton} onClick={() => setShowLogoutPopup(true)}><CancelScheduleSendOutlinedIcon className={styles.icon} />Logout</button>
        </div>
      </div>
      {showLogoutPopup && (
        <div className={styles.backgroundOverlay}>
          <div className={styles.logoutPopup}>
            <p>Are you sure you want to Logout?</p>
            <div className={styles.buttonContainer}>
              <button className={styles.confirmButton} onClick={handleConfirmLogout}>
                Yes, Logout
              </button>
              <button className={styles.outlineButton} onClick={handleCancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SideBar