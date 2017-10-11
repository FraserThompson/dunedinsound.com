var isotopeConfig = isotopeConfig || {};

isotopeConfig.searchingInit = function() {

  if (!isotopeConfig.iso) {
    
    isotopeConfig.iso = new Isotope( '.sorted-tiles', {
      itemSelector: '.isotope-item',
      percentPosition: true,
      layoutMode: 'packery'
    });

  }
  
  isotopeConfig.quicksearch = document.getElementById('quicksearch'); 

  isotopeConfig.searchHandler = function() {
    isotopeConfig.qsRegex = new RegExp( quicksearch.value, 'gi' );
    isotopeConfig.iso.arrange({ filter: isotopeConfig.filterFunction });
  }

  isotopeConfig.quicksearch.addEventListener("keyup", isotopeConfig.debounce(isotopeConfig.searchHandler));

  isotopeConfig.iso.arrange({ sortBy: 'name' });

}