import * as THREE from 'three'; 
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import map from './assets/textures/map.jpg'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import glb from './assets/models/coin.glb';

const params = {
    radius: 2.5,
    height: 0.3,
    radialSegements: 100,
}

export function createCoin(scene, physicsWorld) {

    // let coinLoader = new GLTFLoader();
    // coinLoader.load( glb , (glb) =>{
    //     const objMesh = glb.scene;
    //     objMesh.traverse((obj) => {
    //         if (obj.isMesh) {
    //             obj.material.color.set(0xffffff)
    //         };
    //     });
        
    //     scene.add(objMesh);
    // });

    
    const coinMesh = createMesh();
    scene.add(coinMesh);
    const coinBody = createBody();
    physicsWorld.addBody(coinBody);

    return {coinMesh, coinBody}

}


function createMesh() {

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(map);


    const material = new THREE.MeshStandardMaterial({
        map: texture,
    })

    const geometry = new THREE.CylinderGeometry(params.radius, 
                                                params.radius, 
                                                params.height, 
                                                params.radialSegements);
    const coin = new THREE.Mesh(geometry, material);
    
    coin.position.set( -5, 0, 0);
    coin.castShadow = true;

    return coin
}

function createBody() {
    const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Cylinder(params.radius, params.radius, params.height, params.radialSegements),
        sleepTimeLimit: .1
    });
    return body;
}

