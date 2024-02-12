import { Scene, ColorRepresentation, Mesh, MeshBasicMaterial, TextureLoader, Texture, PerspectiveCamera } from "three"
import { FBXLoader, GLTFLoader, OBJLoader, DRACOLoader } from "three/examples/jsm/Addons.js"
import { GeometryTypes, Vector3D } from "../ifaces/geometry.interface"

/*********************************/
/*        LOADER FUNCTIONS       */
/*********************************/

export function loadObject (name: string, loader: FBXLoader | GLTFLoader | OBJLoader, path: string, scene: Scene) {
  const parse = path.split('.')
  const extension = parse[parse.length-1]
  
  try {
    switch (extension) {
      case 'obj': 
      case 'fbx': {
        (loader as FBXLoader | OBJLoader).load(path, (fbx) => {
          fbx.name = name
          scene.add(fbx)
        })
        break
      }
      case 'glb':
      case 'gltf': {
        const loadDraco : DRACOLoader = new DRACOLoader();
        loadDraco.setDecoderPath( 'https://threejs.org/examples/jsm/libs/draco/' );
        (loader as GLTFLoader).setDRACOLoader( loadDraco );
  
        (loader as GLTFLoader).load(path, (gltf) => {
          gltf.scene.name = name
          scene.add(gltf.scene)
        })
        break
      } 
      default : {
        console.log('loadObject ne gère pas cette extension connard !')
      }
    }
  } catch (err) {
    console.log(err)
  }
}
  
/*********************************/
/*        CREATE FUNCTIONS       */ 
/*********************************/

/**
 * 
 * @param geometry formes geometriques comportant tout les différents formes 3D de THREEJS
 * @param color choix de la couleur
 * @returns Mesh: élément ajoutable à la scène
 */
export function createSurface (geometry: GeometryTypes, color: ColorRepresentation): Mesh {
  const material = new MeshBasicMaterial( {color: color} ) // SETTING COLOR IN HEX #RGB
  const mesh = new Mesh(geometry, material);

  return mesh
}

/**
 * 
 * @param path chemin de la texture
 * @param geometry type de forme géometrique
 * @returns Mesh: élément ajoutable à la scène
 */
export function createSurfaceWithTexture (geometry: GeometryTypes, path: string): Promise<Mesh> {
  return loadTexture(path)
    .then((textureSurface) => {
      const material = new MeshBasicMaterial({map: textureSurface})
      const mesh = new Mesh(geometry, material)

      return mesh
    })
    .catch((message: string) => {
        throw message
    }) 
}
  
/**
 * 
 * @param element définir le mesh/object 3D
 * @param pos définir les coordonnées de l'élément
 */
export function setPosition (element: Mesh, pos: Vector3D) {
  element.position.x = pos.x
  element.position.y = pos.y
  element.position.z = pos.z
}

export function loadTexture(path: string, onProgress?: (event: ProgressEvent) => void): Promise<Texture> {
  return new Promise((resolve, reject) => {
    new TextureLoader().load(path,
      texture => resolve(texture),
      onProgress,
      _ => reject(`Couldn't load texture ${path}`));
  });
}

/********************************************/
/*             CAMERA FUNCTIONS             */
/********************************************/

export function rotateMesh(element: Mesh, axes: Vector3D) {
  if(element) {
    element.rotation.x += axes.x
    element.rotation.y += axes.y
    element.rotation.z += axes.z
  }
}

/********************************************/
/*             CAMERA FUNCTIONS             */
/********************************************/

export function cameraNewPosition (camera: PerspectiveCamera, newPosition: Vector3D) {
  camera.position.setX(newPosition.x)
  camera.position.setY(newPosition.y)
  camera.position.setZ(newPosition.z)
  camera.lookAt(0,0,0)
}