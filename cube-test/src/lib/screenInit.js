import * as THREE from 'three';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { createDiceMesh, diceParam } from './cubeInit';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import glb from './assets/models/coin.glb';
import gsap from 'gsap'


export default class scenenInit {
    constructor(canvasId) {
        // Core three.js compoenents
        this.scene = undefined;
        this.camera = undefined;
        this.cameraX = 0;
        this.cameraY = 1;
        this.cameraZ = 25;
        this.renderer = undefined;

        this.physicsWorld = undefined;

        // Objects
        this.dice = {
            mesh: undefined,
            body: undefined
        };

        this.coin = {
            mesh: undefined,
            body: undefined
        };


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
        this.scene.background = new THREE.Color(0xffffff);

        //Camera
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            window.innerWidth / window.innerHeight,
            this.nearPlane,
            this.farPlane
        );
        this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ);
        this.camera.lookAt(this.scene);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById(this.canvasId),
            antialias: true,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Clock
        this.clock = new THREE.Clock();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        // Lights
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

        // if window resizes
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    initPysics() {
        let physicsWorld = new CANNON.World({
         gravity: new CANNON.Vec3(0, -50, 0),
        })
        physicsWorld.defaultContactMaterial.restitution = .3;
     
        this.physicsWorld = physicsWorld;
     }

     render() {
        this.renderer.render(this.scene, this.camera);
    }


    // Object Creations

     createFloor() {
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(250, 250),
            new THREE.ShadowMaterial({
                opacity: .1,
                transparent: false,
            })
        )
        floor.receiveShadow = true;
        floor.position.y = -7;
        floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * .5);
        this.scene.add(floor);
    
        const floorBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        });
        floorBody.position.copy(floor.position);
        floorBody.quaternion.copy(floor.quaternion);
        this.physicsWorld.addBody(floorBody)
    }

    createDice() {
        const diceMesh = new createDiceMesh();
        this.scene.add(diceMesh);
    
        const diceBody = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(diceParam.boxSize / 2, diceParam.boxSize / 2, diceParam.boxSize / 2)),
            sleepTimeLimit:.1
        });
        this.physicsWorld.addBody(diceBody);
        this.dice.mesh = diceMesh;
        this.dice.body = diceBody;
    }

    createCoin() {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();
    
        const rgbeLoader = new RGBELoader();
    
        let coinLoader = new GLTFLoader();
    
        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(), 
            new THREE.MeshNormalMaterial()
        );
    
        const body = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Cylinder()
        })

        this.coin.mesh = mesh;
        this.coin.body = body;
    
    
        coinLoader.load( glb , (glb) =>{
            const mesh = glb.scene;
            
            rgbeLoader.load('https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr', function(texture) {
                const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                mesh.traverse((child) => {
                    if(child instanceof THREE.Mesh) {
                        child.material.envMap = envMap;
                        child.material.color.set(0xE7E634);
                        child.castShadow = true;
                    };
                });
                texture.dispose();
                pmremGenerator.dispose();
            });
            
            mesh.scale.set(2,2,2);
            this.scene.add(mesh);
            const body = new CANNON.Body({
                mass: 1,
                shape: new CANNON.Cylinder(1 * 2, 1 * 2, .3 * 2, 20),
            });
            this.physicsWorld.addBody(body);

            this.coin.mesh = mesh;
            this.coin.body = body;
        });
    }

    // Actions and Animations
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

        this.coin.body.position = new CANNON.Vec3(-5, 1.5, 7.5);
        this.coin.mesh.position.copy(this.coin.body.position);

        // this.coin.mesh.rotation.set(2* Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
        this.coin.body.quaternion.copy(this.coin.mesh.quaternion);

        const force = 8 + 5 * Math.random();
        this.coin.body.applyImpulse(
            new CANNON.Vec3(0, force * 2, -force),
            new CANNON.Vec3(0,0,1 * Math.random())
        )
    }

    cameraUp() {
        gsap.timeline()
            .to(this.camera.position, { y: 15, z: 10, duration: 3,
                                        onUpdate: function(){
                                            this.camera.lookAt(this.scene);
                                        }
                                    });
    }

    cameraDown() {
        gsap.timeline()
            .to(this.camera.position, { y: 1, z: 25, 
                                        duration: 3,
                                        onUpdate: function(){
                                            this.camera.lookAt(this.scene);
                                        }
                                    });
    }

    animate() {
        this.physicsWorld.fixedStep();

        this.dice.mesh.position.copy(this.dice.body.position);
        this.dice.mesh.quaternion.copy(this.dice.body.quaternion);

        if (this.coin.mesh !== undefined) {
            this.coin.mesh.position.copy(this.coin.body.position);
            this.coin.mesh.quaternion.copy(this.coin.body.quaternion);
        }

        window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
        this.controls.update();
    }

    // Misc.
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}











