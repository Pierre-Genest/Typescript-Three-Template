import { PerspectiveCamera, PointLight, PointLightHelper } from "three"
import { CameraOptions, LightInfo } from "../ifaces/basic.interface"

/*********************************/
/*        SETUP FUNCTIONS        */
/*********************************/

export function setupCamera (camera: CameraOptions) {
  camera.camera.position.set(5, 5, 5)
  camera.position = {x: 5, y: 5, z: 5}
  camera.time = 6
  camera.to = {x: 10, y: 10, z: 10}
  camera.camera.lookAt(0, 0, 0)
}

export function setupLight (lights: LightInfo[], helpers?: boolean) {
  const light = new PointLight(0xffffff, 10)

  light.position.set(5, 5, 0)
  light.lookAt(0, 0, 0)
  lights.push({
    light: light,
    helper: helpers ? new PointLightHelper(light) : undefined
  })
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