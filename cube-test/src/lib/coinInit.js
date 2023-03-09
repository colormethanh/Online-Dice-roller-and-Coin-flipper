import * as THREE from 'three'; 
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';



const params = {
    radius: 2.5,
    height: 0.3,
    radialSegements: 100,
}

export function createCoin(scene, physicsWorld) {
    
    const coinMesh = createMesh();
    scene.add(coinMesh);
    const coinBody = createBody();
    physicsWorld.addBody(coinBody);

    return {coinMesh, coinBody}

}


function createMesh() {
    const material = new THREE.MeshStandardMaterial({
        metalness:0.7,
        roughness:.3,
    })

    const geometry = new THREE.CylinderGeometry(params.radius, 
                                                params.radius, 
                                                params.height, 
                                                params.radialSegements);
    const coin = new THREE.Mesh(geometry, material);
    
    coin.position.set( -5, 0, 0);

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

