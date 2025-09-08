import { useState, useRef } from 'react'
import './App.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



function App() {
  const [tasks,setTasks] = useState([]);
  const [notification,setNotification] = useState({show:false, message:""});
  const [showTask, setShowTask] = useState(false);

  const showTaskForm = ()=>{
    setShowTask(!showTask);

  }

  const timeRef = useRef(null);

  const showNotification = (message)=>{
    setNotification({show:true, message});
    clearTimeout(timeRef.current);
    timeRef.current = setTimeout(()=>{
      setNotification({show:false, message});
    },2000);
  }

  return (
    <>
      <Header 
        showTask={showTask}
      />

      <SideBar
        showTask={showTask}
        showTaskForm={showTaskForm} 
      />

      <TaskCard
        tasks={tasks}
        setTasks={setTasks}
        showNotification={showNotification}
        showTask={showTask}
      />

      <TaskForm
        tasks={tasks}
        setTasks={setTasks}
        showNotification={showNotification}
        showTask={showTask}
        setShowTask={setShowTask}
      />

      <Notification 
      notification={notification} />
    </>
  )
}


function Header({showTask}) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = ()=>{
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-theme");
  }

  return (
    <header className={showTask?"blur":""}>
      <nav>
        <h1>To Do App</h1>
        <button id="theme-toggle" onClick={toggleTheme}>Toggle Theme</button>
      </nav>
    </header>
  )
}

function TaskForm({tasks, setTasks, showNotification,showTask,setShowTask}) {
  const [input,setInput] = useState("");
  const [plannedDate, setPlannedDate] = useState(new Date());
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");

  const addTask = ()=>{
    if(input==="") return;
    const now = new Date();
    const time = now.toLocaleString();
    const newTask ={
      text: input,
      time: time,
      done: false,
      plannedDate: plannedDate,
      priority: priority,
      description: description,
    }
    setTasks([...tasks,newTask]);
    setInput("");
    setDescription("");
    showNotification("Task added successfully!");
    setShowTask(false);
  }
  return (
    <div className={`overlay ${showTask? "show":"hide"}`} onClick={()=>setShowTask(false)}>
    <div className={`create-task ${showTask?"show":"hide"}`} id="create-task" onClick={(e)=>e.stopPropagation()}>
        <span style={{fontSize:'24px',marginTop:'20px'}}>Title</span>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a new task" />
         <span style={{fontSize:'24px',marginTop:'20px'}}>Description</span>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write a description" />
        <div id="priority-options">
          <label>
            <input type="checkbox" className="circle-checkbox" value="High" checked={priority==="High"} onChange={(e)=>setPriority(e.target.checked?"High":"")} /> 
            <span style={{display:'inline-block', width: '9px',height:'9px', borderRadius:'50%', backgroundColor:'red', marginRight:'5px'}}></span>
            High Priority
          </label>
          <label>
            <input type="checkbox" className="circle-checkbox" value="Medium" checked={priority==="Medium"} onChange={(e)=>setPriority(e.target.checked?"Medium":"")} /> 
            <span style={{display:'inline-block', width: '9px',height:'9px', borderRadius:'50%', backgroundColor:'blue', marginRight:'5px'}}></span>
            Medium Priority
          </label>
          <label>
            <input type="checkbox" className="circle-checkbox" value="Low" checked={priority==="Low"} onChange={(e)=>setPriority(e.target.checked?"Low":"")} /> 
            <span style={{display:'inline-block', width: '9px',height:'9px', borderRadius:'50%', backgroundColor:'green', marginRight:'5px'}}></span>
            Low Priority
          </label>
        </div>
          <DatePicker selected={plannedDate} onChange={(date) => setPlannedDate(date)} dateFormat={"dd//MM/yyyy"}/>
          <button id="add-button" onClick={addTask}>Add</button>
      </div>
    </div>
  )
}

function TaskCard({tasks, setTasks, showNotification,showTask}) {
  const [changeInput,setChangeInput] = useState("");
  const [editingIndex,setEditingIndex] = useState(null);

  const taskDone = (index)=>{
    const updatedTasks = tasks.map((task,i)=>i===index?{...task,done:!task.done}:task);
    setTasks(updatedTasks);
    showNotification("Task status updated!");
  }

  const deleteTask = (index)=>{
    const updatedTasks = tasks.filter((_,i)=>i!==index);
    setTasks(updatedTasks);
    showNotification("Task deleted successfully!");
  }

  const updateTask = (index)=>{
    setEditingIndex(index);
    setChangeInput(tasks[index].text);
  }

  const confirmChange = (index)=>{
    if (changeInput == null || changeInput === "") return;
    const updatedTasks = tasks.map((task,i)=>i===index?{...task,text:changeInput}:task);
    setTasks(updatedTasks);
    setEditingIndex(null);
    setChangeInput("");
    showNotification("Task updated successfully!");
  }

  return (
    <ul id="task-cards" className={showTask?"blur":""}>
      {tasks.map((task, index) => (
        <div id="task-card">
          <li key={index} className={`task-list ${task.done ? "completed" : ""}`}>
            {editingIndex === index ? 
            (<>
              <input type='text' value={changeInput} onChange={(e) => setChangeInput(e.target.value)} /> 
              <button id='ok-button' onClick={()=>confirmChange(index)}>OK</button>
            </>) : 
            (<>
              <div>{task.text}</div>
              <div>{task.description}</div>
              <div style={{ marginLeft: '10px', fontSize: '1em', color: '#888' }}>Do before: {task.plannedDate?.toLocaleDateString()}</div>
              <div className='button-group'>
                <button className={`done-button ${task.done ? "completed" : ""}`} onClick={()=> taskDone(index)}>Done</button>
                <button id="delete-button" onClick={()=> deleteTask(index)}>Delete</button>
                <button id="update-button" onClick={()=> updateTask(index)}>Update</button>
              </div>
              <div className='task-meta'>
                <span className={`priority-indicator ${task.priority}`} style={{fontSize:'0.7em'}}>Priority: {task.priority} </span>
                <span style={{ marginLeft: '10px', fontSize: '0.7em', color: '#888' }}>Created on: ({task.time})</span>
              </div>
            </>)}
          </li>
        </div>
      ))}
    </ul>
  )
}

function Notification({notification}) {
  return (
    <div className={`notification ${notification.show ? "show": "hide"}`} id="notification">{notification.message}</div>
  )
}

function SideBar({showTask,showTaskForm}) {
  return (
    <div id="sidebar" className={showTask?"blur":""}>
      <button id="add-button" onClick={showTaskForm}>Add Task</button>
      <h2>Categories</h2>
      <ul>
        <li>All Tasks</li>
        <li>Completed Tasks</li>
        <li>Pending Tasks</li>
        <li>High Priority</li>
        <li>Medium Priority</li>
        <li>Low Priority</li>
      </ul>
    </div>
  )
}

export default App
