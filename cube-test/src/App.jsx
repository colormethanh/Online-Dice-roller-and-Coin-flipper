import { useState, useEffect } from 'react'
import { GUI } from 'dat.gui';
import './App.css'
import scenenInit from './lib/screenInit';






function App() {

    const [scene, setScene] = useState();

    useEffect(() => {
        const scene = new scenenInit('myCanvas');
        setScene(scene);
        scene.initialize();
        scene.createCoin();
        scene.createDice();
        // scene.throwDice();
        // scene.flipCoin();
        scene.animate();


        const gui = new GUI();

        const lightFolder = gui.addFolder('light');
        lightFolder.add(scene.topLight,'intensity' , 0, 1).name('topLight');
        lightFolder.add(scene.rectLightRed, 'intensity', 0, 20).name('rectLightR');
        lightFolder.add(scene.rectLightGreen, 'intensity', 0, 20).name('rectLightG');
        lightFolder.add(scene.rectLightBlue, 'intensity', 0, 20).name('rectLightB');

        const cameraFolder = gui.addFolder('camera');
        cameraFolder.add(scene.camera.position, 'x', -10, 50).name('Camera X');
        cameraFolder.add(scene.camera.position, 'y', -50, 20).name('Camera Y');
        cameraFolder.add(scene.camera.position, 'z', 0, 100).name('Camera Z');
        cameraFolder.add(scene.topLight.position, 'x', -25, 50).name('toplightX');
        cameraFolder.add(scene.topLight.position, 'y', -25, 50).name('toplightY');
        cameraFolder.add(scene.topLight.position, 'z', -25, 50).name('toplightZ');

        const customFunctionFolder = gui.addFolder('custom Function');
        customFunctionFolder.open();
        const customParams = {
            function: false,
        };

        customFunctionFolder
            .add(customParams, 'function')
            .name('Camera Up')
            .onChange((value) => {
                if (value == true) {
                    scene.cameraUp();
                }
            })
        customFunctionFolder
            .add(customParams, 'function')
            .name('Camera Down')
            .onChange((value) => {
                if (value == true) {
                    scene.cameraDown();
                }
            })

        // Destory gui to prevent multiple stale ui from being displayed 
        return() => {
            gui.destroy();
        };
    }, []);

    const throwDice = () => {
        console.log("Throwing Dice");
        scene.throwDice();
    }

    const flipCoin = () => {
        console.log("Flipping Coin");
        scene.flipCoin();
    }

    const selectCoin = () => {
        scene.removeDice();
        scene.selectCoin();
    }

    const selectDice = () => {
        scene.removeCoin();
        scene.selectDice();
    }

    const emptyState = () => {
        scene.emptyState();
    }

    const selectState = () => {
        scene.selectState();
    }

    return (
        <div className="App">
            <canvas id="myCanvas" />
            <div className="content">
                <button onClick={throwDice}>
                    Roll Dice
                </button>
                <button  onClick={flipCoin}>
                    Flip Coin
                </button>
                <button onClick={selectDice}>
                    Select Dice 
                </button>
                <button onClick={selectCoin}>
                    Select Coin 
                </button>
                <button onClick={emptyState}>
                    Empty State
                </button>
                <button onClick={selectState}>
                    Select State
                </button>
            </div>
        </div>
    );
}

export default App
