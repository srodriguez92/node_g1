import request from "supertest";
import app from "../../src/app";
import {connect, closeDatabase} from "../../src/repositories/__mocks__/db_handler";

jest.setTimeout(30000);

let server: any = null;
let agent: any = null;

describe("POST Contacts, Register new contact", () => {
	beforeAll(async (done) => {
		await connect();
		server = app
			.listen(3003, () => {
				agent = request.agent(server);
				done();
			})
			.on("error", (err) => {
				done(err);
			});
	});
	let token = "";
	let contact_id = 0;
	it("Create a new user correctly", async () => {
		const resp = await request(app).post("/v1/user").send({
			name: "Test_name",
			email: "testname1@email.com",
			password: "12345678",
		});
		expect(resp.status).toEqual(200);
	});

	it("Create a new session", async () => {
		const resp = await request(app).post("/v1/auth").send({
			email: "testname1@email.com",
			password: "12345678",
		});
		expect(resp.status).toEqual(200);
		token = resp.body.token;
	});

	it("Create a new contact correctly", async () => {
		const resp = await request(app)
			.post("/v1/contact")
			.send({
				name: "Test_name Contact",
				email: "testnamecontact@email.com",
				phone: "12345678",
			})
			.set({"x-auth-token": token});
		expect(resp.status).toEqual(201);
		expect(typeof resp.body.data).toEqual("object");
		expect(typeof resp.body.msj).toEqual("string");
		expect(resp.body.msj).toEqual("Contact Created");
		contact_id = resp.body.data._id;
	});

	it("Update a contact correctly", async () => {
		const resp = await request(app)
			.put("/v1/contact")
			.send({
				name: "Test_name Contact update",
				email: "testnamecontact@email.com",
				phone: "12345678",
			})
			.set({"x-auth-token": token})
			.query({id: contact_id});
		expect(resp.status).toEqual(200);
		expect(typeof resp.body.data).toEqual("object");
		expect(typeof resp.body.msj).toEqual("string");
		expect(resp.body.msj).toEqual("Contact updated");
	});

	it("Get contacts list", async () => {
		const resp = await request(app).get("/v1/contact").set({"x-auth-token": token});

		expect(resp.status).toEqual(200);
		expect(typeof resp.body.data).toEqual("object");
		expect(resp.body.data.length).toBeGreaterThan(0);
		expect(typeof resp.body.msj).toEqual("string");
		expect(resp.body.msj).toEqual("List of contacts");
	});

	it("Delete a contact correctly", async () => {
		const resp = await request(app)
			.delete(`/v1/contact/${contact_id}`)
			.set({"x-auth-token": token});

		expect(resp.status).toEqual(200);
		expect(typeof resp.body.data).toEqual("object");
		expect(resp.body.data._id).toEqual(contact_id);
		expect(typeof resp.body.msj).toEqual("string");
		expect(resp.body.msj).toEqual("Contact Removed");
	});

	afterAll(async () => await closeDatabase());
});
