const mongoose = require("mongoose");
const User = require("../database/models/User");
const chai = require("chai");
const request = require("supertest");
const { describe, it, before, after } = require("mocha");
const connect = require("../database/database");
const expect = chai.expect;
const app = require("../app");

describe("POST /user/login", () => {
  let server;
  let userEmail = "test@example.com";

  before(async () => {
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    await connect(process.env.DB_URL, options);
    server = app.listen(3000);
    // create new user for login test
    await request(app)
      .post("/user/register")
      .send({ email: userEmail, password: "password123" });
  });

  after(async () => {
    await server.close();
    await User.deleteOne({ email: userEmail });
    await mongoose.connection.close();
  });

  it("should return a token when given valid credentials", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({
        email: userEmail,
        password: "password123",
      })
      .expect(200);
    expect(res.body.success).to.be.true;
    expect(res.body).to.have.property("token");
    expect(res.body.token).to.exist;
  });

  it("should return an error when given invalid credentials", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({
        email: userEmail,
        password: "wrongpassword",
      })
      .expect(401);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Invalid email or password.");
  });

  it("should return an error when given an invalid email", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({
        email: "invalidemail",
        password: "password",
      })
      .expect(401);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Invalid email or password.");
  });

  it("should return an error when given no email or password", async () => {
    const res = await request(app).post("/user/login").send({}).expect(401);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Invalid email or password.");
  });
});
