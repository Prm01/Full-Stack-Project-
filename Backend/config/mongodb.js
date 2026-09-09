import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI is not configured');
    }

    if (!/^mongodb(?:\+srv)?:\/\//.test(mongoUri)) {
        throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
    }

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });

    await mongoose.connect(mongoUri, { dbName: 'Doctor' });
}
export default connectDB;