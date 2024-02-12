
<template>
  <div :style="`width: ${windowSize.width}px; height: ${windowSize.height}px`" class="relative no-overflow ">
    <!-- COMPONENTS THREE -->
    <tutoThreeComponent v-if="windowSize.width !== 0 && windowSize.height !== 0" :windowSize="windowSize"/>
    <!-- OVERLAY -->
    <div class="absolute absolute-top absolute-left z-index-front width-100 height-100 flex flex-end no-overflow">
      <div class="width-100 height-100">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import { reactive } from 'vue'
import tutoThreeComponent from './components/tutoThreeComponent.vue'

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
window.onresize = resize

/********************************************/
/*     FUNCTION CALL IN VUE CYCLE LIFE      */
/********************************************/
</script>
