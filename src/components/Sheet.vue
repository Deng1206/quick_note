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
    <form>
        <div class="group">
            <button type="button" class="circle pos" id="playseq" tabindex="0">
                <span tabindex="-1"><span class="icon play"></span></span>
            </button>
            <button type="button" class="circle neg inactive" id="stopseq" tabindex="0">
                <span tabindex="-1"><span class="icon stop"></span></span>
            </button>
            <label for="tempo">Tempo</label>
            <input id="tempo" type="number" min="1" max="300" value="120">
            <label for="timesig">Time</label>
            <select id="timesig">
                <option value="2/4">2/4</option>
                <option value="3/4">3/4</option>
                <option value="4/4" selected>4/4</option>
                <option value="6/8">6/8</option>
            </select>
            <span class="sep"></span>
        </div>
        <div class="group">
            <div class="note">
                <span id="key">-</span>
            </div>
        </div>
        <div class="group">
            <label for="notekind"> Kind</label>
            <select id="notekind">
                <optgroup label="Duple">
                    <option value="4">Whole</option>
                    <option value="2">Half</option>
                    <option value="1" selected>Quarter</option>
                    <option value="0.5">8th</option>
                    <option value="0.25">16th</option>
                    <option value="0.125">32nd</option>
                </optgroup>
                <optgroup label="Tuplet">
                    <option value="0.6667">Quarter Triplet</option>
                    <option value="0.3333">Triplet</option>
                    <option value="0.1667">Sextuplet</option>
                </optgroup>
            </select>
            <label for="wavetype"> wave type</label>
            <select id="wavetype">
                <option name="oscillator-type" value="sine" type="radio" selected>sine</option>
                <option name="oscillator-type" value="square" type="radio">square</option>
                <option name="oscillator-type" value="sawtooth" type="radio">sawtooth</option>
                <option name="oscillator-type" value="triangle" type="radio">triangle</option>
            </select>
        </div>
        <div class="group">
            <div class="btn-group-vert">
                <label>Key</label>
                <div class="bgv-container">
                    <button id="keyUp" class="button" type="button" tabindex="0" disabled>
                        <span tabindex="-1"><span class="icon up-arrow"></span></span>
                    </button><button id="keyDown" class="button" type="button" tabindex="0" disabled>
                        <span tabindex="-1"><span class="icon down-arrow"></span></span>
                    </button>
                </div>
            </div>
            <div class="btn-group">
                <label>Delay</label>
                <button id="delayLeft" type="button" tabindex="0" class="button" disabled>
                    <span tabindex="-1"><span class="icon left-arrow"></span></span>
                </button><button id="delayRight" type="button" tabindex="0" class="button" disabled>
                    <span tabindex="-1"><span class="icon right-arrow"></span></span>
                </button>
            </div>
        </div>
        <div class="group">
            <button id="add" type="button" class="pos button" tabindex="0">
                <span tabindex="-1">+ Add</span>
            </button>
            <button id="del" type="button" class="neg inactive button" tabindex="0">
                <span tabindex="-1">&ndash; Delete</span>
            </button>
            <span class="sep"></span>
        </div>
        <div class="group">
            <button id="delall" type="button" class="neg button" tabindex="0" disabled>
                <span tabindex="-1">&#x1f4a3;&nbsp; Delete All</span>
            </button>
        </div>
        <div class="group">
            <button class="button" id="loadunicorn" type="button" tabindex="0">
                <span tabindex="-1">&#129412;&nbsp; Load Unicorn!</span>
            </button>
        </div>
    </form>
    <main>
        <canvas class="canvassheet"></canvas>
    </main>
    </div>
</template>

