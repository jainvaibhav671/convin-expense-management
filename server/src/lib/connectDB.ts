import mongoose from "mongoose"
import env from "@env"

const URI = env.MONGODB_URI

const clientOptions: mongoose.ConnectOptions = {
    dbName: env.MONGODB_NAME,
    retryWrites: true,
    writeConcern: {
        w: "majority",
    },
    appName: env.CLUSTER_NAME,
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
};

export default async function connectDB() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(URI, clientOptions);
        await mongoose.connection.db?.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        console.log("MongoDB connected");
    } catch (error: any) {
        console.log(error.message)
    }
}
