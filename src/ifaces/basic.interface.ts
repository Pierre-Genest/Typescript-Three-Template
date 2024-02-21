import { 
  DirectionalLight, DirectionalLightHelper, Group, 
  LineBasicMaterial, LineDashedMaterial, Mesh, 
  MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, 
  MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial,
  MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, 
  MeshToonMaterial, Object3DEventMap, PerspectiveCamera, 
  PointLight, PointLightHelper, PointsMaterial, 
  RawShaderMaterial, ShaderMaterial, ShadowMaterial, 
  SpotLight, SpotLightHelper, SpriteMaterial 
} from "three"
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

export interface MovementOptions {
  position: Vector3D,
  time: number,
  to: Vector3D,
  lookAt?: Vector3D
}

export interface CameraOptions extends MovementOptions {
  elem: PerspectiveCamera
}

export type ObjInfo = {
  mesh: Mesh | Group<Object3DEventMap>,
  physic?: Body
  movment?: MovementOptions
}

export interface LightInfo extends MovementOptions {
  elem: Lights,
  helper?: LightsHelper
}

export type Lights = DirectionalLight | SpotLight | PointLight
export type LightsHelper = DirectionalLightHelper | SpotLightHelper | PointLightHelper

export type Material = LineBasicMaterial | LineDashedMaterial | MeshBasicMaterial | MeshDepthMaterial | MeshDistanceMaterial |
  MeshLambertMaterial | MeshMatcapMaterial | MeshNormalMaterial | MeshPhongMaterial | MeshPhysicalMaterial | MeshStandardMaterial |
  MeshToonMaterial | PointsMaterial | RawShaderMaterial | ShaderMaterial | ShadowMaterial | SpriteMaterial 