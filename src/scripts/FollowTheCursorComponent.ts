import { PointLight, PointLightHelper } from "three"
import { CameraOptions, LightInfo } from "../ifaces/basic.interface"

/*********************************/
/*        SETUP FUNCTIONS        */
/*********************************/

export function setupCamera (camera: CameraOptions) {
  camera.elem.position.set(5, 5, 5)
}

export function setupLight (lights: LightInfo[], helpers?: boolean) {
  const light1 = new PointLight(0xffffff, 10)
  const light2 = new PointLight(0xffffff, 10)
  const light3 = new PointLight(0xffffff, 10)

  const position1 = {x: 0, y: 5, z: 0}
  const position2 = {x: 5, y: 0, z: 0}
  const position3 = {x: 0, y: 0, z: 5}

  lights.push({
    elem: light1,
    helper: helpers ? new PointLightHelper(light1, 1) : undefined,
    movement: {
      position: position1,
      time: 0.1,
      to: position1,
      lookAt: {x: 0, y: 0, z: 0},
    }
  })

  lights.push({
    elem: light2,
    helper: helpers ? new PointLightHelper(light2, 1) : undefined,
    movement: {
      position: position2,
      time: 0.1,
      to: position2,
      lookAt: {x: 0, y: 0, z: 0},
    }
  })

  lights.push({
    elem: light3,
    helper: helpers ? new PointLightHelper(light3, 1) : undefined,
    movement: {
      position: position3,
      time: 0.1,
      to: position3,
      lookAt: {x: 0, y: 0, z: 0},
    }
  })

}
