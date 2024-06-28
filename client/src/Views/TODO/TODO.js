import { useEffect, useState } from 'react'
import Styles from './TODO.module.css'
import { dummy } from './dummy'
import axios from 'axios';

export function TODO(props) {

    const [newTodo, setNewTodo] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [todoData, setTodoData] = useState(dummy);
    const [loading, setLoading] = useState(true);
    const [editFormData, setEditFormData] = useState({
        id: '',
        title: '',
        description: ''
    });

    useEffect(() => {
        const fetchTodo = async () => {
            const apiData = await getTodo()
            setTodoData(apiData);
            setLoading(false)
        }
        fetchTodo();
    }, [])

    const getTodo = async () => {
        const options = {
            method: "GET",
            url: "http://localhost:8000/api/todo",
            headers: {
                accept: "application/json",
            }
        }
        try {
            const response = await axios.request(options)
            return response.data
        } catch (err) {
            console.log(err);
            return []; // return an empty array in case of error
        }
    }

    const addTodo = () => {
        const options = {
            method: "POST",
            url: "http://localhost:8000/api/todo",
            headers: {
                accept: "application/json",
            },
            data: {
                title: newTodo,
                description : newDescription
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData(prevData => [...prevData, response.data.newTodo])
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const deleteTodo = (id) => {
        const options = {
            method: "DELETE",
            url: "http://localhost:8000/api/todo/${id}",
            headers: {
                accept: "application/json",
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData(prevData => prevData.filter(todo => todo._id !== id))
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const updateTodo = (id) => {
        const todoToUpdate = todoData.find(todo => todo._id === id)
        const options = {
            method: "PATCH",
            url: "http://localhost:8000/api/todo/${id}",
            headers: {
                accept: "application/json",
            },
            data: {
                ...todoToUpdate,
                done: !todoToUpdate.done
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo))
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const editTodo = (id) => {
        const options = {
            method: "PATCH",
            url: "http://localhost:8000/api/todo/${id}",
            headers: {
                accept: "application/json",
            },
            data: {
                title: editFormData.title,
                description: editFormData.description
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo));
                setEditFormData({ id: '', title: '', description: '' });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleEditClick = (todo) => {
        setEditFormData({
            id: todo._id,
            title: todo.title,
            description: todo.description
        });
    };

    

    return (
        <div className={Styles.ancestorContainer}>
            <div className={Styles.headerContainer}>
                <h1>
                    Tasks
                </h1>
                <span>
                    <div>
                        <input
                        className={Styles.todoInput}
                        type='text'
                        name='New Todo'
                        placeholder='Add a new todo'
                        
                        value={newTodo}
                        onChange={(event) => {
                            setNewTodo(event.target.value)
                        }}
                    />
                    </div>
                    
                    <div>
                        <input
                        className={Styles.todoInput}
                        type='text'
                        name='New Description'
                        placeholder='Description'
                        value={newDescription}
                        onChange={(event) => {
                            setNewDescription(event.target.value);
                        }}
                    />
                    </div>
                    
                    <div >
                        <button
                                id='addButton'
                                name='add'
                                className={Styles.addButton}
                                onClick={() => {
                                    addTodo();
                                    setNewTodo('');
                                    setNewDescription('');
                                }}
                            >
                                + New Todo
                            </button>
                    </div>
                </span>
            </div>
            
            <div id='todoContainer' className={Styles.todoContainer}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : (
                    todoData.length > 0 ? (
                        todoData.map((entry, index) => (
                            <div key={entry._id} className={Styles.todo}>
                                <span className={Styles.infoContainer}>
                                    <input
                                        type='checkbox'
                                        checked={entry.done}
                                        onChange={() => {
                                            updateTodo(entry._id);
                                        }}
                                    />
                                   <strong>{entry.title}</strong> 
                                   
                                    
                                </span>
                                
                                <span className='styles.todoDescription'>
                                    {entry.description}
                                </span>
                                
                                <span
                                    className={Styles.editButton}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        handleEditClick(entry);
                                    }}
                                >
                                    Edit
                                </span>
                                <span
                                    className={Styles.deleteButton}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        deleteTodo(entry._id);
                                    }}
                                >
                                    Delete
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className={Styles.noTodoMessage}>No tasks available. Please add a new task.</p>
                    )
                )}
            </div>

            {editFormData.id && (
                <div className={Styles.editForm}>
                    <h2>Edit Todo</h2>
                    <input
                        className={Styles.todoInput}
                        type='text'
                        name='Edit Title'
                        value={editFormData.title}
                        onChange={(event) => {
                            setEditFormData({ ...editFormData, title: event.target.value });
                        }}
                    />
                    <input
                        className={Styles.todoInput}
                        type='text'
                        name='Edit Description'
                        value={editFormData.description}
                        onChange={(event) => {
                            setEditFormData({ ...editFormData, description: event.target.value });
                        }}
                    />
                    <button
                        id='editButton'
                        name='edit'
                        className={Styles.addButton}
                        onClick={() => {
                            editTodo(editFormData.id);
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            )}


        </div>    

    )
}