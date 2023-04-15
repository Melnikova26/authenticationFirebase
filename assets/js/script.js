import cards from './modules/cards';
import getResource from './services/services';
import { getHeader, getSongList } from './modules/aside';

window.addEventListener("DOMContentLoaded", async() => {

	const data = await getResource();
	cards();
	const wrapper = document.querySelector('.wrapper__img'),
		  container = document.querySelector('.container'),
		  albumParent = document.querySelector('.main__items'),
		  parentSongList = document.querySelector('.aside__list'),
		  aside = document.querySelector('.aside'),
		  bar = document.querySelector('.bar'),
		  range = document.querySelector('.range'),
		  musicCurrentTime = document.querySelector('.start'),
		  musicDuration = document.querySelector('.end'),
		  mainAudio = document.querySelector('.main__audio');
	let runningTime = 0;
	let isPausing =false;
	let source = '';
	let indexCurrent = 0;
	const wave = `
			<div class="wave">
				<div class="wave1"></div>
				<div class="wave1"></div>
				<div class="wave1"></div>
				<div class="wave1"></div>
			</div>
		`;
	function numText(id) {
		return `<div class="aside__num grey">${id}</div>`;
	}


	function play(nums, songs){
		const plays = document.querySelectorAll('.play');
		const pauses = document.querySelectorAll('.pause');
		plays.forEach((item, index) => {
			item.addEventListener('click', (event) => {
				pauses.forEach(pause => {
					pause.style.visibility = 'hidden';
				});
				nums.forEach((num, i) => {
					num.innerHTML = numText(i + 1);
				});

				mainAudio.src = songs[index].src;
				item.style.visibility = 'hidden';
				pauses[index].style.visibility = 'visible';
				indexCurrent = index;
				nums[index].innerHTML = wave;
				if(isPausing && mainAudio.src === source){
					mainAudio.currentTime = runningTime;
					isPausing = false;
				}
				mainAudio.play();
				runWithAnimation('running');
			});
		});
	}

	function pause(songs, nums){
		const pauses = document.querySelectorAll('.pause');
		const plays = document.querySelectorAll('.play');
		pauses.forEach((item, index) => {
			item.addEventListener('click', () => {
				source = mainAudio.src;
				item.style.visibility = 'hidden';
				plays[index].style.visibility = 'visible';
				mainAudio.currentTime = runningTime;
				nums[index].innerHTML = numText(songs[index].id);
				mainAudio.pause();
				currentTotalTime(runningTime, musicCurrentTime)
				isPausing = true;
			});
		});
	}

	function currentTotalTime(targetTime, durationText){
		let min = Math.floor(targetTime / 60);
		let sec = Math.floor(targetTime % 60);
		if(min < 10){
			min = `0${min}`;
		}
		if(sec < 10){
			sec = `0${sec}`;
		}
		return durationText.innerHTML = `${min}:${sec}`;
	}

	function runWithAnimation(pausePlay, element = '.wave1'){
		const animationItems = document.querySelectorAll(element);
		animationItems.forEach(item => {
			item.style.animationPlayState = pausePlay;
		})
	}

	albumParent.addEventListener('click', function(event){
		albumParent.querySelectorAll('.main__picture').forEach(elem => {
			elem.classList.remove('active');
		});

		const target = event.target;
		const parent = target.closest('.main__item');
		mainAudio.pause();
		musicDuration.innerHTML = '';
		document.querySelector('.start').innerHTML = '00:00';
		bar.style.width = '0%';
		
		if(target && parent.hasAttribute('data-album')) {
			const attribute = parent.getAttribute('data-album');
			document.querySelector('.aside__header').remove();
			parentSongList.innerHTML = '';
			data.forEach(({img, title, artist, songs})=> {
				if (title === attribute){
					parent.querySelector('.main__picture').classList.add('active');
					wrapper.style.backgroundImage = `url(${img})`;
					getHeader(img, title, artist, aside);
					getSongList(songs, parentSongList);
					const songItems = document.querySelectorAll('.aside__item');

					songItems.forEach((item, i) => {
						item.addEventListener('mouseover', (e) => {
							const newItem = e.target.closest('.aside__item');
							if(item == newItem || item == newItem){
								const playPause = newItem.querySelector('.aside__play-pause');
								const play = newItem.querySelector('.play');
								const pause = newItem.querySelector('.pause');
								const pauses = document.querySelectorAll('.pause');
								const num = newItem.querySelector('.aside__num');
								playPause.style.visibility = 'visible';
								num.style.visibility = 'hidden';
								if(mainAudio.paused){
									play.style.visibility = 'visible';
								} else {
									if(pause === pauses[indexCurrent]){
										pauses[indexCurrent].style.visibility = 'visible';
									} else {
										pause.style.visibility = 'hidden';
										play.style.visibility = 'visible';
									}
									
								}
							}
						});
						item.addEventListener('mouseout', (e) => {
							if(item == e.target.closest('.aside__item') || item == e.target){
								const newItem = e.target.closest('.aside__item');
								const playPause = document.querySelectorAll('.aside__play-pause')[i];
								const play = document.querySelectorAll('.play')[i];
								const pauses = document.querySelectorAll('.pause');
								const num = newItem.querySelector('.aside__num');
								playPause.style.visibility = 'hidden';
								play.style.visibility = 'hidden';
								pauses.forEach(pause => {
									pause.style.visibility = 'hidden';
								})
								
								num.style.visibility= "visible";
							}
							
						});
					});
					const nums = document.querySelectorAll('.aside__num');
					play(nums, songs);
					pause(songs, nums);
					
				} 
			});
			
		}
	});

	mainAudio.addEventListener('timeupdate', (e) => {
		const currentTime = e.target.currentTime;
		const duration = e.target.duration;
		runningTime = currentTime;
		let progressWidth = (currentTime / duration) * 100;
		bar.style.width = `${progressWidth}%`;

		mainAudio.addEventListener('loadeddata', () => {
			let audioDuration = mainAudio.duration;
			currentTotalTime(audioDuration, musicDuration);
		});

		currentTotalTime(currentTime, musicCurrentTime);
	});

	range.addEventListener('click', (e) => {
		let barWidthVal = range.clientWidth;
		let clickedOffsetX = e.offsetX;
		let songDuration = mainAudio.duration;

		mainAudio.currentTime = (clickedOffsetX / barWidthVal) * songDuration;
		if(!mainAudio.paused){
			mainAudio.play();
		}
	});


	mainAudio.addEventListener('ended', () =>{
		runWithAnimation('paused');
	});

	mainAudio.addEventListener('pause', () =>{
		document.querySelector('.start').innerHTML = '00:00';
		bar.style.width = '0%';
	});

	// menu-burger

	const open = document.querySelector('.burger'),
		  exit = document.querySelector('.close');
	open.addEventListener('click', () => {
		open.style.display = 'none';
		container.style.display = 'block';
		exit.style.display = 'block';
	});
	exit.addEventListener('click', () => {
		open.style.display = 'block';
		container.style.display = 'none';
		exit.style.display = 'none';
	});

});

