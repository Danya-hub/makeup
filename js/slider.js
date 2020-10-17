function slider() {
    $(document).ready(function () {
        $('.slider').slick({
            arrows: false,
            dots: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            speed: 500,
            easing: 'ease',
            infinite: false,
            initialSlide: 0,
            draggable: false,
            swipe: true,
            touchMove: true,
            waitForAnimate: false,
            rows: 2,
            responsive: [
                {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                } 
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 1
                } 
            }
        ]
        });
    })
}

export default slider;