import mongoose from "mongoose";

const dbconfig = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Database connected successfully ");
    } catch (error) {
        throw new Error(error as string);
    }
}

export default dbconfig;