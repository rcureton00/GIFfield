'use strict';
describe("test: ", function(){
  // it('should be cool', function() {
  //   expect(true).to.be.true;
  // });

  console.log("IO", io);

  beforeEach(angular.mock.module('MusicPlayer'));
  
  describe('home view controller', function(){
    it('should should exist', inject(function($controller, $rootScope){
      //spec body
      var scope = $rootScope.$new();
      var HomeController = $controller('HomeController', {$scope:scope});
      expect(HomeController).toBeDefined();
    }));

  });

});




// describe('home view', function(){
//   beforeEach(module('appPlayer'));

 

