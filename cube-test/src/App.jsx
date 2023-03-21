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
        scene.throwDice();
        scene.flipCoin();
        scene.animate();


        const gui = new GUI();

        const lightFolder = gui.addFolder('light');
        lightFolder.add(scene.topLight,'intensity' , 0, 1).name('topLight');
        // lightFolder.add(scene.ambientLight, 'intensity', 0, 1).name('ambientLight');
        // lightFolder.add(scene.rectLightWhite, 'intensity', 0, 20).name('rectLightW');
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

    const removeCoin = () => {
        if (scene.coin.mesh == undefined) {
            return;
        }
        console.log("Removing Coin");
        scene.removeObj(scene.coin.mesh);
        scene.coin.mesh = undefined;
    }

    const createCoin = () => {
        if (scene.coin.mesh == undefined) {
            scene.createCoin();
        }
    }

    const removeDice = () => {
        if (scene.dice.mesh == undefined) {
            return;
        }
        console.log("Removing Dice");
        scene.removeObj(scene.dice.mesh);
    }

    const createDice = () => {
        if (scene.dice.mesh == undefined) {
            scene.createDice()
        }
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
                <br></br>
                <button onClick={removeCoin}>
                    Remove Coin
                </button>
                <button onClick={createCoin}>
                    Add Coin
                </button>
                <br></br>
                <button onClick={removeDice}>
                    Remove Dice
                </button>
                <button onClick={createDice}>
                    Create Dice
                </button>
            </div>
        </div>
    );
}

export default App
