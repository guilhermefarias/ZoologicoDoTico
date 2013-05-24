var Game = {
	animal: null,
	setup: function(){
		Game.Audio.stopAll();
		Game.backToSplashScreen();
		Game.buttonSetup();
		Game.Audio.setLoop();
	},
	backToSplashScreen: function(){
		var GameScreen = jQuery('.screen');
		GameScreen.empty();
		GameScreen.attr('class','screen splash sprite-all');
		Game.Show.splash();
		Game.Audio.playSplash();
		Game.Audio.updateButtons();
	},
	buttonSetup: function(){
		jQuery(document).on('click','.btn-help', function(){
			Game.Show.helpModal();
		});

		jQuery(document).on('click','.btn-back', function(){
			jQuery('.help-screen').remove();
			jQuery('.credit-screen').remove();
			jQuery('.level-screen').remove();
		});

		jQuery(document).on('click','.btn-credits', function(){
			Game.Show.creditsModal();
		});

		jQuery(document).on('click','.btn-play', function(){
			Game.Show.levelModal();
		});

		jQuery(document).on('click','.btn-select-level', function(){
			Game.Show.levelModal();
		});

		jQuery(document).on('click','.btn-speech', function(){
			Game.Speech.toggleRecord();
		});

		jQuery(document).on('click','.btn-sound', function(){
			Game.Audio.toggleSound(jQuery(this));
		});

		jQuery(document).on('click','.btn-volume', function(){
			Game.Audio.toggleMusic(jQuery(this));
		});

		jQuery(document).on('click','.btn-back-to-game', function(){
			jQuery('.pause-screen').remove();
		});

		jQuery(document).on('click','.btn-menu', function(){
			Game.Audio.stopGame();
			Game.backToSplashScreen();
		});

		jQuery(document).on('click','.btn-pause', function(){
			Game.Show.pauseModal();
		});

		jQuery(document).on('click','div[class*="btn-"]', function(){
			Game.Audio.playClick();
		});
	},
	insertMedia: function(){
		var mediaObjects = ''+
		'<div id="media">'+
			'<img id="sprite-all" src="img/sprite-all.png"/>'+
			'<img id="sprite-buttons" src="img/sprite-buttons.png"/>'+
			'<audio id="win-audio" src="audio/audio-victory.mp3"></audio>'+
			'<audio id="game-audio" src="audio/audio-game.mp3"></audio>'+
			'<audio id="click-audio" src="audio/audio-mouse-click.wav"></audio>'+
			'<audio id="splash-audio" src="audio/audio-splash.mp3"></audio>'+
		'</div>';

		jQuery("body").append(mediaObjects);
		setTimeout(Game.setup,2000);
	},
	startGame: function(level){
		var GameScreen = jQuery('.screen');
		GameScreen.empty();
		GameScreen.attr('class','screen playing sprite-all');
		Game.Show.play(Game.getAnimal());
		Game.Speech.setup();
		Game.Audio.playGame();
		Game.Audio.updateButtons();
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
		jQuery('.screen').addClass('win');
	},
	checkWin: function(speak){
		if(speak == Game.animal){
			Game.win();
		} else {
			alert('QUE PENA, VOCÊ ERROU');
		}
	},
	Show: {
		splash: function(){
			var splashScreen = ''+
				'<div class="light "></div>'+
				'<div class="splash-parrot sprite-all"></div>'+
				'<div class="controls">'+
					'<div class="btn-sound sprite-bt"></div>'+
					'<div class="btn-volume sprite-bt"></div>'+
				'</div>'+
				'<div class="buttons">'+
					'<div class="btn-play sprite-bt"></div>'+
					'<div class="btn-help sprite-bt"></div>'+
				'</div>'+
				'<div class="btn-credits sprite-bt"></div>';
			jQuery('.screen').append(splashScreen);
		},
		play: function(animal){
			var playScreen = ''+
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
			jQuery('.playing').append(playScreen);
		},
		pauseModal: function(){
			var pauseScreen = ''+
				'<div class="pause-screen">'+
					'<div class="dialog sprite-all">'+
						'<div class="btn-back-to-game sprite-bt"></div>'+
						'<div class="btn-select-level sprite-bt"></div>'+
						'<div class="btn-menu sprite-bt"></div>'+
					'</div>'+
				'</div>';
			jQuery('.screen').append(pauseScreen);
		},
		creditsModal: function(){
			var creditScreen = ''+
				'<div class="credit-screen">'+
					'<div class="dialog sprite-all">'+
						'<div class="btn-back sprite-bt"></div>'+
					'</div>'+
				'</div>';
			jQuery('.screen').append(creditScreen);
		},
		helpModal: function(){
			var helpScreen = ''+
				'<div class="help-screen">'+
					'<div class="dialog sprite-all"></div>'+
					'<div class="help-parrot sprite-all"></div>'+
					'<div class="btn-back sprite-bt"></div>'+
				'</div>';
			jQuery('.screen').append(helpScreen);
		},
		levelModal: function(){
			var levelScreen = ''+
				'<div class="level-screen">'+
					'<div class="dialog sprite-all">'+
						'<div class="btn-level1 sprite-bt"></div>'+
						'<div class="btn-back sprite-bt"></div>'+
					'</div>'+
				'</div>';
			jQuery('.screen').append(levelScreen);
			jQuery('.level-screen').on('click','.btn-level1', function(){
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
					jQuery('.btn-speech').removeClass('off').addClass('on');
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
					jQuery('.btn-speech').removeClass('on').addClass('off');
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
		Obj: {
			splash: null,
			game: null,
			win: null,
			click: null
		},
		stopAll: function(){
			Game.Audio.Obj.splash = document.getElementById('splash-audio');
			Game.Audio.Obj.game = document.getElementById('game-audio');
			Game.Audio.Obj.win = document.getElementById('win-audio');
			Game.Audio.Obj.click = document.getElementById('click-audio');

			Game.Audio.Obj.splash.pause();
			Game.Audio.Obj.game.pause();
			Game.Audio.Obj.win.pause();
			Game.Audio.Obj.click.pause();
		},
		updateButtons: function(){
			var soundButton = jQuery('.btn-sound'),
				volumeButton = jQuery('.btn-volume');

			if(!Game.Audio.music){
				volumeButton.addClass('off');
			}

			if(!Game.Audio.sound){
				soundButton.addClass('off');
			}
		},
		toggleSound: function(element){
			var screenObj = jQuery('.screen');
			if(element.hasClass('off')){
				Game.Audio.sound = true;
				if(screenObj.hasClass('splash')){
					Game.Audio.Obj.splash.play();
				} else if(screenObj.hasClass('playing')){
					Game.Audio.Obj.game.play();	
				}
			} else {
				Game.Audio.sound = false;
				if(screenObj.hasClass('splash')){
					Game.Audio.Obj.splash.pause();
				} else if(screenObj.hasClass('playing')){
					Game.Audio.Obj.game.pause();	
				}
			}
			Game.Utils.toggleOff(element);
		},
		toggleMusic: function(element){
			if(element.hasClass('off')){
				Game.Audio.music = true;
			} else {
				Game.Audio.music = false;
				Game.Audio.Obj.win.pause();
			}
			Game.Utils.toggleOff(element);
		},
		setLoop: function(){
			Game.Audio.Obj.splash.loop = true;
			Game.Audio.Obj.game.loop = true;
		},
		playSplash: function(){
			if(Game.Audio.sound){
				Game.Audio.Obj.splash.play();
			}
		},
		stopSplash: function(){
			Game.Audio.Obj.splash.pause();
			Game.Audio.Obj.splash.currentTime = 0;
		},
		playGame: function(){
			if(Game.Audio.sound){
				Game.Audio.Obj.game.play();
			}
		},
		stopGame: function(){
			Game.Audio.Obj.game.pause();
			Game.Audio.Obj.game.currentTime = 0;
		},
		playWin: function(){
			if(Game.Audio.music){
				Game.Audio.Obj.win.play();
			}
		},
		playClick: function(){
			if(Game.Audio.music){
				Game.Audio.Obj.click.play();
			}
		}
	}
}

Game.insertMedia();