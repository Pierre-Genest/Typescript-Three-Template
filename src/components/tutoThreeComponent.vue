<template>
  <div ref="sceneParent" class="relative z-index width-100 height-100 " />
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import { Ref, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, Mesh, AxesHelper, SphereGeometry, Clock } from 'three'
import { setupCamera, cameraUpdate, setupLight } from '../scripts/tutoThreeComponent' 
import { createSurfaceWithTexture, rotateMesh, setCameraPosition, setMeshPosition,  } from '../scripts/basicThree'
import { Size2D, Vector3D } from '../ifaces/geometry.interface'
import { CameraOptions } from '../ifaces/basic.interface'

/********************************************/
/*           TYPES ASSIGNATION              */
/********************************************/
type MyProps = { windowSize: Size2D }

/********************************************/
/*           VARIABLE ASSIGNATION           */
/********************************************/
const props = defineProps < MyProps >()

const interval: Ref<undefined | ReturnType<typeof setInterval>> = ref()
const fov = ref(75)
const near = ref(0.1)
const far = ref(1000)
const environnement = reactive<Record<string, Mesh>>({})
const cameraOptions: CameraOptions = reactive({
  position: { x: 0, y: 0, z: 0 },
  time: 4,
  to: { x: 2, y: 0, z: 10 },
  lookAt: {x: 0, y: 0, z: 0}
})

const sceneParent: Ref<HTMLElement | undefined> = ref()

const axesHelper = new AxesHelper(10)
const sphere = new SphereGeometry( 1, 100, 100 ); 
const surface = new BoxGeometry(10, 1, 10)

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
    setCameraPosition(camera, cameraOptions.position, cameraOptions.lookAt)
  } else if (cameraOptions.position.x !== cameraOptions.to.x 
    || cameraOptions.position.y !== cameraOptions.to.y 
    || cameraOptions.position.z !== cameraOptions.to.z ) setCameraPosition(camera, cameraOptions.to, cameraOptions.lookAt)
}

function animate() {
  const deltaTime = clock.getDelta()

  requestAnimationFrame( animate )
  if (environnement["sphere"]) rotateMesh(environnement["sphere"], {x: 0, y: 0.01, z:0.0})
  //if (environnement["surface"]) rotateMesh(environnement["surface"],{x: 0.00, y: 0.01, z:0.0})
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

createSurfaceWithTexture(sphere, "/textures/blue.jpeg", 0.8)
  .then((mesh) => {
    setMeshPosition(mesh, { x: 0, y: 1.5, z: 0 })
    environnement["sphere"] = mesh
  })

createSurfaceWithTexture(surface, "/textures/marbre.jpeg")
  .then((mesh) => {
    setMeshPosition(mesh, { x: 0, y: 0, z: 0 })
    environnement["surface"] = mesh
  })

setupCamera(camera)
setupLight(scene)
setCameraPosition(camera, {x:10, y:10, z:9})

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
  scene.add(axesHelper)
  for (let key in newEnvironment) scene.add(newEnvironment[key].clone())
  render()
})

onMounted(() => { // function called after every tags are mounted in the file
  if (sceneParent.value) {
    sceneParent.value.appendChild(renderer.domElement)
    animate()

    // TEST
    interval.value = setInterval(() => {
      cameraOptions.time =  4
      cameraOptions.to = {
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
        z: Math.floor(Math.random() * 10),
      }
    }, 4000)
    render()
  }
})

onUnmounted(() => {
  clearInterval(interval.value)
})
</script>