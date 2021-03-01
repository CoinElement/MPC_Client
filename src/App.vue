<template>
  <div id="app">
    <el-container>
      <el-header>
        <Navbar />
      </el-header>
      <el-main>
        <el-row type="flex" justify="center">
          <el-col :span="14" :xs="{ span: 20 }">
            <router-view class="main-view-container" />
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  components: { Navbar }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.el-header {
  background: #545c64;
}

.main-view-container {
  padding: 7px;
  border: solid 1px #e6e6e6;
  background: whitesmoke;
}
</style>
