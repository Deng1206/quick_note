<script src="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.2/owl.carousel.min.js"></script>
<template>
  <div class="paint">
    <header class="navigation">
    <div class="navigation-wrapper">
      <a href="javascript:void(0)" class="logo">
        <i class="fa fa-2x fa-ils"></i>
      </a>
      <a href="javascript:void(0)" class="navigation-menu-button" id="js-mobile-menu">
        <i class="fa fa-2x fa-bars"></i>
      </a>
      <nav>
        <ul id="js-navigation-menu" class="navigation-menu show">
          <li class="nav-link scroll">
            <router-link :to="{name:'Pomodoro'}"
                            class="navbar_tab_item_link">
                <div class="navbar_tab_item_link_button"
                >Poromodo</div>
            </router-link>
          </li>
          <li class="nav-link scroll">
            <router-link :to="{name:'Todo'}"
                            class="navbar_tab_item_link">
                <div class="navbar_tab_item_link_button"
                @>todo</div>
            </router-link>
          </li>
          <li class="nav-link scroll">
            <router-link :to="{name:'Paint'}"
                            class="navbar_tab_item_link">
                <div class="navbar_tab_item_link_button"
                >paint</div>
                </router-link>
          </li>
          <li class="nav-link scroll">
            <router-link :to="{name:'Sheet'}"
                            class="navbar_tab_item_link">
                <div class="navbar_tab_item_link_button"
                >sheet</div>
                </router-link>
          </li>
          <li class="nav-link scroll">
            <span class="navbar_tab_item_link">
                <button @click="logout" class="navbar_tab_item_link_button">
                    Logout</button>
            </span>
          </li>
        </ul>
      </nav>
    </div>
  </header>
<div class="draw">
  <div class="title">
  <h1>Let's draw</h1>
  </div>
   <div class="color">
  R<input v-model="r" id="red" type="range" name="points" min="0" max="255" value="0"><br>
  G<input v-model="g" id="green" type="range" name="points" min="0" max="255" value="0"><br>
  B<input v-model="b" id="blue" type="range" name="points" min="0" max="255" value="0">
  </div>
  <div class="value">
    R<input v-model="r" id="vred" type="text" value="0">
    G<input v-model="g" id="vgreen" type="text" value="0">
    B<input v-model="b" id="vblue" type="text" value="0">
  </div>
  <canvas class="canvaspaint" ref="canvas" id='drawing-pad' width='300' height='300'>
    This is an interactive drawing pad.
  </canvas>
  <div>
    <button @click='resetCanvas'>Reset Canvas</button>
    <button @click='saveImage'>Save Image</button>
    <button @click='replay'>Replay</button>
  </div>
  <hr>
  <img ref="img" src="" id='canvas-image'>
  <small>Right click to save image.</small>
</div>
</div>

</template>

<script>
import firebase from 'firebase';
export default({
    name:'Paint',
     data(){
    return{
      isLoggedIn: false,
      curretnUser: false,
      r:0,
      g:0,
      b:0,
      canvas: null,
      context: null,
      isDrawing: false,
      startX: 0,
      startY: 0,
      points: [],
    }
  },
  mounted(){
    var vm = this
    vm.canvas = vm.$refs.canvas
    vm.context = vm.canvas.getContext("2d");
    vm.canvas.addEventListener('mousedown', vm.mousedown);
    vm.canvas.addEventListener('mousemove', vm.mousemove)
    document.addEventListener('mouseup', vm.mouseup);
  },
  watch: {
    r:function(value){
      this.context.strokeStyle='rgb('+this.r+','+this.g+','+this.b+')'
    },
    g:function(value){
      this.context.strokeStyle='rgb('+this.r+','+this.g+','+this.b+')'
    },
    b:function(value){
      this.context.strokeStyle='rgb('+this.r+','+this.g+','+this.b+')'
    }
  },
  methods:{
    logout:function(){
            firebase.auth().signOut().then(()=>{
              this.$router.push('/');
            });
          },
    mousedown(e){
      var vm = this
      var rect = vm.canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      
      vm.isDrawing = true;
      vm.startX = x;
      vm.startY = y;
      vm.points.push({
        x: x,
        y: y
      });
    },
    mousemove(e){
      var vm = this
      var rect = vm.canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      
      if (vm.isDrawing) {
        vm.context.beginPath();
        vm.context.moveTo(vm.startX, vm.startY);
        vm.context.lineTo(x, y);
        vm.context.lineWidth = 1;
        vm.context.lineCap = 'round';
        vm.context.stroke();
        
        vm.startX = x;
        vm.startY = y;  
        
        vm.points.push({
          x: x,
          y: y
        });
      }
    },
    mouseup(e){
      var vm = this
      vm.isDrawing = false;
      if (vm.points.length > 0) {
        localStorage['points'] = JSON.stringify(vm.points);    
      }
    },
    resetCanvas(){
      var vm = this
      vm.canvas.width = vm.canvas.width;
      vm.points.length = 0; // reset points array
    },
    saveImage(){
      var vm = this
      var dataURL = vm.canvas.toDataURL();
      var img = vm.$refs.img;
      img.src = dataURL;
    },
    replay(){
      var vm = this
      vm.canvas.width = vm.canvas.width;
      
      // load localStorage
      if (vm.points.length === 0) {
        if (localStorage["points"] !== undefined) {
          vm.points = JSON.parse(localStorage["points"]);
        }
      }
      
      var point = 1;
      setInterval(function(){
        drawNextPoint(point);
        point += 1;
      },10);
      
      function drawNextPoint(index) {    
      if (index >= vm.points.length) {
        return;
      }
        var startX = vm.points[index-1].x;
        var startY = vm.points[index-1].y;
        
        var x = vm.points[index].x;
        var y = vm.points[index].y;
        
        vm.context.beginPath();
        vm.context.moveTo(startX, startY);
        vm.context.lineTo(x, y);
        vm.context.lineWidth = 1;
        vm.context.lineCap = 'round';
        vm.context.stroke();
      }
    },
  }
})
</script>

