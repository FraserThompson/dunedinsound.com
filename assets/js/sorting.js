var isotopeConfig = isotopeConfig || {};

isotopeConfig.sortingInit = function() {

  if (!isotopeConfig.iso) {
    
    isotopeConfig.iso = new Isotope( '.sorted-tiles', {
      itemSelector: '.isotope-item',
      percentPosition: true,
      layoutMode: 'packery',
      getSortData: {
        name: '.name',
        date: function (elem) {
          return Date.parse(elem.querySelector('.date') ? elem.querySelector('.date').textContent : "");
        },
        numberOfGigs: function (elem) {
          return elem.querySelector('.numberOfGigs') ? parseInt(elem.querySelector('.numberOfGigs').textContent) : "";
        }
      },
      sortAscending: {
        name: true,
        date: false,
        numberOfGigs: false
      }
    });

  }

  
  isotopeConfig.sortByGroup = document.querySelector('.sort-by-button-group');
  isotopeConfig.sortByGroup.addEventListener( 'click', function( event ) {
    // only button clicks
    if ( !matchesSelector( event.target, '.btn' ) ) {
      return;
    }
    var sortValue = event.target.getAttribute('data-sort-value');
    isotopeConfig.iso.arrange({ sortBy: sortValue });
  });

}