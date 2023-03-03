import * as THREE from 'three'; 
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';


const params = {
    segments: 40,
    edgeRadius: .09,
    notchRadius: .12,
    notchDepth: .1,
};


export function createDiceGeometry() {

    let boxGeometry = new THREE.BoxGeometry(1,1,1, params.segments, params.segments, params.segments);
    const positionAttr = boxGeometry.attributes.position;
    const subCubeHalfSize = .5 - params.edgeRadius;
    
    for (let i = 0; i < positionAttr.count; i++) {
        let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);

        const subCube = new THREE.Vector3(Math.sign(position.x), Math.sign(position.y), Math.sign(position.z)).multiplyScalar(subCubeHalfSize);
        const addition = new THREE.Vector3().subVectors(position, subCube)


        // Modify position x,y, and z for each position
        if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) 
        {
            // position is close to box vertex
            addition.normalize().multiplyScalar(params.edgeRadius);
            position = subCube.add(addition)

        } 
        else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize) 
        {
            // position is close to the box edge that's parallel to z axis
            addition.z = 0;
            addition.normalize().multiplyScalar(params.edgeRadius);
            position.x = subCube.x + addition.x;
            position.y = subCube.y + addition.y;
        }
        else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize)
        {
            // position is close to the box edge that's parallel to y axis
            addition.y = 0;
            addition.normalize().multiplyScalar(params.edgeRadius);
            position.x = subCube.x + addition.x;
            position.z = subCube.z + addition.z;
        }
        else if (Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize)
        {
            // position is close to the box edge that parallel to x axis
            addition.x = 0;
            addition.normalize().multiplyScalar(params.edgeRadius);
            position.y = subCube.y + addition.y;
            position.z = subCube.z + addition.z;
        }

        // create notches for cube
        const notchWave = (v) => {
            v = (1/ params.notchRadius) * v;
            v = Math.PI * Math.max(-1, Math.min(1 , v));
            return params.notchDepth * (Math.cos(v) + 1);
        }
        const notch = (pos) => notchWave(pos[0]) * notchWave(pos[1]);
        const offset = .23;

        if(position.y === .5) {
            // cube face is top face
            position.y -= notch([position.x, position.z]);
        } else if (position.x === .5) {
            // cube face is right right
            position.x -= notch([position.y + offset, position.z + offset]);
            position.x -= notch([position.y - offset, position.z - offset]);
        } else if (position.z === .5) {
            // cube face is front face
            position.z -= notch([position.x - offset, position.y - offset]);
            position.z -= notch([position.x, position.y]);
            position.z -= notch([position.x + offset, position.y + offset]);
        } else if (position.z === -.5) {
            // cube face is back face
            position.z += notch([position.x + offset, position.y + offset]);
            position.z += notch([position.x + offset, position.y - offset]);
            position.z += notch([position.x - offset, position.y + offset]);
            position.z += notch([position.x - offset, position.y - offset]);
        } else if (position.x === -.5) {
            // cube face is left face
            position.x += notch([position.y + offset, position.z + offset]);
            position.x += notch([position.y + offset, position.z - offset]);
            position.x += notch([position.y, position.x]);
            position.x += notch([position.y - offset, position.z + offset]);
            position.x += notch([position.y - offset, position.z - offset]);
        } else if (position.y === -.5) {
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
    const baseGeometry = new THREE.PlaneGeometry(1 - 2 * params.edgeRadius, 1 - 2 * params.edgeRadius);

    const offset = .48;

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

export function createDiceMesh() {
    const boxMaterialOuter = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
    })

    const boxMaterialInner = new THREE.MeshStandardMaterial({
        color:0x000000,
        roughness: 0,
        metalness: 1,
        side: THREE.DoubleSide
    })

    const diceMesh = new THREE.Group();
    const innerMesh = new THREE.Mesh(createInnerGeometry(),boxMaterialInner);
    const outerMesh = new THREE.Mesh(createDiceGeometry(), boxMaterialOuter);
    diceMesh.add(innerMesh, outerMesh);

    return diceMesh;
}
