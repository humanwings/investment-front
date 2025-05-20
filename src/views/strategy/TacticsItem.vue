<template>
  <div class="container">
    <!-- 无选择 -->
    <template v-if="( item.option == null)" >
    </template>

    <!-- 选股策略 选择区间跌幅，选择区间振幅 -->
    <template v-else-if="( (item.option[0] == tacticsArray[0][0]) && ((item.option[1] == tacticsArray[0][2][0][0]) || (item.option[1] == tacticsArray[0][2][1][0])))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]).slice(0,3) }}：
      <el-select class="ndate" v-model="item.param1" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in nDateOptions"
          :key="option.value"
          :label="option.label" 
          :value="option.value">
        </el-option>
      </el-select>
      ~
      <el-select class="ndate" v-model="item.param2" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in nDateOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ tacticsMap.get(item.option[0]+item.option[1]).slice(-2) }}：
      <el-input-number class="inputfloat" v-model="item.param3" :precision="1" :step="0.1" :min="-5" :max="5" placeholder="无" controls-position="right"></el-input-number>%
      ~
      <el-input-number class="inputfloat" v-model="item.param4" :precision="1" :step="0.1" :min="-5" :max="5" placeholder="无" controls-position="right"></el-input-number>%
    </template>
    <!-- 选股策略 选择区间颜色 -->
    <!-- <template v-else-if="( (item.option[0] == tacticsArray[0][0]) && ( item.option[1] == tacticsArray[0][2][2][0]))" >
      <el-button id="color1" class="colorButton" @click="switchColor">N-1日</el-button>
      <el-button id="color2" class="colorButton" @click="switchColor">N日</el-button>
    </template> -->
    <!-- 选股策略 暴跌缺口 暴跌平台-->
    <template v-else-if="( (item.option[0] == tacticsArray[0][0]) && ( (item.option[1] == tacticsArray[0][2][2][0]) || (item.option[1] == tacticsArray[0][2][4][0]) ))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}
      <el-select class="comparison" v-model="item.param1" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in comparisonOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
      <el-input-number class="inputnumer" v-model="item.param3" :min="0" :max="10" placeholder="无" controls-position="right"></el-input-number>个
    </template>
    <!-- 选股策略 暴跌天数 -->
    <template v-else-if="( (item.option[0] == tacticsArray[0][0]) && ( item.option[1] == tacticsArray[0][2][3][0]))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-select class="comparison" v-model="item.param1" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in comparisonOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
      <el-input-number class="inputnumer" v-model="item.param3" :min="0" :max="10" placeholder="无" controls-position="right"></el-input-number>天
    </template>
    <!-- 选股策略 暴跌原因 -->
    <template v-else-if="( (item.option[0] == tacticsArray[0][0]) && ( item.option[1] == tacticsArray[0][2][5][0]))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-select class="bool" v-model="item.param1" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in boolOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
      <el-select class="reason" v-model="item.param2" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in reasonOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
    </template>
    <!-- 选股策略 暴跌区间最大幅度，暴跌区间总幅度 -->
    <template v-else-if="( (item.option[0] == tacticsArray[0][0]) && ((item.option[1] == tacticsArray[0][2][6][0]) || (item.option[1] == tacticsArray[0][2][7][0])))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-input-number class="inputfloat" v-model="item.param3" :precision="1" :step="0.1" :min="5" :max="50" placeholder="无" controls-position="right"></el-input-number>%
      ~
      <el-input-number class="inputfloat" v-model="item.param4" :precision="1" :step="0.1" :min="5" :max="50" placeholder="无" controls-position="right"></el-input-number>%
    </template>
    <!-- 选股策略 PE-TTM PB(不含上商誉)-->
    <template v-else-if="( (item.option[0] == tacticsArray[0][0]) && ((item.option[1] == tacticsArray[0][2][8][0]) || (item.option[1] == tacticsArray[0][2][9][0])))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-input-number class="inputfloat" v-model="item.param3" :precision="1" :step="1" :min="0" :max="100" placeholder="无" controls-position="right"></el-input-number>
      ~
      <el-input-number class="inputfloat" v-model="item.param4" :precision="1" :step="1" :min="0" :max="100" placeholder="无" controls-position="right"></el-input-number>
    </template>
    <!-- 选股策略 股东人数 -->
    <template v-else-if="( (item.option[0] == tacticsArray[0][0]) && (item.option[1] == tacticsArray[0][2][10][0]))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-input-number class="inputfloat" v-model="item.param3" :precision="1" :step="1" :min="0" placeholder="无" controls-position="right"></el-input-number>千人
      ~
      <el-input-number class="inputfloat" v-model="item.param4" :precision="1" :step="1" :min="0" placeholder="无" controls-position="right"></el-input-number>千人
    </template>
    <!-- 选股策略 股东平均自由流通市值 -->
    <template v-else-if="( (item.option[0] == tacticsArray[0][0]) && (item.option[1] == tacticsArray[0][2][11][0]))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-input-number class="inputfloat" v-model="item.param3" :precision="1" :step="1" :min="0" placeholder="无" controls-position="right"></el-input-number>万元
      ~
      <el-input-number class="inputfloat" v-model="item.param4" :precision="1" :step="1" :min="0" placeholder="无" controls-position="right"></el-input-number>万元
    </template>
    <!-- 选股策略 标的类型 -->
    <template v-else-if="( (item.option[0] == tacticsArray[0][0]) && (item.option[1] == tacticsArray[0][2][12][0]))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-select class="bool" v-model="item.param1" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in boolOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
      <el-select class="reason" v-model="item.param2" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in listingStatusOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
    </template>

    <!-- 买入策略 买入时机 -->
    <template v-else-if="( (item.option[0] == tacticsArray[1][0]) && ( item.option[1] == tacticsArray[1][2][0][0]))" >
      买入时间：
      <el-select v-model="item.param1" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in buyTimeOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
      买入持续：
      <el-select v-model="item.param2" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in buyDateOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
    </template>
    <!-- 买入策略 买入价位 -->
    <template v-else-if="( (item.option[0] == tacticsArray[1][0]) && ( item.option[1] == tacticsArray[1][2][1][0]))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-input-number class="inputfloat" v-model="item.param3" :precision="1" :step="0.1" :min="-5" :max="5" placeholder="无" controls-position="right"></el-input-number>%
    </template>
    <!-- 买入策略 买入仓位 -->
    <template v-else-if="( (item.option[0] == tacticsArray[1][0]) && ( item.option[1] == tacticsArray[1][2][2][0]))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-select v-model="item.param1" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in buyPosOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
    </template>
    <!-- 买入策略 每日最大买入数 -->
    <template v-else-if="( (item.option[0] == tacticsArray[1][0]) && ( item.option[1] == tacticsArray[1][2][3][0]))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-input-number class="inputnumer" v-model="item.param3" :min="1" :max="10" placeholder="无"  controls-position="right"></el-input-number>支
    </template>

    <!-- 卖出策略 持股日数 -->
    <template v-else-if="( (item.option[0] == tacticsArray[2][0]) && ( item.option[1] == tacticsArray[2][2][0][0]))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-input-number class="inputnumer" v-model="item.param3" :min="1" :max="5" placeholder="无"  controls-position="right"></el-input-number>日
    </template>
    <!-- 卖出策略 卖出时机 -->
    <template v-else-if="( (item.option[0] == tacticsArray[2][0]) && ( item.option[1] == tacticsArray[2][2][1][0]))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-select v-model="item.param1" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in sellTimeOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
    </template>
    <!-- 卖出策略 卖出价位浮动 -->
    <template v-else-if="( (item.option[0] == tacticsArray[2][0]) && ( item.option[1] == tacticsArray[2][2][2][0]))" >
      {{ tacticsMap.get(item.option[0]+item.option[1]) }}：
      <el-input-number class="inputfloat" v-model="item.param3" :precision="1" :step="0.1" :min="-5" :max="5" placeholder="无" controls-position="right"></el-input-number>%
    </template>
    <!-- 卖出策略 止盈止损 -->
    <template v-else-if="( (item.option[0] == tacticsArray[2][0]) && (item.option[1] == tacticsArray[2][2][3][0]))" >
      止盈：
      <el-select class="sellstop" v-model="item.param1" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in sellStopOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
      <el-input-number class="inputfloat" v-model="item.param3" :precision="1" :step="0.1" :min="0" :max="50" placeholder="无" controls-position="right"></el-input-number>%
      止损：
      <el-select class="sellstop" v-model="item.param2" placeholder="请选择" size="medium">
        <el-option 
          v-for="option in sellStopOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
      <el-input-number class="inputfloat" v-model="item.param4" :precision="1" :step="0.1" :min="-20" :max="0" placeholder="无" controls-position="right"></el-input-number>%
    </template>

  </div>
