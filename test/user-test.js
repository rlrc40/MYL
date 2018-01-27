var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000");

describe("SAMPLE unit test", function(){

    it("should create user correctly", function(){
  
      server
      .post("/users/register")
      .send({name: "Raul", email: "raul@email.com", description: "blablabla", age: 24})
      .expect("Content-type",/json/)
      .expect(200) 
      .expect({name: "Raul", email: "raul@email.com", description: "blablabla", age: 24}) 
      .end(function(err, res) {
        if (err) throw err;
      });
    });  
});

describe("SAMPLE unit test", function(){

  it("should return an error because the duplicated email", function(){

    server
    .post("/users/register")
    .send({name: "Raul", email: "raul@email.com", description: "blablabla", age: 24});

    server
    .post("/users/register")
    .send({name: "Raul", email: "raul@email.com", description: "blablabla", age: 24})
    .expect("Content-type",/json/)
    .expect(412) 
    .expect("Email raul@email.com is already taken")
    .end(function(err, res) {
      if (err) throw err;
    });
  });  
});