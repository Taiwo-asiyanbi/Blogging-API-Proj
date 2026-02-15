// blog test
const calculateReadingTime = require("../utils/calculateReadingTime");

describe("Reading Time Algorithm", () => {
  it("should calculate reading time based on word count", () => {
    const text = "This is a short blog post with about fifty words...";
    const readingTime = calculateReadingTime(text);
    expect(readingTime).toBeGreaterThan(0);
  });
});
