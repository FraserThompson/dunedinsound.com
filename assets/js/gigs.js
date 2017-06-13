var isotopeConfig = isotopeConfig || {};

var gigsInit = function() {

    var dividers = document.getElementsByClassName('divider');

    smoothScroll.init({
        selector: '.sidebar-link',
        speed: 500,
        selectorHeader: '.header',
        easing: 'easeInOutCubic',
        before: function() {
            blazy.destroy();
        },
        after: function() {
            blazy.revalidate();
        }
    });

    var year_els = document.getElementsByClassName('year');

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

            // If we were searching show the dividers again
            if (searching == 1){
                for (var i = 0; i < dividers.length; i++) {
                    dividers[i].style.display = "block";
                }
                searching = 0;
                blazy.revalidate();
            }

        } else {

            // If we're searching hide the dividers
            if (searching == 0) {
                for (var i = 0; i < dividers.length; i++) {
                    dividers[i].style.display = "none";
                }
                isotopeInit();
                searching = 1;
            }

            isotopeConfig.qsRegex = new RegExp( quicksearch.value, 'gi' );
            isotopeConfig.iso.arrange({ filter: isotopeConfig.filterFunction });
        }
    }

    isotopeConfig.quicksearch.addEventListener("keyup", isotopeConfig.debounce(isotopeConfig.searchHandler));

}
