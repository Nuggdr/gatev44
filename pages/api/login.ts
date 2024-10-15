// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcryptjs'; // Alterar para bcryptjs

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === 'POST') {
        const { username, password } = req.body;

        // Tente encontrar o usuário no banco de dados
        const user = await User.findOne({ username });

        // Verifique se o usuário existe e se a senha está correta
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Se tudo estiver correto, retorne os dados do usuário (opcionalmente pode incluir um token)
        return res.status(200).json({
            username: user.username,
            email: user.email,
            ip: user.ip,
        });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} não permitido`);
}
