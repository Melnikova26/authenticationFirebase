import cards from './modules/cards';
import getResource from './services/services';
import { getHeader, getSongList } from './modules/aside';

window.addEventListener("DOMContentLoaded", async() => {
	const data = await getResource();
	console.log(data);
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

	function play(nums, waves, songs){
		nums.forEach((item, index) => {
			item.addEventListener('click', () => {
				nums.forEach(elem => {
					elem.style.visibility = 'visible';
				});
				waves.forEach(wave => {
					wave.style.visibility = 'hidden';
				});
				mainAudio.src = songs[index].src;
				console.log(mainAudio.src, songs[index].src, document.querySelectorAll('.wave')[index]);
				item.style.visibility = 'hidden';
				document.querySelectorAll('.wave')[index].style.visibility = 'visible';
				if(isPausing && mainAudio.src === source){
					mainAudio.currentTime = runningTime;
					isPausing = false;
				}
				mainAudio.play();
				runWithAnimation('running');
				console.log(runningTime);
				console.log(isPausing);
			});
		});
	}

	function pause(waves){
		waves.forEach((item, index) => {
			item.addEventListener('click', () => {
				source = mainAudio.src;
				item.style.visibility = 'hidden';
				document.querySelectorAll('.aside__num')[index].style.visibility = 'visible';
				mainAudio.currentTime = runningTime;
				mainAudio.pause();
				let currentMin = Math.floor(runningTime / 60);
				let currentSec = Math.floor(runningTime % 60);
				if(currentSec < 10){
					currentSec = `0${currentSec}`;
				}
				if(currentMin < 10){
					currentMin = `0${currentMin}`;
				}
				musicCurrentTime.innerHTML = `${currentMin}:${currentSec}`;
				isPausing = true;
				console.log(isPausing);
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
					const nums = document.querySelectorAll('.aside__num');
					const waves = document.querySelectorAll('.wave');

					play(nums, waves, songs);
					pause(waves);
					
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
		mainAudio.play();
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

