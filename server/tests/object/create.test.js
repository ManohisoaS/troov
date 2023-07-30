const mongoose = require("mongoose");
const chai = require("chai");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { describe, it, before, after } = require("mocha");

const User = require("../../database/models/User");
const Object = require("../../database/models/Object");
const app = require("../../app");
const connect = require("../../database/database");

const expect = chai.expect;

describe("POST /object", () => {
  let server;
  let userEmail = "test@example.com";
  let userPassword = "password123";
  let objectId;

  before(async () => {
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    await connect(process.env.DB_URL, options);
    server = app.listen(3000);
    // create new user for test
    await request(app)
      .post("/user/register")
      .send({ email: userEmail, password: userPassword });
  });

  after(async () => {
    await server.close();
    await User.deleteOne({ email: userEmail });
    await Object.findByIdAndDelete(objectId);
    await mongoose.connection.close();
  });

  it("should create a new object", async () => {
    let res = await request(app)
      .post("/user/login")
      .send({ email: userEmail, password: userPassword });
    let token = res.body.token;

    res = await request(app)
      .post("/object")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "object name", description: "detail of object" })
      .expect(201);
    expect(res.body.success).to.be.true;
    expect(res.body.newObject).to.exist;
    objectId = res.body.newObject._id;
  });

  it("should return an error if name is missing", async () => {
    let res = await request(app)
      .post("/user/login")
      .send({ email: userEmail, password: userPassword });
    let token = res.body.token;

    res = await request(app)
      .post("/object")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "object name" })
      .expect(400);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Name and description are required");
  });

  it("should return an error if description is missing", async () => {
    let res = await request(app)
      .post("/user/login")
      .send({ email: userEmail, password: userPassword });
    let token = res.body.token;

    res = await request(app)
      .post("/object")
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "detail of object" })
      .expect(400);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Name and description are required");
  });

  it("should return an error if the token is missing", async () => {
    let res = await request(app)
      .post("/object")
      .send({ name: "object name", description: "detail of object" })
      .expect(401);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Missing token");
  });

  it("should return an error if the token is invalid", async () => {
    let token = "invalid_token";
    let res = await request(app)
      .post("/object")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "object name", description: "detail of object" })
      .expect(401);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Invalid token");
  });

  it("should return an error if the token is expired", async () => {
    // create token with short life time
    let token = jwt.sign({ email: userEmail }, process.env.JWT_SECRET, {
      expiresIn: "1ms",
    });
    let res = await request(app)
      .post("/object")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "object name", description: "detail of object" })
      .expect(401);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Token expired");
  });
});
