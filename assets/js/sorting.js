var isotopeConfig = isotopeConfig || {};

isotopeConfig.sortingInit = function() {

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