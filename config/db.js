// Importa el módulo mongoose para interactuar con MongoDB
import mongoose from "mongoose";

// Define una función asincrónica llamada conectarDB
const conectarDB = async () => {
    // Intenta conectarse a la base de datos MongoDB utilizando la URI proporcionada en el archivo de entorno
try {
    // Establece la conexión a MongoDB y espera a que se complete
    const conexion = await mongoose.connect(process.env.MONGODB_URI);

    // Obtiene la información de host y puerto de la conexión usando la variable 'conexion'. MongoDB tiene una propiedad llamada connection, y dentro de ella es donde se encuentran las propiedades como host y port. Por lo tanto, para acceder a estas propiedades, necesitas usar conexion.connection.host y conexion.connection.port.
    const url = `${conexion.connection.host}:${conexion.connection.port}`;

    // Imprime en la consola un mensaje indicando que la conexión a MongoDB ha sido exitosa
    console.log(`MongoDB Conectado en: ${url}`);
} catch (error) {
    // En caso de error, imprime en la consola un mensaje de error
    console.log(`Error: ${error.message}`);
    
    // Termina el proceso con código 1 (indicando un error)
    process.exit(1);
}

};

// Exporta la función conectarDB para que pueda ser utilizada en otros archivos
export default conectarDB;