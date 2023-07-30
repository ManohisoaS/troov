const mongoose = require("mongoose");
const chai = require("chai");
const request = require("supertest");
const { describe, it, before, after } = require("mocha");

const User = require("../../src/database/models/User");
const app = require("../../src/app");
const connect = require("../../src/database/database");

const expect = chai.expect;

describe("POST /user/register", () => {
  let server;
  let userEmail = "test@example.com";

  before(async () => {
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    await connect(process.env.DB_URL, options);
    server = app.listen(3000);
  });

  after(async () => {
    await server.close();
    await User.deleteOne({ email: userEmail });
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({ email: userEmail, password: "password123" });
    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
  });

  it("should return an error if email already exists", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({ email: userEmail, password: "password123" });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("This email is already in use");
  });

  it("should return an error if email is missing", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({ password: "password123" });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Email is required");
  });

  it("should return an error if password is missing", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({ email: "test@example.com" });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
    expect(res.body.error).to.equal("Password is required");
  });

  it("should return an error if email is invalid", async () => {
    const emailList = [
      "test@.gmail.com",
      "test@.com",
      "testgmail.com",
      "test@gmail",
    ];
    emailList.forEach(async (email) => {
      console.log(`test for ${email}`);
      const res = await request(app)
        .post("/user/register")
        .send({ email, password: "password123" });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.error).to.equal("Invalid email address");
    });
  });
});
