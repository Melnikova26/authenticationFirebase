

window.addEventListener("DOMContentLoaded", function(){
	const wrapper = document.querySelector('.wrapper__img'),
		  albumParent = document.querySelector('.main__items'),
		  parentSongList = document.querySelector('.aside__list'),
		  aside = document.querySelector('.aside'),
		  end = document.querySelector('.end'),
		  bar = document.querySelector('.bar'),
		  range = document.querySelector('.range'),
		  musicCurrentTime = document.querySelector('.start'),
		  musicDuration = document.querySelector('.end'),
		  mainAudio = document.querySelector('.main__audio');
	let fuckTime = 0;
	let isPausing =false;
	let source;


	async function fetchData() {
		return await fetch('https://database-52211-default-rtdb.firebaseio.com/albums.json')
		.then(response => response.json())
		.then(data => data)
		.catch(error => console.error(error));
	}

	albumParent.addEventListener('click', function(event){
		const target = event.target;
		const parent = target.closest('.main__item');
		mainAudio.pause();
		end.innerHTML = '';
		document.querySelector('.start').innerHTML = '00:00';
		bar.style.width = '0%';
		
		if(target && parent.hasAttribute('data-album')) {
			const attribute = parent.getAttribute('data-album');
			fetchData().then(data => {
				data.forEach(({img, title, artist, songs})=> {
					if (title === attribute){
						wrapper.style.backgroundImage = `url(${img})`;
						const header = document.createElement('div');
						header.classList.add("aside__header");
						header.innerHTML = `
							<div class="aside__picture">
								<img src=${img} alt=${title}>
							</div>
							<div class="aside__desc">
								<div class="aside__title">${title}</div>
								<div class="aside__text">${artist}</div>
								<div class="aside__ost">OST</div>
							</div>
						`;
						document.querySelector('.aside__header').remove();
						aside.prepend(header);
						
						parentSongList.innerHTML = '';
						songs.forEach(elem => {
							const element = document.createElement('li');
							element.classList.add("aside__item");
							element.innerHTML = `
									<div class="wave">
										<div class="wave1"></div>
										<div class="wave1"></div>
										<div class="wave1"></div>
										<div class="wave1"></div>
									</div>
									<div class="aside__num grey">${elem.id}</div>
									<div class="aside__song">${elem.title}</div>
									<div class="aside__singer grey">${elem.singer}</div>
									<div class="aside__total grey">${elem.duration}</div>`;
							parentSongList.appendChild(element);
						});

						const nums = document.querySelectorAll('.aside__num');
						const waves = document.querySelectorAll('.wave');

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
									mainAudio.currentTime = fuckTime;
									isPausing = false;
								}
								mainAudio.play();
								runWithAnimation('running');
								console.log(fuckTime);
								console.log(isPausing);
							});
						});

						waves.forEach((item, index) => {
							item.addEventListener('click', () => {
								source = mainAudio.src;
								item.style.visibility = 'hidden';
								document.querySelectorAll('.aside__num')[index].style.visibility = 'visible';
								mainAudio.currentTime = fuckTime;
								mainAudio.pause();
								let currentMin = Math.floor(fuckTime / 60);
								let currentSec = Math.floor(fuckTime % 60);
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
						
					};
				});
			});
		}
	});
	function runWithAnimation(pausePlay, element = '.wave1'){
		const animationItems = document.querySelectorAll(element);
		animationItems.forEach(item => {
			item.style.animationPlayState = pausePlay;
		})
	}

	mainAudio.addEventListener('timeupdate', (e) => {
		const currentTime = e.target.currentTime;
		fuckTime = currentTime;
		const duration = e.target.duration;
		let progressWidth = (currentTime / duration) * 100;
		bar.style.width = `${progressWidth}%`;
		mainAudio.addEventListener('loadeddata', () => {
			
			let audioDuration = mainAudio.duration;
			let totalMin = Math.floor(audioDuration / 60);
			let totalSec = Math.floor(audioDuration % 60);
			if(totalMin < 10){
				totalMin = `0${totalMin}`;
			}
			if(totalSec < 10){
				totalSec = `0${totalSec}`;
			}
			musicDuration.innerHTML = `${totalMin}:${totalSec}`;
		});	
		let currentMin = Math.floor(currentTime / 60);
		let currentSec = Math.floor(currentTime % 60);
		if(currentSec < 10){
			currentSec = `0${currentSec}`;
		}
		if(currentMin < 10){
			currentMin = `0${currentMin}`;
		}
		musicCurrentTime.innerHTML = `${currentMin}:${currentSec}`;
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
		console.log('pauzze');
		console.log(mainAudio.paused, 'пауза?');
	});

	function cards() {
		class AlbomCard {
			constructor(src, title, artist, parentSelector) {
				this.src = src;
				this.title = title;
				this.artist = artist;
				this.parent = document.querySelector(parentSelector);
			}
	
			render() {
				const element = document.createElement('div');
				element.classList.add("main__item");
				element.setAttribute('data-album', `${this.title}`);
	
				element.innerHTML = `
					<div class="main__picture">
                        <img src=${this.src} alt=${this.title}>
                    </div>
                    <div class="main__subheader">${this.title}</div>
                    <div class="main__text">${this.artist}</div>
				`;
				this.parent.append(element);
			}
		}
		
		fetchData().then(data => {
			data.forEach(({img, title, artist})=> {
				new AlbomCard(img, title, artist, '.main__items').render();
			});
		});
	
	}
	cards();

	// search

	const searchResults = document.querySelector('.header__results');
	fetchData().then(data => {
		data.forEach(({img, title, artist})=> {
			
		});
	});
	
});
