import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
     dob: {
        type: Date,
        required: false // or true depending on your requirements
    },
    // date: { type: Number, required: true }, // Fixed: require -> required
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
})

// ✅ Correct model creation
const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)

// ✅ Export the model, not the schema
export default appointmentModel