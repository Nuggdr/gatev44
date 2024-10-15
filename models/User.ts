import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Adicione o campo email se ainda não estiver lá
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine' } // Referência à máquina associada
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
