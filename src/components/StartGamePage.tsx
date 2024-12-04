import React from 'react'
import { Button } from './ui/button'

const StartGamePage = () => {
  return (
    <div className='start-game px-4 py-2'>
        <div className='flex justify-between items-center mb-10'>
           <h1 className='text-3xl font-bold'>Tic Tac Toe</h1>
           <Button>Leaderbord</Button>
        </div>
        <div className='flex flex-col justify-center items-center gap-y-20'>
           <p className='text-2xl'>Start Manually or Invite your friend</p>
           <button className='bg-white/30 backdrop-blur-md k w-24 h-24 rounded-full text-2xl font-bold '>
             Start
           </button>
        </div>
    </div>
  )
}

export default StartGamePage