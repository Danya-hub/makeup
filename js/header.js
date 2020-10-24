// --------- function of header ---------

const header = () => {

    // --------- create variables ---------

    const burgerMenuButton = document.querySelectorAll('.burgerMenuButton'); //button
    const windowNav = document.querySelector('.windowNav'); //div
    const blackout = document.querySelector('.blackout'); //div
    const body = document.querySelector('body'); //body
    const closeBurgerMenuButton = document.querySelector('.closeButton'); //button
    const windowNavListItemLinks = document.querySelectorAll('.windowNav-listItem-links'); //a && span
    const windowNavListServices = document.querySelector('.windowNav-listServices'); //ul

    // --------- listener of button ---------

    for (let i = 0; i < burgerMenuButton.length; i++) {
        burgerMenuButton[i].addEventListener('click', (e) => {
            e.preventDefault();
            burgerMenuButton[i].classList.add('activated');
            if (burgerMenuButton[i].classList.contains('activated')) {
                windowNav.style.transform = 'translateX(0%)';
                closeBurgerMenuButton.classList.add('activeCloseButton');
                blackout.classList.add('activeBlackout');
                body.style.cssText = `
                overflow-y: hidden;
                overflow-x: unset;
            `;

                if (closeBurgerMenuButton.classList.contains('activeCloseButton')) {
                    closeBurgerMenuButton.addEventListener('click', () => {
                        e.preventDefault();
                        closeBurgerMenuButton.classList.remove('activeCloseButton');
                        windowNav.style.transform = 'translateX(101%)';
                        blackout.classList.remove('activeBlackout');
                        burgerMenuButton[i].classList.remove('activated');
                        body.style.cssText = `
                        overflow-y: unset;
                        overflow-x: hidden;
                    `;
                    })

                    blackout.addEventListener('click', () => {
                        e.preventDefault();
                        closeBurgerMenuButton.classList.remove('activeCloseButton');
                        windowNav.style.transform = 'translateX(101%)';
                        blackout.classList.remove('activeBlackout');
                        burgerMenuButton[i].classList.remove('activated');
                        body.style.cssText = `
                        overflow-y: unset;
                        overflow-x: hidden;
                    `;
                    })
                }
            }
        })
    }

    // --------- arrow animate in the link ---------

    for (let i = 0; i < windowNavListItemLinks.length; i++) {
        windowNavListItemLinks[1].addEventListener('click', (e) => {
            e.preventDefault();
            windowNavListItemLinks[1].classList.toggle('rotateArrow');
            windowNavListServices.classList.toggle('activationListServices');
        })
    }
}

// --------- end function of header ---------

// --------- export function of header ---------

export default header;

// --------- The End ---------