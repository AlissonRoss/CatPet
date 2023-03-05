
import './App.css';
import Cat, {addDonut, incrementCatSize, decrementCatSize} from './cat.js';
import { Button } from '@mui/material';
import React, { useState } from 'react';

function Increment(){
  const [count, setCount] = useState(0);
  return(   
  <Button variant="contained" style={{ margin:"1em"}}
    onClick={() => {
      setCount(count+1)
      addDonut();
      incrementCatSize();

    }}>{count} Donuts </Button>
  );
}


function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        CatPet v 0.0
      </header> */}
          <Cat id="c" style={{ position:"absolute"}}/>
          CatPet v.0.0
          <br/>
          <Increment/>
          <Button variant="contained" style={{ margin:"1em"}} onClick={() => {
              decrementCatSize();
              }}> Diet
          </Button>

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

