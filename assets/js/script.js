
import { createUser, signInUser, getUser } from "./data";

window.addEventListener('DOMContentLoaded', () => {
    
    const header = document.querySelector('.main__header'),
        mainIn = document.querySelector('.main__in'),
        links = document.querySelectorAll('.main__link a'),
        mainUp = document.querySelector('.main__up'),
        btnIn = mainIn.querySelector('.sign-in'),
        inInputs = mainIn.querySelectorAll('input'),
        btnUp = mainUp.querySelector('.sign-up '),
        upInputs = mainUp.querySelectorAll('input'),
        modal = document.querySelector('.modal'),
        close = document.querySelector('.modal__close'),
        modalText = document.querySelector('.modal__text'),
        button = document.querySelector('.button'),
        usersList = document.querySelector('.users'),
        usersListBtn = document.querySelector('.users__btn');

    function modalOpen(text){
        modal.style.display = 'flex';
        modalText.textContent = text;
        close.addEventListener('click', function(){
            modal.style.display = 'none';
        });
    }

    function workWithUser(e, inputs, callback){
        e.preventDefault();
        const email = inputs[0].value;
        const password = inputs[1].value;
        inputs.forEach(item => item.value = '');
        callback(email, password, modalOpen);
    }

    function getData(){
        getUser(usersList);
        document.querySelector('.wrapper').style.display = 'none';
        modal.style.display = 'none';
        document.querySelector('.users__main').style.display = 'block';
    }

    links.forEach(link => {
        link.addEventListener('click', function() {
            if (link.textContent === 'Sign up'){
                header.textContent = 'Sign up';
                mainUp.style.display = 'block';
                mainIn.style.display = 'none';
            } else {
                header.textContent = 'Sign in';
                mainUp.style.display = 'none';
                mainIn.style.display = 'block';
            }
        });
    })

    btnUp.addEventListener('click', (e) => workWithUser(e, upInputs, createUser));
    btnIn.addEventListener('click', (e) => workWithUser(e, inInputs, signInUser));

    button.addEventListener('click', getData);
    usersListBtn.addEventListener('click', function(){
        document.querySelector('.wrapper').style.display = 'block';
        document.querySelector('.users__main').style.display = 'none';
    });










});