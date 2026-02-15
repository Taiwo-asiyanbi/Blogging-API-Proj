//user test.js
const User = require("../models/user");

describe("User Model", () => {
  it("should require first_name, last_name, email, and password", async () => {
    const user = new User({});
    let err;
    try {
      await user.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.first_name).toBeDefined();
    expect(err.errors.last_name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });
});