<style lang="postcss" scoped>
.canvaspaint {border: 1px solid red;cursor:crosshair;}
header.navigation {
  background-color: #333;
  border-bottom: 1px solid #1a1a1a;
  min-height: 60px;
  width: 100%;
  z-index: 999;
}
.navbar_tab_item_link {
  text-decoration: none;
}
header.navigation .navigation-wrapper {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 9999;
}
header.navigation .navigation-wrapper::after {
  clear: both;
  content: "";
  display: block;
}
header.navigation .navigation-wrapper::after {
  clear: both;
  content: "";
  display: block;
}
header.navigation .logo {
  float: left;
  max-height: 60px;
  padding-left: 1em;
  padding-right: 2em;
}
header.navigation .logo i {
  max-height: 60px;
  padding: 0.5em 0;
  color: white;
}
header.navigation .navigation-menu-button {
  color: #999;
  display: block;
  float: right;
  font-weight: 700;
  font-size: 15px;
  margin: 0;
  margin-top: 1em;
  padding-right: 1em;
  text-transform: uppercase;
}
@media screen and (min-width: 53.75em) {
  header.navigation .navigation-menu-button {
    display: none;
  }
}
header.navigation .navigation-menu-button:hover {
  color: white;
}
header.navigation nav {
  float: none;
  min-height: 60px;
  z-index: 9999999;
}
@media screen and (min-width: 53.75em) {
  header.navigation nav {
    float: left;
  }
}
header.navigation ul.navigation-menu {
  transform-style: preserve-3d;
  clear: both;
  display: none;
  margin: 0 auto;
  overflow: visible;
  padding: 0;
  width: 100%;
  z-index: 9999;
}
header.navigation ul.navigation-menu.show {
  display: block;
}
@media screen and (min-width: 53.75em) {
  header.navigation ul.navigation-menu {
    display: inline;
    margin: 0;
    padding: 0;
  }
}
header.navigation ul li.nav-link {
  background: #333;
  display: block;
  line-height: 60px;
  overflow: hidden;
  padding-right: 0.8em;
  text-align: right;
  width: 100%;
  z-index: 9999;
}
@media screen and (min-width: 53.75em) {
  header.navigation ul li.nav-link {
    background: transparent;
    display: inline;
    line-height: 60px;
    text-decoration: none;
    display: auto;
  }
}
header.navigation ul li.nav-link a {
  color: #999;
  display: inline-block;
  font-weight: 400;
  -webkit-transition: all 0.5s ease-out;
  -moz-transition: all 0.5s ease-out;
  -o-transition: all 0.5s ease-out;
  transition: all 0.5s ease-out;
}
@media screen and (min-width: 53.75em) {
  header.navigation ul li.nav-link a {
    padding-right: 1em;
  }
}
header.navigation ul li.nav-link a:hover {
  color: white;
}
header.navigation .active-nav-item a {
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  padding-bottom: 3px;
}

nav{
  margin-left: 750px;
}
.paint{
  background-image: url('https://github.com/a80601pass/photo/blob/master/painting2.jpg?raw=true');
}
.title{
  margin-top:100px;
}
.draw{
  text-align: center;
}
.color{
  width:500px;
  margin-left: 700px;
  margin-top: 40px;
}
.value{
  margin-top: 30px;
}
.canvaspaint{
  margin-top: 40px;
  background-color: #FFF;
}
hr{
  color:black;
  margin-top: 95px;
}
</style>