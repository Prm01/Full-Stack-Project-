import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.warn('MONGODB_URI is not configured. Database features are unavailable.');
        return;
    }

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });

    try {
        await mongoose.connect(`${mongoUri}/Doctor`);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
    }
}
export default connectDB;