<template>
  <div style="width:600px">
    <el-input v-model="shownText" placeholder="Please choose the accout you want display" readonly>
      <template slot="prepend">Choose Account:</template>
      <el-button @click="show_dialog = true" slot="append">Choose...</el-button>
    </el-input>
    <el-table :data="accTable" border height="500">
      <el-table-column prop="acctname" label="Account Name" width="140" />
      <el-table-column prop="total_bal" label="Balance" />
      <el-table-column prop="timestamp" label="Time" width="100" />
      <el-table-column prop="branches" label="Branch" width="400" />

      <el-table-column label="Operation" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button @click="updateTotal(scope)" size="small">Update balance</el-button>
          <el-button @click="updateTable(scope.row.acctname, scope.$index)" size="small"
            >Get balance</el-button
          >
        </template>
      </el-table-column>
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
        text = text + item + " ";
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
      this.$axios.get("s3").then(response => {
        console.log(response);
        this.accList = response.data;
        this.getTableData();
      });
    },
    updateTotal: function(scope) {
      console.log("scope", scope);
      console.log(scope);
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
          /*
          if (response.data) {
            this.updateTable(account, scope.$index);
          }
          */
        });
    },
    updateTable(account, index) {
      var that = this;
      console.log(index);
      this.$axios.post("/get-result", { account: account }).then(response => {
        console.log(response);
        var item = response.data.Items[response.data.Count - 1];
        if (index != undefined) {
          that.accTable[index] = item;
        } else {
          if (response.data.Count != 0) {
            that.accTable.push(item);
          } else {
            that.accTable.push({
              accName: account,
              accBal: 0
            });
          }
        }
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
</style>
