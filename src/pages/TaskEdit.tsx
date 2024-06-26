import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { Todo } from "../../types/todo";

function TaskEdit() {
    const navigate = useNavigate()
    let { id } = useParams();
    const [errors, setErrors] = useState<string[]>([])
    const [task, setTask] = useState<Todo>({
        id: 0,
        name: '',
        url: '',
        completed: false
    })


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/api/get_task/${id}`);
            setTask(response.data);
          } catch (error: any) {
            console.error('Error fetching task:', error);
          }
        };
    
        fetchData();
    }, [id])


    const hadleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setTask({ ...task, [e.target.name]: e.target.value });
    }


    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setTask(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };
   
    const updateTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            name: task.name,
            url: task.url,
            completed: task.completed
        }

        let errors: string[] = [];

        if (!data.name) {
            errors.push("Task name is required!")
        }

        if (!data.url) {
            errors.push("Task url is required!")
        }

        setErrors(errors);

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/update_task/${id}`, data);
            alert(response.data.message);
            navigate('/')
        } catch (error: any) {
            errors.push(error.response);
        }
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="d-flex align-items-center justify-content-between m-0">Edit Task
                                <Link to="/" className="btn btn-primary float-end">
                                    Back
                                </Link>
                            </h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={updateTask}>
                                <div className="mb-3">
                                    <label htmlFor="name">Task Name</label>
                                    <input type="text" id="name" name="name" value={task.name} onChange={hadleInput} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="url">Task URL</label>
                                    <input type="text" id="url" name="url" value={task.url} onChange={hadleInput} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="completed">Task Completed</label>
                                    <div>
                                        <input type="checkbox" id="completed" name="completed" checked={task.completed} onChange={handleCheckboxChange} className="form-check-input" />
                                    </div>
                                </div>
                                <div>
                                    <ul className="text-danger">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-3">
                                    <button type="submit" className="btn btn-primary">Update Task</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskEdit;