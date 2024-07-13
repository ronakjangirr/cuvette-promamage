import React, { useState, useEffect } from 'react'
import axios from 'axios';
import styles from './Style.module.css';
import FiberManualRecordSharpIcon from '@mui/icons-material/FiberManualRecordSharp';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import { baseUrl } from '../apiConfig';

function Todos() {
    const [todoData, setTodoData] = useState({
        title: "",
        priority: "",
        list: [],
        dueDate: "",
        checkedTasks: []
    })

    const { id } = useParams();

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH PRIORITY':
                return '#ff0070';
            case 'MODERATE PRIORITY':
                return '#54b1fe';
            case 'LOW PRIORITY':
                return '#63c05b';
            default:
                return 'black';
        }
    };

    useEffect(() => {
        const fetchTodoById = async () => {
            try {
                // debugger
                // const response = await axios.get(`http://localhost:9090/api/todo/getEditData/${id}`);
                const response = await axios.get(`${baseUrl}api/todo/getEditData/${id}`);
                const data = response.data
                setTodoData(data);

                // setTodoData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTodoById();
    }, []); 

    const formatDueDate = (dueDate) => {
        const date = new Date(dueDate);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const suffix = (day === 1 || day === 21 || day === 31) ? 'st' : (day === 2 || day === 22) ? 'nd' : (day === 3 || day === 23) ? 'rd' : 'th';
        return `${month} ${day}${suffix}`;
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    return (
        <>
            <div className={styles.popup}>
                <div className={styles.card}>
                    <div className={styles.cardBody}>
                        {todoData && todoData.priority && (
                            <p>
                                <FiberManualRecordSharpIcon className={styles.highIcon} style={{ fontSize: '12px', color: getPriorityColor(todoData.priority) }} />
                                {todoData && todoData.priority}
                            </p>
                        )}
                        <div className={styles.titleHeader}>
                            <h2>{todoData && todoData.title}</h2>
                        </div>
                        <div className={styles.todoHeader}>
                            <h3>Checklist : {todoData && todoData.checkedTasks && (
                                <span>
                                    {todoData.checkedTasks.filter(task => task).length}
                                </span>
                            )}  /{todoData && todoData.list && todoData.list.length} </h3>
                        </div>
                        <div className={styles.checklistScrollbar}>
                            <ul className={styles.checklist}>
                                {todoData && todoData.list.map((listItem, index) => (
                                    <li key={index} className={styles.listStyle}>
                                        <input
                                            type="checkbox"
                                            checked={todoData.checkedTasks[index]}
                                            className={styles.checkbox}
                                        />
                                        {listItem}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.footerButtonContainer}>
                        Due Date -    
                            <button className={`${styles.footerButton} ${isOverdue(todoData.dueDate) ? styles.overdue : ''}`}>
                                {todoData && todoData.dueDate ? formatDueDate(todoData.dueDate) : 'No Due Date'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Todos







