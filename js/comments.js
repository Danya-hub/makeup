const comments = () => {
    const sliderImg = document.querySelectorAll('.slider-img');
    const bigImageWindow = document.querySelector('.bigImageWindow');
    const blackout = document.querySelector('.blackout');
    const closeButton = document.querySelector('.bigImageWindow-closeButton');
    const bigImage = document.querySelector('.bigImageWindow--imgProcedure-img');
    const bigImageComment = document.querySelector('.bigImageWindow--textWrapper-txt');
    const body = document.querySelector('body');

    const comment = [`Ламинирование ресниц + ботокс
    + окрашивание ресниц краской + моделирование
    бровей + окрашивание хной. Девочки, когда
    делаете комплекс у меня, процедуры дешевле
    чем делать отдельно. Буду рада вас видеть у
    меня на процедурах.`, `Процедура ламинирование и
    ботокс ресниц для клиентки с ресницами очень
    плотным и растущими вниз. Такие реснички
    будут вас радовать на протяжении 1-1,5 месяца.`, `dddddddddd`, `ffff`, `dgggg`, `eee`];

    const commentUnderImage = () => {
        for (let i = 0; i < sliderImg.length; i++) {
            sliderImg[i].setAttribute('x', i);
        }
    };

    commentUnderImage();      

    for (let i = 0; i < sliderImg.length; i++) {
        sliderImg[i].addEventListener('click', (e) => {
            if (!(bigImageWindow.classList.contains('bigImageWindowActive'))) {
                bigImageWindow.classList.add('bigImageWindowActive');
                blackout.classList.add('activeBlackout');
                
                body.style.cssText = `
                    overflow-y: hidden; 
                    overflow-x: unset;
                `;

                bigImage.src = e.target.src;
                bigImageComment.innerHTML = comment.find((arr, i) => i === Number(e.target.getAttribute('x')) ? arr : undefined);
            }
        })
    }
    
    closeButton.addEventListener('click', () => {
        bigImageWindow.classList.remove('bigImageWindowActive');
        blackout.classList.remove('activeBlackout');
        body.style.cssText = `
            overflow-y: unset; 
            overflow-x: hidden;
        `;
    })
}

export default comments;