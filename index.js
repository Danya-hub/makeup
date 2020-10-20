'use strict';

// --------- import of function ---------

import header from "./js/header.js";
import animateScroll from "./js/animateScroll.js";
import slider from "./js/slider.js";
import comments from "./js/comments.js";

// --------- call of function ---------

header();
animateScroll();
slider();
comments();

// --------- create variables ---------

const buttonScrollTop = document.querySelector('.buttonScrollTop');
const mainHeader = document.querySelector('header');
const copyHeader = document.querySelector('.copyHeader');

// --------- button for scroll to top ---------

window.addEventListener('scroll', () => {
    if (window.pageYOffset !== 0) {
        buttonScrollTop.classList.add('activeButton')
    } else {
        buttonScrollTop.classList.remove('activeButton')
    }

    if (window.pageYOffset >= mainHeader.offsetHeight) {
        copyHeader.classList.add('copyHeaderActive');
    } else {
        copyHeader.classList.remove('copyHeaderActive');
    }
})

// --------- The End ---------