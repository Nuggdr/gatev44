import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import Machine from '../../models/Machine'; // Certifique-se de importar o modelo Machine

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    const username = req.headers.username;

    if (!username) {
        return res.status(400).json({ message: 'Usuário não fornecido' });
    }

    try {
        // Buscando o usuário e populando os dados da máquina associada
        const user = await User.findOne({ username }).populate({
            path: 'machineId', // Certifique-se de que o campo é referenciado corretamente no modelo User
            model: Machine, // Especificando o modelo Machine explicitamente
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const userData = {
            username: user.username,
            email: user.email,
            ip: user.machineId ? user.machineId.ip : 'sem assinatura', // Exibimos 'sem assinatura' se não houver máquina
            machine: user.machineId ? {
                ip: user.machineId.ip,
                username: user.machineId.username,
                password: user.machineId.password,
            } : null, // Incluindo os dados da máquina associada se existir
        };

        return res.status(200).json(userData);
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return res.status(500).json({ message: 'Erro ao buscar dados do usuário' });
    }
}
