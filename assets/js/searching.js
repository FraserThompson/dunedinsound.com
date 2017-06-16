var isotopeConfig = isotopeConfig || {};

isotopeConfig.searchingInit = function() {

  if (!isotopeConfig.iso) {
    
    isotopeConfig.iso = new Isotope( '.sorted-tiles', {
      itemSelector: '.isotope-item',
      percentPosition: true,
      layoutMode: 'packery'
    });

  }

  isotopeConfig.iso.on( 'arrangeComplete', function() {
      blazy.revalidate();
  });
  
  isotopeConfig.quicksearch = document.getElementById('quicksearch'); 

  isotopeConfig.searchHandler = function() {
    isotopeConfig.qsRegex = new RegExp( quicksearch.value, 'gi' );
    isotopeConfig.iso.arrange({ filter: isotopeConfig.filterFunction });
    blazy.revalidate();
  }

  isotopeConfig.quicksearch.addEventListener("keyup", isotopeConfig.debounce(isotopeConfig.searchHandler));

  isotopeConfig.iso.arrange({ sortBy: 'name' });

}