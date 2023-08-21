import mongoose, { ConnectOptions } from "mongoose"

const connectDB = async () => {
    try {
        const dbUrl = process.env.MONGO_URL!
        const con = await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
        console.log(`Database connected : ${con.connection.host}`)
    } catch (error: any) {
        console.error(`Error: ${error.message}`)
    }
}

export default connectDB
