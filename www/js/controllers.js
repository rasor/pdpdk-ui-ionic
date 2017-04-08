(function () {
    'use strict';

    var DashCtrl = function ($scope, $ionicPopover, pdpConfigService, pdpRestService, pdpFakeRestSystemsService) {
        $scope.claimNo = "1234";

        $ionicPopover.fromTemplateUrl('templates/popover-viewmodel.html', {
          scope: $scope,
        }).then(function(popover) {
          $scope.popover = popover;
        });
        $scope.openPopover = function($event) {
          $scope.popover.show($event);
        };
        $scope.closePopover = function() {
          $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.popover.remove();
        });

        $scope.onGotViewModel = function () {
            //Select first option in dropdown
            var noOfSystems = $scope.viewModel.ClaimsSystems.length;
            if (noOfSystems > 0) {
                $scope.selectedSystem = $scope.viewModel.ClaimsSystems[0];
            }

            //Set default values:
            $scope.whatIfDeleteClaim = true;
        };
        $scope.setViewModel = function () {
            //Save initial data from server
            //$scope.viewModel = { "ServiceUrl": "http://localhost:44945/api", "ClaimsSystems": ["pdp.cpr.system.tester.local", "pdp.cpr.system.sif.local", "pdp.cpr.system.sif.itest", "pdp.cpr.system.sif.stest"] };
            $scope.viewModel = { ServiceUrl: pdpConfigService.serviceUrl };
            if (!pdpConfigService.useFakeRestSystems) {
                pdpRestService.getSystems($scope.viewModel.ServiceUrl, "cprs").then(
                    function successCallback(response) {
                        console.log('success on getSystems(' + 'cprs' + '): ' + response.data);
                        $scope.viewModel.ClaimsSystems = response.data;
                        $scope.onGotViewModel();
                    },
                    function errorCallback(response) {
                        console.log('error on getSystems(' + 'cprs' + '): ' + response.data);
                        $scope.viewModel.ClaimsSystems = [];
                        $scope.onGotViewModel();
                    }
                );
            } else {
                console.log('faked getSystems(' + 'cprs' + ')');
                $scope.viewModel.ClaimsSystems = pdpFakeRestSystemsService.getSystems($scope.viewModel.ServiceUrl, "cprs");
                $scope.onGotViewModel();
            }
        };
        $scope.beforeDeleteClaim = function () {
            //Disable button
            $scope.buttonDeleteClaimDisabled = true;
            //Clear msgs
            $scope.successMessage = "";
            $scope.errMessage = "";
        };
        $scope.onDeleteClaim = function () {
            $scope.beforeDeleteClaim();
            pdpRestService.deleteClaim($scope.viewModel.ServiceUrl, $scope.claimNo, $scope.selectedSystem, $scope.whatIfDeleteClaim).then(
                function successCallback(response) {
                    console.log('success on deleteClaim(' + $scope.claimNo + '): ' + response.data);
                    $scope.successMessage = response.data + ' whatif:' + $scope.whatIfDeleteClaim;
                    $scope.afterDeleteClaim();
                },
                function errorCallback(response) {
                    console.log('error on deleteClaim(' + $scope.claimNo + '): ' + response.data);
                    $scope.errMessage = 'En fejl skete i forsøget på at slette skade ' + $scope.claimNo + ': ' + response.data
                    $scope.afterDeleteClaim();
                }
            );
        };
        $scope.afterDeleteClaim = function () {
            //Enable button
            $scope.buttonDeleteClaimDisabled = false;
        };
    };

    angular.module('starter.controllers', [])
        .controller('DashCtrl', ['$scope', '$ionicPopover', 'pdpConfigService','pdpRestService','pdpFakeRestSystemsService', DashCtrl]);

})();