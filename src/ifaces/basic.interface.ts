import { DirectionalLight, DirectionalLightHelper, PerspectiveCamera, PointLight, PointLightHelper, SpotLight, SpotLightHelper } from "three"
import { Vector3D } from "./geometry.interface"

export type CameraOptions = {
  camera: PerspectiveCamera
  position: Vector3D,
  time: number,
  to: Vector3D,
  lookAt?: Vector3D
}

export type LightInfo = {
  light: Lights,
  helper?: LightsHelper
}

export type Lights = DirectionalLight | SpotLight | PointLight

export type LightsHelper = DirectionalLightHelper | SpotLightHelper | PointLightHelper