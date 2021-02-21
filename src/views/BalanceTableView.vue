<template>
  <div style="width:600px">
    <el-input v-model="shownText" placeholder="Please choose the accout you want display" readonly>
      <template slot="prepend">Choose Account:</template>
      <el-button @click="show_dialog = true" slot="append">Choose...</el-button>
    </el-input>
    <el-table :data="accTable" border>
      <el-table-column prop="accName" label="Account Name" />
      <el-table-column prop="accBal" label="Balance" />
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
        text = text + item;
      });
      this.shownText = text;
      this.getTableData();
      this.show_dialog = false;
    },
    getTableData: function() {
      this.accTable = [];
      var that = this;
      this.value.forEach(val => {
        this.$axios.post("/get-result", { account: val }).then(response => {
          var balance = 0;
          console.log(response);
          response.data.Items.forEach(item => {
            balance += item.balance;
          });
          that.accTable.push({
            accName: val,
            accBal: balance
          });
        });
      });
    },
    getAccList: function() {
      this.$axios.get("s3").then(response => {
        console.log(response);
        this.accList = response.data;
        this.getTableData();
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
