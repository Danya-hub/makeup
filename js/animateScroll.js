// --------- function for scroll animate ---------

function animateScroll () {
    $(document).ready(function() {
        const header = $('#header');
        $('.buttonScrollTop').click(function() {
            $('html, body').animate({
                scrollTop: $(header).offset().top
            }, 300)
        })
    });
}

// --------- end function for scroll animate ---------

// --------- export scroll animate ---------

export default animateScroll;

// --------- The End ---------