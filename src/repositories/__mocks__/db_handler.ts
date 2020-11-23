import mongoose from "mongoose";

import {MongoMemoryServer} from "mongodb-memory-server";

const mongod = new MongoMemoryServer();

export const connect = async () => {
    const uri = await mongod.getConnectionString();
    // const uri = await mongod.getUri();
	const mongooseOpts = {
		useNewUrlParser: true,
		autoReconnect: true,
		reconnectTries: Number.MAX_VALUE,
		reconnectInterval: 1000,
	};

	await mongoose.connect(uri, mongooseOpts);
};

export const closeDatabase = async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongod.stop();
};
