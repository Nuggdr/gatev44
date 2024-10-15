import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import Machine from '../../models/Machine'; // Mantido caso seja necessário futuramente

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === 'POST') {
        const { userId, machineId } = req.body;

        try {
            // Busca o usuário e a máquina pelo ID
            const user = await User.findById(userId);
            const machine = await Machine.findById(machineId);

            if (!user || !machine) {
                return res.status(404).json({ message: 'Usuário ou Máquina não encontrados' });
            }

            // Atribui a máquina ao usuário
            user.machineId = machine._id;
            await user.save();

            return res.status(200).json({ message: 'Máquina atribuída com sucesso' });
        } catch (error) {
            console.error('Erro ao atribuir máquina:', error);
            return res.status(500).json({ message: 'Erro ao atribuir máquina' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Método ${req.method} não permitido`);
    }
}
