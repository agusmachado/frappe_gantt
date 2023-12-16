import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        const url = `${connection.connection.host} : ${connection.connection.host.port}`

        console.log(`MongoDb Conectado en: ${url}`)
    } catch (error) {
        console.log(`error: ${error.message}`)
        process.exit(1)
    }
}

export default conectarDB