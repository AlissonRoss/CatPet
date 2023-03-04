
import './App.css';
import Cat, {addDonut, onBounceButtonClick, onShadowMapToggleButtonClick} from './cat.js';
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

          {/* { <Button variant="contained" style={{ margin:"1em"}}
           onClick={() => {
            onBounceButtonClick();
          }}
          >Bounce</Button>} */}

          {/* { <Button variant="contained" style={{ margin:"1em"}}
           onClick={() => {
            onShadowMapToggleButtonClick();
          }}
          >Toggle Shadow Map Bounds</Button>} */}
    </div>
  );
}

export default App;
