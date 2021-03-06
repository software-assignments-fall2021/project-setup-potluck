import chai from "chai"
import chaiHttp from "chai-http"
import { ApiError } from "mockaroo/lib/errors"
import app from "../app"
import "@babel/polyfill"
import { Console } from "console"
const assert = require("assert")

chai.use(chaiHttp)
chai.should()
chai.use(require("chai-json-schema"))

//Imports for testing login authentication

// ############### SCHEMAS TO TEST DB RESULTS ###############

// schema to test api call against the post's schema
const postSchema = {
  //schema configuration
  title: "postSchema v1",
  type: "object",
  required: ["title", "imageURL", "content", "author", "tags","parentRestaurant"],
  //the schema itself
  properties: {
    title: { type: "string" },
    author: { type: "object",
      minItems: 4,
      uniqueItems: false,
      items:{
        email: {type: 'string'},
        image: {type:'string'},
        posts: {type: 'array'},
        username: {type: 'string'}
      }
    },
    imageURL: { type: "string" },
    content: { type: "string" },
    parentRestuarant: {type: "object"},
    tags: { type: "array" },

    
  },
}

const restaurantSchema = {
  // Schema config
  title: "restaurantSchema v1",
  type: "object",
  properties: {
    categories: {type: "object",
        minItems: 2,
        uniqueItems: false,
        items: {
          alias: {type: "string"},
          title: {type: "string"}
        },
        required: true
    },
    location: {type: "object",
      minItems: 1,
      uniqueItems: false,
      items: {
        coordinates: {type: "object",
          minItems: 6,
          uniqueItems: false,
          items: {
            longitude: {type: "float", required: true}, 
            latitude: {type: "float", required: true}
          }
        },
        city: {type: "string", required: true},
        country: {type: "string", required: true},
        state: {type: "string", required: true},
        address: {type: "string", required: true},
        zip_code: {type: "number", required: true}
      },
    },
    _id: {type: "string", required: true},
    name: {type: "string", required: true},
    phone_number: {type: "string", required: true},
    yelp_id: {type: "string", required: true},
    yelp_url: {type: "string", required: true},
    restaurant_img_url: { type: "string", required: true},
    transactions: {type: "array",
        minItems: 0,
        uniqueItems: false,
        items: {
          type: "string"
        },
        required: true
    },
    posts: {type: "array",
        minItems: 0,
        uniqueItems: false,
        items: {
          type: "number"
        },
        required: true
    },
    __v: {type: "number", required: true}
  }
    
}

const userDataSchema = {
  title: "userDataSchema v1",
  type: "object",
  required: [
    "id",
    "username",
    "first_name",
    "last_name",
    "email",
    "password",
    "gender",
    "profilePic",
  ],
  properties: {
    id: {
      type: "number",
    },
    username: {
      type: "string",
    },
    first_name: {
      type: "string",
    },
    last_name: {
      type: "string",
    },
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
    gender: {
      type: "string",
    },
    profilePic: {
      type: "string",
    },
  },
}

// ############### TESTS ###############

//suite of tests for the search/feed route
describe("searchTests", () => {
  //testing the get request to see if it returns 200 level status (that it went through properly)
  describe("GET/", () => {
    let error, response
    //Makes request prior to all tests running
    before((done) => {
      //use chai to make a get request to search route
      chai
        .request(app)
        .get("/search")
        .end((err, res) => {
          //hoist error, response to the actual response, error variables
          ;(error = err), (response = res)
          //console.log(res);
          done()
        })
    })
    it("Request should return a valid 200 response", (done) => {
      //use chai to make a get request to the search route!
      //checks if request returns a 200 level response
      response.should.have.status(200)
      done()
    })
    it("Request should return an array", (done) => {
      //checks to see if the response is an array
      //console.log(typeof(response.body))
      //console.log(response.body)
      response.body.should.be.a("array")
      done()
    })
    it("All Elements in the array should be objects that adhere to the postSchema used by the mockaroo api, the frontend, and eventually (but not yet) mongoDB", (done) => {
      //check to see if every element in the array is an object that adheres to a predefined schema
      response.body.forEach((element) => {
        element.should.be.jsonSchema(postSchema)
      })
      done()
    })
  })
})

//suite of tests for the search/feed route
describe("restaurants", () => {
  //testing the get request to see if it returns 200 level status (that it went through properly)
  describe("GET/", () => {
    let error, response
    //Makes request prior to all tests running
    before((done) => {
      //use chai to make a get request to search route
      chai
        .request(app)
        .get("/restaurants")
        .end((err, res) => {
          //hoist error, response to the actual response, error variables
          ;(error = err), (response = res)
          //console.log(res);
          done()
        })
    })
    it("Request should return a valid 200 response", (done) => {
      //use chai to make a get request to the restaurants route!
      //checks if request returns a 200 level response
      response.should.have.status(200)
      done()
    })

    it("Request should return an array", (done) => {
      //checks to see if the response is an array
      response.body.should.be.a("array")
      done()
    })

    it("All Elements in the array should be objects that adhere to the restaurantSchema in MongoDB", (done) => {
      //check to see if every element in the array is an object that adheres to a predefined schema
      response.body.forEach((element) => {
        element.should.be.jsonSchema(restaurantSchema)
      })
      done()
    })
  })
})

