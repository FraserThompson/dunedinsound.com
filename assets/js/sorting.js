var sortingInit = function() {

  var qsRegex;
  var quicksearch = document.getElementById('quicksearch'); 

  var iso = new Isotope( '.sorted-tiles', {
    itemSelector: '.tile-wrap',
    percentPosition: true,
    getSortData: {
      name: '.name',
     date: function (elem) {
          return Date.parse(elem.querySelector('.date').textContent);
      }
    },
    sortAscending: {
      name: true,
      date: false
    }
  });

  var filterFunction = function (elem) {
    return qsRegex ? elem.querySelector('.name').innerHTML.match( qsRegex ) : true;
  }

  var searchHandler = function() {
    qsRegex = new RegExp( quicksearch.value, 'gi' );
    blazy.revalidate();
    iso.arrange({ filter: filterFunction });
  }

  quicksearch.addEventListener("keyup", debounce(searchHandler));

  // bind sort button click
  var sortByGroup = document.querySelector('.sort-by-button-group');
  sortByGroup.addEventListener( 'click', function( event ) {
    // only button clicks
    if ( !matchesSelector( event.target, '.btn' ) ) {
      return;
    }
    var sortValue = event.target.getAttribute('data-sort-value');
    iso.arrange({ sortBy: sortValue });
    setTimeout(function() {
      blazy.revalidate();
    }, 500);    
  });

  iso.arrange({ sortBy: 'name' });

    // debounce so filtering doesn't happen every millisecond
  function debounce( fn, threshold ) {
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