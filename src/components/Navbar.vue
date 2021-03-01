<template>
  <div class="navbar">
    <el-row type="flex">
      <el-col :span="4">
        <div>
          <el-avatar icon="el-icon-user-solid" :size="50"></el-avatar>
        </div>
      </el-col>
      <el-col :span="16">
        <el-menu
          mode="horizontal"
          :default-active="$route.name"
          router
          background-color="#ffffff00"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item :route="{ path: '/balance' }" index="Balance">Table</el-menu-item>
          <el-menu-item :route="{ path: '/account' }" index="AccountList"
            >Account list</el-menu-item
          >
        </el-menu>
      </el-col>
      <el-col :span="4"> </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Navbar"
};
</script>

<style scoped>
.el-menu {
  border-bottom: 0px;
}
</style>