//Suite of tests for login authentication (loginRoute)
//This test sends valid login information, and should receive a 200 response
describe("loginTestsValidCredentials", () => {

  const validUserCredentials = {
    username: 'cereal', 
    password: 'cereal'
  }
  
  describe("POST/", () => {
    let error, response
    //Makes request prior to all tests running
    before((done) => {
      //use chai to make a get request to login route
      chai
        .request(app)
        .post("/login")
        .send(validUserCredentials)
        .end((err, res) => {
          //hoist error, response to the actual response, error variables
          ;(error = err), (response = res)
          //console.log(res);
          done()
        })
    })

    //Write test here for checking that status is Success when given VALID login credentials
    //The question is: how do I do valid login credentials??
    it("Request should return a valid 200 response", (done) => {
      //use chai to make a get request to the restaurants route!
      //checks if request returns a 200 level response
      response.should.have.status(200)
      done()
    })

    //Possibly: check for successful redirect to "/"
  })
 
})

//This test sends valid login information, and should receive a 200 response
describe("loginTestsInvalidCredentials", () => {

  const invalidUserCredentials = {
    username: 'fakeUsername', 
    password: 'fakePassword'
  }
  
  describe("POST/", () => {
    let error, response
    //Makes request prior to all tests running
    before((done) => {
      //use chai to make a get request to login route
      chai
        .request(app)
        .post("/login")
        .send(invalidUserCredentials)
        .end((err, res) => {
          //hoist error, response to the actual response, error variables
          ;(error = err), (response = res)
          //console.log(res);
          done()
        })
    })

    //Write test here for checking that status is Success when given VALID login credentials
    //The question is: how do I do valid login credentials??
    it("Request should return a valid 401 response because of invalid credentials", (done) => {
      //use chai to make a get request to the restaurants route!
      //checks if request returns a 200 level response
      response.should.have.status(401)
      done()
    })

    //Possibly: check for successful redirect to "/"
  })
 
})

//Suite of tests for login authentication (loginRoute)
// describe("registerTests", () => {

//   const validRegistrationCredentials = {
//     firstName: 'Mister',
//     lastName: 'Rogers',
//     username: 'mrogers', 
//     email: 'mrogers@gmail.com',
//     password: 'neighborhood'
//   }
  
//   describe("POST/", () => {
//     let error, response
//     //Makes request prior to all tests running
//     before((done) => {
//       //use chai to make a get request to login route
//       chai
//         .request(app)
//         .post("/register")
//         .send(validRegistrationCredentials)
//         .end((err, res) => {
//           //hoist error, response to the actual response, error variables
//           ;(error = err), (response = res)
//           console.log(res);
//           console.log(err)
//           done()
//         })
//     })

//     //Write test here for checking that status is Success when given VALID registration credentials
//     it("Request should return a valid 200 response", (done) => {
//       //use chai to make a get request to the restaurants route!
//       //checks if request returns a 200 level response
//       response.should.have.status(200)
//       done()
//     })

//     //Not sure if there's anything I can test for when given invalid registration credentials ?

//   })
 
// })

describe("userData", () => {
  describe("GET/", () => {
    let error, response
    //Makes request prior to all tests running
    before((done) => {
      //use chai to make a get request to search route
      chai
        .request(app)
        .get("/user/")
        .end((err, res) => {
          //hoist error, response to the actual response, error variables
          ;(error = err), (response = res)
          //console.log(res);
          done()
        })
    })

    it("Request should return a valid 200 response", (done) => {
      //use chai to make a get request to the restaurants route!
      //checks if request returns a 200 level response
      response.should.have.status(200)
      done()
    })

    it("Request should return an array", (done) => {
      //checks to see if the response is an array
      response.body.should.be.a("array")
      done()
    })

    it("All Elements in the array should be objects that adhere to the userDataSchema used by the mockaroo api, the frontend, and eventually (but not yet) mongoDB", (done) => {
      //check to see if every element in the array is an object that adheres to a predefined schema
      response.body.forEach((element) => {
        element.should.be.jsonSchema(userDataSchema)
      })
      done()
    })
  })
})

//basic primer for unit testing with mocha/chai:

//use describe() to define your test suite and then individual tests inside it's your suite's callback
//use it() to write the description of an individual test
//everything in your it() callback is part of that test,
//you can use chai.request to make a request from the app and then .get('/your route')
//you can use should be and should have to check specific properties of whatever you are checking
//think of these as less verbose assertions made to be easier to read
//the rest is pretty self explanatory check out the documentation for chai, mocha, or any of the mocha plugins
//type in npm run name of test file  (so in this case npm run test) to run your tests
//type npm run coverage to take a look at a coverage report (this comes from istanbul-nyc)
//extra: hooks can let you do things before or after specific (or all) tests within your suite
//have a great day!
