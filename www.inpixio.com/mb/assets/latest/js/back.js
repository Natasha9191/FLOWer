$(document).ready(function () {
    (function ($) {
        $(function () {
            $('ul.tabs__caption').on('click', 'li:not(.act)', function () {
                $(this).addClass('act').siblings().removeClass('act').closest('div.tabs').find('div.tabs__content').removeClass('act').eq($(this).index()).addClass('act');
            });

        });
    })(jQuery);
    $('.testimals-car').owlCarousel({
        navText: ["<i class='icon-carrot'></i>", "<i class='icon-carrot'></i>"],
        smartSpeed: 1000,
        lazyLoad: true,
        loop: false,
        rewind: true,
        nav: false,
        dots: true,
        items: 1,
        margin: 30,
        stagePadding: 0,
        responsive: {
            1000: {
                dots: false,
                nav: true
            },
        }
    });
});
