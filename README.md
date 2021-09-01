### custom-calendar（自定义日历选择器-移动端）

## Project setup（安装以来）
```
yarn install
```

### Compiles and hot-reloads for development（启动项目）
```
yarn start
```


- 该组件依赖于dayjs
>- 参数说明
>- 父组件通过v-model获取选中的日期

```
    beginDate           |    开始日期               默认今天
    defaultCalendarNum  |    可选时间长度            默认365天
    dateRange           |    日历默认选中时间        默认为空，(Array)
    latestDay           |    开始时间选择范围        默认开始时间往后7天
    minSelectedDay      |    至少选择的日期范围       默认开始日期后3天
    sign                |    开始结束的标记          默认为'开始'and'结束'
```

