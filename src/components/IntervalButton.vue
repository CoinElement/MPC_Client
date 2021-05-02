<template>
  <el-button @click="handleClick()" :disabled="current_interval >= 0 && !locked" size="small">
    {{ content }}
    <span v-if="current_interval >= 0 && !locked"> ({{ current_interval }}s) </span>
  </el-button>
</template>

<script>
export default {
  props: {
    locked: {
      type: Boolean,
      default: false
    },
    content: String,
    interval: Number
  },
  data: function() {
    return {
      current_interval: -1,
      shown_text: this.content,
      timer: null
    };
  },
  methods: {
    handleClick(evt) {
      console.log("interval button clicked");
      this.current_interval = this.interval;
      this.$emit("click", evt);
      this.countDown();
    },
    countDown() {
      this.timer = window.setInterval(() => {
        console.log("countDown");
        this.current_interval--;
        if (this.current_interval < 0) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
    }
  }
};
</script>
