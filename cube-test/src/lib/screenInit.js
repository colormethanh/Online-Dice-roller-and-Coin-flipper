import * as THREE from 'three';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { createDiceMesh, diceParam } from './cubeInit';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import glb from './assets/models/coin2.glb';
import gsap from 'gsap'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

export default class scenenInit {
    constructor(canvasId) {
        // Core three.js compoenents
        this.scene = undefined;
        this.camera = undefined;
        this.cameraX = 0;
        this.cameraY = 2;
        this.cameraZ = 30;
        this.renderer = undefined;

        // Raycaster components
        this.raycaster = undefined;
        this.pointer = undefined;
        this.intersected = undefined;
        this.arrowHelper = undefined;
        this.sceneObjs = []

        this.physicsWorld = undefined;

        this.state = "empty";

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
        this.topLight = undefined;
        this.directionalLight = undefined;
        this.spotLight = undefined;

        // RectLights
        this.rectLightW = 8;
        this.rectLightH = 18;
        this.rectYoffset = Math.abs((this.rectLightH/2) - 7);
        this.rectLightRed = undefined;
        this.rectLightGreen = undefined;
        this.rectLightBlue = undefined;

        // Results
        this.results = document.querySelector('#results');
    }

    initialize() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000); 
        
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
        
        this.renderer.setPixelRatio( window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        document.body.appendChild(this.renderer.domElement);

        // Raycaster
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        // Clock
        this.clock = new THREE.Clock();
        
        // Helpers
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.enable = false;
        // this.stats = Stats();
        // document.body.appendChild(this.stats.dom);

        // Lights
        this.topLight = new THREE.PointLight(this.topLightColor, 0);
        this.topLight.position.set(0, 24, 2);
        this.topLight.castShadow = true;
        this.topLight.shadow.mapSize.width = 2048;
        this.topLight.shadow.mapSize.height = 2048;
        this.scene.add(this.topLight);
        const pointLightHelper = new THREE.PointLightHelper(this.topLight, 1);
        this.scene.add(pointLightHelper);
        
        this.directionalLight = new THREE.DirectionalLight( this.topLightColor, 0.1 );
        this.directionalLight.position.set(0, 0, 1)
        this.scene.add( this.directionalLight );

        this.spotLight = new THREE.SpotLight(this.topLightColor);
        this.spotLight.position.set(0, 15, 0);
        // spotlight angle should grow to .16
        this.spotLight.angle = 0;
        this.spotLight.castShadow = true;

        this.scene.add( this.spotLight );
        

        
        // Rectangle Lights
        this.initRectLights();

        // Physics
        this.initPysics();

        // Floor
        this.createFloor();

        this.createCoin();
        this.createDice();
        

        // GSAP configs
        gsap.config({
            units: {height: '%', width: '%', fontSize: 'rem'}
          });

        // if window resizes
        document.addEventListener('mousemove', (e) => this.onPointerMove(e), {passive:false});
        document.addEventListener('click', (e) => this.onPointerClick(e), {passive:false});
        window.addEventListener('resize', () => this.onWindowResize(), {passive:false});
    }

    initPysics() {
        let physicsWorld = new CANNON.World({
            allowSleep: true,
            gravity: new CANNON.Vec3(0, -50, 0),
        })
        physicsWorld.defaultContactMaterial.restitution = .2;
     
        this.physicsWorld = physicsWorld;
     }

     render() {
        this.renderer.render(this.scene, this.camera);
    }

    // State Changes
    clearState() {
        this.state = "clear";
        this.resetResults();  
        const tl = gsap.timeline();

        tl.to(this.dice.mesh.position, {y: 20, duration: 2, onComplete: () => {
            this.removeDice();
        }})
        tl.to(this.coin.mesh.position, {y: 20, duration: 2, onComplete: () => {
            this.removeCoin();
        }}, 0)
        tl.to(this.rectLightGreen, {intensity: 0, duration: 3, ease: "bounce.inOut"}, 0);
        tl.to(this.rectLightRed, {intensity: 0, duration: 3, ease: "bounce.in"}, 1);
        tl.to(this.rectLightBlue, {intensity: 0, duration: 3, ease: "bounce.out"}, 2);
        tl.to(this.topLight, {intensity: 0, duration: 1, onComplete: () => {
            this.cameraDown();
        }}, 0)
        
    }

    selectState() {
        console.log("select State initiated");
        this.state = "select";
        this.resetResults();

        this.dice.mesh.position.set(4, 20, -5);
        this.coin.mesh.position.set(-4, 20, -5);

        const tl = gsap.timeline();
        tl.to(this.topLight, {intensity: 0, duration: 1});

        if (this.rectLightBlue.intensity < 5) {
            tl.to(this.rectLightBlue, {intensity: 5, duration: 3, ease: "bounce.inOut", delay: 2}, 0);
            tl.to(this.rectLightRed, {intensity: 5, duration: 3, ease: "bounce.in", delay: 2.5}, 1);
            tl.to(this.rectLightGreen, {intensity: 5, duration: 3, ease: "bounce.out", delay: 2.5}, 2);
            tl.to(this.dice.mesh.position, {duration: 4, y: 0, delay:.5, ease:'circ', delay: 2.5}, 3);
            tl.to(this.coin.mesh.position, {duration: 4, y:0, delay:.5, ease:'circ', delay: 2.5}, 3);
        } else {
            tl.to(this.dice.mesh.position, {duration: 3, y: 0, delay:.5, ease:'circ'}, 0);
            tl.to(this.coin.mesh.position, {duration: 3, y:0, delay:.5, ease:'circ'}, 0);
        }
        tl.to("#flip-btn", {width: 0, duration: 2}, 1);
        
        tl.to(this.camera.position, { x:this.cameraX, 
            y: this.cameraY, 
            z: this.cameraZ, 
            duration: 2,
            onUpdate: (camera = this.camera) =>{
                camera.lookAt(0,0,0);
            }
        }, 1)

    }

    selectDice() {
        console.log("Changing state")
        this.state = "dice";
        console.log("current state" + this.state)
        this.removeCoin();
        this.resetResults();
        this.dice.body.velocity.setZero();
        this.dice.body.angularVelocity.setZero();
        this.dice.body.position = new CANNON.Vec3(0, 20, -5);
        this.dice.mesh.position.copy(this.dice.body.position);
        const tl = gsap.timeline();

        if(this.rectLightBlue.intensity < 5) {
            tl.to(this.rectLightBlue, {intensity: 5, duration: 3, ease: "bounce.inOut"}, 0);
            tl.to(this.rectLightRed, {intensity: 5, duration: 3, ease: "bounce.in"}, 1);
            tl.to(this.rectLightGreen, {intensity: 5, duration: 3, ease: "bounce.out"}, 2);
        }

        tl.to("#flip-btn", {width: 0, duration: 1}, 1);
        tl.to(this.topLight, {intensity: .2, duration:1});
        tl.to(this.camera.position, { y: 9.5, 
            z: 15, 
            duration: 2,
            onUpdate: (camera = this.camera) => {
                camera.lookAt(this.scene.position);
            }    
        }, (this.rectLightBlue.intensity < 5 ? 3 : 1));
        tl.to("#flip-btn", {width: 100, duration: 2, onComplete: () => {
            this.dice.body.applyImpulse(new CANNON.Vec3(0, -0.1, 0));
        }}, (this.rectLightBlue.intensity < 5 ? 2 : 3));

    }

    selectCoin() {
        console.log("changing state")
        this.state = "coin";
        console.log("current state " + this.state)
        this.removeDice();
        this.resetResults();
        this.coin.body.velocity.setZero();
        this.coin.body.angularVelocity.setZero();
        this.coin.body.position = new CANNON.Vec3(0, 20, -5);
        this.coin.mesh.position.copy(this.coin.body.position);

        const tl = gsap.timeline();
        if(this.rectLightBlue.intensity < 5) {
            tl.to(this.rectLightBlue, {intensity: 5, duration: 3, ease: "bounce.inOut"}, 0);
            tl.to(this.rectLightRed, {intensity: 5, duration: 3, ease: "bounce.in"}, 1);
            tl.to(this.rectLightGreen, {intensity: 5, duration: 3, ease: "bounce.out"}, 2);
        }
        tl.to("#flip-btn", {width: 0, duration: 1}, 1);
        tl.to(this.topLight, {intensity: .2, duration:1});
        tl.to(this.camera.position, { y: 9.5, 
            z: 15, 
            duration: 2,
            onUpdate: (camera = this.camera) => {
                camera.lookAt(this.scene.position);
            }    
        }, (this.rectLightBlue.intensity < 5 ? 3 : 1));
        tl.to("#flip-btn", {width: 100, duration: 2, onComplete: () => {
            this.coin.body.applyImpulse(new CANNON.Vec3(0, -0.1, 0));
        }}, (this.rectLightBlue.intensity < 5 ? 2 : 3));

    }

    lightDice() {
        // console.log("lighting dice");
        
        this.spotLight.target = this.dice.mesh;
        gsap.to(this.spotLight, {angle:.16, duration:1.5, ease: "sine.out"})
    }

    lightCoin() {
        // console.log("lighting coin");
        
        this.spotLight.target = this.coin.mesh;
        gsap.to(this.spotLight, {angle: .16, duration:1.5, ease: "sine.out"});
    }

    lightOff() {
        // console.log("lighting off");
        gsap.to(this.spotLight, {angle: 0, duration:1.5, ease: "sine.out"});
        
    }

    // Object Creations
    initRectLights() {
        RectAreaLightUniformsLib.init();

        const rectLightRed = new THREE.RectAreaLight(0xff0000, 0, this.rectLightW, this.rectLightH);
        this.rectLightRed = rectLightRed;
        this.rectLightRed.position.set(0, this.rectYoffset, -15);
        this.rectLightRed.lookAt(new THREE.Vector3(0, this.rectYoffset, 10));
        this.scene.add(rectLightRed);
        this.scene.add( new RectAreaLightHelper( rectLightRed ) );

        const rectLightGreen = new THREE.RectAreaLight(0x00ff00, 0, this.rectLightW, this.rectLightH);
        this.rectLightGreen = rectLightGreen;
        this.rectLightGreen.position.set(10, this.rectYoffset, -12);
        this.rectLightGreen.lookAt(new THREE.Vector3(0, this.rectYoffset, 10));
        this.scene.add(rectLightGreen);
        this.scene.add( new RectAreaLightHelper(rectLightGreen));

        const rectLightBlue = new THREE.RectAreaLight(0x0000ff, 0, this.rectLightW, this.rectLightH);
        this.rectLightBlue = rectLightBlue;
        this.rectLightBlue.position.set(-10, this.rectYoffset, -12);
        this.rectLightBlue.lookAt(new THREE.Vector3(0, this.rectYoffset, 10));
        this.scene.add(rectLightBlue);
        this.scene.add( new RectAreaLightHelper(rectLightBlue));
    }

    createFloor() {
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(250, 250),
            new THREE.MeshStandardMaterial({
                color:0x848896,
                roughness: .2,
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
        const diceMesh = new createDiceMesh(this.sceneObjs);
        this.scene.add(diceMesh);
        this.dice.mesh = diceMesh;
        this.dice.mesh.userData={shape: "dice"}
        this.dice.mesh.position.set(4, 50, -50);
        if (this.dice.body == undefined) {
            const diceBody = new CANNON.Body({
                mass: 1,
                shape: new CANNON.Box(new CANNON.Vec3(diceParam.boxSize / 2, diceParam.boxSize / 2, diceParam.boxSize / 2)),
                sleepTimeLimit:.1
            });  
           this.physicsWorld.addBody(diceBody);
           this.dice.body = diceBody;  
        }
        this.addDiceEvents();
    }

    createCoin() {
        let coinLoader = new GLTFLoader();
    
        coinLoader.load(glb, (glb) => {
            const mesh = glb.scene; 

            mesh.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.material.color.set(0xfbcb08);
                    child.material.metalness = 0;
                    child.material.roughness = 0.2;
                    child.material.envMapIntensity = 0.0;
                    child.userData = {shape: 'coin'}
                    this.sceneObjs.push(child);
                };
            });

            mesh.scale.set(2, 2, 2);
            mesh.position.set(-4, 50, -50);
            this.scene.add(mesh);
            this.coin.mesh = mesh;
            this.coin.userData = {shape: "coin"}

            
            const body = new CANNON.Body({
                mass: 1,
                shape: new CANNON.Cylinder(2, 2, .3*2, 20),
                sleepTimeLimit: 1
            });
            this.physicsWorld.addBody(body);
            this.coin.body = body;
            
            this.addCoinEvents();

        });
    }

    // Object events to identify the side landed on
    addDiceEvents() {
        this.dice.body.addEventListener('sleep', (e) => {
            this.dice.body.allowSleep = false;
            const euler = new CANNON.Vec3();
            e.target.quaternion.toEuler(euler);

            const eps = .1;

            let isZero = (angle) => Math.abs(angle) < eps;
            let isHalfPi = (angle) => Math.abs(angle - .5 * Math.PI) < eps;
            let isMinusHalfPi = (angle) => Math.abs(.5 * Math.PI + angle) < eps;
            let isPiOrMinusPi = (angle) => (Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps);
            
            if (isZero(euler.z)) {
                if (isZero(euler.x)) {
                    // console.log("Landed on 1");
                    this.showResults("1");
                } else if (isHalfPi(euler.x)) {
                    // console.log("landed on 4");
                    this.showResults("4");
                } else if (isMinusHalfPi(euler.x)) {
                    // console.log("Landed on 3");
                    this.showResults("3");
                } else if (isPiOrMinusPi(euler.x)) {
                    // console.log("landed on 6");
                    this.showResults("6");
                } else {
                    // Landed on edge
                    this.dice.body.allowSleep = true;
                }
            } else if (isHalfPi(euler.z)) {
                // console.log("landed on 2");
                this.showResults("2");
            } else if (isMinusHalfPi(euler.z)) {
                // console.log("Landed on 5");
                this.showResults("5");
            } else {
                // landed on edge
                this.dice.body.allowSleep = true;
            }
        });
    }

    addCoinEvents() {
        this.coin.body.addEventListener('sleep', (e) => {
            this.coin.body.allowSleep = false;
            const euler = new CANNON.Vec3();
            e.target.quaternion.toEuler(euler);
            // console.log("coin event");

            const eps = .1;
            
            let isZero = (angle) => Math.abs(angle) < eps;
            let isPiOrMinusPi = (angle) => (Math.abs( Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps);

            if (isZero(euler.x)) {
                // console.log("TAILS!");
                this.showResults("   TAILS!")
            } else if (isPiOrMinusPi(euler.x)) {
                // console.log("HEADS!");
                this.showResults("   HEADS!");
            } else {
                this.coin.body.allowSleep = true;
            }
        })
    }

    showResults(result) {
        this.results.innerHTML = result;
    }

    resetResults() {
        this.results.innerHTML = "";
    }

    // Actions and Animations
    throwDice() {
        this.removeCoin();
        this.resetResults();
        this.dice.body.velocity.setZero();
        this.dice.body.angularVelocity.setZero();

        this.dice.body.position = new CANNON.Vec3(5, 1.5, 3);
        this.dice.mesh.position.copy(this.dice.body.position);

        this.dice.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
        this.dice.body.quaternion.copy(this.dice.mesh.quaternion);

        const force = 5 + 5 * Math.random();
        this.dice.body.applyImpulse(
            new CANNON.Vec3(-(force / 2), (force * 2.5), -(force / 2)),
            new CANNON.Vec3(0,0,.5)
        );

        this.dice.body.allowSleep = true;
    }

    flipCoin() {
        this.removeDice();
        this.resetResults();
        this.coin.body.velocity.setZero();
        this.coin.body.angularVelocity.setZero();

        this.coin.body.position = new CANNON.Vec3(-5, 1.5, 5);
        this.coin.mesh.position.copy(this.coin.body.position);

        this.coin.mesh.rotation.set(2* Math.PI * Math.random(), 0, 0);
        this.coin.body.quaternion.copy(this.coin.mesh.quaternion);

        const force = 6 + 5 * Math.random();
        this.coin.body.applyImpulse(
            new CANNON.Vec3(force/2, force * 2, -force),
            new CANNON.Vec3(0,0,1 + ( Math.random() * .5))
        )
        this.coin.body.allowSleep = true;
    }

    removeDice() {
        this.dice.body.velocity.setZero();
        this.dice.body.angularVelocity.setZero();


        this.dice.body.position = new CANNON.Vec3(0, 0, -50);
        this.dice.mesh.position.copy(this.dice.body.position);
    }

    removeCoin() {
        this.coin.body.velocity.setZero();
        this.coin.body.angularVelocity.setZero();

        this.coin.body.position = new CANNON.Vec3(0, 0, -50);
        this.coin.mesh.position.copy(this.coin.body.position);
    }

    // To delete later
    cameraUp() {
        gsap.to(this.camera.position, { y: 9.5, 
                                        z: 15, 
                                        duration: 2,
                                        onUpdate: (camera = this.camera) => {
                                            camera.lookAt(this.scene.position);
                                        }    
                                    });
    }

    cameraDown() {
        gsap.to(this.camera.position, { x:this.cameraX, 
                                        y: this.cameraY, 
                                        z:this.cameraZ, 
                                        duration: 2,
                                        onUpdate: (camera = this.camera) =>{
                                            camera.lookAt(this.scene.position);
                                        }
                                    })
    }

    animate() {
        this.physicsWorld.fixedStep();
        
        
        if (this.state === "coin" || this.state === "dice") {

            if (this.dice.mesh !== undefined) {
                this.dice.mesh.position.copy(this.dice.body.position);
                this.dice.mesh.quaternion.copy(this.dice.body.quaternion);
            }
    
            if (this.coin.mesh !== undefined) {
                this.coin.mesh.position.copy(this.coin.body.position);
                this.coin.mesh.quaternion.copy(this.coin.body.quaternion);
            }
        }

        if (this.state == "select") {

            if (this.dice.mesh !== undefined) {
                this.dice.mesh.rotation.y += .01;
                this.dice.mesh.rotation.x += .01;
            }

            if (this.coin.mesh !== undefined) {
                this.coin.mesh.rotation.y += .01;
                this.coin.mesh.rotation.x += .01;
            }
        }

        window.requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        // this.stats.update();
        // this.controls.update();
    }

    // Misc.
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onPointerMove(e) {
        this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.sceneObjs, false);

        if (intersects.length > 0 && this.state === 'select') {
            this.intersected = intersects[0].object;
            const shape = this.intersected.userData.shape;
            // console.log(this.intersected.userData.shape);

            document.body.style.cursor = 'pointer';
            
            if (shape == "dice") {
                this.lightDice();
            } else if (shape == "coin") {
                this.lightCoin();
            } else {
                this.lightOff();
            }
            
        } else {
            this.intersected = null;
            // console.log("not intersected");
            this.lightOff();
            document.body.style.cursor = 'default';
        }
    }

    onPointerClick(e) {
        console.log("Checking state")
        console.log(this.state)
        if (this.state === "select") {
            console.log("conditional passed state = " + this.state)
        
            this.pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
            this.pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
            this.raycaster.setFromCamera(this.pointer, this.camera);

            const intersects = this.raycaster.intersectObjects(this.sceneObjs, false);

            if (intersects.length > 0) {
                
                this.intersected = intersects[0].object;
                const shape = this.intersected.userData.shape;
                // console.log("clicked on " + this.intersected.userData.shape);

                if (shape === "dice") {
                    console.log('selecting Dice');
                    this.selectDice();
                } else if (shape === "coin") {
                    console.log('selecting Coin');
                    this.selectCoin();
                } else {
                    console.log("No selection")
                    return;
                }
            } 
        }

        return;
    }
}











