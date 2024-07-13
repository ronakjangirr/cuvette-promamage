import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Style.module.css';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import FiberManualRecordSharpIcon from '@mui/icons-material/FiberManualRecordSharp';
// import 'react-datepicker/dist/react-datepicker.css';
import MoreHorizSharpIcon from '@mui/icons-material/MoreHorizSharp';
import ArrowDropDownCircleSharpIcon from '@mui/icons-material/ArrowDropDownCircleSharp';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import DeleteTodo from '../../PopUps/DeleteTodo/DeleteTodo';
import EditTodo from '../../PopUps/EditTodo/EditTodo';
import CreateTodo from '../../PopUps/CreateTodo/CreateTodo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../apiConfig';

function Dash({ onDataLengthUpdate }) {
    const [selectedOption, setSelectedOption] = useState('This week');
    const [isOpen, setIsOpen] = useState(false);
    const [todoData, setTodoData] = useState([]);
    const [backlogData, setBacklogData] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [doneData, setDoneData] = useState([]);
    const [editTodoId, setEditTodoId] = useState(null);
    const [showDeleteTodo, setShowDeleteTodo] = useState(false);
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [showEditTodo, setShowEditTodo] = useState(false);
    const [expandedStates, setExpandedStates] = useState(Array(todoData.length).fill(false));
    const [showCreateTodo, setShowCreateTodo] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate()
    const [userName, setUserName] = useState('')

    useEffect(() => {
        // Update myData whenever any of the state variables change
        let myData = {
            backlogDataLength: backlogData.length,
            progressDataLength: progressData.length,
            todoDataLength: todoData.length,
            doneDataLength: doneData.length,
        };
        onDataLengthUpdate(myData);
    }, [todoData, backlogData, progressData, doneData]);



    //   Uncomment it later for token verification
    useEffect(() => {
        let verifyToken = window.localStorage.getItem('token')

        if (!verifyToken) {
            navigate('/')
        }
        console.log("backlogData Length", backlogData.length);
        console.log("TodoData Length", todoData.length);

        console.log("progressData Length", progressData.length);

        console.log("doneData Length", doneData.length);

        console.log("formattedDueDate====", todoData)
        setUserName(window.localStorage.getItem("username"))
    }, [])

    const handleShare = (id) => {
        const url = `${window.location.origin}/todo-list/${id}`;

        navigator.clipboard.writeText(url)
            .then(() => {
                toast("Link copied", { position: "top-right" });
            })
            .catch((error) => {
                console.error('Failed to copy link: ', error);
            });
    }

    const formatDate = () => {
        const date = new Date();
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return formattedDate;
    };

    const handleDeleteClick = async (objectId) => {
        // debugger
        setSelectedObjectId(objectId);
        setShowDeleteTodo(true);
    };

    const handleCloseDeleteTodo = (flag) => {
        setShowDeleteTodo(flag);
    }

    const handleEditSuccess = (updatedItem) => {
        setBacklogData(prevBacklogData => {
            const index = prevBacklogData.findIndex(item => item._id === updatedItem._id);

            if (index !== -1) {
                const updatedBacklogData = [...prevBacklogData];
                updatedBacklogData[index] = updatedItem;
                return updatedBacklogData;
            }

            return prevBacklogData;
        });

        setTodoData(prevBacklogData => {
            const index = prevBacklogData.findIndex(item => item._id === updatedItem._id);

            if (index !== -1) {
                const updatedBacklogData = [...prevBacklogData];
                updatedBacklogData[index] = updatedItem;
                return updatedBacklogData;
            }

            return prevBacklogData;
        });

        setProgressData(prevBacklogData => {
            const index = prevBacklogData.findIndex(item => item._id === updatedItem._id);

            if (index !== -1) {
                const updatedBacklogData = [...prevBacklogData];
                updatedBacklogData[index] = updatedItem;
                return updatedBacklogData;
            }

            return prevBacklogData;
        });

        setDoneData(prevBacklogData => {
            const index = prevBacklogData.findIndex(item => item._id === updatedItem._id);
            if (index !== -1) {
                const updatedBacklogData = [...prevBacklogData];
                updatedBacklogData[index] = updatedItem;
                return updatedBacklogData;
            }
            return prevBacklogData;
        });
    };


    const handleDeleteSuccess = () => {
        setBacklogData(prevBacklogData => prevBacklogData.filter(item => item._id !== selectedObjectId));

        setProgressData(prevProgressData => prevProgressData.filter(item => item._id !== selectedObjectId));

        setDoneData(prevDoneData => prevDoneData.filter(item => item._id !== selectedObjectId));
    };


    const handleUpdateTodoArray = (updatedData) => {
        setTodoData(prevData => [...prevData, updatedData]); // Add the new todo to the todoData array
    }

    const fetchData = async () => {
        try {
            // const response = await axios.get('http://localhost:9090/api/todo/getData');
            const response = await axios.get(`${baseUrl}api/todo/getData`);

            const data = response.data.map(item => ({
                ...item,
                formattedDueDate: formatDueDate(item.dueDate),
                isOverdue: new Date(item.dueDate) < new Date()
            }));
            setTodoData(data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (id) => {
        // debugger
        setEditTodoId(id);
        setShowEditTodo(true)
    }

    const handleCloseEdit = (flag) => {
        setShowEditTodo(flag)
    }

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

    const formatDueDate = (dueDate) => {
        if (dueDate) {
            const date = new Date(dueDate);
            const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            return formattedDate;
        } else {
            return "";
        }
    };


    const toggleDropdown = async (option) => {
        setIsOpen(!isOpen);
        setSelectedOption(option);

        try {
            // debugger
            // const response = await axios.get(`http://localhost:9090/api/todo/filterData/${option}`);
            const response = await axios.get(`${baseUrl}api/todo/filterData/${option}`);
            const data = response.data
            setTodoData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const togglePopup = () => {
        setShowCreateTodo(true)
    };

    const handleCloseCreate = () => {
        setShowCreateTodo(false)
    }

    const toggleExpansion = (index) => {
        const updatedStates = [...expandedStates];
        updatedStates[index] = !updatedStates[index];
        setExpandedStates(updatedStates);
    };

    const toggleDropdownTwo = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const moveTodoToBacklog = async (index) => {
        try {
            const updatedTodoData = [...todoData];
            const itemToMove = updatedTodoData.splice(index, 1)[0];
            setTodoData(updatedTodoData);
            setBacklogData(prevState => {
                const updatedBacklogData = [...prevState, itemToMove];

                const updateAnalytics = async () => {
                    try {
                        let analyticsLength = {
                            backlogLength: updatedBacklogData.length,
                        };

                        // let response = await axios.post('http://localhost:9090/api/analytics/saveAnalytics', analyticsLength);
                        let response = await axios.post(`${baseUrl}api/analytics/saveAnalytics`, analyticsLength);
                        let request = response.data;
                        console.log("request", request);
                    } catch (error) {
                        console.error("Error updating analytics data:", error);
                    }
                };
                updateAnalytics();
                return updatedBacklogData;
            });
        } catch (error) {
            console.error("Error moving todo to backlog:", error);
        }
    };

    const moveTodoToProgress = async (index) => {
        try {
            const updatedTodoData = [...todoData];
            const itemToMove = updatedTodoData.splice(index, 1)[0];
            setTodoData(updatedTodoData);

            setProgressData(prevState => {
                const updatedBacklogData = [...prevState, itemToMove];

                const updateAnalytics = async () => {
                    try {
                        let analyticsLength = {
                            progressLength: updatedBacklogData.length,
                        };

                        // let response = await axios.post('http://localhost:9090/api/analytics/saveAnalytics', analyticsLength);
                        let response = await axios.post(`${baseUrl}api/analytics/saveAnalytics`, analyticsLength);
                        let request = response.data;
                        console.log("request", request);
                    } catch (error) {
                        console.error("Error updating analytics data:", error);
                    }
                };
                updateAnalytics();

                return updatedBacklogData;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const moveTodoToDone = async (index) => {
        try {
            const updatedTodoData = [...todoData];
            const itemToMove = updatedTodoData.splice(index, 1)[0];
            setTodoData(updatedTodoData);
            setDoneData(prevState => {
                const updatedBacklogData = [...prevState, itemToMove];

                const updateAnalytics = async () => {
                    try {
                        let analyticsLength = {
                            doneLength: updatedBacklogData.length
                        };

                        // let response = await axios.post('http://localhost:9090/api/analytics/saveAnalytics', analyticsLength);
                        let response = await axios.post(`${baseUrl}api/analytics/saveAnalytics`, analyticsLength);

                        let request = response.data;
                        console.log("request", request);
                    } catch (error) {
                        console.error("Error updating analytics data:", error);
                    }
                };
                updateAnalytics();
                return updatedBacklogData;
            });
        } catch (error) {
            console.error(error);
        }

    };

    const moveBacklogToProgress = async (index) => {
        try {
            const updatedTodoData = [...backlogData];
            const itemToMove = updatedTodoData.splice(index, 1)[0];
            setBacklogData(updatedTodoData);
            setProgressData(prevState => {
                const updatedBacklogData = [...prevState, itemToMove];

                const updateAnalytics = async () => {
                    try {
                        let analyticsLength = {
                            progressLength: updatedBacklogData.length,
                        };
                        // let response = await axios.post('http://localhost:9090/api/analytics/saveAnalytics', analyticsLength);
                        let response = await axios.post(`${baseUrl}api/analytics/saveAnalytics`, analyticsLength);
                        let request = response.data;
                        console.log("request", request);
                    } catch (error) {
                        console.error("Error updating analytics data:", error);
                    }
                };
                updateAnalytics();
                return updatedBacklogData;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const moveBacklogToDone = async (index) => {
        try {
            const updatedTodoData = [...backlogData];
            const itemToMove = updatedTodoData.splice(index, 1)[0];
            setBacklogData(updatedTodoData);
            setDoneData(prevState => {
                const updatedBacklogData = [...prevState, itemToMove];
                const updateAnalytics = async () => {
                    try {
                        let analyticsLength = {
                            doneLength: updatedBacklogData.length
                        };
                        // let response = await axios.post('http://localhost:9090/api/analytics/saveAnalytics', analyticsLength);
                        let response = await axios.post(`${baseUrl}api/analytics/saveAnalytics`, analyticsLength);

                        let request = response.data;
                        console.log("request", request);
                    } catch (error) {
                        console.error("Error updating analytics data:", error);
                    }
                };
                updateAnalytics();
                return updatedBacklogData;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const moveProgressToBacklog = async (index) => {
        try {
            const updatedTodoData = [...progressData];
            const itemToMove = updatedTodoData.splice(index, 1)[0];
            setProgressData(updatedTodoData);
            setBacklogData(prevState => {
                const updatedBacklogData = [...prevState, itemToMove];

                const updateAnalytics = async () => {
                    try {
                        let analyticsLength = {
                            backlogLength: updatedBacklogData.length,
                        };
                        // let response = await axios.post('http://localhost:9090/api/analytics/saveAnalytics', analyticsLength);
                        let response = await axios.post(`${baseUrl}api/analytics/saveAnalytics`, analyticsLength);
                        let request = response.data;
                        console.log("request", request);
                    } catch (error) {
                        console.error("Error updating analytics data:", error);
                    }
                };
                updateAnalytics();
                return updatedBacklogData;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const moveProgressToDone = async (index) => {
        try {
            const updatedTodoData = [...progressData];
            const itemToMove = updatedTodoData.splice(index, 1)[0];
            setProgressData(updatedTodoData);
            setDoneData(prevState => {
                const updatedBacklogData = [...prevState, itemToMove];

                const updateAnalytics = async () => {
                    try {
                        let analyticsLength = {
                            doneLength: updatedBacklogData.length
                        };
                        // let response = await axios.post('http://localhost:9090/api/analytics/saveAnalytics', analyticsLength);
                        let response = await axios.post(`${baseUrl}api/analytics/saveAnalytics`, analyticsLength);
                        let request = response.data;
                        console.log("request", request);
                    } catch (error) {
                        console.error("Error updating analytics data:", error);
                    }
                };
                updateAnalytics();

                return updatedBacklogData;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const moveDoneToBacklog = async (index) => {
        try {
            const updatedTodoData = [...progressData];
            const itemToMove = updatedTodoData.splice(index, 1)[0];
            setDoneData(updatedTodoData);
            setBacklogData(prevState => {
                const updatedBacklogData = [...prevState, itemToMove];

                const updateAnalytics = async () => {
                    try {
                        let analyticsLength = {
                            backlogLength: updatedBacklogData.length,
                        };
                        // let response = await axios.post('http://localhost:9090/api/analytics/saveAnalytics', analyticsLength);
                        let response = await axios.post(`${baseUrl}api/analytics/saveAnalytics`, analyticsLength);
                        let request = response.data;
                        console.log("request", request);
                    } catch (error) {
                        console.error("Error updating analytics data:", error);
                    }
                };
                updateAnalytics();
                return updatedBacklogData;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const moveDoneToProgress = async (index) => {
        try {
            const updatedTodoData = [...progressData];
            const itemToMove = updatedTodoData.splice(index, 1)[0];
            setDoneData(updatedTodoData);
            setProgressData(prevState => {
                const updatedBacklogData = [...prevState, itemToMove];

                const updateAnalytics = async () => {
                    try {
                        let analyticsLength = {
                            progressLength: updatedBacklogData.length,
                        };
                        // let response = await axios.post('http://localhost:9090/api/analytics/saveAnalytics', analyticsLength);
                        let response = await axios.post(`${baseUrl}api/analytics/saveAnalytics`, analyticsLength);

                        let request = response.data;
                        console.log("request", request);
                    } catch (error) {
                        console.error("Error updating analytics data:", error);
                    }
                };
                updateAnalytics();
                return updatedBacklogData;
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className={styles.mainContainer}>
                <ToastContainer />
                <div className={styles.header}>
                    <h2>Welcome! {userName}</h2>
                    <h3>{formatDate()}</h3>
                </div>
                <div className={styles.header}>
                    <h2>Board</h2>

                    <div className={styles.dropdown}>
                        <button onClick={() => toggleDropdown(selectedOption)} className={styles.dropbtn}>
                            {selectedOption} <KeyboardArrowDownOutlinedIcon />
                        </button>
                        {isOpen && (
                            <div className={styles.dropdownContent}>
                                <a href="#" onClick={() => toggleDropdown('Today')}>Today</a>
                                <a href="#" onClick={() => toggleDropdown('This week')}>This week</a>
                                <a href="#" onClick={() => toggleDropdown('This Month')}>This Month</a>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.container}>

                    <div className={styles.row}>
                        <div className={styles.childRow}>
                            <p>Backlogs</p>
                            <div className={styles.iconContainer}>
                                <p><AddOutlinedIcon /></p>
                            </div>
                        </div>
                        <div>

                            {backlogData.map((item, index) => (
                                <div className={styles.main} key={index}>
                                    <div className={styles.childTodoHeader}>
                                        {item && item.priority && (
                                            <p>
                                                <FiberManualRecordSharpIcon className={styles.highIcon} style={{ fontSize: '12px', color: getPriorityColor(item.priority) }} />
                                                {item.priority}
                                            </p>
                                        )}

                                        <div className={styles.dropdownTwo}>
                                            <MoreHorizSharpIcon onClick={toggleDropdownTwo} />
                                            {isDropdownOpen && (
                                                <div className={styles.dropdownTwoContent}>
                                                    <a onClick={() => handleEdit(item._id)}>Edit</a>
                                                    <a onClick={() => handleShare(item._id)}>Share</a>
                                                    <a onClick={() => handleDeleteClick(item._id)}>Delete</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.titleHeader}>
                                        <h2>{item && item.title}</h2>
                                    </div>
                                    <div className={styles.todoHeader} onClick={() => toggleExpansion(index)}>
                                        <h3>Checklist {item && item.list ? item.list.length : 0}</h3>
                                        {expandedStates[index] ? <ArrowCircleUpIcon /> : <ArrowDropDownCircleSharpIcon />}
                                    </div>
                                    <div className={`${styles.listItems} ${expandedStates[index] ? styles.expanded : styles.collapsed}`}>
                                        {item && item.list && item.list.length > 0 ? (
                                            <ul className={styles.checklist}>
                                                {item.list.map((listItem, listItemIndex) => (
                                                    <li key={listItemIndex} className={styles.listStyle}>
                                                        <input
                                                            type="checkbox"
                                                            id={`checkbox-${index}-${listItemIndex}`}
                                                            checked={item.checkedTasks[listItemIndex]}
                                                            className={styles.checkbox} />
                                                        {listItem}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No checklist items</p>
                                        )}
                                    </div>
                                    <div className={styles.footerButtonContainer}>
                                        <button className={`${styles.footerButton} ${item && item.isOverdue ? styles.overdue : ''}`}>{item.formattedDueDate ? `${item.formattedDueDate}th` : 'No Due Date'}</button>
                                        <button className={styles.footerButton} >BACKLOG</button>
                                        <button className={styles.footerButton} onClick={() => moveBacklogToProgress(index)}>PROGRESS</button>
                                        <button className={styles.footerButton} onClick={() => moveBacklogToDone(index)}>DONE</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.childRow}>
                            <p>Todo</p>
                            <div className={styles.iconContainer}>
                                <p onClick={togglePopup}><AddOutlinedIcon /></p>
                                <p><DoNotDisturbOnOutlinedIcon className={styles.minus} /></p>

                            </div>
                        </div>
                        <div>
                            {todoData.map((item, index) => (
                                <div className={styles.main} key={index}>
                                    <div className={styles.childTodoHeader}>
                                        {item && item.priority && (
                                            <p>
                                                <FiberManualRecordSharpIcon className={styles.highIcon} style={{ fontSize: '12px', color: getPriorityColor(item.priority) }} />
                                                {item.priority}
                                            </p>
                                        )}
                                        <div className={styles.dropdownTwo}>
                                            <MoreHorizSharpIcon onClick={toggleDropdownTwo} />
                                            {isDropdownOpen && (
                                                <div className={styles.dropdownTwoContent}>
                                                    <a onClick={() => handleEdit(item._id)}>Edit</a>
                                                    <a onClick={() => handleShare(item._id)}>Share</a>
                                                    <a onClick={() => handleDeleteClick(item._id)}>Delete</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.titleHeader}>
                                        <h2>{item && item.title}</h2>
                                    </div>
                                    <div className={styles.todoHeader} onClick={() => toggleExpansion(index)}>
                                        <h3>Checklist {item && item.list ? item.list.length : 0}</h3>
                                        {expandedStates[index] ? <ArrowCircleUpIcon /> : <ArrowDropDownCircleSharpIcon />}
                                    </div>
                                    <div className={`${styles.listItems} ${expandedStates[index] ? styles.expanded : styles.collapsed}`}>
                                        {item && item.list && item.list.length > 0 ? (
                                            <ul className={styles.checklist}>
                                                {item.list.map((listItem, listItemIndex) => (
                                                    <li key={listItemIndex} className={styles.listStyle}>
                                                        <input
                                                            type="checkbox"
                                                            id={`checkbox-${index}-${listItemIndex}`}
                                                            checked={item.checkedTasks[listItemIndex]}
                                                            className={styles.checkbox} />
                                                        {listItem}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No checklist items</p>
                                        )}
                                    </div>
                                    <div className={styles.footerButtonContainer}>
                                        <button className={`${styles.footerButton} ${item && item.isOverdue ? styles.overdue : ''}`}>{item.formattedDueDate ? `${item.formattedDueDate}th` : 'No Due Date'}</button>
                                        <button className={styles.footerButton} onClick={() => moveTodoToBacklog(index)}>BACKLOG</button>
                                        <button className={styles.footerButton} onClick={() => moveTodoToProgress(index)}>PROGRESS</button>
                                        <button className={styles.footerButton} onClick={() => moveTodoToDone(index)}>DONE</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.childRow}>
                            <p>In progress</p>
                            <div className={styles.iconContainer}>
                                <p><AddOutlinedIcon /></p>
                            </div>
                        </div>
                        <div>
                            {progressData.map((item, index) => (
                                <div className={styles.main} key={index}>
                                    <div className={styles.childTodoHeader}>
                                        {item && item.priority && (
                                            <p>
                                                <FiberManualRecordSharpIcon className={styles.highIcon} style={{ fontSize: '12px', color: getPriorityColor(item.priority) }} />
                                                {item.priority}
                                            </p>
                                        )}
                                        <div className={styles.dropdownTwo}>
                                            <MoreHorizSharpIcon onClick={toggleDropdownTwo} />
                                            {isDropdownOpen && (
                                                <div className={styles.dropdownTwoContent}>
                                                    <a onClick={() => handleEdit(item._id)}>Edit</a>
                                                    <a onClick={() => handleShare(item._id)}>Share</a>
                                                    <a className={styles.deleteOption} onClick={() => handleDeleteClick(item._id)}>Delete</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.titleHeader}>
                                        <h2>{item && item.title}</h2>
                                    </div>
                                    <div className={styles.todoHeader} onClick={() => toggleExpansion(index)}>
                                        <h3>Checklist {item && item.list ? item.list.length : 0}</h3>
                                        {expandedStates[index] ? <ArrowCircleUpIcon /> : <ArrowDropDownCircleSharpIcon />}
                                    </div>
                                    <div className={`${styles.listItems} ${expandedStates[index] ? styles.expanded : styles.collapsed}`}>
                                        {item && item.list && item.list.length > 0 ? (
                                            <ul className={styles.checklist}>
                                                {item.list.map((listItem, listItemIndex) => (
                                                    <li key={listItemIndex} className={styles.listStyle}>
                                                        <input
                                                            type="checkbox"
                                                            id={`checkbox-${index}-${listItemIndex}`}
                                                            checked={item.checkedTasks[listItemIndex]}
                                                            className={styles.checkbox} />
                                                        {listItem}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No checklist items</p>
                                        )}
                                    </div>
                                    <div className={styles.footerButtonContainer}>
                                        <button className={`${styles.footerButton} ${item && item.isOverdue ? styles.overdue : ''}`}>{item.formattedDueDate ? `${item.formattedDueDate}th` : 'No Due Date'}</button>
                                        <button className={styles.footerButton} onClick={() => moveProgressToBacklog(index)}>BACKLOG</button>
                                        <button className={styles.footerButton}>PROGRESS</button>
                                        <button className={styles.footerButton} onClick={() => moveProgressToDone(index)}>DONE</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.childRow}>
                            <p>Done</p>
                            <div className={styles.iconContainer}>
                                <p><AddOutlinedIcon /></p>
                            </div>
                        </div>
                        <div>
                            {doneData.map((item, index) => (
                                <div className={styles.main} key={index}>
                                    <div className={styles.childTodoHeader}>
                                        {item && item.priority && (
                                            <p>
                                                <FiberManualRecordSharpIcon className={styles.highIcon} style={{ fontSize: '12px', color: getPriorityColor(item.priority) }} />
                                                {item.priority}
                                            </p>
                                        )}
                                        <div className={styles.dropdownTwo}>
                                            <MoreHorizSharpIcon onClick={toggleDropdownTwo} />
                                            {isDropdownOpen && (
                                                <div className={styles.dropdownTwoContent}>
                                                    <a onClick={() => handleEdit(item._id)}>Edit</a>
                                                    <a onClick={() => handleShare(item._id)}>Share</a>
                                                    <a className={styles.deleteOption} onClick={() => handleDeleteClick(item._id)}>Delete</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.titleHeader}>
                                        <h2>{item && item.title}</h2>
                                    </div>
                                    <div className={styles.todoHeader} onClick={() => toggleExpansion(index)}>
                                        <h3>Checklist {item && item.list ? item.list.length : 0}</h3>
                                        {expandedStates[index] ? <ArrowCircleUpIcon /> : <ArrowDropDownCircleSharpIcon />}
                                    </div>
                                    <div className={`${styles.listItems} ${expandedStates[index] ? styles.expanded : styles.collapsed}`}>
                                        {item && item.list && item.list.length > 0 ? (
                                            <ul className={styles.checklist}>
                                                {item.list.map((listItem, listItemIndex) => (
                                                    <li key={listItemIndex} className={styles.listStyle}>
                                                        <input
                                                            type="checkbox"
                                                            id={`checkbox-${index}-${listItemIndex}`}
                                                            checked={item.checkedTasks[listItemIndex]}
                                                            className={styles.checkbox} />
                                                        {listItem}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No checklist items</p>
                                        )}
                                    </div>
                                    <div className={styles.footerButtonContainer}>
                                        {/* <button className={`${styles.footerButton} ${item && item.isOverdue ? styles.overdue : ''}`}>{item.formattedDueDate ? `${item.formattedDueDate}th` : 'No Due Date'}</button> */}
                                        <button className={`${styles.footerButton} ${item && item.isOverdue ? styles.overdueGreen : ''}`}>{item.formattedDueDate ? `${item.formattedDueDate}th` : 'No Due Date'}</button>
                                        <button className={styles.footerButton}>Completed Task</button>


                                        {/* <button className={styles.footerButton} onClick={() => moveDoneToBacklog(index)}>BACKLOG</button>
                                        <button className={styles.footerButton} onClick={() => moveDoneToProgress(index)}>PROGRESS</button>
                                        <button className={styles.footerButton} >DONE</button> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* //========== ||  CreateTodo Popup ||=============//*/}

            {showCreateTodo && <CreateTodo closeCreatePopup={handleCloseCreate} onSaveSuccess={handleUpdateTodoArray} />}

            {/* //========== ||  EditTodo Popup ||=============//*/}

            {showEditTodo && <EditTodo closeEditTodo={handleCloseEdit} todoId={editTodoId} onEditSuccess={handleEditSuccess} />}

            {/* //========== ||  DeleteTodo Popup ||=============//*/}

            {showDeleteTodo && <DeleteTodo closeDeleteTodo={handleCloseDeleteTodo} objectId={selectedObjectId} onDeleteSuccess={fetchData} onDeleteUpdate={handleDeleteSuccess} />}

        </>
    )
}

export default Dash