</template>

<script>
import { tacticsMap,tacticsArray,comparisonOptions,reasonOptions,nDateOptions,boolOptions,buyTimeOptions,buyDateOptions,buyPosOptions,sellTimeOptions,sellStopOptions,listingStatusOptions, colorArray } from "@/codebook";

export default {
  name: 'TacticsItem',
  props: {
    // route object
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comparisonOptions,
      reasonOptions,
      nDateOptions,
      boolOptions,
      buyTimeOptions,
      buyDateOptions,
      buyPosOptions,
      sellTimeOptions,
      sellStopOptions,
      listingStatusOptions,
      tacticsMap,
      tacticsArray
    }
  },
  methods: {
    // switchColor(event){
    //   const obj = event.target;
    //   var id ;
    //   var color;
    //   if (obj.nodeName == "SPAN") {
    //     id = obj.parentNode.id;
    //   }else{
    //     id = obj.id;
    //   }
    //   // console.log(id);
    //   // console.log(this.item.param1);
    //   if ( id == "color1" ) {
    //     color = colorArray[(colorArray.indexOf(this.item.param1) + 1) % colorArray.length]
    //     this.item.param1 = color
    //   }else{
    //     color = colorArray[(colorArray.indexOf(this.item.param2) + 1) % colorArray.length]
    //     this.item.param2 = color
    //   }
    //   if (obj.nodeName == "SPAN") {
    //     obj.parentNode.style.backgroundColor = color;
    //   }else{
    //     obj.style.backgroundColor = color;
    //   }
    //   // 请求 http://www.baidu.com，并返回数据
    // }
  }
}
</script>

<style scoped>
.container{
  text-align: left;
}

.comparison{
  width: 120px;
}
.ndate{
  width: 90px;
}
.reason{
  width: 150px;
}

.bool{
  width: 100px;
}
.inputnumer{
  width: 120px;
}

.inputfloat{
  width: 130px;
}

.sellstop{
  width: 180px;
}

.colorButton{
  background-color: grey;
  color : white;
  width: 100px;
}

</style>
