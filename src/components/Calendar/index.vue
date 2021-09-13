<template>
  <div class="calendar_wrap">
    <div class="header">
      <ul class="week">
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ul>
    </div>
    <div class="warp">
      <ul class="items">
        <li class="item" v-for="m in items" :key="m.label">
          <div class="date">{{ m.label | forMatDate}}</div>
          <div class="cells">
            <div
              class="cell"
              v-for="(day,i) in m.days"
              :key="i"
              :class="[
                {gray: not(day)},
                {active: day.checked && day.day},
                {today: day.id && isToday(day)},
                radiusClass(day),
                computeIsChecked(day)
              ]"
              @click="clickDay(day)"
            >
              <span>{{ day.day }}</span>
              <div class="slot" v-if="day.day && (active[0] ? day.id !== active[0].id : true) && (active[1] ? day.id !== active[1].id : true)">
                <slot
                  name="price"
                  :day="day && (active[1] && day.id !== active[1]['id'])"
                ></slot>
              </div>
              <div class="slot">
                <div class="corner">
                  {{  active[0] && day.id === active[0].id && sign.start ? sign.start : '' }}
                  {{ active[1] && day.id === active[1].id && sign.end ? sign.end : ''}}
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  const isBetween  = require('dayjs/plugin/isBetween')
  const isSameOrBefore   = require('dayjs/plugin/isSameOrBefore')
  const isSameOrAfter  = require('dayjs/plugin/isSameOrAfter')
  dayjs.extend(isBetween)
  dayjs.extend(isSameOrAfter)
  dayjs.extend(isSameOrBefore)
  export default {
    name: "Calendar",
    props:{
      beginDate: {
        default:function (){
          return dayjs()
        }
      },
      defaultCalendarNum: {default: 365},
      latestDay: {default:7},
      minSelectedDay:{default:3},
      sign: {
        default: function () {
          return {
            start:'开始',
            end:'结束'
          }
        }
      },
      value:{
        type:Array
      }
    },
    model:{
      prop:'value',
      event:'modelChange'
    },
    data () {
      return {
        items: [],
        active: [],
        dateRange: this.value
      }
    },
    created() {
      this.initDate()
    },
    methods:{
      initDate () {
        // 获取月的天数
        const {beginDate} = this
        const range = []
        const min = dayjs(beginDate).format('YYYY-M')
        const max = dayjs(beginDate).add(this.defaultCalendarNum, 'day').format('YYYY-M')
        const { dateRange, latestDay, minSelectedDay } = this
        const getDays = (date, index) => {
          const hasDays = dayjs(date).daysInMonth()
          const firstDayIsWeek = ~~dayjs(date).startOf('month').format('d')
          const days = []
          for (let i = 0; i < firstDayIsWeek; i++) {
            const obj = {
              id: i,
              day: '',
              checked: false
            }
            days.push(obj)
          }
          for (let i = 0; i < hasDays; i++) {
            const obj = {
              id: `${date}-${i + 1}`,
              year: dayjs(date).format('YYYY'),
              month: dayjs(date).format('M'),
              day: i + 1,
              checked: false,
              parentIndex: index
            }
            // @ts-ignore
            days.push(obj)
            if (Array.isArray(dateRange) && dateRange.length === 2) {
              if (
                !dayjs(dateRange[0]).isBetween(
                  dayjs(`${dayjs(beginDate).format('YYYY-M-D')} 00:00`),
                  dayjs(beginDate).add(latestDay, 'day'),
                  null,
                  '[]'
                )
              ) {
                alert('默认的开始时间必须在最晚取车时间之内')
              } else if (
                Math.abs(dayjs(dateRange[0]).diff(dayjs(dateRange[1]), 'day')) + 1 <
                minSelectedDay
              ) {
                alert(`默认选中的最短租期为${minSelectedDay}天`)
              } else {
                if (dayjs(dateRange[0]).format('YYYY-M-D') === obj.id) {
                  range.push(obj)
                } else if (dayjs(dateRange[1]).format('YYYY-M-D') === obj.id) {
                  range.push(obj)
                }
              }
            }
          }
          return days
        }

        const diffM = dayjs(max).diff(dayjs(min), 'month')
        const dateList = []
        for (let i = 0; i <= diffM; i++) {
          const startY = ~~dayjs(min).format('YYYY')
          let startM = ~~dayjs(min).format('M') - 1
          startM = startM + i
          const year = startY + Math.floor(startM / 12)
          const month = (startM % 12) + 1
          const obj = {
            label: `${year}-${month}`,
            year,
            month,
            days: getDays(`${year}-${month}`, i)
          }
          // @ts-ignore
          dateList.push(obj)
        }
        this.items = dateList
        this.active = range
      },
      not (day) {
        return !day.day || dayjs(day.id).isBefore(dayjs(),'day')
      },
      isToday(day){
        return dayjs().format('YYYY-M-D') === day.id
      },
      radiusClass  (item){
        const { active } = this
        if (active.length === 1 && item.id === active[0].id){
          return 'active-start'
        }else if (active.length === 2){
          return `${item.id === active[0].id ? 'active-start' : ''} ${item.id === active[1].id ? 'active-end' : ''} ${dayjs(item.id).isBetween(active[0].id,active[1].id,'day') ? 'active' : ''}`
        }
      },
      computeIsChecked (day) {
        const {defaultCalendarNum,active} = this
        if (day.id && day.day){
          if (active.length > 0){
            return dayjs(day.id).isAfter(dayjs(active[0].id).add(defaultCalendarNum, 'day')) && 'gray'
          }
        }
      },
      clickDay(day){
        const {active,latestDay,minSelectedDay,defaultCalendarNum} = this
        if (day.id && day.day && dayjs(day.id).isSameOrAfter(dayjs(),'day')){
          if (active.length < 2){
            if (active.length === 0 && !dayjs(day.id).isBetween(dayjs(`${dayjs().format('YYYY-M-D')} 00:00`),dayjs().add(latestDay,'day'),null,'[]')){
              alert(`最晚可预约${latestDay}天内取车`)
              return false
            }
            if (active.length === 1 && dayjs(day.id).isBefore(active[0].id)){
              this.active = [day]
              return false
            }
            if (active.length === 1 && Math.abs(dayjs(active[0].id).diff(day.id,'day')) + 1 < minSelectedDay){
              alert(`用车天数不得小于${minSelectedDay}天`)
              return false
            }
            if (active.length === 1 && dayjs(day.id).isAfter(dayjs(active[0].id).add(defaultCalendarNum, 'day'))){
              return false
            }
            this.active = active.concat(day)
          }else {
            if (active.length === 2 && !dayjs(day.id).isBetween(dayjs(`${dayjs().format('YYYY-M-D')} 00:00`),dayjs().add(latestDay,'day'),null,'[]')){
              //Toast({title:`最晚可预约${latestDay}天内取车`})
              this.active = []
              return false
            }
            this.active = [day]
          }
        }
      }

    },
    watch:{
      active(n){
        if (n.length === 2){
          this.$emit('modelChange',[dayjs(n[0]['id']).format('YYYY-MM-DD'),dayjs(n[1]['id']).format('YYYY-MM-DD')])
        }else if(n.length === 1) {
          this.$emit('modelChange',[dayjs(n[0]['id']).format('YYYY-MM-DD')])
        }
      }
    },
    filters:{
      forMatDate(val){
        return dayjs(val).format('YYYY年MM月')
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import "./index.styl"
</style>
