<template>
  <FollowTheCursorComponent ref="scene"  v-if="windowSize.height !== 0 && windowSize.width !== 0" :window-size="windowSize"/>

  <Teleport to="#overlay-informations">
  </Teleport>

  <Teleport to="#overlay-ctas">
  </Teleport>
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import { reactive, onUnmounted, Teleport } from 'vue'
import FollowTheCursorComponent from '../components/FollowTheCursorComponent.vue';

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