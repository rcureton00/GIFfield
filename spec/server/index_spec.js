var expect = require('chai').expect;

var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');

var db = require('../../server/index.js')

describe('You Should Really Title the Tests', function() {
  it('You Should Really Sub-Title the Sub-Tests', function() {
    expect(true).to.equal(true);
  });
});