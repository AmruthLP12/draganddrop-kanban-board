"use client"

import { useState } from "react"
import { Grip } from 'lucide-react'

interface Task {
  id: string
  title: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

export default function KanbanBoard() {
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
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [clickedColumnId, setClickedColumnId] = useState<string | null>(null)

  const handleTaskDragStart = (e: React.DragEvent, taskId: string, sourceColumnId: string) => {
    setDraggedTask({ id: taskId, columnId: sourceColumnId })
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

  const handleTaskDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    e.stopPropagation() // Prevent column drop from triggering

    if (!draggedTask || draggedTask.columnId === targetColumnId) return

    setColumns((prevColumns) => {
      const newColumns = [...prevColumns]
      const sourceColumn = newColumns.find((col) => col.id === draggedTask.columnId)
      const targetColumn = newColumns.find((col) => col.id === targetColumnId)
      const taskToMove = sourceColumn?.tasks.find((task) => task.id === draggedTask.id)

      if (sourceColumn && targetColumn && taskToMove) {
        sourceColumn.tasks = sourceColumn.tasks.filter((task) => task.id !== draggedTask.id)
        targetColumn.tasks.push(taskToMove)
      }

      return newColumns
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
              <h2 className="text-lg font-semibold text-white">{column.title}</h2>
              <Grip className="h-5 w-5 text-gray-400" />
            </div>
            <div 
              className="flex flex-col gap-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleTaskDrop(e, column.id)}
            >
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleTaskDragStart(e, task.id, column.id)}
                  onDragEnd={handleDragEnd}
                  className={`rounded-lg bg-[#161b22] p-4 ${
                    draggedTask?.id === task.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between cursor-grab active:cursor-grabbing">
                    <Grip className="h-5 w-5 text-gray-400" />
                    <span className="rounded-full bg-[#21262d] px-3 py-1 text-sm text-white">
                      Task
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

