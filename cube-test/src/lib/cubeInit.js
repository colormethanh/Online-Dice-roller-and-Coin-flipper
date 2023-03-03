import * as THREE from 'three'; 
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';


const params = {
    segments: 40,
    edgeRadius: .07
};




export function createDiceGeometry() {
    // let boxGeometry = new THREE.BoxGeometry(1,1,1, params.segments, params.segments, params.segments);
    
    let boxMaterial = new THREE.MeshNormalMaterial();
    // let boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    // return boxMesh;


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

        positionAttr.setXYZ(i, position.x, position.y, position.z)
    }

    boxGeometry.deleteAttribute('normal');
    boxGeometry.deleteAttribute('uv');
    boxGeometry = BufferGeometryUtils.mergeVertices(boxGeometry);

    boxGeometry.computeVertexNormals();


    const dice = new THREE.Mesh(boxGeometry, boxMaterial)
    return dice;

}
