import React, { useState, useEffect } from 'react'
import axios from 'axios';
import styles from './Style.module.css';
import FiberManualRecordSharpIcon from '@mui/icons-material/FiberManualRecordSharp';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { baseUrl } from '../../apiConfig';

function EditTodo({ todoId, closeEditTodo, onEditSuccess }) {
    const [todoData, setTodoData] = useState({
        title: "",
        priority: "",
        list: [],
        dueDate: "",
        checkedTasks: []
    })

    useEffect(() => {
        // console.log("todoData", todoData)
    }, [todoData])

    const fetchTodoData = async (id) => {
        try {
            // debugger
            // const response = await axios.get(`http://localhost:9090/api/todo/getEditData/${id}`);
            const response = await axios.get(`${baseUrl}api/todo/getEditData/${id}`);

            setTodoData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTodoData(todoId);
    }, [todoId]);


    const handleDueDateChange = (date) => {
        setTodoData(prevTodoData => ({
            ...prevTodoData,
            dueDate: date
        }));
    };

    const handleChange = (e) => {
        // debugger
        const { name, value } = e.target;
        setTodoData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handlePriorityChange = (priority) => {
        setTodoData(prevData => ({
            ...prevData,
            priority: priority
        }));
    };

    const handleCheckboxChange = (index) => {
        setTodoData(prevTodoData => {
            const updatedCheckedTasks = [...prevTodoData.checkedTasks];
            updatedCheckedTasks[index] = !updatedCheckedTasks[index];
            return {
                ...prevTodoData,
                checkedTasks: updatedCheckedTasks
            };
        });
    };

    const handleTaskChange = (index, value) => {
        const updatedList = [...todoData.list];
        updatedList[index] = value;
        setTodoData(prevTodoData => ({
            ...prevTodoData,
            list: updatedList
        }));
    };

    const handleDelete = (index) => {
        const updatedList = [...todoData.list];
        updatedList.splice(index, 1);

        const updatedCheckedTasks = todoData.checkedTasks.filter((_, i) => i !== index);

        setTodoData(prevTodoData => ({
            ...prevTodoData,
            list: updatedList,
            checkedTasks: updatedCheckedTasks
        }));
    };

    const handleAddTask = () => {
        setTodoData(prevTodoData => ({
            ...prevTodoData,
            list: [...prevTodoData.list, '']
        }));

        setTodoData(prevTodoData => ({
            ...prevTodoData,
            checkedTasks: [...prevTodoData.checkedTasks, false]
        }));
    };

    const handleCancel = () => {
        closeEditTodo(false)
    };

    const handleSave = async () => {
        // debugger
        if (!todoData.title.trim()) {
            alert("Title cannot be empty");
            return;
        }

        if (todoData.list.some(task => !task.trim())) {
            alert("Tasks in the checklist cannot be empty");
            return;
        }

        const { _id: todoId } = todoData;

        const dueDateString = todoData.dueDate instanceof Date ? todoData.dueDate.toLocaleDateString() : "";

        let editedData = {
            title: todoData.title,
            priority: todoData.priority,
            list: todoData.list,
            dueDate: dueDateString,
            checkedTasks: todoData.checkedTasks
        }
        // console.log(editedData)

        try {
            // debugger
            // let response = await axios.put(`http://localhost:9090/api/todo/update/${todoId}`, editedData);
            let response = await axios.put(`${baseUrl}api/todo/update/${todoId}`, editedData);

            let request = response.data.updatedTodo

            console.log("Response Data", request)

            onEditSuccess(request);
        } catch (error) {
            console.error(error)
        }
        handleCancel()

    }


    return (
        <>
            <div className={styles.popup}>
                <div className={styles.card}>
                    <div className={styles.cardBody}>
                        <p className={styles.paragraph}>Title <span ><StarIcon style={{ fontSize: '12px', color: 'red' }} /></span></p>
                        <input type="text" placeholder="Enter your task" className={styles.inputContainer} name='title'
                            value={todoData.title}
                            onChange={handleChange}
                        />
                        <div className={styles.buttonContainer}>
                            <p>Select Priority<span ><StarIcon style={{ fontSize: '12px', color: 'red' }} /></span></p>
                            <button onClick={() => handlePriorityChange('HIGH PRIORITY')}><FiberManualRecordSharpIcon className={styles.highIcon} style={{ fontSize: '12px' }} />HIGH PRIORITY</button>
                            <button onClick={() => handlePriorityChange('MODERATE PRIORITY')}><FiberManualRecordSharpIcon className={styles.moderateIcon} style={{ fontSize: '12px' }} />MODERATE PRIORITY</button>
                            <button onClick={() => handlePriorityChange('LOW PRIORITY')}><FiberManualRecordSharpIcon className={styles.lowIcon} style={{ fontSize: '12px' }} />LOW PRIORITY</button>
                        </div>
                        <div>
                            <p>Checklist <span ><StarIcon style={{ fontSize: '12px', color: 'red' }} /></span> </p>
                        </div>
                        <div>
                            {todoData.list.map((task, index) => (
                                <div className={styles.inputContainer} key={index}>
                                    <input type='checkbox' checked={todoData.checkedTasks[index]} onChange={() => handleCheckboxChange(index)} />
                                    <input type="text" key={index} value={task} className={styles.inputField} placeholder="Enter your Tasks" onChange={(e) => handleTaskChange(index, e.target.value)} />
                                    <DeleteIcon className={styles.deleteIcon} onClick={() => handleDelete(index)} />
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3><AddOutlinedIcon onClick={handleAddTask} />Add New</h3>
                        </div>
                        <div className={styles.btnContainer}>
                            <DatePicker
                                selected={todoData.dueDate}
                                onChange={handleDueDateChange}
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

export default EditTodo