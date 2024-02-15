<template>
  <div ref="sceneParent" class="relative z-index width-100 height-100 " />
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import { Ref, onMounted, onUnmounted, reactive, ref, toRaw, watch } from 'vue'
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, AxesHelper, SphereGeometry, Clock } from 'three'
import { Body, Sphere, Box, World, Vec3 } from 'cannon-es'
import { setupCamera, cameraUpdate, setupLight, handleElem } from '../scripts/tutoThreeComponent' 
import { createSurfaceWithTexture, rotateMesh } from '../scripts/basicThree'
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

const intervalCamera: Ref<undefined | ReturnType<typeof setInterval>> = ref()
const intervalLight: Ref<undefined | ReturnType<typeof setInterval>> = ref()

const fov = ref(75)
const near = ref(0.1)
const far = ref(1000)
const environment = reactive<Record<string, ObjInfo>>({})
const camera: CameraOptions = reactive({
  elem: new PerspectiveCamera( fov.value, props.windowSize.width / props.windowSize.height, near.value, far.value ),
  position: { x: 0, y: 0, z: 0 },
  time: 4,
  to: { x: 2, y: 0, z: 10 },
  lookAt: {x: 0, y: 0, z: 0}
})

const sceneParent: Ref<HTMLElement | undefined> = ref()
const lights: Ref<LightInfo[]> = ref([])
const axeHelper = new AxesHelper(10)

const sphere = new BoxGeometry( 1, 1, 1 );
const sphereShape = new Box(new Vec3(0.5, 0.5, 0.5))
const sphereBody = new Body({ mass: 1 })

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

function displayAll (deltaTime: number) {
  handleElem(deltaTime, camera)
  displayLights(deltaTime)
  scene.add(axeHelper)
  triggerPhysics()
  displayEnvironments()
  renderer.info.reset(); 
}

function triggerPhysics () {
  for (let key in environment) {
    if (environment[key].physic) {
      environment[key].mesh.position.set(
        environment[key].physic.position.x,
        environment[key].physic.position.y,
        environment[key].physic.position.z,
      )
      environment[key].mesh.quaternion.set(
        environment[key].physic.quaternion.x,
        environment[key].physic.quaternion.y,
        environment[key].physic.quaternion.z,
        environment[key].physic.quaternion.w
     )
    }
  }
}

function displayLights (deltaTime: number) {
  for (let light of toRaw(lights.value)) {
    handleElem(deltaTime, light)
    scene.add(light.elem)
    if (light.helper) scene.add(light.helper)
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
  //if (environment["sphere"]) rotateMesh(environment["sphere"].mesh, {x: 0, y: 0.01, z:0.0})
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

sphereBody.addShape(sphereShape)
sphereTestBody.addShape(sphereTestShape)
surfaceBody.addShape(surfaceShape)

createSurfaceWithTexture(sphere, "/textures/blue.jpeg", { x: 0, y: 5, z: 0 }, {
  shadow: { cast: true },
  opacity: 0.5,
  physic: sphereBody
}).then((mesh) => {
  environment["sphere"] = {
    mesh: mesh,
    physic: sphereBody
  }
  world.addBody(sphereBody)
})

createSurfaceWithTexture(sphereTest, "/textures/blue.jpeg", { x: 1, y: 2, z: 0 }, {
  shadow: { cast: true },
  physic: sphereTestBody
}).then((mesh) => {
  environment["sphereTest"] = {
    mesh: mesh,
    physic: sphereTestBody
  }
  world.addBody(sphereTestBody)
})

createSurfaceWithTexture(surface, "/textures/marbre.jpeg", { x: 0, y: 0, z:0 }, {
  shadow: { receive: true },
  physic: surfaceBody
}).then((mesh) => {
  environment["surface"] = {
    mesh: mesh,
    physic: surfaceBody
  }
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

    // Exemple pour presen 
    intervalCamera.value = setInterval(() => {
      camera.time =  4
      camera.to = {
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
        z: Math.floor(Math.random() * 10),
      }
    }, 4000)
    //intervalLight 
    intervalLight.value = setInterval(() => {
      for (let light of toRaw(lights.value)) {
        light.time =  4
        light.to = {
          x: Math.floor(Math.random() * 5),
          y: Math.floor(Math.random() * 5),
          z: Math.floor(Math.random() * 5),
        }
      }
    }, 4000)
    render()
  }
})

onUnmounted(() => {
  clearInterval(intervalCamera.value)
  clearInterval(intervalLight.value)
})
</script>