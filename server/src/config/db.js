import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
    path: ".env",
    debug: true
});
const DBConnect = async()=>{
    try {
        console.log(process.env.DB_URI)
        const connectionInstance = await mongoose.connect(process.env.DB_URI)
        console.log(`data base connect successfully at host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(`somting went wrong while connection the DB`);
        process.exit(1);
    }

}

export default DBConnect;
