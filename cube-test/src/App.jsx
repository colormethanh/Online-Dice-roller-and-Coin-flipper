import { useState, useEffect } from 'react'
import { GUI } from 'dat.gui';
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


        const gui = new GUI();

        const customFunctionFolder = gui.addFolder('custom Function');
        customFunctionFolder.open();
        const customParams = {
            printHello: false,
        };
        customFunctionFolder
            .add(customParams, 'printHello')
            .name('Throw dice')
            .onChange((value) => {
                if (value === true){
                    test.throwDice();
                }
            });

        // Destory gui to prevent multiple stale ui from being displayed 
        return() => {
            gui.destroy();
        };
    }, []);

    return (
        <div className="App">
            <canvas id="myCanvas" />
        </div>
    );
}

export default App
