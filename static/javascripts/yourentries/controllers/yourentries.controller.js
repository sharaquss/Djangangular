(function () {
  'use strict';

  angular
    .module('thinkster.yourentries.controllers')
    .controller('YourentriesController', YourentriesController);

  YourentriesController.$inject = ['$scope', 'Yourentries', 'Snackbar', 'Authentication'];


  function YourentriesController($scope, Yourentries, Snackbar, Authentication) {
    var vm = this;
    vm.yourcolumns = [];
    var hasLiked = false;
    activate();


    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf thinkster.entrys.controllers.entrysController
    */
    function activate() {
      $scope.$watchCollection(function () { return $scope.yourentries; }, render);
      $scope.$watch(function () { return $(window).width(); }, render);
    }


    $scope.deleteEntry = function() {
      var id = $scope.$parent.yourentry.id;
      Yourentries.destroy(id);
      Snackbar.error("DESTROYED" + $scope.id);
    };

    $scope.likeEntry = function() {
      var entry = $scope.$parent.yourentry;
      var acc = Authentication.getAuthenticatedAccount()
      if (!Authentication.isAuthenticated()) {
        Snackbar.error("log in to like");
      } else if (acc.id == entry.author.id) {
        Snackbar.error("can't like your own entry");
      } else {
        entry.likes += 1;
        Yourentries.update(entry, entry.id);
        Snackbar.show("UPDATED LIKES: " + entry.id);
      }
    };

    $scope.readEntry = function() {
      var entry = $scope.$parent.yourentry;
      entry.visits += 1;
      Yourentries.update(entry, entry.id);
      Snackbar.show("UPDATE VISITS: " + entry.id);
    };

    /**
    * @name calculateNumberOfColumns
    * @desc Calculate number of columns based on screen width
    * @returns {Number} The number of columns containing entrys
    * @memberOf thinkster.entrys.controllers.entrysControllers
    */
    function calculateNumberOfColumns() {
      var width = $(window).width();

      if (width >= 1200) {
        return 4;
      } else if (width >= 992){
        return 3;
      } else if (width >= 768){
        return 2;
      }
      return 1;

      // if (width >= 1200) {
      //     return 4;
      // } else if (width >= 992) {
      //   return 3;
      // } else if (width >= 768) {
      //   return 2;
      // }
      // // } else {
      //   return 1;
      // // }
      // // return 1;
    }


    /**
    * @name approximateShortestColumn
    * @desc An algorithm for approximating which column is shortest
    * @returns The index of the shortest column
    * @memberOf thinkster.entrys.controllers.entrysController
    */
    function approximateShortestColumn() {
      var scores = vm.yourcolumns.map(columnMapFn);

      return scores.indexOf(Math.min.apply(this, scores));


      /**
      * @name columnMapFn
      * @desc A map function for scoring column heights
      * @returns The approximately normalized height of a given column
      */
      function columnMapFn(column) {
        var lengths = column.map(function (element) {
          return element.content.length;
        });

        return lengths.reduce(sum, 0) * column.length;
      }


      /**
      * @name sum
      * @desc Sums two numbers
      * @params {Number} m The first number to be summed
      * @params {Number} n The second number to be summed
      * @returns The sum of two numbers
      */
      function sum(m, n) {
        return m + n;
      }
    }


    /**
    * @name render
    * @desc Renders entrys into columns of approximately equal height
    * @param {Array} current The current value of `vm.entrys`
    * @param {Array} original The value of `vm.entrys` before it was updated
    * @memberOf thinkster.entrys.controllers.entrysController
    */
    function render(current, original) {
      if (current !== original) {
        vm.yourcolumns = [];

        for (var i = 0; i < calculateNumberOfColumns(); ++i) {
          vm.yourcolumns.push([]);
        }

        for (var i = 0; i < current.length; ++i) {
          var column = approximateShortestColumn();

          vm.yourcolumns[column].push(current[i]);
        }
      }

    }
  }
})();