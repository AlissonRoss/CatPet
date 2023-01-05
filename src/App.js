
import './App.css';
import Cat, {addDonut} from './cat.js';
import { Button } from '@mui/material';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        CatPet v 0.0
      </header> */}
          <Cat id="c" style={{ position:"absolute"}}/>
          CatPet v.0.0
          <br/>
          <Button variant="contained" style={{ margin:"1em"}}
           onClick={() => {
            addDonut();
          }}
          >Donuts</Button>
    </div>
  );
}

export default App;
