import './App.css'
import BattleGrid from './components/battleGrid.tsx'

function App() {

  return (
    <>
      <div className='title'> 
        <h1 className='titleText'>Batalha Naval</h1>
      </div>

      <div className="sideMenu">
        <h1 className='sideMenuTitle'>Side Menu</h1>
      </div>

      <div className='gridContainer'>
        <BattleGrid />
      </div>      
    </>
  )
}

export default App
