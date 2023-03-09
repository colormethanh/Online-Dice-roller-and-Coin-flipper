import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import glb from './assets/models/coin.glb';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';


export function getCoin(scene, renderer) {

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr', function(texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        fthis.scene.enviroment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
    });



    let coinLoader = new GLTFLoader();
    coinLoader.load( glb , (glb) =>{
        const objMesh = glb.scene;
        scene.add(objMesh);
        return objMesh;
    });
}