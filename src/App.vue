
<template>
  <div v-if="windowSize.width !== 0 && windowSize.height !== 0" 
    :style="`width: ${windowSize.width}px; height: ${windowSize.height}px`"  
    class="relative no-overflow ">
    <router-view v-if="mounted"/>
    <div class="absolute absolute-top absolute-left z-index-front width-100 height-100 flex flex-end no-overflow">
      <div class="width-100 height-100">
        <div id="overlay-informations" class="height-80"/>
        <div id="overlay-ctas" class="height-20 flex flex-align flex-column"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/********************************************/
/*              IMPORTS                     */
/********************************************/
import { onMounted, reactive, ref } from 'vue'

/********************************************/
/*           VARIABLE ASSIGNATION           */
/********************************************/
const mounted = ref(false)
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

onMounted(() => {
  mounted.value = true
})

</script>
