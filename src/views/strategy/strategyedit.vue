<template>
  <div>
    <h3>{{ this.label }}策略 </h3>
    <label style="margin-left:35px">策略名：
      <el-input class= "edit-input" v-model="name" placeholder="请输入内容" maxlength="20" clearable></el-input>
    </label>
    <el-button
      v-if="isEdit"
      type="primary"
      icon="el-icon-edit"
      @click="updateName()"
    >
      修改策略名
    </el-button>
    <el-button
    class="top-button"
      type="primary"
      icon="el-icon-edit"
      @click="reset()"
    >
      重置
    </el-button>
    
    <el-button
      class="top-button"
      type="success"
      icon="el-icon-edit"
      @click="confirmCreate()"
    >
    新建策略
    </el-button>
    <el-button
      v-if="isEdit"
      class="top-button"
      type="warning"
      icon="el-icon-edit"
      @click="confirmUpdate()"
    >
    修改策略
    </el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="{ row,$index }">
          <el-button
            v-if="row.tacticsId == -1"
            class="row-button"
            type="success"
            size="small"
            icon="el-icon-edit"
            @click="addItem(row)"
            round 
          >
            追加
          </el-button>
          <el-button
            v-else
            class="row-button"
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="delItem(row,$index)"
            round 
          >
            删除
          </el-button>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="子策略ID" width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.tacticsId }}</span>
        </template>
      </el-table-column> -->

      <el-table-column width="300px" align="center" label="分类">
        <template v-if="row.tacticsId != -1" slot-scope="{ row }">
          <el-cascader
            v-model="row.option"
            :options="tacticsOptions"
            :props="{ expandTrigger: 'hover' }"
            @change="setOption(row)"
          ></el-cascader>
        </template>
      </el-table-column>

      <el-table-column width="800px" align="center" label="子策略设定">
        <template v-if="row.tacticsId != -1" slot-scope="{ row }">
          <tactics-item :item="row" />
          <!-- {{ row.param4}} -->
        </template>
      </el-table-column>


      <el-table-column width="80px" align="center" label="category">
        <template slot-scope="{ row }">
          <span>{{ row.category }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="kind">
        <template slot-scope="{ row }">
          <span>{{ row.kind }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="80px" align="center" label="Param1">
        <template slot-scope="{ row }">
          <span>{{ row.param1 }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="Param2">
        <template slot-scope="{ row }">
          <span>{{ row.param2 }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="Param3">
        <template slot-scope="{ row }">
          <span>{{ row.param3 }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="Param4">
        <template slot-scope="{ row }">
          <span>{{ row.param4 }}</span>
        </template>
      </el-table-column> -->

      <el-table-column width="200px" align="center" label="Option">
        <template slot-scope="{ row }">
          <span>{{ row.option }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getStrategy,createStrategy,updateStrategy,updateStrategyName } from "@/api/strategy";
import { tacticsOptions } from "@/codebook";
import TacticsItem from "./TacticsItem";


export default {
  components: { TacticsItem },
  name: "StrategyEdit",
  // props:["isEdit"],
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      strategyId:this.$route.params.id,
      name: "",
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 8,
      },
      tacticsOptions,
    };
  },
  computed:{
    isEdit : function() {
      return Boolean(this.strategyId)
    },
    label : function() {
      return this.isEdit? '修改':'新建';
    }
  },
  created() {
    if (this.isEdit) {
      this.getDetail();
    }else{
      this.addItem();
      console.log(this.list);
      this.listLoading = false;
    }
  },
  methods: {
    async getDetail() {
      this.listLoading = true;
      const { data } = await getStrategy(this.strategyId);
      console.log(data)
      this.name = data.strategy.name
      const items = data.strategy.list;
      if (items) {
        this.list = items.map((v) => {
          this.$set(v, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
          // this.$set(v, "option", [v.category,v.kind]); // https://vuejs.org/v2/guide/reactivity.html
          v.option = [v.category,v.kind];
          if (v.param3 == null ) {
            v.param3 = undefined
          }
          if (v.param4 == null ) {
            v.param4 = undefined
          }
          // v.originalTitle = v.title //  will be used when user click the cancel botton
          return v;
        });
      }
      console.log(this.list)
      this.addItem();
      this.listLoading = false;
    },
    setOption(row) {
      row.category = row.option[0]
      row.kind = row.option[1]
    },
    delItem(row,index) {
      this.list.splice(index, 1)
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
    },
    addItem(row) {
      if (row) {
        row.tacticsId = 0;
      }
      var newItem = {
        tacticsId: -1,
        category: undefined,
        kind: undefined,
        param1: undefined,
        param2: undefined,
        param3: undefined,
        param4: undefined,
        option: undefined
      };
      this.list.push(newItem);
    },
    reset(){
      console.log(this.list);
      this.$confirm(`此操作将重置此策略, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type : 'warning'
      }).then(() => {
        // todo
      }).catch(() => {
      });
    },
    confirmCreate() {
      this.$confirm(`此操作将${this.label}此策略, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:'success'
      }).then(() => {
        this.create();
      }).catch(() => {
      });
    },
    create(){
      var postData = {
        name: this.name,
        list: this.list
      }
      createStrategy(postData).then(response => {
        const { data } = response
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
        this.$router.push(`/strategy/strategylist`);
      }).catch(error => {
        reject(error)
      })
    },
    confirmUpdate() {
      this.$confirm(`此操作将${this.label}此策略, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:'warning'
      }).then(() => {
        this.update();
      }).catch(() => {
      });
    },
    update(){
      var postData = {
        strategyId: this.strategyId,
        name: this.name,
        list: this.list
      }
      updateStrategy(postData).then(response => {
        const { data } = response
        this.$notify({
          title: 'Success',
          message: 'Updated Successfully',
          type: 'success',
          duration: 2000
        })
        this.$router.push(`/strategy/strategylist`);
      }).catch(error => {
        reject(error)
      })
    },
    updateName(){
      var postData = {
        strategyId: this.strategyId,
        name: this.name,
      }
      updateStrategyName(postData).then(response => {
        this.$notify({
          title: 'Success',
          message: '策略名 Updated Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        reject(error)
      })
    }
  },
};
</script>

<style scoped>
.edit-input {
  margin: 15px;
  width: 200px;
}

.top-button {
  float: right;
  margin-right: 20px;
  width: 120px;
}

.row-button {
  width: 80px;
}

</style>
