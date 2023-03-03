import { useState, useEffect } from 'react'
import './App.css'
import * as THREE from 'three'
import ScenenInit from './lib/screenInit';



function App() {

    useEffect(() => {
        const test = new ScenenInit('myCanvas');
        test.initialize();
        test.animate();
        
        const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
        const boxMaterial = new THREE.MeshNormalMaterial();
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

        test.scene.add(boxMesh);
    }, []);

    return (
        <div className="App">
            <canvas id="myCanvas" />
        </div>
    );
}

export default App
