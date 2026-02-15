//integration/blogtest.js
const request = require("supertest");
const app = require("../app"); 

let token;

beforeAll(async () => {
  // Sign up and sign in to get JWT
  await request(app).post("/api/auth/signup").send({
    first_name: "Taiwo",
    last_name: "Tester",
    email: "taiwo@example.com",
    password: "password123"
  });

  const res = await request(app).post("/api/auth/signin").send({
    email: "taiwo@example.com",
    password: "password123"
  });

  token = res.body.token;
});

describe("Blog Endpoints", () => {
  let blogId;

  it("should create a blog in draft state", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Blog",
        description: "Testing blog creation",
        body: "This is a test blog body",
        tags: ["test", "blog"]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.state).toBe("draft");
    blogId = res.body.data._id;
  });

  it("should publish the blog", async () => {
    const res = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ state: "published" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.state).toBe("published");
  });

  it("should fetch published blogs", async () => {
    const res = await request(app).get("/api/blogs");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].state).toBe("published");
  });

  it("should fetch a single blog and increment read_count", async () => {
    const res1 = await request(app).get(`/api/blogs/${blogId}`);
    const count1 = res1.body.data.read_count;

    const res2 = await request(app).get(`/api/blogs/${blogId}`);
    const count2 = res2.body.data.read_count;

    expect(count2).toBe(count1 + 1);
  });
});
