<template>
  <div ref="sceneParent" class="relative z-index width-100 height-100 " />
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import { Ref, onMounted, reactive, ref, watch } from 'vue'
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, Mesh, AxesHelper, SphereGeometry, Clock } from 'three'
import { setupCamera, cameraUpdate, setupLight } from '../scripts/tutoThreeComponent' 
import { createSurfaceWithTexture, rotateMesh, setCameraPosition, setMeshPosition,  } from '../scripts/basicThree'
import { Size2D, Vector3D } from '../ifaces/geometry.interface'

/********************************************/
/*           TYPES ASSIGNATION              */
/********************************************/
type MyProps = { windowSize: Size2D }

/********************************************/
/*           VARIABLE ASSIGNATION           */
/********************************************/
const props = defineProps < MyProps >()

const fov = ref(75)
const near = ref(0.1)
const far = ref(1000)
const environnement = reactive<Record<string, Mesh>>({})
const cameraOptions = reactive({
  position: { x: 0, y: 0, z: 0 },
  time: 12,
  to: { x: 10, y: 10, z: 10 }
})

const sceneParent: Ref<HTMLElement | undefined> = ref()

const axesHelper = new AxesHelper(1)
const geometry = new SphereGeometry( 1, 10, 10 ); 
const geometry2 = new BoxGeometry(10, 3, 10)

const scene: Scene = new Scene()
const clock: Clock = new Clock()
const renderer: WebGLRenderer = new WebGLRenderer()
const camera: PerspectiveCamera = new PerspectiveCamera( fov.value, props.windowSize.width / props.windowSize.height, near.value, far.value )

/********************************************/
/*             FUNCTIONNALITIES             */
/********************************************/

function handleCamera (deltaTime: number) {
  const distance: Vector3D = {
    x: cameraOptions.to.x - cameraOptions.position.x,
    y: cameraOptions.to.y - cameraOptions.position.y,
    z: cameraOptions.to.z - cameraOptions.position.z
  }
  const speed: Vector3D = {
    x: (distance.x / cameraOptions.time) * deltaTime,
    y: (distance.y / cameraOptions.time) * deltaTime,
    z: (distance.z / cameraOptions.time) * deltaTime
  }

  if(cameraOptions.time > 0) {
    cameraOptions.time = cameraOptions.time - deltaTime
    cameraOptions.position = {
      x: cameraOptions.position.x + speed.x, 
      y: cameraOptions.position.y + speed.y, 
      z: cameraOptions.position.z + speed.z
    }
    setCameraPosition(camera, cameraOptions.position)
  } else if (cameraOptions.position.x !== cameraOptions.to.x 
    || cameraOptions.position.y !== cameraOptions.to.y 
    || cameraOptions.position.z !== cameraOptions.to.z ) setCameraPosition(camera, cameraOptions.to)
}

function animate() {
  const deltaTime = clock.getDelta()

  requestAnimationFrame( animate )
  if (environnement["sphere"]) rotateMesh(environnement["sphere"], {x: 0.01, y: 0.01, z:0.0})
  if (environnement["surface"]) rotateMesh(environnement["surface"],{x: 0.00, y: 0.01, z:0.0})
  handleCamera(deltaTime)
	render()
}

function render () { renderer.render( scene, camera ) }


/********************************************/
/*       FUNCTION CALL IN SETUP             */
/********************************************/
/* Calling in setup is calling before the   */
/* HTML tags are created                    */
/********************************************/

renderer.setSize(props.windowSize.width, props.windowSize.height)

createSurfaceWithTexture(geometry, "/textures/Obama/Obama.jpg")
  .then((mesh) => {
    environnement["sphere"] = mesh
  })

createSurfaceWithTexture(geometry2, "/textures/Trump/Trump.jpg")
  .then((mesh) => {
    setMeshPosition(mesh, {x:1, y:-2, z:1})
    environnement["surface"] = mesh
  })

setupCamera(camera)
setupLight(scene)
setCameraPosition(camera, {x:10, y:10, z:9})

scene.add(axesHelper)

/********************************************/
/*     FUNCTION CALL IN VUE CYCLE LIFE      */
/********************************************/

watch(props, (newProps: MyProps) => { 
  const aspect = newProps.windowSize.width / newProps.windowSize.height
  cameraUpdate(camera, fov.value, aspect, near.value, far.value)
  renderer.setSize(newProps.windowSize.width, newProps.windowSize.height)
  render()
})

watch(environnement, (newEnvironment: Record<string, Mesh>) => {
  scene.clear()
  for (let key in newEnvironment) scene.add(newEnvironment[key].clone())
  render()
})

onMounted(() => { // function called after every tags are mounted in the file
  if (sceneParent.value) {
    sceneParent.value.appendChild(renderer.domElement)
    animate()
    render()
  }
})
</script>