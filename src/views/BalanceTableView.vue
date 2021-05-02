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
      <el-table-column label="Operation" width="220">
        <template slot-scope="scope">
          <IntervalButton
            :content="scope.row.isUpdating ? 'display' : 'update'"
            :interval="5"
            :locked="!scope.row.isUpdating"
            @click="handleAccountClick(scope.$index)"
          />
          <el-button @click="showHistory(scope.row.acctname)" size="small">
            History
          </el-button>
          <!--
          <el-button @click="requestUpdate(scope.row.acctname)" size="small">
            Request update
          </el-button>
          -->
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
      <el-table-column prop="timestamp" label="Time" width="200" />
      <el-table-column prop="branches" label="Branch" width="400" />
    </el-table>

    <el-dialog :visible.sync="show_dialog" title="Choose Accounts">
      <el-transfer
        v-model="selectedAccounts"
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
    <HistoryDialog :visible.sync="historyShow" :account="historyAcct" />
  </div>
</template>

<script>
import HistoryDialog from "@/components/HistoryDialog.vue";
import IntervalButton from "@/components/IntervalButton.vue";

export default {
  components: { HistoryDialog, IntervalButton },
  data() {
    return {
      show_dialog: false,
      accList: [], // 账户列表
      selectedAccounts: [],
      shownText: "",
      accTable: [],
      tableUpdating: false,
      historyShow: false,
      historyAcct: ""
    };
  },
  methods: {
    submitChoice() {
      var text = "";
      this.selectedAccounts.forEach(item => {
        text = text + item + ",";
      });
      this.shownText = text;
      this.updateFullTable();
      this.show_dialog = false;
    },
    /**
     * @description 获取账户列表
     */
    getAccList() {
      this.$axios.get("s3").then(response => {
        console.log("getAccountList", response.data);
        this.accList = response.data;
      });
    },
    /**
     * @description 更新整个表格
     */
    updateFullTable() {
      this.tableUpdating = true;
      this.accTable = [];
      this.selectedAccounts.forEach(value => {
        this.refreshBalance(value);
      });
    },
    /**
     * @description 更新账户的存款
     * @param {accountName} 账户的名称
     * @param {index} 在列表里的下标
     */
    refreshBalance(accountName, index) {
      this.$axios.post("/get-result", { account: accountName }).then(response => {
        console.log("updateTable", response.data);
        var item = response.data[0];
        var newItem = {
          acctname: item ? item.acctname : accountName,
          total_bal: item ? item.total_bal : 0,
          isUpdating: false,
          timestamp: item ? item.timestamp : "",
          branches: item ? item.branches : ""
        };
        if (index != undefined) {
          this.$set(this.accTable, index, newItem);
        } else {
          this.accTable.push(newItem);
        }
        this.tableUpdating = false;
      });
    },
    /**
     * @description 请求后端更新存款
     */
    requestUpdate(accountName, index) {
      this.accTable[index].isUpdating = true;
      // 请求后端进行更新数据库
      this.$notify({
        type: "info",
        message: "Requesting"
      });
      this.$axios
        .post("/update-result", {
          account: accountName
        })
        .then(response => {
          console.log("RequestUpdate", response.data);
          this.$notify({
            type: "success",
            message: "Request Success"
          });
        });
    },
    showBalanceView(accountName, index) {
      console.log("ShowDetail", accountName, index);
      this.$router.push({
        path: `account/${accountName}`
      });
    },
    handleAccountClick(index) {
      let accountName = this.accTable[index].acctname;
      if (this.accTable[index].isUpdating) {
        console.log("display");
        this.refreshBalance(accountName, index);
      } else {
        console.log("update");
        this.requestUpdate(accountName, index);
      }
    },
    showHistory(accountName) {
      this.historyShow = true;
      this.historyAcct = accountName;
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
