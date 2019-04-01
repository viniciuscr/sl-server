import Client from "../src/middleware/client";

jest.mock("../src/model/client.dao");

beforeAll(async () => {});

test("Client.Login: Return error for invalid password if not is in shortid´d format", async () => {
  const badRequest = jest.fn(errors =>
    expect(errors).toEqual(expect.objectContaining({ password: "Invalid password." }))
  );

  await Client.login({
    badRequest,
    request: {
      body: {
        email: "email@test.com",
        password: "AStrongPass"
      }
    }
  });
  expect(badRequest).toBeCalled();
});

test("Client.Login: Return error for invalid email if not a valid email format", async () => {
  const badRequest = jest.fn(errors =>
    expect(errors).toEqual(expect.objectContaining({ email: "Invalid e-mail." }))
  );

  await Client.login({
    badRequest,
    request: {
      body: {
        email: "emailtest.com",
        password: "AStrongPass"
      }
    }
  });
  expect(badRequest).toBeCalled();
});

test("Client.Login: Return error for invalid email if not set", async () => {
  const badRequest = jest.fn(errors =>
    expect(errors).toEqual(expect.objectContaining({ email: "Invalid e-mail." }))
  );

  await Client.login({
    badRequest,
    request: {
      body: {
        password: "AStrongPass"
      }
    }
  });
  expect(badRequest).toBeCalled();
});

test("Client.Login: Return error for invalid password if not set", async () => {
  const badRequest = jest.fn(errors =>
    expect(errors).toEqual(expect.objectContaining({ password: "Invalid e-mail." }))
  );

  await Client.login({
    badRequest,
    request: {
      body: {
        email: "email@test.com"
      }
    }
  });
  expect(badRequest).toBeCalled();
});
