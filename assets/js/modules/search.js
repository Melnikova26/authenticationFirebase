function search(card, selector, mainSubHeader, items) {
    const input = document.querySelector('.header__search');
    const regEx = /^\s+|\s+(?=\s)|\s+$/g;
    input.addEventListener('keydown', (e) => {
        if (e.keyCode === 13){
            const value = input.value.replace(regEx, '').toUpperCase();
            if (value != ''){
                items.forEach(item => {
                    const title = item.querySelector(mainSubHeader);
                    if(title.innerText.toUpperCase().search(value) === -1) {
                        item.classList.add(selector)
                    } else {
                        item.classList.remove(selector);
                    }  
                });
                const showItems = document.querySelectorAll(`${card}:not(.${selector})`);
                showItems[0].click();
            } else {
                items.forEach(item => {
                    item.classList.remove(selector);
                });
                document.querySelectorAll(card)[1].click();
            }
        }
    });
}

export default search;