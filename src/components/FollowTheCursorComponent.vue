<template>
  <div ref="sceneParent" class="relative z-index width-100 height-100 " />
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import { Ref, onMounted, onUnmounted, reactive, ref, toRaw, watch } from 'vue'
import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, Clock, SphereGeometry, Raycaster, Vector2, Vector3, Quaternion } from 'three'
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

const fov = ref(75)
const near = ref(0.1)
const far = ref(1000)
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
const numberOfBalls = ref(1)

const sceneParent: Ref<HTMLElement | undefined> = ref()
const lights: Ref<LightInfo[]> = ref([])
const axeHelper = new AxesHelper(10)

const scene: Scene = new Scene()
const world = new World()
const clock: Clock = new Clock()
const renderer: WebGLRenderer = new WebGLRenderer()

const raycaster = new Raycaster()
const mouse: Vector2 = reactive(new Vector2(-1, -1))

const interval: Ref<undefined | ReturnType<typeof setInterval>> = ref()

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
    const physic = environment[key].physic
    if (physic) {
      const position = new Vector3(physic.position.x, physic.position.y, physic.position.z)
      const quaternion = new Quaternion(physic.quaternion.x, physic.quaternion.y, physic.quaternion.z)
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

world.gravity.set(0, 0, 0)

for(let i = 1; i<= numberOfBalls.value; i++) {
  const size = randomIntFromInterval(1, 2)
  const sphereMesh = new SphereGeometry(size, 100, 100 )
  const sphereShape = new Sphere(size)
  const sphereBody = new Body({ mass: 1 })

  sphereBody.addShape(sphereShape)

  const mesh = createSurface(sphereMesh, 0x00ff00, { x: 0, y: 0, z: 0 }, { physic: sphereBody })

  environment[`elem-${i}`] = { 
    elem: mesh,
    physic: sphereBody
  }
  world.addBody(sphereBody)
}

console.log(environment)

setupCamera(camera)
setupLight(lights.value, true)


window.addEventListener("touchmove", (event) => {
  mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera.elem)

  const intersects = raycaster.intersectObjects(scene.children)

  console.log(intersects)
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
    sceneParent.value.appendChild(renderer.domElement)
    interval.value = setInterval(() => {
      const to = { 
        x: randomIntFromInterval(-1, 1), 
        y: randomIntFromInterval(-1, 1), 
        z: randomIntFromInterval(-1, 1)
      }
      console.log(to)
      for(let i = 1; i<= numberOfBalls.value; i++)
        environment[`elem-${i}`].movement = {
            position: { 
              x: environment[`elem-${i}`].elem.position.x, 
              y: environment[`elem-${i}`].elem.position.y, 
              z: environment[`elem-${i}`].elem.position.z 
            },
            time: 5,
            to: to,
        }
    }, 5000)
    animate()
    render()
  }
})

onUnmounted(() => {
  clearInterval(interval.value)
})

</script>