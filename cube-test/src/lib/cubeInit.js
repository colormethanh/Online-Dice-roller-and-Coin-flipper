import * as THREE from 'three'; 
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

// Visable World
const cubeSize =  2.5;

export const diceParam = {
    boxSize: cubeSize,
    segments: 40,
    edgeRadius: cubeSize * .09,
    notchRadius: cubeSize * .12,
    notchDepth: cubeSize * .1,
};

export function createDiceGeometry() {

    let boxGeometry = new THREE.BoxGeometry(diceParam.boxSize, diceParam.boxSize, diceParam.boxSize, diceParam.segments, diceParam.segments, diceParam.segments);
    const positionAttr = boxGeometry.attributes.position;
    const subCubeHalfSize = (diceParam.boxSize/2) - diceParam.edgeRadius;
    
    for (let i = 0; i < positionAttr.count; i++) {
        let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);

        const subCube = new THREE.Vector3(Math.sign(position.x), Math.sign(position.y), Math.sign(position.z)).multiplyScalar(subCubeHalfSize);
        const addition = new THREE.Vector3().subVectors(position, subCube)


        // Modify position x,y, and z for each position
        if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) 
        {
            // position is close to box vertex
            addition.normalize().multiplyScalar(diceParam.edgeRadius);
            position = subCube.add(addition)

        } 
        else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize) 
        {
            // position is close to the box edge that's parallel to z axis
            addition.z = 0;
            addition.normalize().multiplyScalar(diceParam.edgeRadius);
            position.x = subCube.x + addition.x;
            position.y = subCube.y + addition.y;
        }
        else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize)
        {
            // position is close to the box edge that's parallel to y axis
            addition.y = 0;
            addition.normalize().multiplyScalar(diceParam.edgeRadius);
            position.x = subCube.x + addition.x;
            position.z = subCube.z + addition.z;
        }
        else if (Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize)
        {
            // position is close to the box edge that parallel to x axis
            addition.x = 0;
            addition.normalize().multiplyScalar(diceParam.edgeRadius);
            position.y = subCube.y + addition.y;
            position.z = subCube.z + addition.z;
        }

        const notchWave = (v) => {
            v = (1/ diceParam.notchRadius) * v;
            v = Math.PI * Math.max(-1, Math.min(1 , v));
            return diceParam.notchDepth * (Math.cos(v) + 1);
        }
        const notch = (pos) => notchWave(pos[0]) * notchWave(pos[1]);
        
        // const offset = ((Math.abs(diceParam.boxSize - 1) / 1) * 100) * .23;
        const offset = cubeSize * .23

        if(position.y === (diceParam.boxSize / 2)) {
            // cube face is top face
            position.y -= notch([position.x, position.z]);
        } else if (position.x === (diceParam.boxSize / 2)) {
            // cube face is right right
            position.x -= notch([position.y + offset, position.z + offset]);
            position.x -= notch([position.y - offset, position.z - offset]);
        } else if (position.z === (diceParam.boxSize / 2)) {
            // cube face is front face
            position.z -= notch([position.x - offset, position.y - offset]);
            position.z -= notch([position.x, position.y]);
            position.z -= notch([position.x + offset, position.y + offset]);
        } else if (position.z === -(diceParam.boxSize / 2)) {
            // cube face is back face
            position.z += notch([position.x + offset, position.y + offset]);
            position.z += notch([position.x + offset, position.y - offset]);
            position.z += notch([position.x - offset, position.y + offset]);
            position.z += notch([position.x - offset, position.y - offset]);
        } else if (position.x === -(diceParam.boxSize / 2)) {
            // cube face is left face
            position.x += notch([position.y + offset, position.z + offset]);
            position.x += notch([position.y + offset, position.z - offset]);
            position.x += notch([position.y, position.x]);
            position.x += notch([position.y - offset, position.z + offset]);
            position.x += notch([position.y - offset, position.z - offset]);
        } else if (position.y === -(diceParam.boxSize / 2)) {
            // cube face is bottom face
            position.y += notch([position.x + offset, position.z + offset]);
            position.y += notch([position.x + offset, position.z]);
            position.y += notch([position.x + offset, position.z - offset]);
            position.y += notch([position.x - offset, position.z + offset]);
            position.y += notch([position.x - offset, position.z]);
            position.y += notch([position.x - offset, position.z - offset]);
        }

        // setting the old position to the altered positions
        positionAttr.setXYZ(i, position.x, position.y, position.z)
    }

    boxGeometry.deleteAttribute('normal');
    boxGeometry.deleteAttribute('uv');
    boxGeometry = BufferGeometryUtils.mergeVertices(boxGeometry);

    boxGeometry.computeVertexNormals();

    return boxGeometry;

}

function createInnerGeometry() {
    const baseGeometry = new THREE.PlaneGeometry(diceParam.boxSize - 2 * diceParam.edgeRadius, diceParam.boxSize - 2 * diceParam.edgeRadius);

    const offset = diceParam.boxSize * .48;

    // merge plane 
    return BufferGeometryUtils.mergeBufferGeometries([
        baseGeometry.clone().translate(0,0, offset),
        baseGeometry.clone().translate(0,0, -offset),
        baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, -offset, 0),
        baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, offset, 0),
        baseGeometry.clone().rotateY(.5 * Math.PI).translate(-offset, 0, 0),
        baseGeometry.clone().rotateY(.5 * Math.PI).translate(offset, 0, 0)
    ], false);
}

export function createDiceMesh(envMapIntensity) {

    const boxMaterialOuter = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
    })

    const boxMaterialInner = new THREE.MeshStandardMaterial({
        color:0x000000,
        roughness: 0.1,
        side: THREE.DoubleSide
    })

    const diceMesh = new THREE.Group();
    const innerMesh = new THREE.Mesh(createInnerGeometry(), boxMaterialInner);
    const outerMesh = new THREE.Mesh(createDiceGeometry(), boxMaterialOuter);
    outerMesh.castShadow = true;
    diceMesh.add(innerMesh, outerMesh);

    return diceMesh;
}



