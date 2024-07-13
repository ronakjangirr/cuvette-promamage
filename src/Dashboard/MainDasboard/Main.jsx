import React, { useEffect, useState } from 'react'
import SideBar from '../SideBar/SideBar'
import styles from './Style.module.css';
import Dash from '../Dash/Dash';
import Analytics from '../Analytics/Analytics';
import { useNavigate } from 'react-router-dom';
import Settings from '../Settings/Settings';

function Main() {
  const [selected, setSelected] = useState('dashboard');
  const [showsPopUp, setShowPopUp] = useState(false)
  const [one, setOne] = useState(false)

  const navigate = useNavigate();

  const handleShowComponent = (value) => {
    setSelected(value)
  }

  const handleShowCard = (flag) => {
    setShowPopUp(flag)
  }

  const handleUpdateAnalytics = () => {
    setOne(true)
  };

  useEffect(() => {
    // let verifyToken = window.localStorage.getItem('token');

    // if(!verifyToken){
    //   navigate("/")
    // }

  }, [selected, showsPopUp])

  const handleClose = (flag) => {
    setShowPopUp(flag)
  }




  const [dataLengths, setDataLengths] = useState({
    backlogDataLength: 0,
    progressDataLength: 0,
    todoDataLength: 0,
    doneDataLength: 0
  });


  const handleSetLength = (lengths) => {
    setDataLengths(lengths);
    console.log("Lengths====", lengths)
  }

  useEffect(() => {
    console.log("dataLengths====", dataLengths);
  }, [dataLengths]);


  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.leftSideBar}>
          <SideBar sendToParent={handleShowComponent} showPopUp={handleShowCard} updateAnalytics={handleUpdateAnalytics} />
        </div>
        <div className={styles.main}>
          {selected === "dashboard" && <Dash onDataLengthUpdate={handleSetLength} />}
          {selected === "analytics" && <Analytics showPoll={handleShowComponent} updateData={one} dataLengths={dataLengths} />}
          {selected === "settings" && <Settings showQuiz={handleShowComponent} />}
        </div>
        <div>
        </div>
      </div>
    </>
  )
}

export default Main