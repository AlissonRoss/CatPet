
import './App.css';
import Cat from './cat.js';
import Cube from './cube.js';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        CatPet v 0.0
      </header>
      <main>
          <Cat/>
          <Cube/>
      </main>
      <footer>
          This is a test!
      </footer>
    </div>
  );
}

export default App;
