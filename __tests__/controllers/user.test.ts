import request from "supertest";
import app from "../../src/app";
import {connect, closeDatabase} from "../../src/repositories/__mocks__/db_handler";

jest.setTimeout(30000);

let server: any = null;
let agent: any = null;

describe("POST USER, Register new user", () => {
	beforeAll(async (done) => {
		await connect();
		server = app
			.listen(3001, () => {
				agent = request.agent(server);
				done();
			})
			.on("error", (err) => {
				done(err);
			});
	});
	it("Create a new user correctly", async () => {
		const resp = await request(app).post("/v1/user").send({
			name: "Test_name",
			email: "testname@email.com",
			password: "12345678",
		});
		expect(resp.status).toEqual(200);
		expect(typeof resp.body.data).toEqual("object");
		expect(typeof resp.body.data.token).toEqual("string");
		expect(resp.body.data.token.length).toBeGreaterThanOrEqual(1);
		expect(typeof resp.body.msj).toEqual("string");
		expect(resp.body.msj).toEqual("User Created");
	});

	it("Create user same email", async () => {
		const resp = await request(app).post("/v1/user").send({
			name: "Test_name",
			email: "testname@email.com",
			password: "12345678",
		});
		expect(resp.status).toEqual(400);
		expect(resp.body.status).toEqual("Error");
		expect(resp.body.message).toEqual("User already exists");
		expect(resp.body.errors).toBeNull();
	});
	afterAll(async () => await closeDatabase());
});

describe("POST USER,  Error on json body", () => {
	beforeAll(async (done) => {
		await connect();
		server = app
			.listen(3002, () => {
				agent = request.agent(server);
				done();
			})
			.on("error", (err) => {
				done(err);
			});
	});
	it("Create a new user invalid property", async () => {
		const resp = await request(app).post("/v1/user").send({
			name: "Test_name",
			email: "testnameemail.com",
			password: "12345678",
		});

		expect(resp.status).toEqual(400);
		expect(resp.body.status).toEqual("Error");
		expect(resp.body.message).toEqual("Invalid Field");
		expect(resp.body.errors.length).toBeGreaterThan(0);
		expect(resp.body.errors[0].msg).toEqual("Invalid email format");
		expect(resp.body.errors[0].param).toEqual("email");
		expect(resp.body.errors[0].location).toEqual("body");
	});

	afterAll(async () => await closeDatabase());
});
