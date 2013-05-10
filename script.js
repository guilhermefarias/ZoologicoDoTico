var Game = {
	splash: function() {
		jQuery(document).on('click','.btn-help', function(){
			Game.showHelp();
		});

		jQuery(document).on('click','.btn-back', function(){
			jQuery('.help-screen').remove();
			jQuery('.credit-screen').remove();
		});

		jQuery(document).on('click','.btn-credits', function(){
			Game.showCredits();
		});

		jQuery(document).on('click','.btn-play', function(){
			Game.selectLevel();
		});

		jQuery(document).on('click','.btn-select-level', function(){
			Game.selectLevel();
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
			Game.showPause();
		});

		Game.Audio.playSplash();
	},
	selectLevel: function(){
		var levelScreen = ''+
			'<div class="level-screen">'+
				'<div class="dialog">'+
					'<div class="btn-level1 sprite"></div>'+
				'</div>'+
			'</div>';
		jQuery('.screen').append(levelScreen);

		jQuery('.level-screen').on('click','.btn-level1', function(){
			Game.startGame('level 1');
		});
	},
	startGame: function(level){
		var GameScreen = jQuery('.screen');
		GameScreen.empty();
		GameScreen.attr('class','screen playing');
		Game.showPlay();
		console.log('Nível escolhido: ' + level);
	},
	backToSplashScreen: function(){
		var GameScreen = jQuery('.screen');
		GameScreen.empty();
		GameScreen.attr('class','screen splash');
		Game.showSplash();
	},
	showSplash: function(){
		var splashScreen = ''+
			'<div class="light"></div>'+
			'<div class="parrot"></div>'+
			'<div class="controls">'+
				'<div class="btn-sound sprite"></div>'+
				'<div class="btn-volume sprite"></div>'+
			'</div>'+
			'<div class="buttons">'+
				'<div class="btn-play sprite"></div>'+
				'<div class="btn-help sprite"></div>'+
			'</div>'+
			'<div class="btn-credits sprite"></div>'+
			'<audio id="splash-audio" src="audio/audio-splash.mp3" loop></audio>';
		jQuery('.screen').append(splashScreen);
		Game.Audio.playSplash();
		Game.Audio.setupButtons();
	},
	showPause: function(){
		var pauseScreen = ''+
			'<div class="pause-screen">'+
				'<div class="dialog">'+
					'<div class="btn-back-to-game sprite"></div>'+
					'<div class="btn-select-level sprite"></div>'+
					'<div class="btn-menu sprite"></div>'+
				'</div>'+
			'</div>';
		jQuery('.screen').append(pauseScreen);
	},
	showCredits: function(){
		var creditScreen = ''+
			'<div class="credit-screen">'+
				'<div class="dialog">'+
					'<div class="btn-back sprite"></div>'+
				'</div>'+
			'</div>';
		jQuery('.screen').append(creditScreen);
	},
	showHelp: function(){
		var helpScreen = ''+
			'<div class="help-screen">'+
				'<div class="dialog"></div>'+
				'<div class="help-parrot"></div>'+
				'<div class="btn-back sprite"></div>'+
			'</div>';
		jQuery('.screen').append(helpScreen);
	},
	showPlay: function(){
		var playScreen = ''+
			'<div class="btn-pause sprite"></div>'+
			'<div class="controls">'+
				'<div class="btn-sound sprite"></div>'+
				'<div class="btn-volume sprite"></div>'+
			'</div>'+
			'<div class="play-parrot"></div>'+
			'<div class="textbox"></div>'+
			'<div class="btn-speech sprite off"></div>'+
			'<audio id="game-audio" src="audio/audio-game.mp3" loop></audio>'+
			'<audio id="win-audio" src="audio/audio-victory.mp3"></audio>';
		jQuery('.playing').append(playScreen);
		Game.Speech.setup();
		Game.Audio.playGame();
		Game.Audio.setupButtons();
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
					if(Game.Speech.result == "girafa"){
						Game.Audio.playWin();
						alert('ACERTOU!');
					} else {
						alert('ERROU!');
					}
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
		}
	}
}

Game.splash();