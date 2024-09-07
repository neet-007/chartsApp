import { CanvasMain } from './components/canvas/CanvasMain'
import { Spreadsheet } from './components/data/Spreadsheet'
import { Navbar } from './components/navbar/Navbar'

function App() {

  return (
    <div className='flex flex-col gap-2 p-2'>
      <CanvasMain />
      <Spreadsheet />
    </div>
  )
}

export default App
