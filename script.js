var Game = {
	setup: function(){
		var canvas = document.getElementsByClassName('screen-background')[0].getContext('2d'),
			element = document.getElementsByClassName('screen-elements')[0];
		Game.Obj.screenCanvas = canvas;
		Game.Obj.screenElements = element;
		Game.Screen.drawLoading();
		Game.buttonSetup();
	},
	buttonSetup: function(){
		Zepto(document).on('click','.btn-help', function(){
			Game.Show.helpModal();
		});

		Zepto(document).on('click','.btn-back', function(){
			Zepto('.help-screen').remove();
			Zepto('.credit-screen').remove();
			Zepto('.level-screen').remove();
		});

		Zepto(document).on('click','.btn-credits', function(){
			Game.Show.creditsModal();
		});

		Zepto(document).on('click','.btn-play', function(){
			Game.Show.levelModal();
		});

		Zepto(document).on('click','.btn-select-level', function(){
			Game.Show.levelModal();
		});

		Zepto(document).on('click','.btn-speech', function(){
			Game.Speech.toggleRecord();
		});

		Zepto(document).on('click','.btn-sound', function(){
			Game.Audio.toggleSound(Zepto(this));
		});

		Zepto(document).on('click','.btn-volume', function(){
			Game.Audio.toggleMusic(Zepto(this));
		});

		Zepto(document).on('click','.btn-back-to-game', function(){
			Zepto('.pause-screen').remove();
		});

		Zepto(document).on('click','.btn-menu', function(){
			Game.Audio.stopGame();
			Game.startSplash();
		});

		Zepto(document).on('click','.btn-pause', function(){
			Game.Show.pauseModal();
		});

		Zepto(document).on('click','div[class*="btn-"]', function(){
			Game.Audio.playClick();
		});
	},
	startSplash: function(){
		Game.Screen.drawSplash();
		Game.Show.splash();
	},
	startGame: function(level){
		Game.Screen.drawPlay();
		Game.Show.play();
		Game.Animal.setup();
		Game.Audio.updateButtons();
		Game.Speech.setup();
		Game.Audio.playGame();
	},
	win: function(atualAnimal){
		Game.Screen.drawPlayWin();
		Game.Screen.drawAnimal(atualAnimal + ' win');
		Zepto('.screen-elements').addClass('win');
		Game.Screen.drawWinParrot();
		Game.Audio.playWin();
		Game.Animal.atualKey++;
		setTimeout(Game.Animal.startRound,5000);
	},
	checkWin: function(speak){
		var text = "",
			timeout = 0,
			atualAnimal = Game.Animal.array[Game.Animal.atualKey];

		if(speak == atualAnimal){
			Game.win(atualAnimal);
		} else {
			timeout = 2000;
			text = "Vamos lá! Eu sei que você consegue! Tente mais uma vez!";
			Game.startParrotSpeak(text,timeout);
		}
	},
	startParrotSpeak: function(text,timeout){
		Game.Screen.drawPlayParrot();
		Game.Screen.drawTextbox(text);
		setTimeout(Game.Screen.stopDraw, timeout);
		setTimeout(Game.Screen.drawClearText,timeout);
		setTimeout(Game.Screen.drawIdleParrot, timeout);
	},
	startHelpParrotSpeak: function(timeout){
		Game.Screen.drawHelpParrot();
		setTimeout(Game.Screen.stopDraw, timeout);
	},
	Animal: {
		array: null,
		atualKey: null,
		setup: function(){
		/***********************************************************
		**                                                        **
		**      Aqui fica todos os animais que estão no Jogo      **
		**                                                        **
		***********************************************************/
			var animals = [];
			animals[0] = "girafa";
			animals[1] = "tubarão";
			animals[2] = "coruja";
			animals[3] = "canguru";

			Game.Animal.array = animals;
			Game.Animal.atualKey = 0;
			Game.Animal.startRound();
		},
		startRound: function(){
			var text = "",
				timeout = 0,
				key = Game.Animal.atualKey,
				animal = Game.Animal.array[key];

			if(key == Game.Animal.array.length){
				alert('FIM DO JOGO');
				window.location.reload();
				return false;
			} else if(key > 0){
				Game.Screen.drawPlay();
				Zepto('.screen-elements').removeClass('win');
				if(key == 1){
					timeout = 2000;
					text = "Esse tá fácil ein! Qual o nome dele?";
				} else if(key == 2){
					timeout = 2000;
					text = "Qual o nome desse bicho?";
				} else if(key == 3){
					timeout = 2000;
					text = "Hum.. esse aí tá difícil! Você sabe o nome dele?";
				}
			}
			timeout = 2000;
			text = "Olha lá! O primeiro bicho apareceu! Qual será o nome dele? Aposto que você sabe!";
			Game.Screen.drawAnimal(animal);
			Game.startParrotSpeak(text,timeout);
		}
	},
	Screen: {
		time: null,
		loop: null,
		parrot: null,
		textbox: null,
		stopDraw: function(){
			Game.Screen.loop = null;
		},
		drawLoading: function(){
			var loadBg = new Image(),
				loadArrow = new Image(),
				thisCanvas = Game.Obj.screenCanvas;

			thisCanvas.fillStyle = '#fff925';
			thisCanvas.fillRect(0,0,1024,600);
			loadBg.onload = function(){
				thisCanvas.drawImage(loadBg,0,0);
				loadArrow.onload = function(){
					Game.Obj.screenElements.appendChild(loadArrow);
					Game.Utils.insertMedia();
				};
				loadArrow.className = "load-arrow";
				loadArrow.src = '/zoologicodotico/img/loading-arrow.png';
			};
			loadBg.src = '/zoologicodotico/img/loading.png';
		},
		drawSplash: function(){
			var thisCanvas = Game.Obj.screenCanvas;
			thisCanvas.fillStyle = '#ffffff';
			thisCanvas.fillRect(0,0,1024,600);
			thisCanvas.drawImage(Game.Obj.imageBgs,0,0);
		},
		drawSplashParrot: function(){
			var thisCanvas = document.getElementsByClassName('splash-parrot')[0].getContext('2d');
			thisCanvas.drawImage(Game.Obj.imageSplash,0,-600);
			setTimeout(Game.Screen.drawSplashParrotBlink,5000);
		},
		drawSplashParrotBlink: function(){
			var thisCanvas = document.getElementsByClassName('splash-parrot')[0].getContext('2d');
			thisCanvas.drawImage(Game.Obj.imageSplash,0,0);
			setTimeout(Game.Screen.drawSplashParrot,200);
		},
		drawPlay: function(){
			var thisCanvas = Game.Obj.screenCanvas;
			thisCanvas.drawImage(Game.Obj.imageBgs,0,-610);
		},
		drawPlayWin: function(){
			var thisCanvas = Game.Obj.screenCanvas;
			thisCanvas.drawImage(Game.Obj.imageBgs,0,-1220);
		},
		drawAnimal: function(thisAnimal){
			var thisCanvas = document.getElementsByClassName('animal')[0].getContext('2d'),
				animalW = 500,
				animalH = 500,
				animalX = 0,
				animalY = 0;
				danimalW = 500,
				danimalH = 500,
				danimalX = 0,
				danimalY = 0;

			switch(thisAnimal){
				case 'girafa':
					animalW = 180;
					animalH = 344;
					animalX = 180;
					animalY = 430;
					danimalX = 150;
					danimalY = 60;
					break;
				case 'girafa win':
					animalW = 180;
					animalH = 344;
					animalX = 0;
					animalY = 430;
					danimalX = 150;
					danimalY = 60;
					Game.Screen.drawTextbox("É a GIRAFA! Você conseguiu! Parabéns!",4000);
					break;
				case 'coruja':
					animalW = 207;
					animalH = 242;
					animalX = 610;
					animalY = 240;
					danimalX = 150;
					danimalY = 160;
					break;
				case 'coruja win':
					animalW = 207;
					animalH = 242;
					animalX = 400;
					animalY = 240;
					danimalX = 150;
					danimalY = 160;
					Game.Screen.drawTextbox("É a CORUJA! Você conseguiu! Parabéns!",4000);
					break;
				case 'tubarão':
					animalW = 400;
					animalH = 212;
					animalX = 0;
					animalY = 215;
					danimalX = 40;
					danimalY = 160;
					break;
				case 'tubarão win':
					animalW = 400;
					animalH = 212;
					animalX = 0;
					animalY = 0;
					danimalX = 40;
					danimalY = 160;
					Game.Screen.drawTextbox("É o TUBARÃO! Você conseguiu! Parabéns!",4000);

					break;
				case 'canguru':
					animalW = 320;
					animalH = 237;
					animalX = 720;
					animalY = 0;
					danimalX = 100;
					danimalY = 210;
					break;
				case 'canguru win':
					animalW = 320;
					animalH = 237;
					animalX = 400;
					animalY = 0;
					danimalX = 100;
					danimalY = 210;
					Game.Screen.drawTextbox("É o CANGURU! Você conseguiu! Parabéns!",4000);

					break;
				default:
					break;
			}
			thisCanvas.clearRect(0,0,500,500);
			thisCanvas.drawImage(Game.Obj.imageAnimal,animalX,animalY,animalW,animalH,danimalX,danimalY,animalW,animalH);
		},
		drawHelpParrot: function(){
			var thisCanvas = document.getElementsByClassName('help-parrot')[0].getContext('2d');
			thisCanvas.drawImage(Game.Obj.imageParrot,0,0);
			Game.Screen.loop = 1;
			Game.Screen.time = Date.now();
			Game.Screen.parrot = thisCanvas;
			requestAnimationFrame(Game.Screen.reDrawHelpParrot);
		},
		reDrawHelpParrot: function(){
			if(Game.Screen.loop != null){
				var now = Date.now();
				var delta = now - Game.Screen.time;

			    delta = now - Game.Screen.time;

				if(delta > 100){
					switch(Game.Screen.loop){
						case 1:
						case 5:
						case 9:
						case 13:
						case 17:
							Game.Screen.parrot.drawImage(Game.Obj.imageParrot,0,0,220,256,0,0,220,256);
							break;

						case 2:
						case 6:
						case 10:
						case 14:
						case 18:
							Game.Screen.parrot.drawImage(Game.Obj.imageParrot,220,0,220,256,0,0,220,256);
							break;

						case 3:
						case 7:
						case 11:
						case 15:
						case 19:
							Game.Screen.parrot.drawImage(Game.Obj.imageParrot,440,0,220,256,0,0,220,256);
							break;

						case 4:
						case 8:
						case 12:
						case 16:
						case 20:
							Game.Screen.parrot.drawImage(Game.Obj.imageParrot,220,0,220,256,0,0,220,256);
							break;

						case 21:
							Game.Screen.parrot.drawImage(Game.Obj.imageParrot,660,0,220,256,0,0,220,256);
							break;

						default:
							Game.Screen.loop = 0;
							break;
					}
					Game.Screen.loop++;
					Game.Screen.time = now - (delta % 100);
				}
				requestAnimationFrame(Game.Screen.reDrawHelpParrot);
			}
		},
		drawPlayParrot: function(){
			Game.Screen.loop = 0;
			Game.Screen.time = Date.now();
			Game.Screen.parrot.clearRect(0,0,300,300);
			Game.Screen.parrot.drawImage(Game.Obj.imageParrot,440,260,220,256,10,0,220,256);
			Game.Screen.reDrawPlayParrot();
		},
		reDrawPlayParrot: function(){
			if(Game.Screen.loop != null){
				var now = Date.now();
				var delta = now - Game.Screen.time;

				delta = now - Game.Screen.time;

				if(delta > 100){
					switch(Game.Screen.loop){
						case 1:
						case 5:
						case 9:
						case 13:
						case 17:
							Game.Screen.parrot.drawImage(Game.Obj.imageParrot,0,260,220,256,10,0,220,256);
							break;

						case 2:
						case 6:
						case 10:
						case 14:
						case 18:
							Game.Screen.parrot.drawImage(Game.Obj.imageParrot,220,260,220,256,10,0,220,256);
							break;

						case 3:
						case 7:
						case 11:
						case 15:
						case 19:
							Game.Screen.parrot.drawImage(Game.Obj.imageParrot,440,260,220,256,10,0,220,256);
							break;

						case 4:
						case 8:
						case 12:
						case 16:
						case 20:
							Game.Screen.parrot.drawImage(Game.Obj.imageParrot,220,260,220,256,10,0,220,256);
							break;

						case 21:
							Game.Screen.parrot.drawImage(Game.Obj.imageParrot,660,260,220,256,10,0,220,256);
							break;

						default:
							Game.Screen.loop = 0;
							break;
					}
					Game.Screen.loop++;
					Game.Screen.time = now - (delta % 100);
				}
				requestAnimationFrame(Game.Screen.reDrawPlayParrot);
			}
		},
		drawIdleParrot: function(){
			Game.Screen.parrot.clearRect(0,0,300,300);
			Game.Screen.parrot.drawImage(Game.Obj.imageParrot,0,520,178,256,10,0,178,256);
		},
		drawWinParrot: function(){
			Game.Screen.parrot.clearRect(0,0,220,256);
			Game.Screen.parrot.drawImage(Game.Obj.imageParrot,360,520,280,256,0,0,280,256);
		},
		drawTextbox: function(text){
			Game.Screen.textbox.drawImage(Game.Obj.imageModal,650,500,663,125,0,0,663,125);
			Game.Screen.textbox.font = '22px Calibri';
      		Game.Screen.textbox.fillStyle = '#342c0e';
      		Game.Screen.textbox.fillText(text,55, 30);
		},
		drawClearText: function(){
			Game.Screen.textbox.clearRect(0,0,670,125);
		}
	},
	Show: {
		splash: function(){
			var thisView = Zepto(Game.Obj.screenElements),
				splashElements = '';

			thisView.empty();
			thisView.attr('class','screen-elements splash');
			splashElements = ''+
				'<div class="light"></div>'+
				'<canvas class="splash-parrot" width="823" height="570"></canvas>'+
				'<div class="controls">'+
					'<div class="btn-sound sprite-bt"></div>'+
					'<div class="btn-volume sprite-bt"></div>'+
				'</div>'+
				'<div class="buttons">'+
					'<div class="btn-play sprite-bt"></div>'+
					'<div class="btn-help sprite-bt"></div>'+
				'</div>'+
				'<div class="btn-credits sprite-bt"></div>';
			thisView.append(splashElements);
			Game.Screen.drawSplashParrot();
			Game.Audio.updateButtons();
			Game.Audio.playSplash();
		},
		play: function(animal){
			var thisView = Zepto(Game.Obj.screenElements),
				playScreen = '';

			thisView.empty();
			thisView.attr('class','screen-elements playing');
			playScreen = ''+
				'<div class="btn-pause sprite-bt"></div>'+
				'<div class="controls">'+
					'<div class="btn-sound sprite-bt"></div>'+
					'<div class="btn-volume sprite-bt"></div>'+
				'</div>'+
				'<canvas class="animal" width="500" height="500"></canvas>'+
				'<canvas class="play-parrot" width="280" height="225"></canvas>'+
				'<canvas class="textbox" width="665" height="125"></canvas>'+
				'<div class="btn-speech sprite-bt off"></div>'+
				'<div class="light"></div>';
			thisView.append(playScreen);
			Game.Screen.parrot = document.getElementsByClassName('play-parrot')[0].getContext('2d');
			Game.Screen.textbox = document.getElementsByClassName('textbox')[0].getContext('2d');
			Game.Screen.drawIdleParrot();
		},
		pauseModal: function(){
			var pauseScreen = ''+
				'<div class="pause-screen">'+
					'<div class="dialog sprite-modal">'+
						'<div class="btn-back-to-game sprite-bt"></div>'+
						'<div class="btn-select-level sprite-bt"></div>'+
						'<div class="btn-menu sprite-bt"></div>'+
					'</div>'+
				'</div>';
			Zepto('.screen-elements').append(pauseScreen);
		},
		creditsModal: function(){
			var creditScreen = ''+
				'<div class="credit-screen">'+
					'<div class="dialog sprite-modal">'+
						'<div class="btn-back sprite-bt"></div>'+
					'</div>'+
				'</div>';
			Zepto('.screen-elements').append(creditScreen);
		},
		helpModal: function(){
			var helpScreen = ''+
				'<div class="help-screen">'+
					'<div class="dialog sprite-modal"></div>'+
					'<canvas class="help-parrot" width="220" height="256"></canvas>'+
					'<div class="btn-back sprite-bt"></div>'+
				'</div>';
			Zepto('.screen-elements').append(helpScreen);
			Game.startHelpParrotSpeak(2000);
		},
		levelModal: function(){
			var levelScreen = ''+
				'<div class="level-screen">'+
					'<div class="dialog sprite-modal">'+
						'<div class="btn-level1 sprite-bt"></div>'+
						'<div class="btn-back sprite-bt"></div>'+
					'</div>'+
				'</div>';
			Zepto('.screen-elements').append(levelScreen);
			Zepto('.level-screen').on('click','.btn-level1', function(){
				Game.Audio.stopSplash();
				Game.startGame('level 1');
			});
		}
	},
	Utils: {
		toggleOff:function(element){
			if(element.hasClass('off')){
				element.removeClass('off');
			} else {
				element.addClass('off');
			}
		},
		insertMedia: function(){
			var mediaObjects = 0,
				audioWin = new Audio(),
				audioGame = new Audio(),
				audioClick = new Audio(),
				audioSplash = new Audio(),
				imageBgs = new Image(),
				imageModal = new Image(),
				imageSplash = new Image(),
				imageParrot = new Image(),
				imageAnimal = new Image(),
				imageButtons = new Image();

			audioWin.addEventListener('canplaythrough', function(){
				mediaObjects++;
				Game.Utils.isMediaLoaded(mediaObjects);
			});
			audioGame.addEventListener('canplaythrough', function(){
				mediaObjects++;
				Game.Utils.isMediaLoaded(mediaObjects);
			});
			audioClick.addEventListener('canplaythrough', function(){
				mediaObjects++;
				Game.Utils.isMediaLoaded(mediaObjects);
			});
			audioSplash.addEventListener('canplaythrough', function(){
				mediaObjects++;
				Game.Utils.isMediaLoaded(mediaObjects);
			});
			imageBgs.onload = function(){
				mediaObjects++;
				Game.Utils.isMediaLoaded(mediaObjects);
			};
			imageModal.onload = function(){
				mediaObjects++;
				Game.Utils.isMediaLoaded(mediaObjects);
			};
			imageParrot.onload = function(){
				mediaObjects++;
				Game.Utils.isMediaLoaded(mediaObjects);
			};
			imageAnimal.onload = function(){
				mediaObjects++;
				Game.Utils.isMediaLoaded(mediaObjects);
			};
			imageSplash.onload = function(){
				mediaObjects++;
				Game.Utils.isMediaLoaded(mediaObjects);
			};
			imageButtons.onload = function(){
				mediaObjects++;
				Game.Utils.isMediaLoaded(mediaObjects);
			};

			audioWin.src = '/zoologicodotico/audio/audio-victory.mp3';
			audioGame.src = '/zoologicodotico/audio/audio-game.mp3';
			audioClick.src = '/zoologicodotico/audio/audio-mouse-click.wav';
			audioSplash.src = '/zoologicodotico/audio/audio-splash.mp3';
			imageBgs.src = '/zoologicodotico/img/sprite-bg.png';
			imageModal.src = '/zoologicodotico/img/sprite-modal.png';
			imageParrot.src = '/zoologicodotico/img/sprite-parrot.png';
			imageAnimal.src = '/zoologicodotico/img/sprite-animal.png';
			imageSplash.src = '/zoologicodotico/img/sprite-splash.png';
			imageButtons.src = '/zoologicodotico/img/sprite-buttons.png';

			Game.Obj.audioWin = audioWin;
			Game.Obj.audioGame = audioGame;
			Game.Obj.audioClick = audioClick;
			Game.Obj.audioSplash = audioSplash;
			Game.Obj.imageBgs = imageBgs;
			Game.Obj.imageModal = imageModal;
			Game.Obj.imageParrot = imageParrot;
			Game.Obj.imageSplash = imageSplash;
			Game.Obj.imageAnimal = imageAnimal;
			Game.Obj.imageButtons = imageButtons;
		},
		isMediaLoaded: function(qtd){
			if(qtd == 10){
				Game.startSplash();
			}
		}
	},
	Speech: {
		result: '',
		recognition: null,
		recognizing: false,
		toggleRecord: function(){
			if (Game.Speech.recognizing) {
				Game.Speech.recognition.stop();
			} else {
				Game.Speech.recognition.start();
			}
		},
		setup: function(){
			if ('webkitSpeechRecognition' in window) {
				Game.Speech.recognizing = false;
				Game.Speech.recognition = new webkitSpeechRecognition();
				Game.Speech.recognition.lang = 'pt-BR';
				Game.Speech.recognition.continuous = false;
  				Game.Speech.recognition.interimResults = false;

				Game.Speech.recognition.onstart = function() {
					Game.Speech.recognizing = true;
					Zepto('.btn-speech').removeClass('off').addClass('on');
				};

				Game.Speech.recognition.onerror = function(event) {
					console.log('ERROR!',event);
					if (event.error == 'no-speech') {
					} else if (event.error == 'audio-capture') {
					} else if (event.error == 'not-allowed') {
					} else if (event.error == 'network') {
					}
				};

				Game.Speech.recognition.onend = function() {
					Game.Speech.recognizing = false;
					Game.Speech.result = '';
					Zepto('.btn-speech').removeClass('on').addClass('off');
				};

				Game.Speech.recognition.onresult = function(event) {
					Game.Speech.result = event.results[0][0].transcript;
					console.log('RESULT!',event);
					console.log('TEXTO: ' + Game.Speech.result);
					Game.checkWin(Game.Speech.result);
				};
			} else {
				alert('Você precisa do Google Chrome para jogar :/');
				Game.startSplash();
			}
		}
	},
	Audio: {
		sound: true,
		music: true,
		updateButtons: function(){
			var soundButton = Zepto('.btn-sound'),
				volumeButton = Zepto('.btn-volume');

			if(!Game.Audio.music){
				volumeButton.addClass('off');
			}

			if(!Game.Audio.sound){
				soundButton.addClass('off');
			}
		},
		toggleSound: function(element){
			thisView = Zepto(Game.Obj.screenElements);
			if(element.hasClass('off')){
				Game.Audio.sound = true;
				if(thisView.hasClass('splash')){
					Game.Obj.audioSplash.play();
				} else if(thisView.hasClass('playing')){
					Game.Obj.audioGame.play();	
				}
			} else {
				Game.Audio.sound = false;
				if(thisView.hasClass('splash')){
					Game.Obj.audioSplash.pause();
				} else if(thisView.hasClass('playing')){
					Game.Obj.audioGame.pause();	
				}
			}
			Game.Utils.toggleOff(element);
		},
		toggleMusic: function(element){
			if(element.hasClass('off')){
				Game.Audio.music = true;
			} else {
				Game.Audio.music = false;
				Game.Obj.audioWin.pause();
			}
			Game.Utils.toggleOff(element);
		},
		playSplash: function(){
			if(Game.Audio.sound){
				Game.Obj.audioSplash.play();
			}
		},
		stopSplash: function(){
			Game.Obj.audioSplash.pause();
			Game.Obj.audioSplash.currentTime = 0;
		},
		playGame: function(){
			if(Game.Audio.sound){
				Game.Obj.audioGame.play();
			}
		},
		stopGame: function(){
			Game.Obj.audioGame.pause();
			Game.Obj.audioGame.currentTime = 0;
		},
		playWin: function(){
			if(Game.Audio.music){
				Game.Obj.audioWin.play();
			}
		},
		playClick: function(){
			if(Game.Audio.music){
				Game.Obj.audioClick.play();
			}
		}
	},
	Obj: {
		screenCanvas: null,
		screenElements: null,
		audioWin: null,
		audioGame: null,
		audioClick: null,
		audioSplash: null,
		imageBgs: null,
		imageModal: null,
		imageParrot: null,
		imageAnimal: null,
		imageSplash: null,
		imageButtons: null
	}
}

Game.setup();
