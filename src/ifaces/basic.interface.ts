import { DirectionalLight, DirectionalLightHelper, LineBasicMaterial, LineDashedMaterial, Mesh, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, PerspectiveCamera, PointLight, PointLightHelper, PointsMaterial, RawShaderMaterial, ShaderMaterial, ShadowMaterial, SpotLight, SpotLightHelper, SpriteMaterial } from "three"
import { Vector3D } from "./geometry.interface"
import { Body } from 'cannon-es'

export type shadowOption = {
  cast?: boolean,
  receive?: boolean
}

export type CreateSurfaceOptions = {
  opacity?: number,
  physic?: Body,
  shadow?: shadowOption
}

export type CameraOptions = {
  elem: PerspectiveCamera
  position: Vector3D,
  time: number,
  to: Vector3D,
  lookAt?: Vector3D
}

export type ObjInfo = {
  mesh: Mesh,
  physic?: Body
}

export type LightInfo = {
  elem: Lights,
  helper?: LightsHelper
  position: Vector3D,
  time: number,
  to: Vector3D,
  lookAt?: Vector3D
}

export type Lights = DirectionalLight | SpotLight | PointLight
export type LightsHelper = DirectionalLightHelper | SpotLightHelper | PointLightHelper

export type Material = LineBasicMaterial | LineDashedMaterial | MeshBasicMaterial | MeshDepthMaterial | MeshDistanceMaterial |
  MeshLambertMaterial | MeshMatcapMaterial | MeshNormalMaterial | MeshPhongMaterial | MeshPhysicalMaterial | MeshStandardMaterial |
  MeshToonMaterial | PointsMaterial | RawShaderMaterial | ShaderMaterial | ShadowMaterial | SpriteMaterial 