<template>
  <div ref="sceneParent" class="relative z-index width-100 height-100 " />
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import { Ref, onMounted, onUnmounted, reactive, ref, toRaw, watch } from 'vue'
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, AxesHelper, SphereGeometry, Clock, PlaneGeometry } from 'three'
import { Body, Sphere, Box, World, Vec3 } from 'cannon-es'
import { setupCamera, setupLight } from '../scripts/tutoThreeComponent' 
import { cameraUpdate, createSurface, createSurfaceWithTexture, handleElem, loadObject, rotateMesh } from '../scripts/basicThree'
import { Size2D } from '../ifaces/geometry.interface'
import { CameraOptions, LightInfo, ObjInfo } from '../ifaces/basic.interface'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

/********************************************/
/*           TYPES ASSIGNATION              */
/********************************************/
type MyProps = { windowSize: Size2D }

/********************************************/
/*           VARIABLE ASSIGNATION           */
/********************************************/
const props = defineProps < MyProps >()
const helpers = ref(true) // to trigger or untrigger all helpers

const intervalCamera: Ref<undefined | ReturnType<typeof setInterval>> = ref()
const intervalLight: Ref<undefined | ReturnType<typeof setInterval>> = ref()

const fov = ref(75)
const near = ref(0.1)
const far = ref(1000)
const environment = reactive<Record<string, ObjInfo>>({})
const camera: CameraOptions = reactive({
  elem: new PerspectiveCamera( fov.value, props.windowSize.width / props.windowSize.height, near.value, far.value ),
  movement: {
    position: { x: 0, y: 0, z: 0 },
    time: 0.1,
    to: { x: 5, y: 10, z: 10 },
    lookAt: {x: 0, y: 0, z: 0}
  }
})

const sceneParent: Ref<HTMLElement | undefined> = ref()
const lights: Ref<LightInfo[]> = ref([])
const axeHelper = new AxesHelper(10)

const loader = new GLTFLoader()
const duckShape = new Sphere(0.7)
const duckBody = new Body({ mass: 1 })

const ghost = new BoxGeometry( 1, 1, 1 );

const screen1 =  new PlaneGeometry( 3, 5 )
const screen2 =  new PlaneGeometry( 3, 5 )
const screen3 =  new PlaneGeometry( 3, 5 )

const cube = new BoxGeometry( 1, 1, 1 );
const cubeShape = new Box(new Vec3(0.5, 0.5, 0.5))
const cubeBody = new Body({ mass: 1 })

const sphereTest = new SphereGeometry( 1, 100, 100 );
const sphereTestShape = new Sphere(1)
const sphereTestBody = new Body({ mass: 1 })

const surface = new BoxGeometry(10, 1, 10)
const surfaceShape = new Box(new Vec3(5, 0.5, 5))
const surfaceBody = new Body({ mass: 0 })


const scene: Scene = new Scene()
const world = new World()
const clock: Clock = new Clock()
const renderer: WebGLRenderer = new WebGLRenderer()

/********************************************/
/*             FUNCTIONNALITIES             */
/********************************************/

function randomIntFromInterval (min: number, max: number) { 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/********************************************/
/*    FUNCTIONNALITIES THREE CYCLE LIFE     */
/********************************************/

function displayAll (deltaTime: number) {
  if (helpers.value) scene.add(axeHelper)
  handleElem(deltaTime, camera)
  displayLights(deltaTime)
  triggerPhysics()
  displayEnvironments(deltaTime)
  renderer.info.reset()
}

function triggerPhysics () {
  for (let key in environment) {
    if (environment[key].physic) {
      environment[key].elem.position.copy(environment[key].physic.position)
      environment[key].elem.quaternion.copy(environment[key].physic.quaternion)
      if (environment[key].movement) environment[key].movement.position = { ...environment[key].elem.position }
    }
  }
}

function displayLights (deltaTime: number) {
  for (let light of toRaw(lights.value)) {
    handleElem(deltaTime, light)
    scene.add(light.elem)
    if (light.helper && helpers.value) scene.add(light.helper)
  }

}

function displayEnvironments (deltaTime: number) {
  for (let key in environment) {
    handleElem(deltaTime, environment[key])
    scene.add(environment[key].elem.clone())
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

function render () { renderer.render( scene, camera.elem ) }

/********************************************/
/*       FUNCTION CALL IN SETUP             */
/********************************************/
/* Calling in setup is calling before the   */
/* HTML tags are created                    */
/********************************************/

renderer.setSize(props.windowSize.width, props.windowSize.height)

world.gravity.set(0, -9.82, 0)

cubeBody.addShape(cubeShape)
sphereTestBody.addShape(sphereTestShape)
surfaceBody.addShape(surfaceShape)
duckBody.addShape(duckShape)

createSurfaceWithTexture(ghost, "/textures/blue.jpeg", { x: 0, y: 3, z: 0 }, {
  shadow: { cast: true },
  opacity: 0.5,
}).then((mesh) => {
  environment["ghost"] = { elem: mesh }
})

let mesh = createSurface(screen1, 0xff0000, { x: 0, y: 3, z: -5 })
environment["screen1"] = { elem: mesh }

mesh = createSurface(screen2, 0x00ff00, { x: 3, y: 3, z: -5 })
environment["screen2"] = { elem: mesh }

mesh = createSurface(screen3,  0x0000ff, { x: -3, y: 3, z: -5 })
environment["screen3"] = { elem: mesh }



createSurfaceWithTexture(cube, "/textures/blue.jpeg", { x: 0, y: 5, z: 0 }, {
  shadow: { cast: true },
  physic: cubeBody
}).then((mesh) => {
  environment["cube"] = { elem: mesh, physic: cubeBody }
  world.addBody(cubeBody)
})

createSurfaceWithTexture(sphereTest, "/textures/blue.jpeg", { x: 1, y: 2, z: 0 }, {
  shadow: { cast: true },
  physic: sphereTestBody
}).then((mesh) => {
  environment["sphereTest"] = { elem: mesh, physic: sphereTestBody }
  world.addBody(sphereTestBody)
})

createSurfaceWithTexture(surface, "/textures/marbre.jpeg", { x: 0, y: 0, z:0 }, {
  shadow: { receive: true },
  physic: surfaceBody
}).then((mesh) => {
  environment["surface"] = { elem: mesh, physic: surfaceBody }
  world.addBody(surfaceBody)
})

loadObject("duck",loader, {x: 0, y: 10, z: 0}, "/models/Duck/Duck.gltf", {
  physic: duckBody
})
.then((mesh) => {
  environment["duck"] = { elem: mesh, physic: duckBody }
  world.addBody(duckBody)
})


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

    //intervalLight 
    intervalLight.value = setInterval(() => {
      for (let light of toRaw(lights.value)) {
        if (light.movement) {
          light.movement.time =  6
          light.movement.to = {
            x: randomIntFromInterval(-5, 5),
            y: randomIntFromInterval(1, 5),
            z: randomIntFromInterval(-5, 5),
          }
        }
      }
    }, 6000)
    render()
  }
})

onUnmounted(() => {
  clearInterval(intervalCamera.value)
  clearInterval(intervalLight.value)
})
</script>