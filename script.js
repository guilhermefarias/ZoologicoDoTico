var Game = {
	animal: null,
	setup: function(){
		//verificar se o loading foi carregado e então dá o insert media
		Game.insertMedia();
		//verificar se as midias foram carregadas e então dá o backToSplashScreen
		//setTimeout(Game.backToSplashScreen,2000);
		Game.backToSplashScreen();
		Game.buttonSetup();
	},
	backToSplashScreen: function(){
		var GameScreen = jQuery('.screen');
		GameScreen.empty();
		GameScreen.attr('class','screen splash sprite-all');
		Game.Show.splash();
		Game.Audio.playSplash();
		Game.Audio.setupButtons();
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
		'<div id="media" onload="Game.backToSplashScreen()">'+
			'<img id="sprite-all" src="img/sprite-all.png">'+
			'<img id="sprite-buttons" src="img/sprite-buttons.png">'+
			'<audio id="win-audio" src="audio/audio-victory.mp3"></audio>'+
			'<audio id="game-audio" src="audio/audio-game.mp3" loop></audio>'+
			'<audio id="click-audio" src="audio/audio-mouse-click.wav"></audio>'+
			'<audio id="splash-audio" src="audio/audio-splash.mp3" loop></audio>'+
		'</div>';
		jQuery('body').append(mediaObjects);
	},
	startGame: function(level){
		var GameScreen = jQuery('.screen');
		GameScreen.empty();
		GameScreen.attr('class','screen playing sprite-all');
		Game.Show.play(Game.getAnimal());
		Game.Speech.setup();
		Game.Audio.playGame();
		Game.Audio.setupButtons();
	},
	getAnimal: function(){
		// Aqui fica todos os animais que estão no Jogo
		// Essa função escolhe aleatoriamente algum animal
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
					//ninguem falou nada
					} else if (event.error == 'audio-capture') {
					//sem microfone
					} else if (event.error == 'not-allowed') {
					//nao permitido
					} else if (event.error == 'network') {
					//nao conseguiu se conectar a internet
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
		setupButtons: function(){
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
			var splashAudio = document.getElementById('splash-audio'),
				gameAudio = document.getElementById('game-audio');
			if(element.hasClass('off')){
				Game.Audio.sound = true;
				if(gameAudio){
					gameAudio.play();
				} else if(splashAudio){
					splashAudio.play();
				}
			} else {
				Game.Audio.sound = false;
				if(gameAudio){
					gameAudio.pause();
				} else if(splashAudio){
					splashAudio.pause();
				}
			}
			Game.Utils.toggleOff(element);
		},
		toggleMusic: function(element){
			var winAudio = document.getElementById('win-audio');
			if(element.hasClass('off')){
				Game.Audio.music = true;
			} else {
				Game.Audio.music = false;
				if(winAudio){
					winAudio.pause();
				}
			}
			Game.Utils.toggleOff(element);
		},
		playSplash: function(){
			if(Game.Audio.sound){
				document.getElementById('splash-audio').play();	
			}
		},
		playGame: function(){
			if(Game.Audio.sound){
				document.getElementById('game-audio').play();
			}
		},
		playWin: function(){
			if(Game.Audio.music){
				document.getElementById('win-audio').play();
			}
		},
		playClick: function(){
			if(Game.Audio.music){
				document.getElementById('click-audio').play();
			}
		}
	}
}

Game.setup();