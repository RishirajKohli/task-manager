const app = require("../src/app");
const request = require("supertest");
const User = require("../src/models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const testAgent = request(app);
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Rishabh",
  email: "kk@gmail.com",
  password: "5621341pass",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("Should Sign up User", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      email: "kohli.rishiraj@gmail.com",
      password: "Risha123",
      name: "Rishabh",
    })
    .expect(201);
  const user = await User.findById({ _id: response.body.user._id });
  expect(user).not.toBeNull();
  expect(user.password).not.toBe("Risha123");

  expect(response.body).toMatchObject({
    user: {
      name: "Rishabh",
      email: "kohli.rishiraj@gmail.com",
    },
    token: user.tokens[0].token,
  });
});

test("Should login existing user", async () => {
  const { body } = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await User.findById({ _id: body.user._id });
  expect(user).not.toBeNull();
  expect(user.tokens.map((tokenObj) => tokenObj.token)).toContain(body.token);
});

test("Should not login nonexisting user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "nonexisiting@example.com",
      password: "dummyaccess",
    })
    .expect(400);
});

test("Should not login user with wrong password", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "Somethingwrong",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer 231230023123.fakedata.asdasd`)
    .send()
    .expect(401);
});

test("Should delete account for authenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/my_pic.jpeg")
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  const { body } = await testAgent
    .patch("/users/me/")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Rishi",
      password: "changeme123",
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(body.name).toBe("Rishi");
  expect(user.name).toBe("Rishi");
});

test("Should not update invalid user fields", async () => {
  const { body } = await testAgent
    .patch("/users/me/")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "India",
    })
    .expect(400);
});
