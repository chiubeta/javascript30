var rhythm = [];
var recordStart = false;
var playStart = false;
var inputName = false;
var recordStartTime = 0;
var metronome = {};	//不能用陣列，因為要用 hash 的概念，一個 keycode 對應一個 setInterval 值
// var audioElement = document.querySelectorAll(`audio`);
// var keyElement = document.querySelectorAll(`.keys > div`);

//--------------------------------slider setting
$( ".slider" ).slider({
	min: 200,
  	max: 1500,
  	value: 500,
  	change: function( event, ui ) {
  		var keyCode = $(event.target).attr("data-key").valueOf();
  		var audio = document.querySelector(`audio[data-key="${keyCode}"]`);
		var key = document.querySelector(`div[data-key="${keyCode}"]`);

  		clearInterval(metronome[keyCode]);
		metronome[keyCode] = setInterval(function(){
			playsound(audio, key);
		}, ui.value);
  	}
});

//--------------------------------metronome clicking
$('.key').click(function(e) {
	var keyCode = $(e.currentTarget).attr("data-key").valueOf();
	
	if(!metronome[keyCode]){
		var audio = document.querySelector(`audio[data-key="${keyCode}"]`);
		var key = e.currentTarget;

		// setInterval 不會立刻執行，所以先補第一個上去
		playsound(audio, key);

		metronome[keyCode] = setInterval(function(){
			playsound(audio, key);
		}, 500);

		//show the slider
		document.querySelector(`.slider[data-key="${keyCode}"]`).style.visibility = 'visible';
	}
	else{
		clearInterval(metronome[keyCode]);
		metronome[keyCode] = null;

		//hide the slider
		document.querySelector(`.slider[data-key="${keyCode}"]`).style.visibility = 'hidden';
	}
});

//--------------------------------keyboard
$('body').keydown(function(e){
	if(inputName) return;	//打名字的時候不要觸發

	var audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
	var key = document.querySelector(`div[data-key="${e.keyCode}"]`);

	if(!audio && e.keyCode != 82 && e.keyCode != 80) return;	//濾掉無功用的按鍵

	//--------------------------------R: record start or stop
	if(e.keyCode == 82){	
		if(recordStart == false && playStart == false){ //代表是第一次按空白鍵
			rhythm = [];
			recordStartTime = getTimeStamp();
			recordStart = true;
			$('.recordbar').addClass('recording');
		}
		else if(recordStart == true && playStart == false){
			recordStart = false;
			$('.recordbar').removeClass('recording');
		}
		return;	//下面用來發出音效的部分就不用跑了
	}

	//--------------------------------P: play recorded rhythm
	if(e.keyCode == 80){
		//在錄音狀態 或 播放狀態 或 根本沒有錄 按 enter 視為無用
		if(recordStart == false && playStart == false && rhythm.length != 0){
			playStart = true;
			$('.recordbar').addClass('playListPlaying');
			
			//關閉所有 metronome
			for( key in metronome){
				clearInterval(metronome[key]);
				metronome[key] = null;
				document.querySelector(`.slider[data-key="${key}"]`).style.visibility = 'hidden';
			}

			playList = rhythm.slice();
			var Plength = playList.length;
			for(var i=0; i < Plength; i++){
				//經過 這次按 與 下一次按 的時間
				setTimeout(function(){
					var note = playList.shift();
					var recordAudio = document.querySelector(`audio[data-key="${note.keycode}"]`);
					var recordKey = document.querySelector(`div[data-key="${note.keycode}"]`);
					if(playList.length == 0) {
						playStart = false;
						setTimeout(function(){
							$('.recordbar').removeClass('playListPlaying')
						}, 200);
					}
					if(!recordAudio) return;

					playsound(recordAudio, recordKey);								
				}, playList[i].timestamp - recordStartTime);
			}
		}
		return;
	}
	playsound(audio, key);
});

function getTimeStamp(){
	return new Date().getTime();
}

function playsound(audio, key){
	//Record
	if(recordStart == true){
		var keycode = $(key).attr("data-key").valueOf();
		rhythm.push({keycode:keycode, timestamp:getTimeStamp()});
	}

	//sound
	key.classList.add('playing');
	audio.currentTime = 0;	//按到同一個音，不用等音效結束，就可以覆蓋過去
	audio.play();
	
	//remove sound
	setTimeout(function(){
		key.classList.remove('playing');
	},100);
}

(function(){
	loadButton();

	$( "#name" ).focusin(function() {
	  inputName = true;
	});
	$( "#name" ).focusout(function() {
	  inputName = false;
	});
}());

$("#upload").click(upload);


function read(id) {
	$.ajax({
		url: "php/readRhythm.php",
		type: "POST",
		data: {id: id},
		dataType: "json",
		success:function(result){
			rhythm = JSON.parse(result.rhythm);
			recordStartTime = result.recordTime.valueOf();
		}
	});
}
function loadButton() {
	$.ajax({
		url: "php/loadRhythm.php",
		type: "POST",
		success:function(result){
			$("#load").html(result);
			$("#load").prepend("點點看其他人的作品(載入之後按 <span class='em'>P</span>)<br>");
			$(".loadButton").click(function(e) {
				var id = $(e.target).attr("data-id").valueOf();
				read(id);
			});
		}
	});
}
function upload() {
	$.ajax({
		url: "php/newRhythm.php",
		type: "POST",
		data: { 
			name: $("#name").val(),
			rhythm: JSON.stringify(rhythm),
			recordTime: recordStartTime.toString()
		},
		success:function(result){
			$("#name").val("");
			loadButton();
		}
	});
}