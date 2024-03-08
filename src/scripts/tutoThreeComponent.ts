import { PointLight, PointLightHelper } from "three"
import { CameraOptions, LightInfo } from "../ifaces/basic.interface"

/*********************************/
/*        SETUP FUNCTIONS        */
/*********************************/

export function setupCamera (camera: CameraOptions) {
  camera.elem.position.set(5, 5, 5)
}

export function setupLight (lights: LightInfo[], helpers?: boolean) {
  const light = new PointLight(0xffffff, 10)

  light.position.set(5, 5, 0)
  light.lookAt(0, 0, 0)
  lights.push({
    elem: light,
    helper: helpers ? new PointLightHelper(light, 1) : undefined,
    movement: {
      position: {x: 5, y: 5, z: 5},
      time: 4,
      to: {x: 1, y: 5, z: 2},
      lookAt: {x: 0, y: 0, z: 0},
    }
  })
}
