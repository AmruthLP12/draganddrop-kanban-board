"use client"

import { useState } from "react"
import { Grip } from 'lucide-react'

const scrollbarStyles = `
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #1e2230;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: #3a4256;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #4a5568;
  }
`

interface Task {
  id: string
  title: string
  columnId: string
}

interface Column {
  id: string
  title: string
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "task1", title: "Implement user authentication", columnId: "todo" },
    { id: "task2", title: "Build contact us page", columnId: "todo" },
    { id: "task3", title: "Create product catalog", columnId: "todo" },
    { id: "task4", title: "Develop homepage layout", columnId: "in-progress" },
    { id: "task5", title: "Design color scheme and typography", columnId: "in-progress" },
    { id: "task6", title: "Project initiation and planning", columnId: "done" },
    { id: "task7", title: "Gather requirements from stakeholders", columnId: "done" },
    { id: "task8", title: "Create wireframes and mockups", columnId: "done" },
  ])

  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "Todo" },
    { id: "in-progress", title: "In progress" },
    { id: "done", title: "Done" },
  ])

  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)

  const handleTaskDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleTaskDrop = (e: React.DragEvent, targetColumnId: string, targetIndex: number) => {
    e.preventDefault()
    e.stopPropagation() // Prevent column drop from triggering

    if (!draggedTask) return

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== draggedTask)
      const taskToMove = prevTasks.find((task) => task.id === draggedTask)

      if (taskToMove) {
        const newTask = { ...taskToMove, columnId: targetColumnId }
        updatedTasks.splice(targetIndex, 0, newTask)
      }

      return updatedTasks
    })
    setDraggedTask(null)
  }

  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()

    if (!draggedColumn || draggedColumn === targetColumnId) return

    setColumns((prevColumns) => {
      const sourceIndex = prevColumns.findIndex((col) => col.id === draggedColumn)
      const targetIndex = prevColumns.findIndex((col) => col.id === targetColumnId)
      const newColumns = [...prevColumns]
      const [draggedCol] = newColumns.splice(sourceIndex, 1)
      newColumns.splice(targetIndex, 0, draggedCol)
      return newColumns
    })
    setDraggedColumn(null)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDraggedColumn(null)
  }

  // const getBadgeColor = (title: string) => {
  //   if (title.toLowerCase().includes('implement') || title.toLowerCase().includes('develop')) {
  //     return 'bg-blue-500'
  //   } else if (title.toLowerCase().includes('design') || title.toLowerCase().includes('create')) {
  //     return 'bg-green-500'
  //   } else if (title.toLowerCase().includes('build') || title.toLowerCase().includes('gather')) {
  //     return 'bg-yellow-500'
  //   } else {
  //     return 'bg-gray-500'
  //   }
  // }

  return (
    <div className="min-h-screen bg-[#0a0c14] p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column.id}
            draggable
            className={`flex flex-col rounded-lg bg-[#0d1117] p-4 ${
              draggedColumn === column.id ? 'opacity-50' : ''
            }`}
            onDragStart={(e) => handleColumnDragStart(e, column.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleColumnDrop(e, column.id)}
            onDragEnd={handleDragEnd}
          >
            <div 
              className="mb-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
              onDragOver={(e) => e.stopPropagation()}
            >
              <Grip className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white" contentEditable suppressContentEditableWarning onBlur={(e) => {
                const newTitle = e.currentTarget.textContent;
                if (newTitle) {
                  setColumns(prevColumns => 
                    prevColumns.map(col => 
                      col.id === column.id ? { ...col, title: newTitle } : col
                    )
                  );
                }
              }}>{column.title}</h2>
              <Grip className="h-5 w-5 text-gray-400" />
            </div>
            <div 
              className="flex flex-col gap-3 overflow-y-auto pr-2"
              style={{
                maxHeight: 'calc(100vh - 200px)',
                minHeight: '240px',
              }}
            >
                <style>{scrollbarStyles}</style>
              {tasks
                .filter((task) => task.columnId === column.id)
                .map((task, index) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleTaskDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleTaskDrop(e, column.id, index)}
                    className={`rounded-lg bg-[#161b22] p-4 ${
                      draggedTask === task.id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between cursor-grab active:cursor-grabbing">
                      <Grip className="h-5 w-5 text-gray-400" />
                      <span className={`rounded-full bg-${column.id === 'todo' ? 'blue' : column.id === 'in-progress' ? 'yellow' : 'green'}-500 px-3 py-1 text-sm text-white`}>
                        {column.id === 'todo' ? 'Todo' : column.id === 'in-progress' ? 'In Progress' : 'Done'}
                      </span>
                    </div>
                    <p className="text-white">{task.title}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

