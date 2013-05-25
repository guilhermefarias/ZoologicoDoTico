var Game = {
	animal: null,
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
			Game.backToSplashScreen();
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
		console.log(level);
		/*var GameScreen = Zepto('.screen');
		GameScreen.empty();
		GameScreen.attr('class','screen playing sprite-all');
		Game.Show.play(Game.getAnimal());
		Game.Speech.setup();
		Game.Audio.playGame();
		Game.Audio.updateButtons();*/
	},
	getAnimal: function(){
		/***********************************************************
		**                                                        **
		**      Aqui fica todos os animais que estão no Jogo      **
		**    Essa função escolhe aleatoriamente algum animal     **
		**                                                        **
		***********************************************************/
		var animals = [],
			animalsBr = [],
			randomKey = null;
		
		animals[0] = "giraffe";
		animals[1] = "shark";
		animals[2] = "owl";
		animals[3] = "kangaroo";

		animalsBr[0] = "girafa";
		animalsBr[1] = "tubarão";
		animalsBr[2] = "coruja";
		animalsBr[3] = "canguru";

		randomKey = Math.floor(Math.random()*animals.length);
		Game.animal = animalsBr[randomKey];
		return animals[randomKey];
	},
	win: function(){
		Game.Audio.playWin();
		Zepto('.screen').addClass('win');
	},
	checkWin: function(speak){
		if(speak == Game.animal){
			Game.win();
		} else {
			alert('QUE PENA, VOCÊ ERROU');
		}
	},
	Screen: {
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

			playScreen = ''+
				'<div class="btn-pause sprite-bt"></div>'+
				'<div class="controls">'+
					'<div class="btn-sound sprite-bt"></div>'+
					'<div class="btn-volume sprite-bt"></div>'+
				'</div>'+
				'<div class="animal '+ animal +'"></div>'+
				'<div class="play-parrot sprite-all"></div>'+
				'<div class="textbox sprite-all"></div>'+
				'<div class="btn-speech sprite-bt off"></div>'+
				'<div class="light"></div>';
			thisView.append(playScreen);
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
					'<div class="help-parrot sprite-all"></div>'+
					'<div class="btn-back sprite-bt"></div>'+
				'</div>';
			Zepto('.screen-elements').append(helpScreen);
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
			imageModal.src = '/zoologicodotico/img/sprite-splash.png';
			imageSplash.src = '/zoologicodotico/img/sprite-splash.png';
			imageButtons.src = '/zoologicodotico/img/sprite-buttons.png';

			Game.Obj.audioWin = audioWin;
			Game.Obj.audioGame = audioGame;
			Game.Obj.audioClick = audioClick;
			Game.Obj.audioSplash = audioSplash;
			Game.Obj.imageBgs = imageBgs;
			Game.Obj.imageModal = imageModal;
			Game.Obj.imageSplash = imageSplash;
			Game.Obj.imageButtons = imageButtons;
		},
		isMediaLoaded: function(qtd){
			if(qtd == 7){
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
					console.log('START!');
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
					console.log('END!');
				};

				Game.Speech.recognition.onresult = function(event) {
					Game.Speech.result = event.results[0][0].transcript;
					console.log('RESULT!',event);
					console.log('TEXTO: ' + Game.Speech.result);
					Game.checkWin(Game.Speech.result);
				};
			} else {
				alert('Você precisa do Google Chrome para jogar :/');
				Game.backToSplashScreen();
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
				} else if(screenObj.hasClass('playing')){
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
		imageSplash: null,
		imageButtons: null
	}
}

Game.setup();
