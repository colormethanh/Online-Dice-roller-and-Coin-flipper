import * as THREE from 'three';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { initPysics, createFloor, createDice, createDiceMesh } from './cubeInit';
import { createCoin } from './coinInit';


export default class scenenInit {
    constructor(canvasId) {
        // Core three.js compoenents
        this.scene = undefined;
        this.camera = undefined;
        this.cameraX = 0;
        this.cameraY = 7;
        this.cameraZ = 20;
        this.renderer = undefined;

        this.physicsWorld = initPysics();

        // Objects
        this.dice = {
            mesh: undefined,
            body: undefined
        };

        this.coin = {
            mesh: undefined,
            body: undefined
        }


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
        this.topLight = undefined;

    }

    initialize() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            window.innerWidth / window.innerHeight,
            this.nearPlane,
            this.farPlane
        );
        this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ);
        this.camera.lookAt(this.scene);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById(this.canvasId),
            antialias: true,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        // lights
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.ambientLight);

        this.topLight = new THREE.PointLight(0xffffff, .5);
        this.topLight.position.set(10, 15, 0);
        this.topLight.castShadow = true;
        this.topLight.shadow.mapSize.width = 2048;
        this.topLight.shadow.mapSize.height = 2048;
        this.topLight.shadow.camera.near = 5;
        this.topLight.shadow.camera.far = 400;
        this.scene.add(this.topLight);

        const {diceMesh, diceBody} = createDice(this.scene, this.physicsWorld);
        this.dice.mesh = diceMesh;
        this.dice.body = diceBody;

        const {coinMesh, coinBody} = createCoin(this.scene, this.physicsWorld);
        this.coin.mesh = coinMesh;
        this.coin.body = coinBody;

        createFloor(this.scene, this.physicsWorld );


        // if window resizes
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    throwDice() {

        this.dice.body.velocity.setZero();
        this.dice.body.angularVelocity.setZero();


        this.dice.body.position = new CANNON.Vec3(5, 1.5, 0);
        this.dice.mesh.position.copy(this.dice.body.position);

        this.dice.mesh.rotation.set(2* Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
        this.dice.body.quaternion.copy(this.dice.mesh.quaternion);

        const force = 8 + 5 * Math.random();
        this.dice.body.applyImpulse(
            new CANNON.Vec3(-(force / 2), (force * 2), -(force / 2)),
            new CANNON.Vec3(0,0,.5)
        );

    }

    flipCoin() {

        this.coin.body.velocity.setZero();
        this.coin.body.angularVelocity.setZero();

        this.coin.body.position = new CANNON.Vec3(-5, 1.5, 0);
        this.coin.mesh.position.copy(this.coin.body.position);

        this.coin.mesh.rotation.set(2* Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
        this.coin.body.quaternion.copy(this.coin.mesh.quaternion);

        const force = 8 + 5 * Math.random();
        this.coin.body.applyImpulse(
            new CANNON.Vec3(0, force * 2, -force),
            new CANNON.Vec3(0,0,1)
        )


    }

    animate() {

        this.physicsWorld.fixedStep();

        this.dice.mesh.position.copy(this.dice.body.position);
        this.dice.mesh.quaternion.copy(this.dice.body.quaternion);

        this.coin.mesh.position.copy(this.coin.body.position);
        this.coin.mesh.quaternion.copy(this.coin.body.quaternion);

        
        this.renderer.render(this.scene, this.camera);

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











