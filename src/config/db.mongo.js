import mongoose from 'mongoose';

export async function connectMongo() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('Falta la variable MONGO_URI en el archivo .env');
    }

    await mongoose.connect(uri);
    console.log('Conectado correctamente a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
}
