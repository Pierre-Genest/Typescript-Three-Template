<template>
  <div ref="sceneParent" class="relative z-index width-100 height-100"/>
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import { Ref, onMounted, reactive, ref, toRaw, watch } from 'vue'
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, AxesHelper, Clock, Raycaster, Vector2, Intersection, Object3D, Object3DEventMap, Vector3, Quaternion } from 'three'
import { World, Box, Body, Vec3 } from 'cannon-es'
import { setupCamera, setupLight } from '../scripts/surveyThreeComponent' 
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
const helpers = ref(false) // to trigger or untrigger all helpers

const fov = ref(75)
const near = ref(0.1)
const far = ref(100)
const environment = reactive<Record<string, ObjInfo>>({})
const camera: CameraOptions = reactive({
  elem: new PerspectiveCamera( fov.value, props.windowSize.width / props.windowSize.height, near.value, far.value ),
  movement: {
    position: { x: 0, y: 0, z: 0 },
    time: 0.1,
    to: { x: 5, y: 5, z: 5 },
    lookAt: {x: 0, y: 0, z: 0}
  }
})

const sceneParent: Ref<HTMLElement | undefined> = ref()
const lights: Ref<LightInfo[]> = ref([])
const axeHelper = new AxesHelper(10)

const scene: Scene = new Scene()
const world = new World()
const clock: Clock = new Clock()
const renderer: WebGLRenderer = new WebGLRenderer()

const realCubeSize = 0.25
const cube = new BoxGeometry(realCubeSize, realCubeSize, realCubeSize);
const cubeSize = 0.5

const raycaster = new Raycaster()
const mouse: Vector2 = reactive(new Vector2(-1, -1))

/********************************************/
/*             FUNCTIONNALITIES             */
/********************************************/

function checkIntersection (mesh: Intersection<Object3D<Object3DEventMap>>) {
  if (environment[`${mesh.object.position.x}-${mesh.object.position.y}-${mesh.object.position.z}`] 
      && !environment[`${mesh.object.position.x}-${mesh.object.position.y}-${mesh.object.position.z}`].physic) {
      const surfaceShape = new Box(new Vec3(realCubeSize, realCubeSize, realCubeSize))
      const surfaceBody = new Body({ mass: 1 })
      surfaceBody.addShape(surfaceShape)
      surfaceBody.position.set(mesh.object.position.x, mesh.object.position.y, mesh.object.position.z)
      world.addBody(surfaceBody)
      environment[`${mesh.object.position.x}-${mesh.object.position.y}-${mesh.object.position.z}`].physic = surfaceBody
    }
}

function createWallOfBock() {
  let size = { x: 10, y: 10, z: 10}

  for (let x = 0; x < size.x; x++) {
    for (let y = 0; y < size.y; y++) {
      for (let z = 0; z < size.z; z++) {
        let mesh = createSurface(cube, 0xffffff, { x: x * cubeSize, y:  y * cubeSize, z: z * cubeSize }, {shadow : {receive: true}})
        environment[`${x* cubeSize}-${y* cubeSize}-${z* cubeSize}`] = { elem: mesh }
      }
    }
  }
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
    const physic = environment[key].physic
    if (physic) {
      const position = new Vector3(physic.position.x, physic.position.y, physic.position.z)
      const quaternion = new Quaternion(physic.quaternion.x, physic.quaternion.y, physic.quaternion.z, physic.quaternion.w)
      const movement = environment[key].movement

      environment[key].elem.position.copy(position)
      environment[key].elem.quaternion.copy(quaternion)

      if (movement) movement.position = { ...environment[key].elem.position }
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

setupCamera(camera)
setupLight(lights.value, true)

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera.elem);

  const intersects = raycaster.intersectObjects(scene.children);

  for (let mesh of intersects) checkIntersection(mesh)
})

window.addEventListener("touchmove", (event) => {
  mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera.elem)

  const intersects = raycaster.intersectObjects(scene.children)

  for (let mesh of intersects) checkIntersection(mesh)
})



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
    createWallOfBock()
    sceneParent.value.appendChild(renderer.domElement)
    animate()
    render()
  }
})
</script>