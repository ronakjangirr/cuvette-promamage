import React, { useState, useEffect } from 'react'
import styles from './Style.module.css';
import axios from 'axios';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { baseUrl } from '../../apiConfig';

function Analytics(props) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [todoData, setTodoData] = useState([]);

  let { updateData } = props

  const { dataLengths } = props;

  useEffect(() => {
    if (dataLengths) {
      setAnalyticsData({
        backlogs: dataLengths.backlogDataLength,
        todo: dataLengths.todoDataLength,
        progress: dataLengths.progressDataLength,
        done: dataLengths.doneDataLength
      });
    }
  }, [dataLengths]);

  // useEffect(()=>{
  //   console.log("dataLengths",dataLengths)
  // }, [dataLengths])

  useEffect(() => {
    if (updateData === true) {
      // debugger
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    // try {
    //   const analyticsResponse = await axios.get('http://localhost:9090/api/analytics/getAnalytics');
    //   setAnalyticsData(analyticsResponse.data);
    // } catch (error) {
    //   console.error('Error fetching analytics data:', error);
    // }

    try {
      const todoResponse = await axios.get(`${baseUrl}api/todo/getData`);
      setTodoData(todoResponse.data);
    } catch (error) {
      console.error('Error fetching todo data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculatePriorityCount = (priority) => {
    return todoData.filter(task => task.priority === priority).length;
  };

  const calculateDueDateCount = () => {
    return todoData.filter(task => task.dueDate !== '').length;
  };

  return (
    <>
      <div>
        <div className={styles.header}>
          <h2>Analytics</h2>
        </div>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.list}>
              <h3><FiberManualRecordIcon className={styles.icon} />Backlogs</h3><h3>{analyticsData ? analyticsData.backlogs : 0}</h3>
            </div>
            <div className={styles.list}>
              <h3><FiberManualRecordIcon className={styles.icon} />To-do Tasks</h3><h3>{analyticsData ? analyticsData.todo : 0}</h3>
            </div>
            <div className={styles.list}>

              <h3><FiberManualRecordIcon className={styles.icon} />In-Progress Tasks</h3><h3>{analyticsData ? analyticsData.progress : 0}</h3>
            </div>
            <div className={styles.list}>
              <h3><FiberManualRecordIcon className={styles.icon} />Completed Tasks</h3><h3>{analyticsData ? analyticsData.done : 0}</h3>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.list}>
              <h3><FiberManualRecordIcon className={styles.icon} />Low Priority</h3><h3>{calculatePriorityCount('LOW PRIORITY')}</h3>
            </div>
            <div className={styles.list}>
              <h3><FiberManualRecordIcon className={styles.icon} />Moderate Priority</h3><h3>{calculatePriorityCount('MODERATE PRIORITY')}</h3>
            </div>
            <div className={styles.list}>

              <h3><FiberManualRecordIcon className={styles.icon} />High Priority</h3><h3>{calculatePriorityCount('HIGH PRIORITY')}</h3>
            </div>
            <div className={styles.list}>

              <h3><FiberManualRecordIcon className={styles.icon} />Due Date Tasks</h3><h3>{calculateDueDateCount()}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Analytics