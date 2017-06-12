var isotopeConfig = isotopeConfig || {};

var gigsInit = function() {

    var dividers = document.querySelectorAll('.divider');

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

    gumshoe.init({
        selector: '.sidebar-link',
        selectorHeader: '.header',
        activeClass: 'active',
        offset: +10,
        scrollDelay: false
    });

    var isotopeInit = function() {

        isotopeConfig.iso = new Isotope( '.sorted-tiles', {
            itemSelector: '.isotope-item',
            percentPosition: true,
            layoutMode: 'packery'
        });

        isotopeConfig.iso.on( 'arrangeComplete', function() {
            blazy.revalidate();
        });
    
    }

    isotopeConfig.quicksearch = document.getElementById('quicksearch'); 

    isotopeConfig.searchHandler = function() {

        if (quicksearch.value.trim() == "") {
            isotopeConfig.iso.destroy();
            dividers.forEach(function(el) {
                el.style.display = "block";
            });
            setTimeout(function() {
                blazy.revalidate();
            }, 500)
        } else {
            dividers.forEach(function(el) {
                el.style.display = "none";
            });
            isotopeInit();
            isotopeConfig.qsRegex = new RegExp( quicksearch.value, 'gi' );
            isotopeConfig.iso.arrange({ filter: isotopeConfig.filterFunction });
        }
    }

    isotopeConfig.quicksearch.addEventListener("keyup", isotopeConfig.debounce(isotopeConfig.searchHandler));

}
