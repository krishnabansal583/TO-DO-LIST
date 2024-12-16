import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;

    axios
      .post("http://localhost:5000/tasks", { task: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const toggleTaskCompletion = (id) => {
    axios
      .patch(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setTasks(
          tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        );
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const removeTask = (id) => {
    axios
      .delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((t) => t.id !== id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="bg-blue-600 text-white w-full py-4 shadow-md">
        <h1 className="text-center text-3xl font-bold">To-Do Application</h1>
      </header>

      <main className="flex-grow flex flex-col items-center py-10 w-full">
        <form
          onSubmit={addTask}
          className="bg-white shadow-lg rounded-lg p-6 w-11/12 sm:w-3/4 lg:w-1/2"
        >
          <h2 className="text-2xl font-semibold mb-4">Add a New Task</h2>
          <div className="flex items-center">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a task"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="ml-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>

        <div className="mt-10 w-11/12 sm:w-3/4 lg:w-1/2">
          <h2 className="text-xl font-bold mb-4">Your Tasks</h2>
          {tasks.length > 0 ? (
            <ul className="bg-white shadow-lg rounded-lg p-4 space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    task.completed ? "bg-green-100" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="mr-3"
                    />
                    <span
                      className={`${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.task}
                    </span>
                  </div>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">
              No tasks added yet. Start adding some!
            </p>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-3 w-full text-center">
        <p>© 2024 To-Do App | Designed with ❤️ by Krishna</p>
      </footer>
    </div>
  );
};

export default App;
