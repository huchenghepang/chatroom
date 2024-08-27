<template>
  <div class="app clearfix">
    <div class="header-app " >
      <h3>天空之城-在线聊天室</h3>
    </div>
    <router-view></router-view> 
  </div>
</template>

<script lang="ts" name=App setup>



</script>

<style lang="scss">
h1, h2, h3, h4, h5, h6 {
    font-family: "PT Serif", "Bitter", serif;
    color: #2C3E50; /* 深蓝色标题 */
    mix-blend-mode:differenc;
}
html,body,.app{
  height:100%;
  background-color: transparent;
}
.clearfix::after,.clearfix::before{
  content: "";
  display: table;
  clear: both;
}
.app{
  min-width: 100vw !important;
  min-height: 100vh !important;
}
@property --colorA {
    syntax: '<color>';
    inherits: false;
    initial-value: fuchsia;
}

@property --colorB {
    syntax: '<color>';
    inherits: false;
    initial-value: rgb(0, 255, 115);
}

@property --colorC {
    syntax: '<color>';
    inherits: false;
    initial-value: rgb(55, 0, 255);
}

// 定义头部样式
.header-app{
  width: 100%;
  height: 35px;
  background: linear-gradient(47deg,var(--colorA),var(--colorB),var(--colorC));
  animation: changeColor 10s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  h3{
    width: 100%;
    height: 100px;
    line-height: 30px;
    text-align: center;
    color: #98a;
    margin: 0;
    mix-blend-mode: multiply;
  }
}
@property --colorA {
  syntax: '<color>';
  inherits: false;
  initial-value: fuchsia;
}

@property --colorB {
  syntax: '<color>';
  inherits: false;
  initial-value: rgb(0, 255, 115);
}

@property --colorC {
  syntax: '<color>';
  inherits: false;
  initial-value: rgb(55, 0, 255);
}

@keyframes changeColor {
  20%{
    --colorA:#bfa;
    --colorB: #98a;
    --colorC: fuchsia;
  }
  40%{
    --colorA:rgb(186, 170, 255);
    --colorB: rgb(170, 136, 162);
    --colorC: rgb(115, 255, 0);
  }
  60%{
    --colorA:#bfa;
    --colorB: #98a;
    --colorC: rgb(0, 255, 0);
  }
  80%{
    --colorA:rgb(255, 170, 213);
    --colorB: #98a;
    --colorC: rgb(179, 255, 0);
  }
}




</style>

