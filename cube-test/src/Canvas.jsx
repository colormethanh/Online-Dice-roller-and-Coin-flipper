import { useState, useEffect } from 'react'
import { GUI } from 'dat.gui';
import './App.css'
import scenenInit from './lib/screenInit';
import Screen from './Screen'


export default function Canvas() {
    const [scene, setScene] = useState();
    const [sceneState, setSceneState] = useState();

    useEffect(() => {
        const scene = new scenenInit('myCanvas');
        setScene(scene);
        scene.initialize();
        // scene.createCoin();
        // scene.createDice();
        scene.animate();
        setSceneState(scene.state);


        const gui = new GUI();
        gui.close();
        const lightFolder = gui.addFolder('light');
        lightFolder.add(scene.topLight,'intensity' , 0, 1).name('topLight');
        lightFolder.add(scene.directionalLight, 'intensity',0,1).name('dirLight');
        lightFolder.add(scene.rectLightRed, 'intensity', 0, 20).name('rectLightR');
        lightFolder.add(scene.rectLightGreen, 'intensity', 0, 20).name('rectLightG');
        lightFolder.add(scene.rectLightBlue, 'intensity', 0, 20).name('rectLightB');
        lightFolder.add(scene.spotLight, 'angle', 0, Math.PI / 3).name('spotlightAngle');
        lightFolder.add(scene.spotLight.position, 'z', 0, 20).name('spotlightZ');


        const cameraFolder = gui.addFolder('camera');
        cameraFolder.add(scene.camera.position, 'x', -10, 50).name('Camera X');
        cameraFolder.add(scene.camera.position, 'y', -50, 20).name('Camera Y');
        cameraFolder.add(scene.camera.position, 'z', 0, 100).name('Camera Z');
        cameraFolder.add(scene.topLight.position, 'x', -25, 50).name('toplightX');
        cameraFolder.add(scene.topLight.position, 'y', -25, 50).name('toplightY');
        cameraFolder.add(scene.topLight.position, 'z', -25, 50).name('toplightZ');
        

        const customFunctionFolder = gui.addFolder('custom Function');
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
        customFunctionFolder
            .add(customParams, 'function')
            .name('Throw Dice')
            .onChange((value) => {
                if (value == true) {
                    scene.throwDice();
                }
            })
        customFunctionFolder
            .add(customParams, 'function')
            .name('Flip coin')
            .onChange((value) => {
                if (value == true) {
                    scene.flipCoin();
                }
            })

        // Destory gui to prevent multiple stale ui from being displayed 
        return() => {
            gui.destroy();
        };
    }, []);
    
    return(
        <div>
            <canvas id="myCanvas" />
            <Screen scene={scene} sceneState={sceneState} setSceneState={setSceneState} />
        </div>
    )
}
