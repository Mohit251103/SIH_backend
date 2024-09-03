import mongoose from "mongoose";

const dbconfig = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI!);
        console.log("Database connected successfully ", connection);
    } catch (error) {
        throw new Error("Could not connect with the database");
    }
}

export default dbconfig;