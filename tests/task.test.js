const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");

const { userOne, taskThree, setupDatabase } = require("./fixtures/db");
const e = require("express");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const { body } = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${(userOne, userOne.tokens[0].token)}`)
    .send({ description: "Testing task creation" })
    .expect(201);

  const task = await Task.findById(body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test("Should get all tasks of a user", async () => {
  const { body } = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(body.length).toBe(2);
});

test("Should not delete task of a different user", async () => {
  await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await Task.findById(taskThree._id);
  expect(task).not.toBeNull();
});
