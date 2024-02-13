import { Vector3D } from "./geometry.interface"

export type CameraOptions = {
  position: Vector3D,
  time: number,
  to: Vector3D,
  lookAt?: Vector3D
}