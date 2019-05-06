import shortid from 'shortid';
import Client from "../src/middleware/client";

jest.mock("../src/model/client.dao");

beforeAll(async () => {});

test("Client.Login: Return error for invalid email if not a valid email format", async () => {
  const badRequest = jest.fn(errors =>
    expect(errors).toEqual(expect.objectContaining({ email: "Invalid e-mail." }))
  );
  const ok = jest.fn();

  await Client.login({
    ok,
    badRequest,
    request: {
      body: {
        email: "emailtest.com",
        password: "AStrongPass"
      }
    }
  });
  expect(ok).toBeCalledTimes(0);
  expect(badRequest).toBeCalled();
});

test("Client.Login: Return error for invalid email if not set", async () => {
  const badRequest = jest.fn(errors =>
    expect(errors).toEqual(expect.objectContaining({ email: "Invalid e-mail." }))
  );
  const ok = jest.fn();

  await Client.login({
    ok,
    badRequest,
    request: {
      body: {
        password: "AStrongPass"
      }
    }
  });
  expect(ok).toBeCalledTimes(0);
  expect(badRequest).toBeCalled();
});

test("Client.Login: Return error for invalid password if not set", async () => {
  const badRequest = jest.fn(errors =>
    expect(errors).toEqual(expect.objectContaining({ password: "Invalid password." }))
  );
  const ok = jest.fn();

  await Client.login({
    ok,
    badRequest,
    request: {
      body: {
        email: "email@test.com"
      }
    }
  });
  expect(ok).toBeCalledTimes(0);
  expect(badRequest).toBeCalled();
});

test("Client.Login: Return success for a valid login", async () => {
  const badRequest = jest.fn();
  const ok = jest.fn();

  await Client.login({
    ok,
    badRequest,
    request: {
      body: {
        email: "email@test.com",
        password: shortid.generate()
      }
    }
  });
  expect(badRequest).toBeCalledTimes(0);
  expect(ok).toBeCalled();

  


});

