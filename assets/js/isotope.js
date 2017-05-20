var isotopeConfig = isotopeConfig || {};

isotopeConfig.isotopeInit = function() {

  isotopeConfig.qsRegex;

  isotopeConfig.iso = new Isotope( '.sorted-tiles', {
    itemSelector: '.tile-wrap',
    percentPosition: true,
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


  isotopeConfig.iso.on( 'arrangeComplete', function() {
      blazy.revalidate();
  });
  
  isotopeConfig.filterFunction = function (elem) {
    return isotopeConfig.qsRegex ? elem.querySelector('.name').innerHTML.match( isotopeConfig.qsRegex ) : true;
  }

  isotopeConfig.debounce = function( fn, threshold ) {
    var timeout;
    return function debounced() {
      if ( timeout ) {
        clearTimeout( timeout );
      }
      function delayed() {
        fn();
        timeout = null;
      }
      setTimeout( delayed, threshold || 100 );
    };
  }

}