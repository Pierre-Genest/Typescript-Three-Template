import { PointLight, PointLightHelper } from "three"
import { CameraOptions, LightInfo } from "../ifaces/basic.interface"

/*********************************/
/*        SETUP FUNCTIONS        */
/*********************************/

export function setupCamera (camera: CameraOptions) {
  camera.elem.position.set(5, 5, 5)
  camera.position = {x: 5, y: 5, z: 5}
  camera.time = 0
  camera.to = {x: 5, y: 5, z: 5}
  camera.elem.lookAt(0, 0, 0)
}

export function setupLight (lights: LightInfo[], helpers?: boolean) {
  const light = new PointLight(0xffffff, 10)

  light.position.set(1, 5, 2)
  light.lookAt(0, 0, 0)
  lights.push({
    elem: light,
    helper: helpers ? new PointLightHelper(light, 1) : undefined,
    position: {x: 1, y: 5, z: 2},
    time: 0,
    to: {x: 1, y: 5, z: 2},
    lookAt: {x: 0, y: 0, z: 0},
  })
}
