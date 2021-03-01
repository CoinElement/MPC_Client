<template>
  <div style="width:600px">
    <el-card class="box-card">
      <div slot="header">
        <span>
          Choose account
        </span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="getAccountList()">
          Refresh list
        </el-button>
      </div>

      <ul>
        <li v-for="account in accountList" :key="account.name">
          <router-link :to="{ path: '/account/' + account.name }">
            {{ account.name }}
          </router-link>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accountList: []
    };
  },
  methods: {
    getAccountList() {
      this.$axios.get("s3").then(response => {
        console.log("getAccountList", response.data);
        this.accountList = response.data;
        this.$notify({
          type: "success",
          message: "Account list loaded"
        });
      });
    },
    showAccount(accountName) {
      this.$router.push({
        path: "account",
        params: {
          acctName: accountName
        }
      });
    }
  },
  created() {
    this.getAccountList();
  }
};
</script>

<style>
li {
  list-style-type: none;
}
</style>
