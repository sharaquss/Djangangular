(function () {
    'use strict';

    angular
        .module('thinkster.entries.services')
        .factory('Entries', Entries);

    Entries.$inject = ['$http'];

    function Entries($http) {
        var Entries = {
            all: all,
            create: create,
            get: get,
            update: update
        };
        return Entries;


        function all() {
            return $http.get('/api/v1/entries/');
        }

        function create(content, title) {
            return $http.post('/api/v1/entries/', {
                content: content,
                title: title
            });
        }

        function get(username) {
            return $http.get('/api/v1/accounts/' + username + '/entries/');
        }

        function update(post, id) {
            return $http.put('/api/v1/entries/' + id + "/", post);
        }

    }

})();