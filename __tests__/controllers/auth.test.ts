import request from "supertest";
import app from "../../src/app";
import {connect, closeDatabase} from "../../src/repositories/__mocks__/db_handler";

jest.setTimeout(30000);

let server: any = null;
let agent: any = null;

describe("Auth USER, NEW SESSION", () => {
	beforeAll(async (done) => {
		await connect();

		server = app
			.listen(3005, () => {
				agent = request.agent(server);
				done();
			})
			.on("error", (err) => {
				done(err);
			});
	});

	it("Create a new user correctly", async () => {
		const resp = await request(app).post("/v1/user").send({
			name: "Name test",
			email: "srodrug@cj.com",
			password: "4n1m4l",
		});
		expect(resp.status).toEqual(200);
	});

	it("Create a new session", async () => {
		const resp = await request(app).post("/v1/auth").send({
			email: "srodrug@cj.com",
			password: "4n1m4l",
		});
		expect(resp.status).toEqual(200);
		expect(typeof resp.body.token).toEqual("string");
		expect(resp.body.token.length).toBeGreaterThanOrEqual(1);
	});

	it("Bad password", async () => {
		const resp = await request(app).post("/v1/auth").send({
			email: "srodrug@cj.com",
			password: "123",
		});
		expect(resp.status).toEqual(400);
        expect(typeof resp.body.message).toEqual("string");
        expect(resp.body.message).toEqual("Invalid Credentials");
	
	});

    it("Non valid user", async () => {
		const resp = await request(app).post("/v1/auth").send({
			email: "srodrugyyityt@cj.com",
			password: "123",
		});
		expect(resp.status).toEqual(400);
        expect(typeof resp.body.message).toEqual("string");
        expect(resp.body.message).toEqual("Invalid User");
	
    });

    
	afterAll(async () => await closeDatabase());
});

// describe("Auth USER, NEW SESSION", () => {

//     beforeAll(async (done) => {
// 		await connect();

// 		server = app
// 			.listen(3006, () => {
// 				agent = request.agent(server);
// 				done();
// 			})
// 			.on("error", (err) => {
// 				done(err);
// 			});
//     });
    
//     it("Server error", async () => {
// 		const resp = await request(app).post("/v1/auth").send({
// 			email: "srodrug@cj.com",
// 			password: "123",
// 		});
// 		expect(resp.status).toEqual(400);
//         expect(typeof resp.body.message).toEqual("string");
//         expect(resp.body.message).toEqual("Invalid User");
	
//     });
// });
