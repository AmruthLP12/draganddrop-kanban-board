"use client"

import { useState } from "react"
import { Grip, Plus, Edit2, X } from 'lucide-react'

interface Task {
  id: string
  title: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

export default function BadgeChangingKanban() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "Todo",
      tasks: [
        { id: "task1", title: "Implement user authentication" },
        { id: "task2", title: "Build contact us page" },
        { id: "task3", title: "Create product catalog" },
      ],
    },
    {
      id: "in-progress",
      title: "In progress",
      tasks: [
        { id: "task4", title: "Develop homepage layout" },
        { id: "task5", title: "Design color scheme and typography" },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        { id: "task6", title: "Project initiation and planning" },
        { id: "task7", title: "Gather requirements from stakeholders" },
        { id: "task8", title: "Create wireframes and mockups" },
      ],
    },
  ])

  const [draggedTask, setDraggedTask] = useState<{ id: string; columnId: string } | null>(null)
  const [editingTask, setEditingTask] = useState<{ id: string; columnId: string; title: string } | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [openInputColumnId, setOpenInputColumnId] = useState<string | null>(null);

  const handleTaskDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string) => {
    setDraggedTask({ id: taskId, columnId })
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId, columnId }))
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleTaskDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault()
    const { taskId, columnId } = JSON.parse(e.dataTransfer.getData('text/plain'))
    
    if (columnId === targetColumnId) return

    setColumns(prevColumns => {
      const newColumns = prevColumns.map(col => ({...col, tasks: [...col.tasks]}))
      const sourceColumn = newColumns.find(col => col.id === columnId)
      const targetColumn = newColumns.find(col => col.id === targetColumnId)
      const taskToMove = sourceColumn?.tasks.find(task => task.id === taskId)

      if (sourceColumn && targetColumn && taskToMove) {
        sourceColumn.tasks = sourceColumn.tasks.filter(task => task.id !== taskId)
        targetColumn.tasks.push(taskToMove)
      }

      return newColumns
    })

    setDraggedTask(null)
  }

  const handleAddTask = (columnId: string) => {
    if (newTaskTitle.trim() === "") return

    setColumns(prevColumns => {
      const newColumns = prevColumns.map(col => ({...col, tasks: [...col.tasks]}))
      const column = newColumns.find(col => col.id === columnId)
      if (column) {
        column.tasks.push({
          id: `task${Date.now()}`,
          title: newTaskTitle.trim(),
        })
      }
      return newColumns
    })
    setNewTaskTitle("")
    setOpenInputColumnId(null)
  }

  const handleEditTask = (taskId: string, columnId: string, newTitle: string) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.id === columnId
          ? {...col, tasks: col.tasks.map(task => 
              task.id === taskId ? {...task, title: newTitle.trim()} : task
            )}
          : col
      )
    )
    setEditingTask(null)
  }

  const handleDeleteTask = (taskId: string, columnId: string) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.id === columnId
          ? {...col, tasks: col.tasks.filter(task => task.id !== taskId)}
          : col
      )
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0c14] p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col rounded-lg bg-[#0d1117] p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleTaskDrop(e, column.id)}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{column.title}</h2>
              <button
                onClick={() => setOpenInputColumnId(openInputColumnId === column.id ? null : column.id)}
                className="text-gray-400 hover:text-white"
                aria-label={`Add task to ${column.title}`}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleTaskDragStart(e, task.id, column.id)}
                  className={`rounded-lg bg-[#161b22] p-4 ${
                    draggedTask?.id === task.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <Grip className="h-5 w-5 text-gray-400 cursor-grab" />
                    <span className={`rounded-full px-3 py-1 text-sm text-white ${
                      column.id === 'todo' ? 'bg-blue-600' :
                      column.id === 'in-progress' ? 'bg-yellow-600' :
                      column.id === 'done' ? 'bg-green-600' :
                      'bg-[#21262d]'
                    }`}>
                      {column.title}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingTask({ id: task.id, columnId: column.id, title: task.title })}
                        aria-label={`Edit task: ${task.title}`}
                      >
                        <Edit2 className="h-4 w-4 text-gray-400 hover:text-white" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id, column.id)}
                        aria-label={`Delete task: ${task.title}`}
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  </div>
                  {editingTask?.id === task.id ? (
                    <input
                      type="text"
                      className="w-full bg-[#21262d] text-white p-2 rounded"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      onBlur={() => handleEditTask(task.id, column.id, editingTask.title)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleEditTask(task.id, column.id, editingTask.title)
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <p className="text-white">{task.title}</p>
                  )}
                </div>
              ))}
              {openInputColumnId === column.id && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Add new task..."
                    className="w-full bg-[#21262d] text-white p-2 rounded mb-2"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTask(column.id)
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddTask(column.id)}
                    className="w-full bg-[#238636] text-white p-2 rounded flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

