import { useState, useEffect } from 'react'
import './App.css'
import canvasInit from './lib/canvasInit';
import Screen from './Screen'

// import { GUI } from 'dat.gui';

export default function Canvas() {
    const [scene, setScene] = useState();
    const [sceneState, setSceneState] = useState();

    useEffect(() => {
        const scene = new canvasInit('myCanvas');
        setScene(scene);
        scene.initialize();
        scene.animate();
        setSceneState(scene.state);
    }, []);
    
    return(
        <div>
            <canvas id="myCanvas" />
            <Screen scene={scene} sceneState={sceneState} setSceneState={setSceneState} />
        </div>
    )
}
