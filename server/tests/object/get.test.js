const mongoose = require("mongoose");
const chai = require("chai");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { describe, it, before, after } = require("mocha");

const User = require("../../src/database/models/User");
const app = require("../../src/app");
const connect = require("../../src/database/database");

const expect = chai.expect;

describe("GET /objects", () => {
  let server;
  let userEmail = "test@example.com";
  let userPassword = "password123";

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
    await mongoose.connection.close();
  });

  it("should return a list of objects", async () => {
    let res = await request(app)
      .post("/user/login")
      .send({ email: userEmail, password: userPassword });
    let token = res.body.token;

    res = await request(app)
      .get("/objects")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(200);
      expect(res.body.success).to.be.true;
      expect(res.body.list).to.be.exist;
  });

  it("should return an error if the token is missing", async () => {
    let res = await request(app)
      .get("/objects")
      .send()
      .expect(401);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Missing token");
  });

  it("should return an error if the token is invalid", async () => {
    let token = "invalid_token";
    let res = await request(app)
      .get("/objects")
      .set("Authorization", `Bearer ${token}`)
      .send()
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
      .get("/objects")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(401);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Token expired");
  });
});
