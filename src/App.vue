<template>
  <div id="app">
    <Calendar
      :sign="{start:'取车',end:'换车'}"
      v-model="active"
    >
      <template #price>标记</template>
    </Calendar>
  </div>
</template>

<script>
import Calendar from '@/components/Calendar'

export default {
  name: 'App',
  data(){
    return {
      id:123,
      active:['2021-09-18','2021-10-04']
    }
  },
  components: {
    Calendar
  }
}
</script>
