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
    <div class="container">
  <div class="row">
    <div class="col-xs-12">
      <div class="app">
        <p class="title">Pomodoro Timer</p>
        <div class="pomodoro-timer">
          <div id="pomodoro-progress">

          </div>
          <span id="timer">00:00</span>
        </div>
        <div class="pomodoro-control clearfix">
          <a href="#" id="switchPause" disabled><i class="fa fa-pause"></i> <span>pause</span></a>
          <a href="#" id="switchOn"><i class="fa fa-play"></i> <span>start</span></a>
        </div>
        <p id="status">--</p>
        <p class="title">Time in minutes</p>
        <div class="min-pref">
          <label>Pomodoro: <span id="pomodoro">25</span></label>
          <div id="slider-pomodoro"></div>
          <label>Break: <span id="break">5</span></label>
          <div id="slider-break"></div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import $ from 'jquery'
import 'jquery-ui-dist/jquery-ui'
import 'bootstrap'
import firebase from 'firebase';
    export default {
        name:'poromodo',
        data() {
          return {
            isLoggedIn: false,
            curretnUser: false
          }
        },
        methods:{
          logout:function(){
            firebase.auth().signOut().then(()=>{
              this.$router.push('/');
            });
          }
        },
    mounted() {
    var setTimer;
  // The actual state (work or break)
  var state = "work";
  // Pomodoro progress bar
  var progress = $("#pomodoro-progress");
  // pause/resume
  var pause = false;
  // Alarm sound
  var alarm = new Audio("../assets/mp3/beep-08b.mp3");
  
  // Calculate the total progress
  function progressTime(timer, duration) {
    return (timer / duration) * 100;
  }
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
  // Create and start the Timer
  function startTimer(duration, breakTime, clock) {
    var timer = duration-1, min, sec, percentage;
    setTimer = setInterval(function() {
      if (!pause) {
        min = parseInt(timer / 60, 10);
        sec = parseInt(timer % 60, 10);
      
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
      
        clock.innerHTML = min + ":" + sec;
      
       if (state === "work") {
        percentage = progressTime(parseFloat(duration-timer+"."+sec), duration);
       } else {
         percentage = progressTime(parseFloat(breakTime-timer+"."+sec), breakTime);
       }
      
        progress.css("width", percentage+"%");
      
       if (--timer < 0) {
          percentage = 0;
          alarm.play();
          if (state === "work") {
            $("#status").text("break");
            state = "break";
            timer = breakTime;
          } else if (state === "break") {
            $("#status").text("working");
            state = "work";
            timer = duration;
          }
        }
      }
    }, 1000);
  }
  
  // Pomodoro slider
  $("#slider-pomodoro").slider({
    value: 25,
    step: 1,
    min: 1,
    max: 60,
    slide: function(event, ui) {
      $("#pomodoro").text(ui.value);
    }
  });
  
  // Break slider
  $("#slider-break").slider({
    value: 5,
    step: 1,
    min: 1,
    max: 60,
    slide: function(event, ui) {
      $("#break").text(ui.value);
    }
  });
  
  // Start and Stop
  $("#switchOn").click(function() {
    var clock = document.getElementById("timer");
    var minutes = $("#pomodoro").text();
    var breakTime = $("#break").text();
    clock.innerHTML = minutes + ":00";
    // *** START Button ***
    if ($("#switchOn > span").text() === "start") {
      // It's working time!
      $("#status").text("working");
      $("#status").css("color", "#FF0");
      // Set button states
      $("#switchOn > span").text("stop");
      $("#switchOn > i").attr("class", "fa fa-stop");
      $("#switchPause").removeAttr("disabled");
      // Start the Pomodoro Timer
      startTimer(60 * minutes, 60 * breakTime, clock);
      // ** STOP Button ***
    } else if ($("#switchOn > span").text() === "stop")  {
      $("#status").text("--");
      // Remove the actual timer
      clearInterval(setTimer);
      // Reset variables
      progress.css("width", 0);
      pause = false;
      state = "work";
      // Set button states
      $("#switchOn > span").text("start");
      $("#switchOn > i").attr("class", "fa fa-play");
      $("#switchPause").attr("disabled", "disabled");
      $("#switchPause > span").text("pause");
      $("#switchPause > i").attr("class", "fa fa-pause");
    }
  });
  
  // Pause and Resume
  $("#switchPause").click(function() {
    // Switch between pause and resume
    pause = pause === true ? false : true;
    // Set button states
    if ($("#switchPause > span").text() === "pause") {
      $("#switchPause > span").text("resume");
      $("#switchPause > i").attr("class", "fa fa-play");
    } else if ($("#switchPause > span").text() === "resume") {
      $("#switchPause > span").text("pause");
      $("#switchPause > i").attr("class", "fa fa-pause");
    }
  });
        },
    }
 
</script>

<style lang="postcss" scoped>
  .body{
  margin-top: 10px;
  height: 969px;
  background-image: url('https://github.com/a80601pass/photo/blob/master/study2.jpg?raw=true') ;
}
header.navigation {
  background-color: #333;
  border-bottom: 1px solid #1a1a1a;
  min-height: 60px;
  width: 100%;
  z-index: 999;
  margin-top: -10px;
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

.container {
  text-align: center;
  margin-top: 200px;
}

.app {
  border: 1px solid;
  display: inline-block;
  padding: 15px;
  width: 100%;
  max-width: 350px;
  background: #343436;
  border-radius: 10px;
}

a[disabled] {
  pointer-events: none;
}

a, p {
  color: #FFF;
}

a[disabled] > span,
a[disabled] > i {
  color: #939393;
}

.pomodoro-timer, #pomodoro-progress {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.pomodoro-timer {
  display: table;
  width: 100%;
  background: #FF3C41;
  margin: 0 auto;
  position: relative;
}

#pomodoro-progress {
  position: absolute;
  width: 0;
  height: 100%;
  background: #35D400;
}

.pomodoro-timer > span {
  display: table-cell;
  vertical-align: middle;
  color: #FFF;
  font-size: 4em;
  position: relative;
  padding: 10px;
}

.pomodoro-control {
  display: block;
  margin: 0 auto 10px auto;
}

.pomodoro-control > a {
  text-decoration: none;
  background: #282828;
  display: inline-block;
  color: #FFF;
  padding: 5px;
  font-size: 1.5em;
  text-transform: uppercase;
  width: 50%;
  float: left;
}

.pomodoro-control > a:first-child {
  border-right: 1px solid #434343;
}

.pomodoro-control > a:first-child {
  border-bottom-left-radius: 10px;
}

.pomodoro-control > a:last-child {
  border-bottom-right-radius: 10px;
}

.pomodoro-control > a:hover {
  background: #5D5D5D;
}

.title {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 3px;
}

.min-pref {
  background: #FFF;
  display: block;
  margin: 0 auto;
  padding: 15px;
  border-radius: 5px;
  text-align: left;
}

label {
  font-weight: normal;
}

label > span {
  font-weight: bold;
}

#status {
  text-transform: uppercase;
  font-size: 1.2em;
  margin: 15px 0;
  font-weight: bold;
  color: #FF0;
}

[id^="slider"] {
  margin: 3px 0 10px 0;
}

.ui-widget-content {
    border: 1px solid #CCC;
    background: #ff3c41;
}
</style>