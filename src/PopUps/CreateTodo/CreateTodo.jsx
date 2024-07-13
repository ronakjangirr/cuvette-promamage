import React, { useState, useEffect } from 'react'
import axios from 'axios';
import styles from './Style.module.css';
import FiberManualRecordSharpIcon from '@mui/icons-material/FiberManualRecordSharp';
import DatePicker from 'react-datepicker';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import 'react-datepicker/dist/react-datepicker.css';
import { baseUrl } from '../../apiConfig';

function CreateTodo({ closeCreatePopup, onSaveSuccess }) {
    // function CreateTodo({ closeCreatePopup, onSaveSuccess }) {

    const [tasks, setTasks] = useState([]);
    const [dueDate, setDueDate] = useState(null);
    const [checkedTasks, setCheckedTasks] = useState(Array(tasks.length).fill(false));

    const [data, setData] = useState({
        title: "",
        priority: "",
    })

    const handleChange = (e) => {
        // debugger
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = async () => {

        // debugger

        if (!data.title || !data.priority) {
            alert("Please fill all the mandatory fields");
            return;
        }
        // console.log("register", register);

        if (tasks.every(task => task.trim() === '')) {
            alert("Please add at least one task");
            return;
        }

        if (tasks.some(task => task.trim() === '')) {
            alert("All tasks should be filled");
            return;
        }

        let createdTodoData = {
            title: data.title,
            priority: data.priority,
            list: tasks,
            dueDate: dueDate ? dueDate.toLocaleDateString() : "",
            checkedTasks: checkedTasks
        }

        // console.log(createdTodoData)
        try {
            // debugger
            // let response = await axios.post('http://localhost:9090/api/todo/saveData', createdTodoData);
            let response = await axios.post(`${baseUrl}api/todo/saveData`, createdTodoData);
            let request = response.data

            console.log("Response Data", request)

            onSaveSuccess(request);
        } catch (error) {
            console.error(error)
        }
        handleCancel()
    }


    const handlePriorityChange = (priority) => {
        // if (selectedPriority === priority) {
        //     setSelectedPriority(''); // Deselect the button if it's already selected
        // } else {
        //     setSelectedPriority(priority); // Otherwise, select the clicked button
        // }

        setData(prevData => ({
            ...prevData,
            priority: priority
        }));
    };

    useEffect(() => {
        // console.log("Daata", data)
        // console.log("tasks", tasks)
        // console.log("checkedTasks", checkedTasks)
    }, [data, tasks, checkedTasks])

    const handleAddTask = () => {
        setTasks([...tasks, '']);
        setCheckedTasks([...checkedTasks, false]);
    };

    const handleTaskChange = (index, value) => {
        const updatedTasks = [...tasks];
        updatedTasks[index] = value;
        setTasks(updatedTasks);
    };

    const handleDelete = (index) => {
        const deleteTasks = [...tasks];
        deleteTasks.splice(index, 1);
        setTasks(deleteTasks);

        const updatedCheckedTasks = [...checkedTasks];
        updatedCheckedTasks.splice(index, 1);
        setCheckedTasks(updatedCheckedTasks);
    }

    const handleCheckboxChange = (index) => {
        const updatedCheckedTasks = [...checkedTasks];
        updatedCheckedTasks[index] = !updatedCheckedTasks[index];
        setCheckedTasks(updatedCheckedTasks);
    };

    const handleCancel = () => {
        closeCreatePopup(false);
    };

    return (
        <>
            <div className={styles.popup}>
                <div className={styles.card}>
                    <div className={styles.cardBody}>
                        <p className={styles.paragraph}>Title <span ><StarIcon style={{ fontSize: '12px', color: 'red' }} /></span></p>
                        <input type="text" placeholder="Enter your task" className={styles.inputContainer} name='title' value={data.title} onChange={handleChange}
                        />
                        <div className={styles.buttonContainer}>
                            <p>Select Priority<span ><StarIcon style={{ fontSize: '12px', color: 'red' }} /></span></p>
                            <button onClick={() => handlePriorityChange('HIGH PRIORITY')} ><FiberManualRecordSharpIcon className={styles.highIcon} style={{ fontSize: '12px' }} />HIGH PRIORITY</button>
                            <button onClick={() => handlePriorityChange('MODERATE PRIORITY')}><FiberManualRecordSharpIcon className={styles.moderateIcon} style={{ fontSize: '12px' }} />MODERATE PRIORITY</button>
                            <button onClick={() => handlePriorityChange('LOW PRIORITY')} ><FiberManualRecordSharpIcon className={styles.lowIcon} style={{ fontSize: '12px' }} />LOW PRIORITY</button>
                        </div>
                        <div>
                            <p>Checklist <span ><StarIcon style={{ fontSize: '12px', color: 'red' }} /></span> </p>
                        </div>
                        <div className={styles.taskContainer}>
                            {tasks.map((task, index) => (
                                <div className={styles.inputContainer} key={index}>
                                    <input className={styles.checkboxStyle} type='checkbox' checked={checkedTasks[index]} onChange={() => handleCheckboxChange(index)} />
                                    <input type="text" key={index} value={task} className={styles.inputField} placeholder="Enter your email" onChange={(e) => handleTaskChange(index, e.target.value)} />
                                    <DeleteIcon className={styles.deleteIcon} onClick={() => handleDelete(index)} />
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3><AddOutlinedIcon onClick={handleAddTask} />Add New</h3>
                        </div>
                        <div className={styles.btnContainer}>
                            <DatePicker
                                selected={dueDate}
                                onChange={date => setDueDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Select Due Date"
                                className={styles.calanderButton}
                            />
                            <div className={styles.childBtnContainer}>
                                <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                                <button className={styles.savebutton} onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateTodo;