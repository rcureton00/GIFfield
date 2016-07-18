'use strict';
describe("test: ", function(){

  console.log("IO", io);

  beforeEach(angular.mock.module('MusicPlayer'));
  
  describe('home view controller', function(){
    it('should exist', inject(function($controller, $rootScope){
      //spec body
      var scope = $rootScope.$new();
      var HomeController = $controller('HomeController', {$scope:scope});
      expect(HomeController).toBeDefined();
    }));

  });

});





 

