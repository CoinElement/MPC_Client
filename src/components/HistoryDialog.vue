<template>
  <el-dialog title="History" :visible.sync="openDialog">
    <el-table :data="tableData">
      <el-table-column label="Name" prop="acctname" />
      <el-table-column label="Balance" prop="total_bal" />
      <el-table-column label="Branches" prop="branches" />
      <el-table-column label="Time" prop="timestamp" />
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    updateTable() {
      this.$axios.post("/get-result", { account: this.account }).then(response => {
        console.log("HistoryUpdateTable", response.data);
        this.tableData = response.data;
      });
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    account: {
      type: String,
      default: ""
    }
  },
  computed: {
    openDialog: {
      get() {
        if (this.visible) {
          this.updateTable();
        }
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
        if (val == true) {
          this.updateTable();
        }
      }
    }
  }
};
</script>

<style></style>
