'use strict';

// --------- import ---------

import header from "./js/header.js";
import animateScroll from "./js/animateScroll.js";
import slider from "./js/slider.js";
import comments from "./js/comments.js";

// --------- call of function ---------

header();
animateScroll();
slider();
comments();

// --------- buttonScrollTop ---------

const buttonScrollTop = document.querySelector('.buttonScrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset !== 0) {
        buttonScrollTop.classList.add('activeButton')
    } else {
        buttonScrollTop.classList.remove('activeButton')
    }
})

// --------- The End ---------