<script>
import firebase from 'firebase';
export default {
	name:'Sheet',
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
    mounted(){
        console.clear();
        window.requestAnimFrame = (function(){
  		return window.requestAnimationFrame || 
      	window.webkitRequestAnimationFrame || 
      	window.mozRequestAnimationFrame || 
      	window.oRequestAnimationFrame ||
      	window.msRequestAnimationFrame ||
        function(callback){
          window.setTimeout(callback, 1000/60);
        };
})();
    var canvas = document.getElementsByTagName("canvas")[0],
		ctx = canvas.getContext("2d"),
		rows = 108,
		cols = 80,
		// adjust cell size
		cellX = 24,
		cellY = 10,
		// canvas dimensions
		w = cols * cellX,
		h = rows * cellY,
		s = 2,
		deviceEvent = function() {
		  var events = ["touchstart", "mousedown"],
			  selectedEvent = "ontouchstart" in document.documentElement ? events[0] : events[1];
		  return selectedEvent;
		},
		cellEvent = deviceEvent();
	
	canvas.width = w * s;
	canvas.height = h * s;
	canvas.style.width = w + "px";
	canvas.style.height = h + "px";
	ctx.scale(s,s);

	var notesPerMes = 4,
		noteType = 4,
		freqs = {c0:16.25,cs0:17.32,d0:18.35,ds0:19.45,e0:20.60,f0:21.83,fs0:23.12,g0:24.50,gs0:25.96,a0:27.50,as0:29.14,b0:30.87,c1:32.70,cs1:34.65,d1:36.71,ds1:38.89,e1:41.20,f1:43.65,fs1:46.25,g1:49.00,gs1:51.91,a1:55.00,as1:58.27,b1:61.74,c2:65.41,cs2:69.30,d2:73.42,ds2:77.78,e2:82.41,f2:87.31,fs2:92.50,g2:98.00,gs2:103.83,a2:110.00,as2:116.54,b2:123.47,c3:130.81,cs3:138.59,d3:146.83,ds3:155.56,e3:164.81,f3:174.61,fs3:185.00,g3:196.00,gs3:207.65,a3:220.00,as3:233.08,b3:246.94,c4:261.63,cs4:277.18,d4:293.66,ds4:311.13,e4:329.63,f4:349.23,fs4:369.99,g4:392.00,gs4:415.30,a4:440.00,as4:466.16,b4:493.88,c5:523.25,cs5:554.37,d5:587.33,ds5:622.25,e5:659.25,f5:698.46,fs5:739.99,g5:783.99,gs5:830.61,a5:880.00,as5:932.33,b5:987.77,c6:1046.50,cs6:1108.73,d6:1174.66,ds6:1244.51,e6:1318.51,f6:1396.91,fs6:1479.98,g6:1567.98,gs6:1661.22,a6:1760.00,as6:1864.66,b6:1975.53,c7:2093.00,cs7:2217.46,d7:2349.32,ds7:2489.02,e7:2637.02,f7:2793.83,fs7:2959.96,g7:3135.96,gs7:3322.44,a7:3520.00,as7:3729.31,b7:3951.07,c8:4186.01,cs8:4434.92,d8:4698.63,ds8:4978.03,e8:5274.04,f8:5587.65,fs8:5919.91,g8:6271.93,gs8:6644.88,a8:7040.00,as8:7458.62,b8:7902.13},
		seq = function(ctx) {
			this.context = ctx;
			this.time = this.context.currentTime;
			this.play = function(freq, dur, delay) {
				// create and connect oscillator and gain nodes
				this.oscillator = this.context.createOscillator();
				this.gainNode = this.context.createGain();
				
				this.oscillator.connect(this.gainNode);
				this.gainNode.connect(this.context.destination);

				// setup sound
				this.oscillator.type = getOscillatorType();
				this.oscillator.frequency.value = freq;
				this.gainNode.gain.setValueAtTime(0.3, this.time + delay);

				// play sound
				this.oscillator.start(this.time + delay);
				this.gainNode.gain.exponentialRampToValueAtTime(0.1, this.time + delay + dur);
				this.oscillator.stop(this.time + delay + dur);
			};
			this.stop = function() {
				this.oscillator.stop(this.time);
			};
		},
		note = function(freq,kind,delay) {
			this.freq = freq;
			this.kind = kind;
			this.delay = delay;
		},
		activeCell = {
			x: 0,
			y: rows - 24
		},
		activeNote = {
			id: null,
			data: null
		},
		swapBtns = function(curBtn,tarBtn) {
			let st = "inactive";
			
			if (Array.from(tarBtn.classList).indexOf(st) > -1) {
				curBtn.classList.add(st);
				tarBtn.classList.remove(st);
			}
		},
		playBtn = document.querySelector("#playseq"),
		tempo = document.querySelector("#tempo"),
		noteOpts = document.querySelectorAll("#notekind option"),
		keyUpBtn = document.querySelector("#keyUp"),
		keyDownBtn = document.querySelector("#keyDown"),
		delayLeftBtn = document.querySelector("#delayLeft"),
		delayRghtBtn = document.querySelector("#delayRight"),
		addBtn = document.querySelector("#add"),
		delBtn = document.querySelector("#del"),
		delAllBtn = document.querySelector("#delall"),
		notes = [],
		updateKey = function(y) {
			let theFreq = Object.keys(freqs)[y],
				aKey = document.querySelector("#key"),
				oct = Math.floor(y / 12),
				keyDis = theFreq[0];
			
			if (activeNote.data !== null) {
				notes[activeNote.id].freq = theFreq;
			}
			
			// key of cell
			if (theFreq[1] == "s") {
				keyDis += "&sharp;<sub>" + oct + "</sub>" + " / " + Object.keys(freqs)[y + 1][0] + "&flat;<sub>" + oct + "</sub>";
			} else {
				keyDis += "<sub>" + oct + "</sub>";
			}
			aKey.innerHTML = keyDis;
		},
		progress = {
			isMoving: false,
			value: 0,
			dur: 0
		},
		drawScreen = function(e) {
			ctx.clearRect(0,0,w,h);
			// grid
			ctx.strokeStyle = "#aaa";
			ctx.fillStyle = "#d0d0d0";
			ctx.lineWidth = 1;
			// horizontal lines
			for (let r = 0; r < rows; ++r) {
				if (r % 12 == 1 || r % 12 == 3 || r % 12 == 5 || r % 12 == 8 || r % 12 == 10) {
					ctx.fillRect(0,cellY*r,w,cellY);
				}
				ctx.lineWidth = r % 12 == 0 ? 2 : 1;
				ctx.beginPath();
				ctx.moveTo(0,cellY*r);
				ctx.lineTo(w,cellY*r);
				ctx.stroke();
				ctx.closePath();
			}
			// vertical lines
			for (let c = 0; c < cols; ++c) {
				ctx.lineWidth = c % notesPerMes == 0 ? 2 : 1;
				ctx.beginPath();
				ctx.moveTo(cellX*c,0);
				ctx.lineTo(cellX*c,h);
				ctx.stroke();
				ctx.closePath();
			}
			// octave labels
			ctx.fillStyle = "#444";
			for (let ol = 0; ol < rows; ++ol) {
				if (ol % 12 == 11) {
					let fontS = cellY*2,
						marginL = 4;
					ctx.font = "bold " + fontS + "px Helvetica";
					ctx.textBaseline = "bottom";
					ctx.fillText("C",marginL, cellY * (ol + 1) + 2);
					ctx.font = "bold " + fontS*0.75 + "px Helvetica";
					ctx.fillText((8 - Math.floor(ol / 12)),marginL + fontS*0.75, cellY * (ol + 1) + 1);
				}
			}
			// all notes
			ctx.fillStyle = "#f55";
			ctx.lineWidth = 2;
			for (let n in notes) {
				let rx = cellX * notes[n].delay,
					ry = (cellY * ((rows - 1) - Object.keys(freqs).indexOf(notes[n].freq))),
					rw = cellX * notes[n].kind,
					rh = cellY;
				ctx.fillRect(rx,ry,rw,rh);
				ctx.strokeStyle = "#922";
				ctx.strokeRect(rx,ry,rw,rh);
			}
			// active note, update active cell
			if (e && !progress.isMoving) {
				let cCont = document.querySelector("main"),
					aKey = document.querySelector("#key"),
				 	inputX = e.pageX - this.offsetLeft + cCont.scrollLeft,
					inputY = h - (e.pageY - this.offsetTop + cCont.scrollTop),
					_xRaw = inputX / cellX,
					_yRaw = inputY / cellY,
					_x = Math.floor(_xRaw),
					_y = Math.floor(_yRaw);
				
				activeCell.x = _x;
				activeCell.y = _y;
				
				let findLast = function(fn, ar) {
						let arCopy = ar.slice(0),
							curResult = arCopy.find(fn),
							last = {
								id: null,
								data: null
							};
						for (let i in ar) {
							if (curResult !== undefined) {
								last = {
									id: arCopy.findIndex(fn),
									data: curResult
								};
								arCopy.splice(arCopy.findIndex(fn),1);
								curResult = arCopy.find(fn);
							}
						}
						return last;
					},
					fnd = function(el) { 
						return el.freq == Object.keys(freqs)[_y] && (el.delay <= _xRaw && el.delay + el.kind >= _xRaw);
					};
				
				activeNote = findLast(fnd, notes);

				// show kind value in notekind select
				if (activeNote.data !== null) {
					for (let op in noteOpts) {
						if (noteOpts[op].value == activeNote.data.kind) {
							noteOpts[op].selected = true;
							break;
						} else if (+op == noteOpts.length - 1) {
							noteOpts[2].selected = true;
						}
					}
					keyUpBtn.disabled = false;
					keyDownBtn.disabled = false;
					delayLeftBtn.disabled = false;
					delayRghtBtn.disabled = false;
					swapBtns(addBtn,delBtn);
				} else {
					keyUpBtn.disabled = true;
					keyDownBtn.disabled = true;
					delayLeftBtn.disabled = true;
					delayRghtBtn.disabled = true;
					swapBtns(delBtn,addBtn);
				}
				
				// note of cell
				updateKey(_y);
			}
			
			// progress line
			if (progress.isMoving) {
				let bps = tempo.value/60;
				progress.value += (cellX/60) * bps;
				
				if (progress.value >= (progress.dur * cellX) * bps) {
					progress.value = 0;
					progress.isMoving = false;
				}
				
				ctx.strokeStyle = "#080";
				ctx.beginPath();
				ctx.moveTo(progress.value,0);
				ctx.lineTo(progress.value,h);
				ctx.stroke();
				ctx.closePath();
			} else {
				if (notes.length === 0) {
					playBtn.disabled = true;
					delAllBtn.disabled = true;
				} else {
					playBtn.disabled = false;
					delAllBtn.disabled = false;
				}
				
				// active note (or cell if not a note)
				if (activeNote.data !== null) {
					ctx.fillStyle = "#fc4";
					ctx.fillRect(
						cellX * notes[activeNote.id].delay,
						(cellY * ((rows - 1) - Object.keys(freqs).indexOf(notes[activeNote.id].freq))),
						cellX * notes[activeNote.id].kind,
						cellY
					);
				} else {
					ctx.strokeStyle = "#000";
					ctx.strokeRect(activeCell.x * cellX,h - ((activeCell.y + 1) * cellY),cellX,cellY);
				}
			}
		},
		changeTempo = function() {
			// for keeping tempo in proper range
			if (!progress.isMoving) {
				let val = parseInt(this.value);
				if (val < this.min || isNaN(val)) {
					this.value = this.min;

				} else if (val > this.max) {
					this.value = this.max;

				}
			}
		},
		changeTimeSig = function() {
			let kindLabels = [
				// Duple
				"Whole",
				"Half",
				"Quarter",
				"8th",
				"16th",
				"32nd",
				"64th",
				// Tuplet
				"Quarter Triplet",
				"Triplet",
				"Sextuplet",
				"Dodecuplet"
			];
			if (!progress.isMoving) {
				notesPerMes = this.value.substr(0,1);
				noteType = this.value.substr(2,1);
				
				for (let k in noteOpts) {
					k = +k;
					if (k < 6) {
						noteOpts[k].innerHTML = kindLabels[k + (noteType == 8 ? 1 : 0)];
					} else if (k < 9) {
						noteOpts[k].innerHTML = kindLabels[k + 1 + (noteType == 8 ? 1 : 0)];
					}
				}
				drawScreen();
			}
		},
		getOscillatorType = function(){
			const oscillatorTypeRadios = document.querySelectorAll('[name=oscillator-type]')
			for (let i = 0; i < oscillatorTypeRadios.length; i++) {
				if (oscillatorTypeRadios[i].selected) return oscillatorTypeRadios[i].value;
			}
		},
		moveSelectCell = function(e) {
			let kc = e.keyCode;
			if (kc && !progress.isMoving) {
				if (kc >= 37 && kc <= 40) {
					switch (kc) {
						case 37:
							if (activeCell.x > 0) {
								--activeCell.x;
							}
							break;
						case 38:
							if (activeCell.y < rows - 1) {
								++activeCell.y;
							}
							break;
						case 39:
							if (activeCell.x < cols - 1) {
								++activeCell.x;
							}
							break;
						case 40:
							if (activeCell.y > 0) {
								--activeCell.y;
							}
							break;
						default:

							break;
					}
					updateKey(activeCell.y);
					drawScreen();
					e.preventDefault();
				}
			}
		},
		freqUp = function() {
			if (activeCell.y < rows - 1) {
				++activeCell.y;
			}
			updateKey(activeCell.y);
			drawScreen();
		},
		freqDown = function() {
			if (activeCell.y > 0) {
				--activeCell.y;
			}
			updateKey(activeCell.y);
			drawScreen();
		},
		chngNoteKind = function() {
			if (activeNote.id !== null) {
				notes[activeNote.id].kind = +this.value;
				drawScreen();
			}
		},
		resetUI = function(e = false) {
			if (!progress.isMoving && (!e.keyCode || e.keyCode == 27)) {
				activeNote.id = null;
				activeNote.data = null;
				keyUpBtn.disabled = true;
				keyDownBtn.disabled = true;
				delayLeftBtn.disabled = true;
				delayRghtBtn.disabled = true;
				swapBtns(delBtn,addBtn);
				drawScreen();
			}
		},
		addNote = function(e) {
			let nk = document.querySelector("#notekind");
			if (activeNote.id === null && !progress.isMoving && (!e.keyCode || e.keyCode == 13)) {
				notes.push(
					new note(Object.keys(freqs)[activeCell.y],+nk.value,activeCell.x)
				);
				let newNoteId = notes.length - 1;
				activeNote.id = newNoteId;
				activeNote.data = notes[newNoteId];
				keyUpBtn.disabled = false;
				keyDownBtn.disabled = false;
				delayLeftBtn.disabled = false;
				delayRghtBtn.disabled = false;
				swapBtns(addBtn,delBtn);
				drawScreen();
			}
		},
		deleteNote = function(e) {
			if (activeNote.id !== null && !progress.isMoving && (!e.keyCode || e.keyCode == 8)) {
				notes.splice(activeNote.id,1);
				resetUI();
			}
		},
		delAllNotes = function() {
			if (!progress.isMoving && notes.length > 0) {
				notes = [];
				resetUI();
			}
		},
		decDelay = function(e) {
			if (activeNote.id !== null && !progress.isMoving && (!e.keyCode || e.keyCode == 37)) {
				if (notes[activeNote.id].delay > 0) {
					notes[activeNote.id].delay -= activeNote.data.kind;

					if (notes[activeNote.id].delay * cellX < activeCell.x * cellX) {
						activeCell.x = notes[activeNote.id].delay;
					}
					drawScreen();
				}
			}
		},
		incDelay = function(e) {
			if (activeNote.id !== null && !progress.isMoving && (!e.keyCode || e.keyCode == 39)) {
				notes[activeNote.id].delay += activeNote.data.kind;
				
				if (notes[activeNote.id].delay * cellX >= (activeCell.x + 1) * cellX) {
					activeCell.x = notes[activeNote.id].delay;
				}
				drawScreen();
			}
		},
		playSeq = function() {
			let noteCt = notes.length - 1;
			
			if (noteCt >= 0) {
				let btns = document.querySelectorAll("button"),
					inpt = document.querySelector("input"),
					bps = tempo.value/60,
					slcts = document.querySelectorAll("select"),
					actx = new (window.AudioContext || window.webkitAudioContext)(),
					note = new seq(actx);
				
				// trigger all notes
				for (let s in notes) {
					/* notes are kept in order by user inclusion, 
					but this order will never affect when each are played */
					note.play(freqs[notes[s].freq],notes[s].kind/bps,notes[s].delay/bps);
				}
				
				// make temporary copy of notes to sort by greatest delay plus kind to get proper duration
				let sNotes = notes.slice(0);
				sNotes.sort(function(a,b){
					return (a.delay + a.kind) - (b.delay + b.kind);
				});
				progress.isMoving = true;
				progress.dur = (sNotes[noteCt].delay + sNotes[noteCt].kind)/bps;

				// prevent interruptions by user interacting with tools
				swapBtns(btns[0],btns[1]);
				for (let bctrl in btns) {
					if (bctrl > 1) {
						btns[bctrl].disabled = true;
					}
				}
				inpt.disabled = true;
				for (let sctrl in slcts) {
					if (sctrl < slcts.length) {
						slcts[sctrl].disabled = true;
					}
				}

				let seqEnd = function() {
						actx.close();
						swapBtns(btns[1],btns[0]);
					
						// allow user to play with tools again
						for (let bctrl in btns) {
							if (bctrl >= 2 && bctrl <= 5) {
								if (activeNote.data !== null) {
									btns[bctrl].disabled = false;
								}
							} else if (bctrl >= 6) {
								btns[bctrl].disabled = false;
							}
						}
						inpt.disabled = false;
						for (let sctrl in slcts) {
							if (sctrl < slcts.length) {
								slcts[sctrl].disabled = false;
							}
						}
					},
					to = setTimeout(seqEnd, progress.dur*1000),
					showPrgrss = function() {
						if (progress.isMoving) {
							requestAnimFrame(showPrgrss);
						} else {
							clearTimeout(to);
							seqEnd();
							canvas.addEventListener(cellEvent,drawScreen);
						}
						drawScreen();
					};
				showPrgrss();
				canvas.removeEventListener(cellEvent,drawScreen);
			}
		},
		stopSeq = function() {
			progress.isMoving = false;
			progress.value = 0;
		},
		unicorn = [
			// original sequence by Andrew Huang (https://www.youtube.com/user/songstowearpantsto)
			["a0",1,0], ["a1",1,0],
			["cs0",1,1], ["cs1",1,1], ["cs2",1,1],
			["e0",1,2], ["e1",1,2], ["e2",1,2],
			["a0",1,3], ["a1",1,3], ["a2",1,3], ["cs2",1,3],
			["d0",1,4], ["a1",0.5,4], ["d2",0.5,4], ["d3",0.5,4], ["d3",0.25,4.5],
			["d1",0.5,4.5], ["f2",0.5,4.5], ["f3",0.25,4.75],
			["g0",0.5,5], ["as1",0.5,5], ["g2",0.5,5], ["as2",0.5,5], ["g3",0.5,5],
			["a0",0.5,5.5], ["c2",0.5,5.5], ["f3",0.5,5.5], ["a3",0.5,5.5],
			["as0",0.5,6], ["as1",0.5,6], ["g2",0.5,6], ["d3",0.5,6], ["as3",0.5,6],
			["e2",0.5,6.5], ["g2",0.25,6.75],["as2",0.25,6.5], ["cs4",0.5,6.5],
			["d0",0.5,7], ["d1",0.5,7], ["d2",0.5,7], ["a2",0.5,7], ["f3",0.5,7], ["a3",0.5,7], ["d4",0.5,7],
			["as0",0.5,7.5], ["as2",0.5,7.5], ["e3",0.5,7.5], ["as3",0.25,7.75], ["cs4",0.25,7.5], ["e4",0.25,7.5], ["f4",0.25,7.75],
			["g0",0.5,8], ["d1",0.25,8], ["g1",0.25,8.25], ["d2",0.5,8], ["d3",0.5,8], ["d4",0.5,8], ["g4",0.5,8],
			["as0",0.5,8.5], ["as1",0.25,8.5], ["d2",0.25,8.75], ["g2",0.5,8.5], ["fs3",0.25,8.75], ["a3",0.25,8.5], ["fs4",0.5,8.5],
			["g0",0.5,9], ["g1",0.25,9.25], ["g2",0.25,9], ["as2",0.5,9], ["as2",0.25,9.5], ["d3",0.25,9.25], ["g3",0.25,9], ["fs4",0.25,9.25], ["a4",0.25,9],
			["d1",0.5,9.5], ["as1",0.25,9.5], ["d2",0.25,9.75], ["g3",0.5,9.5], ["as3",0.5,9.5], ["d4",0.25,9.75], ["g4",0.25,9.5], ["as4",0.25,9.75],
			["a0",0.5,10], ["a1",0.25,10.25], ["a2",0.25,10], ["g3",0.25,10.25], ["a3",0.25,10], ["cs4",0.25,10], ["a4",0.5,10], ["cs3",0.25,10.25], ["b4",0.25,10.25],
			["e1",0.5,10.5], ["cs2",0.25,10.5], ["g2",0.25,10.75], ["e3",0.25,10.5], ["cs4",0.25,10.5], ["e4",0.25,10.75], ["g4",0.25,10.5], ["cs5",0.25,10.5], ["e5",0.25,10.75],
			["cs1",0.5,11], ["a1",0.25,11], ["e2",0.25,11.25], ["e3",0.25,11.25], ["a3",0.25,11], ["cs4",0.25,11], ["a5",0.25,11], ["c6",0.25,11.25], ["cs6",0.25,11],
			["a0",0.5,11.5], ["a1",0.5,11.5], ["cs3",0.5,11.5], ["g3",0.5,11.5], ["g4",0.5,11.5], ["a4",0.5,11.5], ["cs5",0.5,11.5], ["e5",0.5,11.5], ["as5",0.25,11.75], ["b5",0.25,11.5],
			["as0",1,12], ["as1",1,12], ["f2",0.5,12], ["f3",0.5,12], ["d4",0.5,12], ["f4",0.5,12], ["as4",1,12], ["c5",0.5,12], ["d5",1,12], ["f5",0.5,12], ["f5",0.25,12.5], ["g5",0.25,12.25], ["a5",0.25,12],
			["e4",0.5,12.5], ["as4",0.25,13], ["g5",0.25,12.75],
			["f1",1,13], ["f4",0.5,13], ["f5",0.25,13.25],
			["g4",0.25,13.5], ["a4",0.25,13.75], ["c5",0.25,13.75], ["d5",0.25,13.5], ["e5",0.25,13.75],
			["d1",1,14], ["as4",0.5,14], ["e5",0.25,14.25], ["f5",0.25,14],
			["f4",0.5,14.5], ["a4",0.25,14.5], ["as4",0.25,14.75], ["d5",0.25,14.5],
			["cs1",1,15], ["g4",0.5,15], ["e5",0.25,15], ["f5",0.25,15.25],
			["a4",0.5,15.5], ["cs5",0.25,15.5], ["f5",0.25,15.75],
			["d1",0.5,16], ["f4",0.5,16], ["d5",0.25,16], ["f5",0.25,16.25],
			["a0",0.5,16.5], ["e4",0.25,16.75], ["a4",0.25,16.5], ["c5",0.25,16.5], ["f5",0.25,16.75],
			["d1",0.5,17], ["g3",0.25,17], ["gs3",0.25,17.25], ["f4",0.25,17], ["g4",0.25,17.25], ["as4",0.25,17], ["d5",0.25,17.25],
			["c1",0.25,17.5], ["f3",0.5,17.5], ["a3",0.5,17.5], ["f4",0.25,17.5], ["a4",0.25,17.75], ["d5",0.25,17.75], ["e5",0.25,17.5],
			["c1",1,18], ["e3",0.25,18], ["as3",0.25,18], ["e4",0.5,18], ["as4",0.25,18], ["cs5",0.25,18.25], ["e5",0.25,18],
			["e3",0.25,18.5], ["g3",0.5,18.5], ["as3",0.5,18.5], ["g4",0.5,18.5], ["c5",0.5,18.5], ["f5",0.25,18.5], ["fs5",0.25,18.75],
			["a0",0.25,19.25], ["cs1",0.25,19], ["e3",0.5,19], ["a3",0.25,19], ["e4",0.5,19], ["a4",0.25,19], ["c5",0.25,19.25], ["cs5",0.25,19], ["g5",0.25,19], ["gs5",0.25,19.25],
			["cs0",0.25,19.75], ["g0",0.25,19.5], ["f3",0.5,19.5], ["a3",0.5,19.5], ["f4",0.25,19.75], ["a4",0.25,19.75], ["as4",0.25,19.5], ["cs5",0.25,19.5], ["d5",0.25,19.75], ["a5",0.25,19.5], ["as5",0.25,19.75],
			["cs1",1,20], ["g3",0.5,20], ["e4",0.25,20], ["g4",0.25,20.25], ["as4",0.25,20], ["e5",0.25,20], ["f5",0.25,20.25], ["b5",0.25,20], ["c6",0.25,20.25],
			["g4",0.25,20.75], ["e4",0.25,20.5], ["as4",0.25,20.5], ["fs5",0.25,20.5], ["gs5",0.25,20.75], ["cs6",0.25,20.5], ["d6",0.25,20.75],
			["d1",0.25,21], ["f4",0.25,21], ["g4",0.25,21.25], ["a4",0.25,21], ["a5",0.25,21], ["as5",0.25,21.25], ["ds6",0.25,21], ["e6",0.25,21.25],
			["d1",0.25,21.5], ["f4",0.25,21.75], ["a4",0.25,21.5], ["b5",0.25,21.5], ["c6",0.25,21.75], ["f6",0.25,21.5], ["fs6",0.25,21.75],
			["d1",0.5,22], ["f4",0.25,22.25], ["g4",0.25,22], ["cs6",0.25,22], ["d6",0.25,22.25], ["g6",0.25,22], ["gs6",0.25,22.25],
			["cs1",0.25,22.5], ["d4",0.25,22.75], ["e4",0.25,22.5], ["ds6",0.25,22.5], ["f6",0.25,22.75], ["a6",0.25,22.5], ["as6",0.25,22.75],
			["cs1",0.5,23], ["cs4",0.25,23], ["c4",0.25,23.25], ["fs6",0.25,23], ["g6",0.25,23.25], ["b6",0.25,23], ["c7",0.25,23.25],
			["g1",0.5,23.5], ["as3",0.25,23.75], ["b3",0.25,23.5], ["a6",0.25,23.5], ["as6",0.25,23.75], ["cs7",0.25,23.5], ["d7",0.25,23.75],
			["c1",0.5,24], ["a3",0.5,24], ["b6",0.25,24], ["cs7",0.25,24.25], ["ds7",0.25,24],
			["as0",0.25,24.5], ["e1",0.25,24.75], ["g3",0.5,24.5], ["d7",0.25,24.5], ["ds7",0.25,24.75], ["e7",0.25,24.5], ["f7",0.25,24.75],
			["a0",0.25,25], ["g1",0.25,25.25], ["f3",0.25,25.25], ["e7",0.25,25], ["f7",0.25,25.25], ["fs7",0.25,25], ["g7",0.25,25.25],
			["g0",0.25,25.5], ["as0",0.25,25.75], ["cs3",0.25,25.75], ["e3",0.25,25.5], ["fs7",0.25,25.5], ["g7",0.25,25.75], ["gs7",0.25,25.5],
			["f0",0.25,26], ["f1",0.25,26.25], ["d3",0.5,26], ["a7",0.25,26],
			["e0",0.25,26.5], ["a0",0.25,26.75], ["c3",0.5,26.5],
			["d0",0.25,27], ["d1",0.25,27.25], ["c3",0.5,27],
			["d0",0.25,27.5], ["d1",0.25,27.75], ["as2",0.5,27.5],
			["d0",0.25,28], ["f0",0.25,28.25], ["a2",0.5,28],
			["d0",0.25,28.75], ["d1",0.25,28.5], ["g2",0.25,28.5], ["a2",0.25,28.75],
			["f0",0.25,29.25], ["c1",0.25,29], ["f2",0.25,29.25], ["g2",0.25,29],
			["e0",0.25,29.75], ["cs1",0.25,29.5], ["f2",0.25,29.75], ["g2",0.25,29.5],
			["g0",0.25,30.25], ["a0",0.25,30], ["a1",0.25,30], ["as1",0.25,30.25], ["e2",0.25,30], ["f2",0.25,30.25],
			["cs1",0.5,30.5], ["g1",0.25,30.5], ["as1",0.25,30.75], ["cs2",0.25,30.75], ["e2",0.25,30.5],
			["d1",0.5,31], ["a1",0.25,31], ["d2",0.5,31],
			["f1",0.1667,31.8333], ["a1",0.1667,31.6667], ["cs2",0.1667,31.5],
			["d1",0.1667,32]
		],
		loadSeq = function(seq) {
			if (!progress.isMoving) {
				notes = [];
				resetUI();
				for (let na in seq) {
					notes.push(new note(seq[na][0],seq[na][1],seq[na][2]));
				}
				drawScreen();
			}
		};
	
	drawScreen();
	updateKey(activeCell.y);
	
	/* Button and canvas functions */
	// play/pause
	playBtn.addEventListener("click",playSeq);
	document.querySelector("#stopseq").addEventListener("click",stopSeq);
	document.addEventListener("keydown",function(e) {
		if (e.keyCode == 80) {
			!progress.isMoving ? playSeq() : stopSeq();
		}
	});
	// tempo, time signature
	tempo.addEventListener("change",changeTempo);
	document.querySelector("#timesig").addEventListener("change",changeTimeSig);
	document.querySelector("#notekind").addEventListener("change",chngNoteKind);
	// adjust frequency
	keyUpBtn.addEventListener("click",freqUp);
	keyDownBtn.addEventListener("click",freqDown);
	// use arrows to move active cell
	document.addEventListener("keydown",moveSelectCell);
	// decrease delay
	delayLeftBtn.addEventListener("click",decDelay);
	document.addEventListener("keydown",decDelay);
	// increase delay
	delayRghtBtn.addEventListener("click",incDelay);
	document.addEventListener("keydown",incDelay);
	// add note
	addBtn.addEventListener("click",addNote);
	document.addEventListener("keydown",addNote);
	// delete note
	delBtn.addEventListener("click",deleteNote);
	document.addEventListener("keydown",deleteNote);
	// reset the UI to deselect atcive note
	document.addEventListener("keydown",resetUI);
	// clear notes
	delAllBtn.addEventListener("click",delAllNotes);
	// load unicorn
	document.querySelector("#loadunicorn").addEventListener("click",function(){
		loadSeq(unicorn);
	});
	canvas.addEventListener(cellEvent,drawScreen);

    }
}



