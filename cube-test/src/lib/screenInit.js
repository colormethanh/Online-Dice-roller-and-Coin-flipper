import * as THREE from 'three';
import { DirectionalLight, UnsignedShort4444Type } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

export default class ScenenInit {
    constructor(canvasId) {
        // Core three.js compoenents
        this.scene = undefined;
        this.camera = undefined;
        this.renderer = undefined;


        // camera params
        this.fov = 45;
        this.nearPlane = 1;
        this.farPlane = 1000;
        this.canvasId = canvasId;

        // additional comps
        this.clock = undefined;
        this.stats = undefined; 
        this.controls = undefined; 
        
        // lighting
        this.ambientLight = undefined;
        this.directionalLight = undefined;
    }

    initialize() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            window.innerWidth / window.innerHeight,
            this.nearPlane,
            this.farPlane
        );
        this.camera.position.z = 48;

        // canvas
        const canvas = document.getElementById(this.canvasId);
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        // lights
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.ambientLight.castShadow = true;
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.castShadow = true;
        this.directionalLight.position.set(0, 32, 64);
        this.scene.add(this.directionalLight);

        // if window resizes
        window.addEventListener('resize', () => this.onWindowResize(), false);

    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate() {

        window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
        this.controls.update();
    }

    

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}











