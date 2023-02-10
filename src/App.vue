<template>
  <div id="app">
    <Calendar
      :sign="{start:'开始',end:'结束'}"
      v-model="active"
      :firstDayIsSun="false"
    >
      <template #default>sign</template>
    </Calendar>
  </div>
</template>

<script>
import Calendar from '@/components/Calendar'
import dayjs from 'dayjs'
export default {
  name: 'App',
  data(){
    return {
      id:123,
      active:[dayjs().format('YYYY-MM-DD hh:mm:ss'),dayjs().add(1,'month').format('YYYY-MM-DD hh:mm:ss')]
    }
  },
  components: {
    Calendar
  }
}
</script>