</script>

<style lang="postcss">
.body{
    font: 1em "Hind", Helvetica, sans-serif;
    line-height: 1.5;
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
input, select {
	line-height: 1.5;
}
.button, input, select {
	border: 0;
	border-radius: 0.2em;
}
.button,
.button > span {
	display: block;
}
.button {
	background-color: #3c5aac;
	border: 0;
	color: #FFF;
	display: inline-block;
	font-size: 1.25em;
	min-width: 5.5em;
	overflow: hidden;
}
.button > span {
	line-height: 1.5;
	height: 2.5em;
    padding: 0.5em 0.75em;
}
.button:not(:disabled):hover > span,
.button:not(:disabled):focus > span {
    background: rgba(255,255,255,0.2);
}
.button:not(:disabled):active > span {
	background-color: rgba(0,0,0,0.4);
}
.button:not(:disabled):focus, span:focus {
	outline: 0;
}
label {
	display: inline-block;
	height: 3em;
	line-height: 3em;
}
.canvassheet {
	display: block;
}
form {
	background-color: #222;
	color: 	#AAAAAA;
	display: flex;
	height: 27em;
	align-items: center;
	align-content: flex-start;
	flex-wrap: wrap;
	padding: 0.75em 0.75em 0 0.75em;
	width: 100%;
	margin-left: 0px;
	margin-top: -20px;
}
main {
	display: flex;
	height: calc(100% - 27em);
	overflow-y: scroll;
}
input, select {
	height: 2.5em;
}
input[type=number] {
	padding-right: 0.25em;
	text-align: right;
	width: 3em;
}
button:disabled, input:disabled, select:disabled {
	opacity: 0.3;
}

/* Button styles */
.circle, .circle > span {
	border-radius: 50%;
}
.circle {
	min-width: 2em;
	width: 2.5em;
}
.pos {
	background-color: #3a3;
}
.neg {
	background-color: #c33;
}
.btn-group, .btn-group-vert {
	display: flex;
}
.btn-group button {
	min-width: 2.25em;
}
.btn-group button:first-of-type,
.btn-group button:first-of-type > span {
	border-radius: 0.2em 0 0 0.2em;
}
.btn-group button:first-of-type {
	border-right: 1px solid #25396e;
}
.btn-group button:last-of-type,
.btn-group button:last-of-type > span  {
	border-radius: 0 0.2em 0.2em 0;
}
.btn-group-vert button {
	display: block;
	min-width: 2.5em;
	height: 1.25em;
}
.btn-group-vert button:first-of-type,
.btn-group-vert button:first-of-type > span {
	border-radius: 0.2em 0.2em 0 0;
}
.btn-group-vert button:first-of-type {
	border-bottom: 1px solid #25396e;
}
.btn-group-vert button:last-of-type,
.btn-group-vert button:last-of-type > span  {
	border-radius: 0 0 0.2em 0.2em;
}

/* Button states */
.inactive {
	display: none;
}
.icon {
	display: block;
}
.play {
	border-top: 0.5em solid transparent;
	border-bottom: 0.5em solid transparent;
	border-left: 0.86em solid #fff;
	margin: 0.25em 0.125em;
	width: 0; 
	height: 0; 
}
.stop {
	background-color: #fff;
	margin: 0.375em 0.125em;
	width: 0.75em;
	height: 0.75em;
}
.up-arrow {
	border-left: 0.5em solid transparent;
	border-right: 0.5em solid transparent;
	border-bottom: 0.3em solid #fff;
	margin: 0;
	width: 0; 
	height: 0; 
}
.down-arrow {
	border-left: 0.5em solid transparent;
	border-right: 0.5em solid transparent;
	border-top: 0.3em solid #fff;
	margin: 0;
	width: 0; 
	height: 0; 
}
.left-arrow {
	border-top: 0.25em solid transparent;
	border-bottom: 0.25em solid transparent;
	border-right: 0.75em solid #fff;
	margin: 0.5em 0;
	width: 0; 
	height: 0; 
}
.right-arrow {
	border-top: 0.25em solid transparent;
	border-bottom: 0.25em solid transparent;
	border-left: 0.75em solid #fff;
	margin: 0.5em 0;
	width: 0; 
	height: 0; 
}

/* Other form parts */
.group {
	display: flex;
	align-items: center;
	margin: 0 0 0.75em 0;
}
.group > *:not(label) {
	margin-right: 0.75em;
}
.group label {
	margin-right: 0.375em;
}
.group:not(:first-of-type) select {
	width: 9em;
}
.note {
	background-color: #111;
	font-size: 1.5em;
	text-align: center;
	text-transform: uppercase;
	width: 6em;
}
.sep {
	box-shadow: 0 0 0 1px #fff;
	height: 2em;
	margin: 0.5em 0;
	opacity: 0.25;
}
@media screen and (min-width: 280px) {
	form {height: 23em;}
	main {height: calc(100% - 23em);}
}
@media screen and (min-width: 332px) {
	form {height: 20em;}
	main {height: calc(100% - 20em);}
}
@media screen and (min-width: 352px) {
	form {height: 16em;}
	main {height: calc(100% - 16em);}
}
@media screen and (min-width: 448px) {
	form {height: 12.5em;}
	main {height: calc(100% - 12.5em);}
}
@media screen and (min-width: 658px) {
	form {height: 8.5em;}
	main {height: calc(100% - 8.5em);}
}
@media screen and (min-width: 1224px) {
	form {height: 4.5em;}
	main {height: calc(100% - 4.5em);}
}
</style>