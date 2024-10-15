import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import Machine from '../../models/Machine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    const { username, machineId } = req.body;

    if (!username || !machineId) {
        return res.status(400).json({ message: 'Usuário ou máquina não fornecidos' });
    }

    try {
        // Verifica se o usuário existe
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Atribui a máquina ao usuário
        user.machineId = machineId; // Altere de acordo com seu esquema
        await user.save();

        return res.status(200).json({ message: 'Máquina atribuída com sucesso!' });
    } catch (error) {
        console.error('Erro ao atribuir máquina:', error);
        return res.status(500).json({ message: 'Erro ao atribuir máquina' });
    }
}
