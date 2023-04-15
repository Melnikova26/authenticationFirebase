function getHeader(img, title, artist, aside) {
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
    aside.prepend(header);
}

function getSongList(songs, parentSongList) {
    songs.forEach(elem => {
        const element = document.createElement('li');
        element.classList.add("aside__item");
        element.innerHTML = `
                <div class="aside__play-pause">
                    <img class="play" src='./assets/icons/play.svg' alt="icon">
                    <img class="pause" src='./assets/icons/pause.svg' alt="icon">
                </div>
                <div class="aside__num grey">${elem.id}</div>
                <div class="aside__song">${elem.title}</div>
                <div class="aside__singer grey">${elem.singer}</div>
                <div class="aside__total grey">${elem.duration}</div>`;
        parentSongList.appendChild(element);
    });
}
export {getHeader, getSongList};