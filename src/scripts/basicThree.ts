import { ColorRepresentation, Mesh, TextureLoader, Texture, PerspectiveCamera, MeshPhongMaterial, Group, Object3DEventMap } from "three"
import { FBXLoader, GLTFLoader, OBJLoader, DRACOLoader } from "three/examples/jsm/Addons.js"
import { GeometryTypes, Vector3D } from "../ifaces/geometry.interface"
import { CameraOptions, CreateSurfaceOptions, LightInfo, Lights, Material, ObjInfo } from "../ifaces/basic.interface"
import { Body, Vec3 } from 'cannon-es'


/*********************************/
/*        LOADER FUNCTIONS       */
/*********************************/

/**
 * 
 * @param name The name with wich you want to store the object in the scene
 * @param loader The loader needed to load your bject
 * @param path The path to get your object
 * @param scene The scene in wich you want to add the object
 * 
 */
export function loadObject (
  name: string, 
  loader: FBXLoader | GLTFLoader | OBJLoader, 
  position: Vector3D, path: string, 
  options?: CreateSurfaceOptions): Promise<Group<Object3DEventMap>> {

  const parse = path.split('.')
  const extension = parse[parse.length-1]

  return new Promise((resolve, reject) => {
    try {
      switch (extension) {
        case 'obj': 
        case 'fbx': {
          (loader as FBXLoader | OBJLoader).load(path, (fbx) => {
            fbx.name = name
            fbx.position.set(position.x, position.y, position.z)
            if (options) {
              if (options.physic) {
                options.physic.position.set(position.x, position.y, position.z)
              }
            }
            resolve(fbx)
          })
          break
        }
        case 'glb':
        case 'gltf': {
          const loadDraco : DRACOLoader = new DRACOLoader();
          loadDraco.setDecoderPath('https://threejs.org/examples/jsm/libs/draco/');
          (loader as GLTFLoader).setDRACOLoader( loadDraco );
    
          (loader as GLTFLoader).load(path, (gltf) => {
            gltf.scene.name = name
            gltf.scene.position.set(position.x, position.y, position.z)
            if (options) {
              if (options.physic) {
                options.physic.position.set(position.x, position.y, position.z)
              }
            }
            resolve(gltf.scene)
          })
          break
        } 
        default : {
          reject('loadObject ne gère pas cette extension connard !')
        }
      }
    } catch (err) {
      reject(err)
    }
  });
  
  
}

/**
 * 
 * @param path the path to the image you want as a texture
 * @param onProgress (not necessary) a function that will be called to get the progress event 
 * @returns A Promise of the Texture
 */
export function loadTexture(path: string, onProgress?: (event: ProgressEvent) => void): Promise<Texture> {
  return new Promise((resolve, reject) => {
    new TextureLoader().load(path,
      texture => resolve(texture),
      onProgress,
      _ => reject(`Couldn't load texture ${path}`));
  });
}

/********************************************/
/*              MESH FUNCTIONS              */
/********************************************/

/**
 * 
 * @param geometry The Three geometry you want to create
 * @param color The color in hexadecimal
 * @param position The position you want the mesh to be
 * @param options (not necessary) The options you want on your mesh 
 * @returns A Mesh
 */
export function createSurface (geometry: GeometryTypes, color: ColorRepresentation, position: Vector3D, options?: CreateSurfaceOptions): Mesh {
  const material = new MeshPhongMaterial( {color: color} ) // SETTING COLOR IN HEX #RGB

  return createMeshWithMaterial(geometry, material, position, options)
}

/**
 * 
 * @param geometry The Three geometry you want to create
 * @param path The path of the texture wanted
 * @param position The position you want the mesh to be
 * @param options (not necessary) The options you want on your mesh 
 * @returns A Promise of the Mesh
 */
export function createSurfaceWithTexture (geometry: GeometryTypes, path: string,  position: Vector3D, options?: CreateSurfaceOptions): Promise<Mesh> {
  return loadTexture(path)
    .then((textureSurface) => {
      const material = new MeshPhongMaterial({map: textureSurface})

      return createMeshWithMaterial(geometry, material, position, options)
    })
    .catch((message: string) => {
        throw message
    }) 
}

/**
 * @param geometry the GeometryTypes you want to create your mesh with
 * @param material the Material you want to put on the mesh
 * @param position The position with type Vector3D
 * @param options CreateSurfaceOptions Options such as transparency, physic, etc...
 * Create a mesh with a Material and differents Options (transparency, physic, etc...)
 */
