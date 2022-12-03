
import './App.css';
import Cat from './cat.js';


function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        CatPet v 0.0
      </header> */}
      <main>
          <Cat style={{width:"inherit", height:"inherit", position:"absolute"}}/>
      </main>
      <footer>
          Thanks for checking out my ThreeJS Testbed!
      </footer>
    </div>
  );
}

export default App;
