'use strict';
describe("test: ", function(){

beforeEach(angular.mock.module('appPlayer'));
  
  beforeEach(inject(function($controller, $rootScope){
    var scope = 5;    
  }));



   

  it('should be registered', function(){
    expect(scope).toBeDefined();
  });
});




// describe('home view', function(){
//   beforeEach(module('appPlayer'));

//   describe('home view controller', function(){
//     it('should should exist', inject(function($controller, $rootScope){
//       //spec body
//       var scope = $rootScope.$new();
//       var HomeController = $controller('HomeController', {$scope:scope});
//       expect(HomeController).toBeDefined();
//     }));

//   });
// });

