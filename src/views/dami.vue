<template>
    <div id="bframe">
        <router-view />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dami',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>
  
<style>
  #bframe{
    padding-left: 30px;
  }
</style>