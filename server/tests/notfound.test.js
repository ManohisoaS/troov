const mongoose = require("mongoose");
const chai = require("chai");
const request = require("supertest");
const { describe, it, before, after } = require("mocha");

const connect = require("../src/database/database");
const app = require("../src/app");
const expect = chai.expect;

describe("Wrong ROUTE", () => {
  let server;

  before(async () => {
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    await connect(process.env.DB_URL, options);
    server = app.listen(3000);
  });

  after(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  it("should return an error if wrong routes ", async () => {
    const res = await request(app).get("/wrong").send().expect(404);
    expect(res.body.message).to.equal("Page not found");
  });

  it("should return an error if wrong routes ", async () => {
    const res = await request(app).post("/wrong").send().expect(404);
    expect(res.body.message).to.equal("Page not found");
  });

  it("should return an error if wrong routes ", async () => {
    const res = await request(app).put("/wrong").send().expect(404);
    expect(res.body.message).to.equal("Page not found");
  });

  it("should return an error if wrong routes ", async () => {
    const res = await request(app).delete("/wrong").send().expect(404);
    expect(res.body.message).to.equal("Page not found");
  });
});
