// models/Machine.ts
import mongoose from 'mongoose';

const MachineSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
});

export default mongoose.models.Machine || mongoose.model('Machine', MachineSchema);
