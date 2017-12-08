var isotopeConfig = isotopeConfig || {};

var gigsInit = function() {

    var sidebar = document.getElementById('sorting-nav');
    var year_els = document.getElementsByClassName('year');
    var backToTop = document.getElementById('back-to-top');

    window.scroll = new SmoothScroll('.sidebar-link', {
        speed: 600,
        selectorHeader: '.header',
        easing: 'easeInOutCubic'
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
                if (year_els[i].dataset.year == el.target.dataset.year){
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
                layoutMode: 'fitRows',
                getSortData: {
                    name: '.name',
                    month: '[data-month]',
                    year: '[data-year]'
                },
            });
        
        }

        // Remove years which aren't in search results
        isotopeConfig.iso.on('layoutComplete', function(results) {

            var years = [];
            var months = [];

            // Iterate results to get months/years from them
            results.forEach(function(thing) {
                var year = thing.sortData.year;
                var month = thing.sortData.month

                if (years.indexOf(year) < 0) years.push(year);
                if (months.indexOf(month) < 0) months.push(month);
            });

            // Hide all the years in the nav which aren't in results
            var year_els = document.getElementsByClassName('year');
            for (var i = 0; i < year_els.length; i++) {

                var thing = year_els[i];

                if (years.indexOf(thing.dataset.year) >= 0){
                    thing.style.display = "block";
                } else {
                    thing.style.display = "none";
                }
            }
            gumshoe.setDistances();

        });
    }

    isotopeConfig.quicksearch = document.getElementById('quicksearch');

    var searching = 0;

    isotopeConfig.searchHandler = function() {

        // blanking the search
        if (quicksearch.value.trim() == "") {

            // Show all the years again
            var year_els = document.getElementsByClassName('year');
            for (var i = 0; i < year_els.length; i++) {
                year_els[i].style.display = "block";
            }

            // Stop using isotope
            if ('iso' in isotopeConfig && isotopeConfig.iso != null) {
                isotopeConfig.iso.destroy();
                isotopeConfig.iso = null;
            }
            gumshoe.setDistances();
            // If we were searching revalidate
            if (searching == 1) searching = 0;

        // actually searching something
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
