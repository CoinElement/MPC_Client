<template>
  <el-card style="width:600px">
    <el-form>
      <el-form-item label="Account Name:">
        <el-input v-model="accountName" readonly> </el-input>
      </el-form-item>
      <el-form-item label="Balance:">
        <el-select v-model="branch" :span="11">
          <el-option v-for="ibranch in branchList" :key="ibranch" :label="ibranch" :value="ibranch">
          </el-option>
        </el-select>
        <el-input :span="11" v-model="currentBalance" readonly></el-input>
      </el-form-item>
      <el-form-item label="New Balance:">
        <el-input v-model="newBalance"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateBalance">Update</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      accountName: "",
      branch: "branch8000",
      branchList: ["branch8000", "branch9000", "branch10000", "branch11000", "branch12000"],
      currentBalance: 0,
      newBalance: 0
    };
  },
  watch: {
    $route(to) {
      this.accountName = to.params["accName"];
    },
    branch() {
      this.getCurrentData();
    },
    accountName() {
      this.getCurrentData();
    }
  },
  created() {
    this.accountName = this.$route.params["accName"];
    this.getCurrentData();
  },
  methods: {
    getCurrentData: function() {
      console.log("Getting current balance");
      this.currentBalance = "Loading......";
      this.$axios
        .post("/get-postgres", { account: this.accountName, branch: this.branch })
        .then(response => {
          console.log("GetCurrentBalance", response);
          if (response.data) {
            this.currentBalance = response.data["balance"];
          } else {
            this.currentBalance = 0;
          }
        })
        .catch(() => {
          this.currentBalance = "Wrong.";
        });
    },
    updateBalance: function() {
      this.$axios
        .post("/put-postgres", {
          account: this.accountName,
          balance: this.newBalance,
          branch: this.branch
        })
        .then(response => {
          console.log("UpdateBalance", response);
          this.$notify({
            message: response.data,
            type: "success"
          });
        });
    }
  }
};
</script>

<style></style>
