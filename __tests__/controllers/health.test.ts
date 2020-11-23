import request from "supertest";
import app from "../../src/app";
let server: any = null;
let agent: any = null;

describe("Get Health", () => {
	beforeEach((done) => {
		server = app
			.listen(4000, () => {
				agent = request.agent(server);
				done();
			})
			.on("error", (err) => {
				done(err);
			});
    });
    
	it("should get health status", async () => {
		const res = await request(app).get("/v1/health");
		expect(res.status).toEqual(200);
	});

	afterEach((done) => {
		return server && server.close(done);
	});
});
