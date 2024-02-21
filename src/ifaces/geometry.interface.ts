import { BoxGeometry, CapsuleGeometry, CircleGeometry, ConeGeometry, CylinderGeometry, DodecahedronGeometry, EdgesGeometry, ExtrudeGeometry, IcosahedronGeometry, LatheGeometry, OctahedronGeometry, PlaneGeometry, PolyhedronGeometry, RingGeometry, ShapeGeometry, SphereGeometry, TetrahedronGeometry, TorusGeometry, TorusKnotGeometry, TubeGeometry, WireframeGeometry } from "three"

export type Vector3D = { 
  x: number,
  y: number,
  z: number
}

export type Size2D = { 
  width: number,
  height: number
}

export type Size3D = { 
  width: number,
  height: number,
  depth: number
}

export type GeometryTypes = BoxGeometry | CapsuleGeometry | CircleGeometry | ConeGeometry |
 CylinderGeometry | DodecahedronGeometry | EdgesGeometry | ExtrudeGeometry |  IcosahedronGeometry |
 LatheGeometry | OctahedronGeometry | PlaneGeometry | PolyhedronGeometry | RingGeometry | ShapeGeometry | 
 SphereGeometry | TetrahedronGeometry | TorusGeometry | TorusKnotGeometry | TubeGeometry | WireframeGeometry 