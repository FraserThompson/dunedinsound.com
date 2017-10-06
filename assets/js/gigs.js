var isotopeConfig = isotopeConfig || {};

var gigsInit = function() {

    var sidebar = document.getElementById('sorting-nav');
    var year_els = document.getElementsByClassName('year');
    var backToTop = document.getElementById('back-to-top');

    window.scroll = new SmoothScroll('.sidebar-link', {
        speed: 600,
        selectorHeader: '.header',
        easing: 'easeInOutCubic',
        before: function() {
            blazy.destroy();
        },
        after: function() {
            blazy.revalidate();
        }
    });

    window.addEventListener("scroll", function() {
        if ((document.documentElement.scrollTop || document.body.scrollTop) > 60){
            backToTop.classList.add('visible');
            sidebar.classList.add('scrolled');
        } else {
            backToTop.classList.remove('visible');
            sidebar.classList.remove('scrolled');
        }
    });

    gumshoe.init({
        selector: '.sidebar-link',
        selectorHeader: '.header',
        activeClass: 'active',
        offset: +10,
        scrollDelay: false,
        // this adds the highlight function to years we are in, it's pretty inefficent tho
        callback: function (el) {
            for (var i = 0; i < year_els.length; i++) {
                if (year_els[i].dataset.year == el.nav.dataset.year){
                    year_els[i].classList.add('year-active');
                } else {
                    year_els[i].classList.remove('year-active');
                }

            }
        } 
    });

    var isotopeInit = function() {

        if (!isotopeConfig.iso) {
            isotopeConfig.iso = new Isotope( '.sorted-tiles', {
                itemSelector: '.isotope-item',
                percentPosition: true,
                layoutMode: 'packery'
            });

            isotopeConfig.iso.on('arrangeComplete', function() {
                blazy.revalidate();
            });
        
        }

    }

    isotopeConfig.quicksearch = document.getElementById('quicksearch');

    var searching = 0;

    isotopeConfig.searchHandler = function() {

        if (quicksearch.value.trim() == "") {

            // Stop using isotope
            if ('iso' in isotopeConfig && isotopeConfig.iso != null) {
                isotopeConfig.iso.destroy();
                isotopeConfig.iso = null;
            }

            // If we were searching revalidate
            if (searching == 1){
                searching = 0;
                blazy.revalidate();
            }

        } else {

            // If we're searching init isotope
            if (searching == 0) {
                isotopeInit();
                searching = 1;
            }

            isotopeConfig.qsRegex = new RegExp( quicksearch.value, 'gi' );
            isotopeConfig.iso.arrange({ filter: isotopeConfig.filterFunction });
        }
    }

    isotopeConfig.quicksearch.addEventListener("keyup", isotopeConfig.debounce(isotopeConfig.searchHandler));

}
