// --------- function of comments ---------

const comments = () => {

    // --------- create variables ---------

    const sliderImg = document.querySelectorAll('.slider-img');
    const bigImageWindow = document.querySelector('.bigImageWindow');
    const blackout = document.querySelector('.blackout');
    const closeButton = document.querySelector('.bigImageWindow-closeButton');
    const bigImage = document.querySelector('.bigImageWindow--imgProcedure-img');
    const bigImageComment = document.querySelector('.bigImageWindow--textWrapper-txt');
    const body = document.querySelector('body');

    // --------- array comments ---------

    const comment = [`Ламинирование ресниц + ботокс
    + окрашивание ресниц краской + моделирование
    бровей + окрашивание хной. Девочки, когда
    делаете комплекс у меня, процедуры дешевле
    чем делать отдельно. Буду рада вас видеть у
    меня на процедурах.`, `Процедура ламинирование и
    ботокс ресниц для клиентки с ресницами очень
    плотным и растущими вниз. Такие реснички
    будут вас радовать на протяжении 1-1,5 месяца.`, `Долговременная укладкабровей. Что входит в эту процедуру?
    <ul class="bigImageWindow-listProcedures">
        <li class="bigImageWindow-listProcedures-item">
            <span class="bigImageWindow-listProcedures-item-span">Укладка составами</span>
            </li>
        <li class="bigImageWindow-listProcedures-item">
            <span class="bigImageWindow-listProcedures-item-span">Коррекция бровей</span>
            </li>
            <li class="bigImageWindow-listProcedures-item">
            <span class="bigImageWindow-listProcedures-item-span">Окрашивание краской</span>
        </li>
        </ul>`, `ffff`, `dgggg`, `eee`];

    // --------- index for image ---------

    const commentUnderImage = () => {
        for (let i = 0; i < sliderImg.length; i++) {
            sliderImg[i].setAttribute('x', i);
        }
    };

    // --------- call of function ---------

    commentUnderImage();

    // --------- window of image ---------

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

    // --------- closing of window ---------

    closeButton.addEventListener('click', () => {
        bigImageWindow.classList.remove('bigImageWindowActive');
        blackout.classList.remove('activeBlackout');
        body.style.cssText = `
        overflow-y: unset; 
            overflow-x: hidden;
            `;
    })

    blackout.addEventListener('click', () => {
        bigImageWindow.classList.remove('bigImageWindowActive');
        blackout.classList.remove('activeBlackout');
        body.style.cssText = `
            overflow-y: unset; 
            overflow-x: hidden;
        `;
    })
}

// --------- end function of comments ---------

// --------- export function of comments ---------

export default comments;

// --------- The End ---------