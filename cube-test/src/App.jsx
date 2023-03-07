import { useState, useEffect } from 'react'
import './App.css'
import scenenInit from './lib/screenInit';
import { initPysics } from './lib/cubeInit';



function App() {

    
    useEffect(() => {
        const test = new scenenInit('myCanvas');
        const physicsWorld = initPysics();
        test.initialize(physicsWorld);
        test.throwDice();
        test.animate();

    }, []);

    return (
        <div className="App">
            <canvas id="myCanvas" />
        </div>
    );
}

export default App
