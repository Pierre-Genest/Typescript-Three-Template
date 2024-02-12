import { AmbientLight, DirectionalLight, Mesh, PerspectiveCamera, Scene, BoxGeometry, MeshBasicMaterial, TextureLoader } from "three"
import { Vector3D } from "../ifaces/geometry.interface"

/*********************************/
/*        SETUP FUNCTIONS        */
/*********************************/

export function setupSurface (scene: Scene, path : string) {
  const textureSurface = new TextureLoader().load(path)
  const geometry = new BoxGeometry(1,0.15,1)
  const material = new MeshBasicMaterial({map : textureSurface})
  const surface = new Mesh (geometry, material)

  surface.position.setY(-1)
  
  scene.add(surface)
}

export function setupBackground (scene: Scene, path : string) {
  const loaderBG = new TextureLoader()

  scene.background = loaderBG.load(path)
}

export function setupCamera (camera: PerspectiveCamera) {
  camera.position.setX(5) //5
  camera.position.setY(6) //6
  camera.position.setZ(5) //5
  camera.lookAt(0,0,0)
}

export function setupCube (cube: Mesh, pos: Vector3D, boxSize: Vector3D) {
  cube.position.setX(pos.x + (boxSize.x / 2))
  cube.position.setY(pos.y + (boxSize.y / 2))
  cube.position.setZ(pos.z + (boxSize.z / 2))
}

export function setupLight (scene: Scene) {
  const ambientLight = new AmbientLight(0xffffff, 0.8)
  const directionalLight = new DirectionalLight(0xffffff, 0.6)

  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.camera.left = - 7
  directionalLight.shadow.camera.top = 7
  directionalLight.shadow.camera.right = 7
  directionalLight.shadow.camera.bottom = - 7
  directionalLight.position.set(5, 5, 5)
  scene.add(ambientLight)
  scene.add(directionalLight)
}

/*********************************/
/*        UPDATE FUNCTIONS       */ 
/*********************************/

export function cameraUpdate (camera: PerspectiveCamera, fov: number, aspect: number, near: number, far: number) {
  camera.aspect = aspect
  camera.fov = fov
  camera.near = near
  camera.far = far
  camera.updateProjectionMatrix()
}