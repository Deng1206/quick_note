<script src="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.2/owl.carousel.min.js"></script>
<template>
  <div class="body">
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
                >todo</div>
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
<div id="ap">
  <div class="title"> 
    {{ titleApp }} 
    <span class="countToDo">
      <span>All: {{ toDos }}</span> 
      <span>Done: {{ completed }}</span>
    </span>
  </div>
 
    <transition-group name="list" tag="ol" class="toDo" v-bind:style="[ show ? { flex: ['1'] } : '' ]" v-show="show">
    <todoitem
     v-for="item in list"
     v-bind:todo="item"
     v-bind:key="item.id"
     v-bind:edit="editItem"
     v-bind:remove="removeItem"
     v-bind:complete="completeItem"          >      
    </todoitem>
    </transition-group>   
    <p class="message" v-show="!show">Adicione tasks e pressione Enter. </p>
  <input type="text" class="input" v-model="toDo" v-on:keyup.enter="addItem">
</div>
</div>
</template>

<script>
import $ from 'jquery'
import 'jquery-ui-dist/jquery-ui'
import 'bootstrap'
import firebase from 'firebase';

$(document).ready(function() {
  //header links
  var menuToggle = $('#js-mobile-menu').unbind();
  $('#js-navigation-menu').removeClass("show");

  //mobile menu toggle
  menuToggle.on('click', function(e) {
    e.preventDefault();
    $('#js-navigation-menu').slideToggle(function() {
      if ($('#js-navigation-menu').is(':hidden')) {
        $('#js-navigation-menu').removeAttr('style');
      }
    });
  });
})

export default {
    name:'Todo',
    mounted() {
    if (localStorage.getItem('toDos')) {
      this.list = JSON.parse(localStorage.getItem('toDos')); 
      if(this.list.length) this.show = true;
    }
  },
  data() {
    return{
    isLoggedIn: false,
    curretnUser: false,
    show: false,
    edit: false,
    titleApp: 'Todo-memo',
    toDo: '',
    list: []
    }
  },
  components: {
        todoitem:{
        props: {edit: Function, remove: Function, complete: Function, todo: Object},
        template: `<li :class="['list-item',{complete:todo.complete}]"><span>{{ todo.text }}</span>
                <a class="done" href="#" @click="complete(todo)"><i class="fa fa-check"></i></a>
                <a class="edit" href="#" @click="edit(todo)"><i class="fa fa-edit"></i></a>
                <a class="del" href="#" @click="remove(todo)"><i class="fa fa-trash-o"></i></a>
            </li>`
        }
  },
   methods: {
      logout:function(){
            firebase.auth().signOut().then(()=>{
              this.$router.push('/');
            });
          },
    addItem: function(e) {
      if (e.keyCode === 13) {
        
        if(this.toDo == '') return;
        
        if(this.edit) {
          this.list[this.list.indexOf(this.edit)].text = this.toDo
          this.edit = false;
          this.toDo = "";
          this.persist()
          return
        }

        if(!this.show) this.show = true;
        this.list.push({id:new Date().getTime(), text:this.toDo, complete:false });
        this.toDo = "";
        this.persist()
      }     
    },
    editItem: function(todo) {
      this.toDo = todo.text;
      this.edit = todo;
    },
    removeItem: function(todo) {      
      this.list.splice(this.list.indexOf(todo), 1);
      
      if(!this.list.length) this.show = false;
      
      this.persist()
    },
    completeItem: function(todo) {      
      this.list[this.list.indexOf(todo)].complete = !todo.complete;
      this.persist()
    },
    persist: function(){
      localStorage.setItem('toDos', JSON.stringify(this.list));
    }
   },
  computed:{
    toDos(){
      return this.list.length;
    },
    completed(){
      let complete =  this.list.filter( item => item.complete == true);
      return complete.length;
    }
  }
  
} 
  </script>

<style lang="postcss" scoped>
.body{
  background-image: url('https://github.com/a80601pass/photo/blob/master/notebook.jpg?raw=true');
  height: 969px;
}

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
#ap {
  font-family : "Signika", sans-serif;
  background: linear-gradient(-45deg, #ff416c, #ff4b2b) no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 500px;
  min-height: 500px;
  background: #f5f5f5;
  border-radius: 5px;
  box-shadow: 0px 50px 60px -20px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 1.5rem;
  margin-top: 200px;
  margin-left: 700px;
  height: 400px;
}

.message,
.title {
  flex: 0.25;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 2rem;
  color: #ff416c;
  position: relative;
}

.title > .countToDo {
  color: silver;
  font-size: 0.9rem;
  position: absolute;
  right: 0;
  transform: translateX(300%);
  display: flex;
  flex-direction: column;
}

.message {
  color: #c6c5ce;
  flex: 1;
}

.toDo {
  width: 340px;
  height: 270px;
  font-size: 1.1rem;
  color: #464e52;
  margin-left: 0;
  padding-right: 0;
  list-style-type: none;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

.toDo li {
  counter-increment: step-counter;
  height: auto;
  display: flex;
  align-items: center;
  word-break: break-all;
  justify-content: space-between;
}

.toDo li::before {
  content: counter(step-counter);
  margin-right: 5px;
  font-size: 80%;
  background-color: rgb(255, 66, 97);
  color: white;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 3px;
  word-break: initial;
}

.list-item span {
  width: 90%;
}

.list-item a {
  text-decoration: none;
  margin-left: 1rem;
  padding: 3px 8px;
}

.list-item a.done {
  color: rgba(181, 206, 210, 0.8);
}
.list-item a.edit {
  color: rgba(0, 188, 212, 0.8);
}
.list-item a.del {
  color: rgba(255, 73, 59, 0.74);
}

.list-item.complete:before {
  background: rgb(151, 176, 180);
}
.list-item.complete span,
.list-item.complete a {
  color: rgb(151, 176, 180);
  text-decoration: line-through;
}
.list-item.complete a {
  display: none;
}
.list-item.complete a.done {
  display: initial;
  color: rgba(0, 212, 77, 0.8);
}

.input {
  border-radius: 5px;
  border: none;
  outline: none;
  height: 35px;
  width: 300px;
  margin: 30px auto;
  box-shadow: 0px 5px 8px -5px rgba(0, 0, 0, 0.8);
  padding: 10px 20px;
  font-weight: 300;
  font-size: 1.2rem;
  caret-color: #ff4266;
}

.list-enter-active,
.list-leave-active {
  transition: all linear 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
}

.list-enter {
  color: lime;
  transform: translateX(-30px);
}

.list-leave-to {
  background: rgba(255, 68, 88, 0.5);
  color: crimson;
  transform: translateX(30px);
}

@media (max-width: 500px) {
  #app {
    width: 100%;
    height: 100vh;
  }

  .input {
    width: 75%;
  }
}
</style>