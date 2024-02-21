
<template>
  <div class="width-100 height-100">
    <tutoThreeComponentVue v-if="windowSize.height !== 0 && windowSize.width !== 0" :window-size="windowSize"/>
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
import tutoThreeComponentVue from '../components/tutoThreeComponent.vue';
import { reactive, onUnmounted, Teleport } from 'vue'

/********************************************/
/*           TYPES ASSIGNATION              */
/********************************************/


/********************************************/
/*           VARIABLE ASSIGNATION           */
/********************************************/
const windowSize = reactive({ width: window.innerWidth, height: window.innerHeight })
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
onUnmounted(() => { window.removeEventListener("resize", resize) })
</script>
