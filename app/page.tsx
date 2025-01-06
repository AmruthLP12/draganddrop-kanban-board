import BadgeChangingKanban from '@/components/BadgeChangingKanban'
import KanbanBoard from '@/components/kanban-board'
import React from 'react'

const Home = () => {
  return (
    <div>
      <KanbanBoard />
      <BadgeChangingKanban />
    </div>
  )
}

export default Home
