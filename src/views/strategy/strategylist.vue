<template>
  <div >
    <h3>策略一览</h3>
    <el-button
      v-if="size>=2"
      type="primary"
      icon="el-icon-c-scale-to-original"
      @click="compare()"
    >
      结果比较
    </el-button>

    <el-button
      v-if="size>=2"
      type="primary"
      icon="el-icon-c-scale-to-original"
      @click="confirmDelSelected()"
    >
      一括删除
    </el-button>
    
    <el-table v-loading="listLoading" :data="list" highlight-current-row height="760px">
      <!-- <el-table-column type="selection" width="50">
      </el-table-column> -->

      <el-table-column fixed align="center" label="" width="40">
        <template slot-scope="{ row }">
          <!-- <input v-model="compareId" type="checkbox" :value="row.strategyId" @click="checkCompareId()" /> -->
          <input v-model="selectedId" type="checkbox" :value="row.strategyId"  />
        </template>
      </el-table-column>

      <el-table-column fixed align="center" label="序号" width="50" prop="strategyId" sortable>
      </el-table-column>

      <el-table-column fixed align="center" label="策略名" width="150" prop="name">
      </el-table-column>

      <el-table-column align="center" label="子策略数">
        <el-table-column align="center" label="选股" width="50" prop="selectTacticsNum">
        </el-table-column>

        <el-table-column align="center" label="买入" width="50" prop="buyTacticsNum">
        </el-table-column>

        <el-table-column align="center" label="卖出" width="50" prop="sellTacticsNum">
        </el-table-column>
      </el-table-column>

      <el-table-column align="center" label="选股结果">
        <el-table-column align="center" label="总数" width="70" prop="totalNum">
        </el-table-column>

        <el-table-column align="center" label="中选数" width="70" prop="selectedNum">
        </el-table-column>

        <el-table-column align="center" label="落选数" width="70" prop="notSelectedNum">
        </el-table-column>

        <el-table-column align="center" label="中选率" width="80">
          <template v-if="row.totalNum != null" slot-scope="{ row }">
            <span>{{ formatPercent(row.selectedNum/row.totalNum) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="落选率" width="80">
          <template v-if="row.totalNum != null" slot-scope="{ row }">
            <span>{{ formatPercent(row.notSelectedNum/row.totalNum) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Error数" width="70" prop="errorNum">
        </el-table-column>
      </el-table-column>

      <el-table-column align="center" label="交易结果">
        <el-table-column align="center" label="盈亏总计" >

          <el-table-column align="center" label="次数" width="100" prop="tradeNum" sortable>
          </el-table-column>

          <el-table-column align="center" label="总金额" width="120" prop="balance" sortable>
          </el-table-column>

          <el-table-column align="center" label="平均金额" width="120" prop="average" sortable>
          </el-table-column>

        </el-table-column>

        <el-table-column align="center" label="盈利小计">
          <el-table-column align="center" label="个数" width="80">
            <template v-if="row.totalNum != null" slot-scope="{ row }">
              <span>{{ row.profitNum }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="比例" width="80">
            <template v-if="row.totalNum != null" slot-scope="{ row }">
              <span>{{ formatPercent(row.profitNum/(row.selectedNum - row.noBuyNum - row.noSellNum)) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="金额" width="90">
            <template v-if="row.totalNum != null" slot-scope="{ row }">
              <span>{{ row.profitSum.toFixed(2) }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="中位数" width="80">
            <template v-if="row.profitMedian != null" slot-scope="{ row }">
              <span>{{ row.profitMedian.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column align="center" label="亏损小计">
          <el-table-column align="center" label="个数" width="80">
            <template v-if="row.totalNum != null" slot-scope="{ row }">
              <span>{{ row.lossNum }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="比例" width="80">
            <template v-if="row.totalNum != null" slot-scope="{ row }">
              <span>{{ formatPercent(row.lossNum/(row.selectedNum - row.noBuyNum - row.noSellNum))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="金额" width="90">
            <template v-if="row.totalNum != null" slot-scope="{ row }">
              <span>{{ row.lossSum.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="中位数" width="80">
            <template v-if="row.lossMedian != null" slot-scope="{ row }">
              <span>{{ row.lossMedian.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column align="center" label="其他">
          <el-table-column align="center" label="盈亏平衡" width="80">
            <template v-if="row.totalNum != null" slot-scope="{ row }">
              <span>{{ row.breakEvenNum }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="买入失败" width="80">
            <template v-if="row.totalNum != null" slot-scope="{ row }">
              <span>{{ row.noBuyNum }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="尚未卖出" width="80">
            <template v-if="row.totalNum != null" slot-scope="{ row }">
              <span>{{ row.noSellNum }}</span>
            </template>
          </el-table-column>
        </el-table-column>
       
      </el-table-column>

      <el-table-column fixed="right" align="center" label="处理" width="400px">
        <template slot-scope="{ row , $index}">
          <el-button-group>
            <el-button
              class="row-button"
              type="primary"
              size="small"
              icon="el-icon-s-check"
              @click="confirmCal(row,$index)"
            >
              检证
            </el-button>
            <el-button
              class="row-button"
              type="primary"
              size="small"
              icon="el-icon-s-data"
              @click="showResult(row,$index)"
            >
              结果
            </el-button>
            <el-button
              class="row-button"
              type="success"
              size="small"
              icon="el-icon-edit"
              @click="editItem(row)"
            >
              编辑
            </el-button>
            <el-button
              class="row-button"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="confirmDel(row,$index)"
            >
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
import { getStrategyList,deleteStrategy, calculateStrategy,deleteSelectedStrategies } from "@/api/strategy";

export default {
  name: "StrategyList",
  data() {
    return {
      list: null,
      listLoading: true,
      compareId: [],
      selectedId: []
    };
  },
  computed:{
    size(){
      return this.list?this.list.length:0;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { data } = await getStrategyList();
      const items = data.strategyList;
      this.list = items;
      // this.list = items.map(v => {
      //   v.average = (v.balance/(v.profitNum + v.lossNum + v.breakEvenNum)).toFixed(2)
      //   return v
      // })
      this.listLoading = false;
    },
    formatPercent(num){
      return (num * 100).toFixed(2) + '%'
    },
    showResult(row) {
      var id = row.strategyId;
      this.$router.push(`/analyte/verification/${id}`);
    },
    editItem(row) {
      var id = row.strategyId;
      this.$router.push(`/strategy/strategyedit/${id}`);
    },
    // handleSelectionChange(val){
    //   if (val){
    //     if (val.length >2 ){
    //       val.pop()
    //     }
    //   }
    //   console.log(val)
    //   this.checked = val;
    // },
    checkCompareId(){
      if (this.compareId){
        if (this.compareId.length>=2){
          this.compareId.shift()
        }
      }
    },
    compare() {
      if (this.compareId){
        if (this.compareId.length == 2){
          this.$router.push({
            name: 'verificationCompare',
            params: {
              idOne: this.compareId[0],
              idTwo: this.compareId[1]
            }
          })
        }
      }
    },
    confirmDel(row,index) {
      this.$confirm(`此操作将删除此策略, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.delItem(row,index)
      }).catch(() => {
      });
    },
    delItem(row,index) {
      deleteStrategy(row.strategyId).then(response => {
        this.list.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: 'Deleted Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        reject(error)
      })
    },
    confirmCal(row,index) {
      this.$confirm(`此操作将重新计算此策略的盈亏状况, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.calItem(row,index)
      }).catch(() => {
      });
    },
    calItem(row,index) {
      calculateStrategy(row.strategyId).then(response => {
        const { data } = response
        var result = data.calculate
        
        result.name = row.name
        result.buyTacticsNum = row.buyTacticsNum
        result.selectTacticsNum = row.selectTacticsNum
        result.sellTacticsNum = row.sellTacticsNum
        
        this.list.splice(index, 1, result)
        
        this.$notify({
          title: 'Success',
          message: 'Calculate Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        reject(error)
      })
    },
    confirmDelSelected(row,index) {
      if (this.selectedId.length != 0) {
        const num = this.selectedId.length
        this.$confirm(`此操作将删除${num}个策略, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.delSelected()
        }).catch(() => {
        });
      }
    },
    delSelected() {
      let postData = new FormData();
      postData.append('strategiesId', this.selectedId);
      deleteSelectedStrategies(postData).then(response => {
        // this.list.splice(index, 1)
        this.delSelectedList();
        this.$notify({
          title: 'Success',
          message: 'Deleted Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        console.log(error)
      })
    },
    delSelectedList(){
      for (let i = 0 ; i < this.selectedId.length ; i++ ){
        for ( let j = 0 ; j < this.list.length ; j++ ){
          if ( this.list[j].strategyId === this.selectedId[i]){
            this.list.splice(j, 1)
            // console.log(this.list[j].strategyId)
            break;
          }
        }
      }
    }
  },
};
</script>
