import { useState, useRef, useEffect } from 'react'
import './App.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



function App() {
  const [tasks,setTasks] = useState([]);
  const [notification,setNotification] = useState({show:false, message:""});
  const [showTask, setShowTask] = useState(false);
  const [editingIndex,setEditingIndex] = useState(null);
  const [editingTask,setEditingTask] = useState(null);
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
        showTaskForm={showTaskForm}
      />

      <TaskCard
        tasks={tasks}
        setTasks={setTasks}
        showNotification={showNotification}
        showTask={showTask}
        setShowTask={setShowTask}
        setEditingIndex={setEditingIndex}
        setEditingTask={setEditingTask}
      />

      <TaskForm
        tasks={tasks}
        setTasks={setTasks}
        showNotification={showNotification}
        showTask={showTask}
        setShowTask={setShowTask}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />

      <Notification 
      notification={notification} />
    </>
  )
}


function Header({showTask, showTaskForm}) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = ()=>{
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-theme");
  }

  return (
    <header className={showTask?"blur":""}>
      <nav>
        <div className='center' style={{width:'220px'}}></div>
        <div className='center-header'>
          <h1>To Do App</h1>
          <button id="add-button" onClick={showTaskForm}>Add Task</button>
        </div>
        <button id="theme-toggle" onClick={toggleTheme}>Toggle Theme</button>
      </nav>
    </header>
  )
}

function TaskForm({tasks, setTasks, showNotification,showTask,setShowTask, editingIndex, setEditingIndex, editingTask, setEditingTask}) {
  const [input,setInput] = useState(editingTask ? editingTask.text : "");
  const [plannedDate, setPlannedDate] = useState(editingTask ? new Date(editingTask.plannedDate) : new Date());
  const [priority, setPriority] = useState(editingTask ? editingTask.priority : "");
  const [description, setDescription] = useState(editingTask ? editingTask.description : "");

  useEffect(() => {
    if (editingTask) {
      setInput(editingTask.text);
      setPlannedDate(new Date(editingTask.plannedDate));
      setPriority(editingTask.priority);
      setDescription(editingTask.description);
    }
  }, [editingTask]);

  const handleSave = () => {
    if (input === "") return;
    if (editingTask) {
      const updatedTasks = tasks.map((task, index) =>
        index === editingIndex
          ? { ...task, text: input, plannedDate, priority, description }
          : task
      );
      setTasks(updatedTasks);
      showNotification("Task updated successfully!");
      setEditingIndex(null);
      setEditingTask(null);
    } else{
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
        showNotification("Task added successfully!");
    }
    setInput("");
    setDescription("");
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
          <button id="add-button" onClick={handleSave}>{editingTask? "Update" : "Add"}</button>
      </div>
    </div>
  )
}

function TaskCard({tasks, setTasks, showNotification,showTask,setShowTask, setEditingIndex, setEditingTask}) {
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
    setEditingTask(tasks[index]);
    setShowTask(true);
  }

  // const confirmChange = (index)=>{
  //   if (changeInput == null || changeInput === "") return;
  //   const updatedTasks = tasks.map((task,i)=>i===index?{...task,text:changeInput}:task);
  //   setTasks(updatedTasks);
  //   setEditingIndex(null);
  //   setChangeInput("");
  //   showNotification("Task updated successfully!");
  // }

  return (
    <ul id="task-cards" className={showTask?"blur":""}>
      {tasks.map((task, index) => (
          <li key={index} className={`task-list ${task.done ? "completed" : ""}`}>
            
            <hr style={{width:'100%'}} />
            <div style={{display:'flex', gap:'10px'}}>
            <span className='priority-dot' style={{
              backgroundColor: 
              task.priority === "High" ? "rgba(255, 0, 0, 0.1)" 
              : task.priority === "Medium" ? "rgba(0, 0, 255, 0.1)" 
              : task.priority === "Low" ? "rgba(0, 128, 0, 0.1)" 
              : "transparent",
              border:
              task.priority === "High" ? "2.5px solid red"
              : task.priority === "Medium" ? "2.5px solid blue"
              : task.priority === "Low" ? "2.5px solid green"
              : "none"
            }}></span>
              <div>
                <div style={{fontSize:'1.1em'}}>{task.text}</div>
                <div style={{fontSize:'0.8em'}} className='task-description'>{task.description}</div>
                <div style={{ fontSize: '1em', color: '#888' }}>{task.plannedDate?.toLocaleDateString()}</div>
                <div className='button-group'>
                  <button className={`done-button ${task.done ? "completed" : ""}`} onClick={()=> taskDone(index)}>Done</button>
                  <button id="delete-button" onClick={()=> deleteTask(index)}>Delete</button>
                  <button id="update-button" onClick={()=> updateTask(index)}>Update</button>
                </div>
                <div className='task-meta'>
                  <span className={`priority-indicator ${task.priority}`} style={{fontSize:'0.7em'}}>Priority: {task.priority} </span>
                  <span style={{ marginLeft: '10px', fontSize: '0.7em', color: '#888' }}>Created on: ({task.time})</span>
                </div>
              </div>
            </div>
          </li>
      ))}
      {tasks.length > 0 && <hr style={{width:'100%'}} />}
      {tasks.length === 0 && <p style={{textAlign:'center', color:'#888', marginTop:'20px'}}>No tasks available. Add a new task!</p>}
    </ul>
  )
}

function Notification({notification}) {
  return (
    <div className={`notification ${notification.show ? "show": "hide"}`} id="notification">{notification.message}</div>
  )
}

export default App
