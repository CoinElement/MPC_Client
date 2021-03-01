<template>
  <div>
    <div class="input-warper">
      <el-input
        v-model="shownText"
        placeholder="Please choose the accout you want display"
        readonly
      >
        <template slot="prepend">Choose Accounts:</template>
        <el-button @click="show_dialog = true" slot="append">Choose...</el-button>
      </el-input>
    </div>
    <el-table
      :data="accTable"
      border
      height="500"
      v-loading="tableUpdating"
      element-loading-text="Loading..."
    >
      <el-table-column label="Operation" width="120">
        <template slot-scope="scope">
          <el-button @click="updateTable(scope.row.acctname, scope.$index)" size="small"
            >Get balance</el-button
          >
        </template>
      </el-table-column>

      <el-table-column prop="acctname" label="Account Name" width="140"> </el-table-column>
      <el-table-column prop="total_bal" label="Balance" width="100">
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="showBalanceView(scope.row.acctname, scope.$index)"
            :underline="false"
          >
            {{ scope.row.total_bal }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="branches" label="Branch" width="400" />
      <el-table-column prop="timestamp" label="Time" width="200" />
    </el-table>

    <el-dialog :visible.sync="show_dialog" title="Choose Accounts">
      <el-transfer
        v-model="value"
        :data="accList"
        :titles="['Unselected', 'Selected']"
        :props="{ label: 'name', key: 'name' }"
      >
      </el-transfer>

      <span slot="footer">
        <el-button @click="show_dialog = false">Cancel</el-button>
        <el-button @click="submitChoice" type="primary">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show_dialog: false,
      accList: [],
      value: [],
      shownText: "",
      accTable: [],
      tableUpdating: false
    };
  },
  methods: {
    submitChoice: function() {
      var text = "";
      this.value.forEach(item => {
        text = text + item + ",";
      });
      this.shownText = text;
      this.getTableData();
      this.show_dialog = false;
    },
    getTableData: function() {
      this.accTable = [];
      this.value.forEach(val => {
        this.updateTable(val);
      });
    },
    getAccList: function() {
      // 获取账户列表
      this.$axios.get("s3").then(response => {
        console.log("getAccountList", response.data);
        this.accList = response.data;
        this.getTableData();
      });
    },
    updateTable(account, index) {
      // 更新列表信息
      sessionStorage.accList = this.accList;
      sessionStorage.value = this.value;
      this.tableUpdating = true;
      var that = this;
      this.$axios.post("/get-result", { account: account }).then(response => {
        console.log("updateTable", response.data);
        var item = response.data[0];
        if (index != undefined) {
          that.accTable[index] = item;
        } else {
          if (item) {
            that.accTable.push(item);
          } else {
            that.accTable.push({
              acctname: account,
              total_bal: 0
            });
          }
        }
        this.tableUpdating = false;
      });
    },
    showBalanceView(accountName, index) {
      console.log("ShowDetail", accountName, index);
      this.$router.push({
        path: `account/${accountName}`
      });
    }
  },
  created: function() {
    this.getAccList();
  }
};
</script>

<style>
.el-checkbox__input {
  left: 8px;
}
.input-warper {
  margin: 5px;
}
</style>
