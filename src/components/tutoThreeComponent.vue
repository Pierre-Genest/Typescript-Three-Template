<template>
  <div ref="sceneParent" class="relative z-index width-100 height-100 " />
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import { Ref, onMounted, onUnmounted, reactive, ref, toRaw, watch } from 'vue'
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, Mesh, AxesHelper, SphereGeometry, Clock } from 'three'
import { setupCamera, cameraUpdate, setupLight } from '../scripts/tutoThreeComponent' 
import { createSurfaceWithTexture, rotateMesh, setCameraPosition, setMeshPosition,  } from '../scripts/basicThree'
import { Size2D, Vector3D } from '../ifaces/geometry.interface'
import { CameraOptions, LightInfo } from '../ifaces/basic.interface'

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
const camera: CameraOptions = reactive({
  camera: new PerspectiveCamera( fov.value, props.windowSize.width / props.windowSize.height, near.value, far.value ),
  position: { x: 0, y: 0, z: 0 },
  time: 4,
  to: { x: 2, y: 0, z: 10 },
  lookAt: {x: 0, y: 0, z: 0}
})

const sceneParent: Ref<HTMLElement | undefined> = ref()
const lights: Ref<LightInfo[]> = ref([])
const axeHelper = new AxesHelper(10)

const sphere = new SphereGeometry( 1, 100, 100 ); 
const surface = new BoxGeometry(10, 1, 10)

const scene: Scene = new Scene()
const clock: Clock = new Clock()
const renderer: WebGLRenderer = new WebGLRenderer()

/********************************************/
/*             FUNCTIONNALITIES             */
/********************************************/

function displayAll () {
  scene.add(axeHelper)
  displayEnvironments(environnement)
  displayLights()
  renderer.info.reset(); 
}

function displayEnvironments (environment: Record<string, Mesh>) {
  for (let key in environment) scene.add(environment[key].clone())
}

function displayLights () {
  for (let light of toRaw(lights.value)) {
    scene.add(light.light)
    if (light.helper) scene.add(light.helper)
  }
}

function handleCamera (deltaTime: number) {
  const distance: Vector3D = {
    x: camera.to.x - camera.position.x,
    y: camera.to.y - camera.position.y,
    z: camera.to.z - camera.position.z
  }
  const speed: Vector3D = {
    x: (distance.x / camera.time) * deltaTime,
    y: (distance.y / camera.time) * deltaTime,
    z: (distance.z / camera.time) * deltaTime
  }

  if(camera.time > 0) {
    camera.time = camera.time - deltaTime
    camera.position = {
      x: camera.position.x + speed.x, 
      y: camera.position.y + speed.y, 
      z: camera.position.z + speed.z
    }
    setCameraPosition(camera.camera, camera.position, camera.lookAt)
  } else if (camera.position.x !== camera.to.x 
    || camera.position.y !== camera.to.y 
    || camera.position.z !== camera.to.z ) setCameraPosition(camera.camera, camera.to, camera.lookAt)
}

function animate() {
  const deltaTime = clock.getDelta()

  requestAnimationFrame( animate )
  scene.clear()
  if (environnement["sphere"]) rotateMesh(environnement["sphere"], {x: 0, y: 0.01, z:0.0})
  handleCamera(deltaTime)
  displayAll()
	render()
}

function render () { renderer.render( scene, camera.camera ) }

function move (ev: KeyboardEvent) {
  if (environnement["sphere"])
    lights.value[0].light.position.set(
      lights.value[0].light.position.x + (ev.key === 'q' ? 0.5 : ev.key === 'd' ? (-0.5) : 0 ), 
      lights.value[0].light.position.y, 
      lights.value[0].light.position.z + (ev.key === 'z' ? 0.5 : ev.key === 's' ? (-0.5) : 0 )
    )
}

/********************************************/
/*       FUNCTION CALL IN SETUP             */
/********************************************/
/* Calling in setup is calling before the   */
/* HTML tags are created                    */
/********************************************/

renderer.setSize(props.windowSize.width, props.windowSize.height)

createSurfaceWithTexture(sphere, "/textures/blue.jpeg")
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
setupLight(lights.value, true)

window.onkeydown = move

/********************************************/
/*     FUNCTION CALL IN VUE CYCLE LIFE      */
/********************************************/

watch(props, (newProps: MyProps) => { 
  const aspect = newProps.windowSize.width / newProps.windowSize.height
  cameraUpdate(camera.camera, fov.value, aspect, near.value, far.value)
  renderer.setSize(newProps.windowSize.width, newProps.windowSize.height)
})

onMounted(() => { // function called after every tags are mounted in the file
  if (sceneParent.value) {
    sceneParent.value.appendChild(renderer.domElement)
    animate()

    // TEST
    interval.value = setInterval(() => {
      camera.time =  4
      camera.to = {
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