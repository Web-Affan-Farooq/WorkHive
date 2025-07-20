import React, { useState } from "react";
import { ManagementSidebar } from "../../layout";
import AddSharpIcon from '@mui/icons-material/AddSharp';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { employees, tasks } from "@/constants/constants";

const style = {
  position: 'absolute',
  top: '50%',
  left: '60%',
  transform: 'translate(-50%, -50%)',
  width: "auto",
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
interface Task {
      title: string,
    note: string,
    description:string,
    dueDate: string,
    status: string,
    assignedTo:{name:string ; id:number}
}

const updatedTasks = tasks.map((task) => {
  const requiredEmployee = employees.find((em) => em.id === task.assignedTo)!;
      return {
    ...task ,assignedTo:{
      name:requiredEmployee.name,
      id:requiredEmployee.id
    }
  }
})

const Tasks = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () =>setOpen(false);
  const [newTask, setnewTask] = useState({
    title: "",
    note: "",
    description:
      "",
    dueDate: "",
    status: "Pending",
    assignedTo: 0
  });
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("new task : ", newTask);
    tasks.push(newTask);
    console.log("Updated tasks : ", tasks);
    setOpen(false)
  }

  return (
    <main className="relative flex h-screen bg-white">
      <ManagementSidebar />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="border-none w-[80vw]"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Task
          </Typography>
          <form onSubmit={handleCreateTask}>
            <input type="text" name="title" id="title" placeholder="Title" className="border border-black placeholder:text-sm py-[4px] px-[15px] rounded-md w-full" onChange={(e) => {
              setnewTask({ ...newTask, title: e.target.value })
            }} />
            <input type="text" name="note" id="note" placeholder="Note" className="border border-black placeholder:text-sm py-[4px] px-[15px] rounded-md w-full" onChange={(e) => {
              setnewTask({ ...newTask, note: e.target.value })
            }} />
            <textarea name="description" id="description" className="border border-black placeholder:text-sm py-[4px] px-[15px] h-[100px] rounded-md w-full" placeholder="Description" onChange={(e) => {
              setnewTask({ ...newTask, description: e.target.value })
            }}></textarea>
            <label htmlFor="Assigned this task to">Assigned to :</label>
            <select name="employees" id="employees" onChange={(e) => {
              console.log(typeof(e.target.value));              
              setnewTask({ ...newTask, assignedTo: Number(e.target.value) })
            }}>
              {
                employees.map((employee, idx) => (
                  <option value={employee.name} key={idx}>{employee.name}</option>
                ))
              }
            </select>
            <input type="datetime-local" name="dueDate" id="due-date" className="border border-black py-[4px] px-[15px] rounded-md w-full" onChange={(e) => {
              setnewTask({ ...newTask, dueDate: e.target.value })
            }} />
            <button type="submit" className="bg-gray-900 cursor-pointer px-[10px] text-sm py-[5px] rounded-md text-white flex flex-row flex-nowrap justify-start items-center gap-[3px]">
              <AddSharpIcon className="size-sm" />
              <span>Create</span>
            </button>
          </form>
        </Box>
      </Modal>

      <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
        <div className="flex flex-row flex-nowrap justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tasks Assigned</h1>
          <button onClick={() => { setOpen(!open) }} type="button" className="bg-gray-900 cursor-pointer px-[10px] text-sm py-[5px] rounded-md text-white flex flex-row flex-nowrap justify-start items-center gap-[3px]">
            <AddSharpIcon className="size-sm" />
            <span>Create</span>
          </button>
        </div>

        <div className="flex flex-row flex-wrap gap-6">
          {updatedTasks.map((task:Task, idx) => {
            const date = new Date(task.dueDate);
            return (
              <div
                key={idx}
                className="bg-white cursor-pointer w-md max-sm:w-full relative shadow-lg p-6 rounded-xl flex flex-col border-l-4 border-blue-500 hover:border-indigo-600 transition-all duration-300">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {task.title}
                </h2>
                <span
                  className={`absolute top-7 right-7 px-2 py-1 rounded-full text-white text-xs font-semibold ${task.status === "Pending"
                    ? "bg-yellow-500"
                    : task.status === "Working"
                      ? "bg-blue-500"
                      : "bg-green-500"
                    }`}
                >
                  {task.status}
                </span>
                <p className="text-gray-600 mb-2">{task.note}</p>
                <p className="text-sm text-gray-500 mb-4">{task.description}</p>

                <div className="mt-auto text-sm space-y-1">
                  <p>
                    <span className="font-semibold text-gray-700">Assigned to:</span>{" "}
                    {task.assignedTo.name}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Due:</span>{" "}
                    {date.toDateString()} at {date.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Tasks;