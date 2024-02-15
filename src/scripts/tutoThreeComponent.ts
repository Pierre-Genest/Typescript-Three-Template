import { PerspectiveCamera, PointLight, PointLightHelper } from "three"
import { CameraOptions, LightInfo } from "../ifaces/basic.interface"
import { Vector3D } from "../ifaces/geometry.interface"
import {setElemPosition } from "./basicThree"

/*********************************/
/*        SETUP FUNCTIONS        */
/*********************************/

export function setupCamera (camera: CameraOptions) {
  camera.elem.position.set(5, 5, 5)
  camera.position = {x: 5, y: 5, z: 5}
  camera.time = 6
  camera.to = {x: 10, y: 10, z: 10}
  camera.elem.lookAt(0, 0, 0)
}

export function setupLight (lights: LightInfo[], helpers?: boolean) {
  const light = new PointLight(0xffffff, 10)

  light.position.set(5, 5, 0)
  light.lookAt(0, 0, 0)
  lights.push({
    elem: light,
    helper: helpers ? new PointLightHelper(light, 1) : undefined,
    position: {x: 5, y: 5, z: 5},
    time: 4,
    to: {x: 1, y: 5, z: 2},
    lookAt: {x: 0, y: 0, z: 0},
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

export function handleElem (deltaTime: number, elem: LightInfo | CameraOptions) {
  const distance: Vector3D = {
    x: elem.to.x - elem.position.x,
    y: elem.to.y - elem.position.y,
    z: elem.to.z - elem.position.z
  }
  const speed: Vector3D = {
    x: (distance.x / elem.time) * deltaTime,
    y: (distance.y / elem.time) * deltaTime,
    z: (distance.z / elem.time) * deltaTime
  }

  if(elem.time > 0) {
    elem.time = elem.time - deltaTime
    elem.position = {
      x: elem.position.x + speed.x, 
      y: elem.position.y + speed.y, 
      z: elem.position.z + speed.z
    }
    setElemPosition(elem.elem, elem.position, elem.lookAt)
  } else if (elem.position.x !== elem.to.x 
    || elem.position.y !== elem.to.y 
    || elem.position.z !== elem.to.z ) setElemPosition(elem.elem, elem.position, elem.lookAt)
}