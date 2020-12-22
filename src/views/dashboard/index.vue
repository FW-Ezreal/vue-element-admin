<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" class="user-avatar">
      <span>name: {{ userInfo.username }}</span>
    </div>
    <div>
      <img :src="emptyGif" class="emptyGif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  }
}
</script>

<style lang="scss" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard {
  &-container {
    margin: 16px;
    background-color: #e3e3e3;
  }
  &-text {
    font-size: 24px;
    line-height: 46px;
    display: flex;
    align-items: center;
    padding: 16px 0 0 16px;
      .user-avatar {
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
</style>
