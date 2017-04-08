(function () {
    'use strict';

    var pdpConfigService = function () {
        var service = {
            useFakeRestSystems: true,
            //When using proxy in ionic.project
            //serviceUrl: "http://localhost:8100/api"
            serviceUrl: "http://localhost:44945/api"
        };
        return service;
    };

    var pdpFakeRestSystemsService = function ($http) {
        function getSystems(serviceUrl, bizType) {
            var fakeSystems;
            fakeSystems = ["pdp.cpr.system.tester.local", "pdp.cpr.system.sif.local", "pdp.cpr.system.sif.itest", "pdp.cpr.system.sif.stest"];
            return fakeSystems;
        }
        var service = {
            getSystems: getSystems,
        };
        return service;
    };

    var pdpRestService = function ($http) {
        function getSystems(serviceUrl, bizType) {
            var cfg = {
                method: 'GET',
                url: serviceUrl + '/systems/' + bizType
            }
            return $http(cfg);
        }
        function deleteClaim(serviceUrl, claimNo, system, whatIf) {
            var cfg = {
                method: 'DELETE',
                url: serviceUrl + '/cprs/if/' + whatIf + '/' + claimNo + '/' + system
            }
            return $http(cfg);
        }
        var service = {
            getSystems: getSystems,
            deleteClaim: deleteClaim
        };
        return service;
    };

    angular.module('starter.services', [])
        .factory('pdpConfigService', [pdpConfigService])
        .factory('pdpRestService', ['$http', pdpRestService])
        .factory('pdpFakeRestSystemsService', [pdpFakeRestSystemsService]);

})();