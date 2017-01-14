var request = require('request')
    ,express = require('express')
    ,assert = require("assert")
    ,http = require("http");

describe('http tests', function(){

    it('should return signin page for correct url', function(done){
        http.get('http://localhost:3000/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should not return page for wrong url', function(done){
        http.get('http://localhost:3000/homee', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should return register page for correct url', function(done){
        http.get('http://localhost:3000/register', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });


    /*

    it('should login for correct credentials', function(done) {
        request.post(
            'http://localhost:3000/login',
            { form: { "email": 'sharat1@sjsu.edu',"password":'test' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('should not allow to login', function(done) {
        request.post(
            'http://localhost:3000/login',
            { form: { "email": 'hemal@sjsu.edu',"password":'aditya' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    */});