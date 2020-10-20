// --------- function of scroll animate ---------

function animateScroll() {
    $(document).ready(function () {
        const header = $('#header');
        $('.buttonScrollTop').click(function () {
            $('html, body').animate({
                scrollTop: $(header).offset().top
            }, 300)
        })
    });
}

// --------- end function of scroll animate ---------

// --------- export function of scroll animate ---------

export default animateScroll;

// --------- The End ---------