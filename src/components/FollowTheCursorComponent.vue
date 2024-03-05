<template>
  <div ref="sceneParent" class="relative z-index width-100 height-100 " />
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import { Ref, onMounted, reactive, ref, toRaw, watch } from 'vue'
import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, Clock, SphereGeometry } from 'three'
import { Body, Sphere, World } from 'cannon-es'
import { setupCamera, setupLight } from '../scripts/FollowTheCursorComponent' 
import { cameraUpdate, createSurface, handleElem } from '../scripts/basicThree'
import { Size2D } from '../ifaces/geometry.interface'
import { CameraOptions, LightInfo, ObjInfo } from '../ifaces/basic.interface'

/********************************************/
/*           TYPES ASSIGNATION              */
/********************************************/
type MyProps = { windowSize: Size2D }

/********************************************/
/*           VARIABLE ASSIGNATION           */
/********************************************/
const props = defineProps < MyProps >()
const helpers = ref(true) // to trigger or untrigger all helpers

const to = reactive({x: 0, y:0})

const timer: Ref<ReturnType<typeof setInterval> | undefined> = ref()
const fov = ref(75)
const near = ref(0.1)
const far = ref(1000)
const environment = reactive<Record<string, ObjInfo>>({})
const camera: CameraOptions = reactive({
  elem: new PerspectiveCamera( fov.value, props.windowSize.width / props.windowSize.height, near.value, far.value ),
  position: { x: 0, y: 0, z: 0 },
  time: 0,
  to: { x: 2, y: 0, z: 10 },
  lookAt: {x: 0, y: 0, z: 0}
})
const numberOfBalls = ref(1)

const sceneParent: Ref<HTMLElement | undefined> = ref()
const lights: Ref<LightInfo[]> = ref([])
const axeHelper = new AxesHelper(10)

const scene: Scene = new Scene()
const world = new World()
const clock: Clock = new Clock()
const renderer: WebGLRenderer = new WebGLRenderer()

/********************************************/
/*             FUNCTIONNALITIES             */
/********************************************/

function displayAll (deltaTime: number) {
  if (helpers.value) scene.add(axeHelper)
  handleElem(deltaTime, camera)
  displayLights(deltaTime)
  triggerPhysics()
  displayEnvironments()
  renderer.info.reset(); 
}

function triggerPhysics () {
  for (let key in environment) {
    if (environment[key].physic) {
      environment[key].mesh.position.copy(environment[key].physic.position)
      environment[key].mesh.quaternion.copy(environment[key].physic.quaternion)
    }
  }
}

function displayLights (deltaTime: number) {
  let i = 0;
  for (let light of toRaw(lights.value)) {
    handleElem(deltaTime, light)
    scene.add(light.elem)
    if (light.helper && helpers.value) scene.add(light.helper)
  }

}

function displayEnvironments () {
  for (let key in environment) {
    scene.add(environment[key].mesh.clone())
  }
}

function animate() {
  const deltaTime = clock.getDelta()
  requestAnimationFrame( animate )
  world.step(deltaTime)
  scene.clear()
  displayAll(deltaTime)
	render()
}

function randomIntFromInterval (min: number, max: number) { 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function render () { renderer.render( scene, camera.elem ) }

/********************************************/
/*       FUNCTION CALL IN SETUP             */
/********************************************/
/* Calling in setup is calling before the   */
/* HTML tags are created                    */
/********************************************/

renderer.setSize(props.windowSize.width, props.windowSize.height)

world.gravity.set(0, 0, 0)

for(let i = 1; i<= numberOfBalls.value; i++) {
  const size = randomIntFromInterval(1, 2)
  const sphereMesh = new SphereGeometry(size, 100, 100 )
  const sphereShape = new Sphere(size)
  const sphereBody = new Body({ mass: 1 })

  sphereBody.addShape(sphereShape)

  const mesh = createSurface(sphereMesh, 0x00ff00, { x: 0, y: 0, z: 0 }, { physic: sphereBody })

  environment[`elem-${i}`] = { 
    mesh: mesh,
    physic: sphereBody
  }
  world.addBody(sphereBody)
}

console.log(environment)

setupCamera(camera)
setupLight(lights.value, true)


/********************************************/
/*     FUNCTION CALL IN VUE CYCLE LIFE      */
/********************************************/

watch(props, (newProps: MyProps) => { 
  const aspect = newProps.windowSize.width / newProps.windowSize.height
  cameraUpdate(camera.elem, fov.value, aspect, near.value, far.value)
  renderer.setSize(newProps.windowSize.width, newProps.windowSize.height)
})

onMounted(() => { // function called after every tags are mounted in the file
  if (sceneParent.value) {
    sceneParent.value.appendChild(renderer.domElement)
    animate()
    render()
  }
})


</script>