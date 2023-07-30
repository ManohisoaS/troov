const mongoose = require("mongoose");
const chai = require("chai");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { describe, it, before, after } = require("mocha");

const User = require("../../src/database/models/User");
const Object = require("../../src/database/models/Object");
const app = require("../../src/app");
const connect = require("../../src/database/database");

const expect = chai.expect;

describe("DELETE /object/:id", () => {
  let server;
  let userEmail = "test@example.com";
  let userPassword = "password123";
  let objectId;
  let token;

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

  it("should return a deleted object", async () => {
    // Log user to get token
    let res = await request(app)
      .post("/user/login")
      .send({ email: userEmail, password: userPassword });
    token = res.body.token;

    // create new objet
    res = await request(app)
      .post("/object")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "object name", description: "detail of object" })
      .expect(201);
    objectId = res.body.newObject._id;

    // delete object
    res = await request(app)
      .delete(`/object/${objectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(200);
    expect(res.body.success).to.be.true;
    expect(res.body.deletedObject).to.be.exist;
    expect(res.body.deletedObject.name).to.equal("object name");
    expect(res.body.deletedObject.description).to.equal("detail of object");
  });

  it("should return an error if object ID is not in database", async () => {
    let res = await request(app)
      .delete(`/object/${objectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(400);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Object is not found");
  });

  it("should return an error if the token is missing", async () => {
    let res = await request(app)
      .delete(`/object/${objectId}`)
      .send({ name: "new name", description: "new description" })
      .expect(401);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Missing token");
  });

  it("should return an error if the token is invalid", async () => {
    let token = "invalid_token";
    let res = await request(app)
      .delete(`/object/${objectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "new name", description: "new description" })
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
      .delete(`/object/${objectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "new name", description: "new description" })
      .expect(401);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Token expired");
  });
});