function createMeshWithMaterial (geometry: GeometryTypes, material: Material, position: Vector3D, options?: CreateSurfaceOptions): Mesh {
  if (options && (options.opacity === 0 || options.opacity)) {
    material.transparent = true
    material.opacity = options.opacity
  }

  const mesh = new Mesh(geometry, material);

  setMeshPosition(mesh, { x: position.x, y: position.y, z: position.z })

  if (options) {
    if (options.physic)
      options.physic.position.set(position.x, position.y, position.z)
    
    if (options.shadow) {
      if (options.shadow.cast) mesh.castShadow = options.shadow.cast
      if (options.shadow.receive) mesh.receiveShadow = options.shadow.receive
    }
  }

  return mesh
}

/**
 * 
 * @param element the mesh you are going to modify
 * @param pos the position you want your element on
 * Modify the position of the mesh with the position given
 */
export function setMeshPosition (element: Mesh, pos: Vector3D) {
  element.position.set(pos.x, pos.y, pos.z)
}

/**
 * 
 * @param element the mesh you are going to modify
 * @param axes the axe on wich you want your element to rotate
 * Modify the rotation of the mesh with the axes given
 */
export function rotateMesh(element: Mesh | Group<Object3DEventMap>, axes: Vector3D) {
  if(element) {
    element.rotation.x += axes.x
    element.rotation.y += axes.y
    element.rotation.z += axes.z
  }
}

/********************************************/
/*             CAMERA FUNCTIONS             */
/********************************************/

/**
 * 
 * @param elem the elem that is going to be updated
 * @param position the position you are going to move to
 * @param lookAt (not necessary) the position that needs to be lookAt
 * Set the element position
 */
export function setElemPosition (elem: PerspectiveCamera | Lights | Mesh | Group<Object3DEventMap>, position: Vector3D, lookAt?: Vector3D) {
  elem.position.set(position.x, position.y, position.z)
  if (lookAt) elem.lookAt(lookAt.x,lookAt.y,lookAt.z)
}

/**
 * 
 * @param elem the physic to update
 * @param velocity the velocity you will add to the elem
 * Set the element position
 */
export function addVelocityToElem (elem: Body | undefined, velocity: Vector3D) {
  if (elem) {
    elem.applyImpulse(new Vec3(velocity.x, velocity.y, velocity.z))
  }
}

/**
 * @param camera the camera that is going to be updated
 * @param fov 
 * @param aspect
 * @param near 
 * @param far 
 * Update the camera viewport
 */
export function cameraUpdate (camera: PerspectiveCamera, fov: number, aspect: number, near: number, far: number) {
  camera.aspect = aspect
  camera.fov = fov
  camera.near = near
  camera.far = far
  camera.updateProjectionMatrix()
}

/**
 * @param camera the camera that is going to be updated
 * @param fov 
 * @param aspect
 * @param near 
 * @param far 
 * Update the camera viewport
 */
export function handleElem (deltaTime: number, elem: LightInfo | CameraOptions | ObjInfo) {
  if (elem.movement) {
    const distance: Vector3D = {
      x: elem.movement.to.x - elem.movement.position.x,
      y: elem.movement.to.y - elem.movement.position.y,
      z: elem.movement.to.z - elem.movement.position.z
    }
    const speed: Vector3D = {
      x: (distance.x / elem.movement.time) * deltaTime,
      y: (distance.y / elem.movement.time) * deltaTime,
      z: (distance.z / elem.movement.time) * deltaTime
    }
  
    if(elem.movement.time > 0) {
      elem.movement.time = elem.movement.time - deltaTime
      elem.movement.position = {
        x: elem.movement.position.x + speed.x, 
        y: elem.movement.position.y + speed.y, 
        z: elem.movement.position.z + speed.z
      }

      if ((elem as ObjInfo).physic) {
        addVelocityToElem((elem as ObjInfo).physic, speed)
      } else {
        setElemPosition(elem.elem, elem.movement.position, elem.movement.lookAt)
      }
    } else if (distance.x < 0 || distance.y < 0 || distance.z < 0)
      if ((elem as ObjInfo).physic) {
        addVelocityToElem((elem as ObjInfo).physic, speed)
      } else {
        setElemPosition(elem.elem, elem.movement.position, elem.movement.lookAt)
      } 
  }

}