import { useState, useEffect } from 'react'
import './App.css'
import scenenInit from './lib/screenInit';
import Screen from './Screen'

// import { GUI } from 'dat.gui';

export default function Canvas() {
    const [scene, setScene] = useState();
    const [sceneState, setSceneState] = useState();

    useEffect(() => {
        const scene = new scenenInit('myCanvas');
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
