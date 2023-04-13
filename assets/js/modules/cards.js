import getResource from '../services/services';
import search from './search';
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
    
    getResource()
    .then(data => {
        data.forEach(({img, title, artist})=> {
            new AlbomCard(img, title, artist, '.main__items').render();
        });
    }).then(() => {
        const items = document.querySelectorAll('.main__item');
        items[1].click();
        search('.main__item', 'hide', '.main__subheader', items);
    });

}

export default cards;