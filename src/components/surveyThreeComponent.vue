<template>
  <div ref="sceneParent" class="relative z-index width-100 height-100 " />
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import { Ref, onMounted, reactive, ref, toRaw, watch } from 'vue'
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, AxesHelper, Clock, Vector3, Quaternion } from 'three'
import { Body, World } from 'cannon-es'
import { setupCamera, setupLight } from '../scripts/surveyThreeComponent' 
import { cameraUpdate, createSurfaceWithTexture, handleElem } from '../scripts/basicThree'
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

const fov = ref(75)
const near = ref(0.1)
const far = ref(1000)
const environment = reactive<Record<string, ObjInfo>>({})
const camera: CameraOptions = reactive({
  elem: new PerspectiveCamera( fov.value, props.windowSize.width / props.windowSize.height, near.value, far.value ),
  movement: {
    position: { x: 0, y: 0, z: 0 },
    time: 0.1,
    to: { x: 2, y: 0, z: 10 },
    lookAt: {x: 0, y: 0, z: 0}
  }
})

const sceneParent: Ref<HTMLElement | undefined> = ref()
const lights: Ref<LightInfo[]> = ref([])
const axeHelper = new AxesHelper(10)

const surface = new BoxGeometry(10, 1, 10)
const surfaceBody = new Body({ mass: 0 })

const scene: Scene = new Scene()
const world = new World()
const clock: Clock = new Clock()
const renderer: WebGLRenderer = new WebGLRenderer()

/********************************************/
/*             FUNCTIONNALITIES             */
/********************************************/


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
  scene.clear()
  const deltaTime = clock.getDelta()
  requestAnimationFrame( animate )
  world.step(deltaTime)
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

createSurfaceWithTexture(surface, "/textures/marbre.jpeg", { x: 0, y: 0, z:0 }, {
  shadow: { receive: true },
  physic: surfaceBody
}).then((mesh) => {
  environment["surface"] = { elem: mesh, physic: surfaceBody }
  world.addBody(surfaceBody)
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
    render()
  }
})

</script>