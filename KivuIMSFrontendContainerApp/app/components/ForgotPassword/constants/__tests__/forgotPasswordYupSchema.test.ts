import { forgotPasswordSchema } from "../forgotPasswordYupSchema";

describe("forgotPasswordSchema", () => {
  it("validates valid email addresses", async () => {
    const validEmails = [
      "test@example.com",
      "user.name@domain.co.uk",
      "test+tag@gmail.com"
    ];

    for (const email of validEmails) {
      await expect(
        forgotPasswordSchema.validate({ email })
      ).resolves.toMatchSnapshot();
    }
  });

  it("rejects invalid email addresses", async () => {
    const invalidEmails = [
      "invalid",
      "@example.com",
      "test@",
      "test.example.com",
      ""
    ];

    for (const email of invalidEmails) {
      await expect(
        forgotPasswordSchema.validate({ email })
      ).rejects.toMatchSnapshot();
    }
  });

  it("requires email field", async () => {
    await expect(forgotPasswordSchema.validate({})).rejects.toMatchSnapshot();
  });

  it("rejects empty string", async () => {
    await expect(
      forgotPasswordSchema.validate({ email: "" })
    ).rejects.toMatchSnapshot();
  });
});
