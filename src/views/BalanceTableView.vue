<template>
  <div>
    <div class="input-warper">
      <el-input
        v-model="shownText"
        placeholder="Please choose the accout you want display"
        readonly
      >
        <template slot="prepend">Choose Account:</template>
        <el-button @click="show_dialog = true" slot="append">Choose...</el-button>
      </el-input>
    </div>
    <el-table :data="accTable" border height="500">
      <el-table-column label="Operation" width="250">
        <template slot-scope="scope">
          <el-button @click="updateTotal(scope)" size="small">Update balance</el-button>
          <el-button @click="updateTable(scope.row.acctname, scope.$index)" size="small"
            >Get balance</el-button
          >
        </template>
      </el-table-column>

      <el-table-column label="Account Name" width="140">
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="showDetail(scope.row.acctname, scope.$index)"
            :underline="false"
          >
            {{ scope.row.acctname }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column prop="total_bal" label="Balance" />
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
      accTable: []
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
    updateTotal: function(scope) {
      // 请求服务器更新账户的数据
      var account = scope.row.accName;
      this.$axios
        .post("put-result", {
          account: account
        })
        .then(response => {
          if (response.data) {
            this.$notify({
              type: "success",
              message: "Update request submitted"
            });
          }
        });
    },
    updateTable(account, index) {
      // 更新列表信息
      var that = this;
      this.$axios.post("/get-result", { account: account }).then(response => {
        console.log("updateTable", response.data);
        var dataCount = response.data.length;
        var item = response.data[dataCount - 1];
        if (index != undefined) {
          that.accTable[index] = item;
        } else {
          if (dataCount != 0) {
            that.accTable.push(item);
          } else {
            that.accTable.push({
              acctname: account,
              total_bal: 0
            });
          }
        }
      });
    },
    showDetail(accountName, index) {
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
