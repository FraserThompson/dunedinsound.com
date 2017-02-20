var isotopeConfig = isotopeConfig || {};

isotopeConfig.searchingInit = function() {

  isotopeConfig.quicksearch = document.getElementById('quicksearch'); 

  isotopeConfig.searchHandler = function() {
    isotopeConfig.qsRegex = new RegExp( quicksearch.value, 'gi' );
    blazy.revalidate();
    isotopeConfig.iso.arrange({ filter: isotopeConfig.filterFunction });
  }

  isotopeConfig.quicksearch.addEventListener("keyup", isotopeConfig.debounce(isotopeConfig.searchHandler));

  isotopeConfig.iso.arrange({ sortBy: 'name' });

}