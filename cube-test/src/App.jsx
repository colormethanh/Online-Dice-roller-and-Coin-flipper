import { useState, useEffect } from 'react'
import './App.css'
import * as THREE from 'three'
import ScenenInit from './lib/screenInit';
import { createDiceMesh } from './lib/cubeInit';



function App() {

    useEffect(() => {
        
        const test = new ScenenInit('myCanvas');
        
        test.initialize();

        test.animate();
        const dice = createDiceMesh();

        test.scene.add(dice);
    }, []);

    return (
        <div className="App">
            <canvas id="myCanvas" />
        </div>
    );
}

export default App
