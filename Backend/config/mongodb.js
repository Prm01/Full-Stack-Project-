import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI is not configured');
    }

    if (!/^mongodb(?:\+srv)?:\/\//.test(mongoUri)) {
        throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
    }

    mongoose.set('bufferCommands', false);

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (error) => {
        console.error(`MongoDB connection error: ${error.message}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.error('MongoDB disconnected');
    });

    await mongoose.connect(mongoUri, {
        dbName: 'Doctor',
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
    });
}
export default connectDB;