
<template>
  <div class="width-100 height-100">
    <AddPhysicsToObjectComponent ref="scene"  v-if="windowSize.height !== 0 && windowSize.width !== 0" :window-size="windowSize"/>
  </div>

  <Teleport to="#overlay-informations">
  </Teleport>

  <Teleport to="#overlay-ctas">
  </Teleport>
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import AddPhysicsToObjectComponent from '../components/AddPhysicsToObjectComponent.vue';
import { reactive, ref } from 'vue'

/********************************************/
/*           TYPES ASSIGNATION              */
/********************************************/


/********************************************/
/*           VARIABLE ASSIGNATION           */
/********************************************/
const windowSize = reactive({ width: window.innerWidth, height: window.innerHeight })
const scene = ref()
/********************************************/
/*             FUNCTIONNALITIES             */
/********************************************/
function resize () { 
  windowSize.width = window.innerWidth
  windowSize.height = window.innerHeight
}
/********************************************/
/*       FUNCTION CALL IN SETUP             */
/********************************************/
/* Calling in setup is calling before the   */
/* HTML tags are created                    */
/********************************************/

resize()
window.addEventListener("resize", (_) => {resize()});

/********************************************/
/*     FUNCTION CALL IN VUE CYCLE LIFE      */
/********************************************/
</script>
../components/AddPhysicsToComponent.vue../components/AddPhysicsToObjectComponent.vue