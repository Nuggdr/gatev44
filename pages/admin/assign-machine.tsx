import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    _id: string;
    username: string;
}

interface Machine {
    _id: string;
    ip: string;
}

const AssignMachinePage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [machines, setMachines] = useState<Machine[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [selectedMachineId, setSelectedMachineId] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        // Função para buscar os usuários
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        // Função para buscar as máquinas
        const fetchMachines = async () => {
            try {
                const response = await axios.get('/api/machines');
                setMachines(response.data);
            } catch (error) {
                console.error('Erro ao buscar máquinas:', error);
            }
        };

        fetchUsers();
        fetchMachines();
    }, []);

    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUserId(event.target.value);
    };

    const handleMachineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMachineId(event.target.value);
    };

    const handleAssign = async () => {
        try {
            const response = await axios.post('/api/assign-machine', {
                userId: selectedUserId,
                machineId: selectedMachineId,
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Erro ao atribuir máquina:', error);
            setMessage('Erro ao atribuir máquina');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Atribuir Máquina a Usuário</h1>

            <div className="mb-4">
                <label htmlFor="user" className="block mb-2 text-sm font-medium text-gray-200">Selecione o Usuário</label>
                <select
                    id="user"
                    value={selectedUserId}
                    onChange={handleUserChange}
                    className="bg-gray-800 text-white border border-gray-600 rounded-lg p-2"
                >
                    <option value="">Selecione um usuário</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.username}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="machine" className="block mb-2 text-sm font-medium text-gray-200">Selecione a Máquina</label>
                <select
                    id="machine"
                    value={selectedMachineId}
                    onChange={handleMachineChange}
                    className="bg-gray-800 text-white border border-gray-600 rounded-lg p-2"
                >
                    <option value="">Selecione uma máquina</option>
                    {machines.map((machine) => (
                        <option key={machine._id} value={machine._id}>
                            {machine.ip}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleAssign}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
                Atribuir Máquina
            </button>

            {message && <p className="mt-4 text-gray-300">{message}</p>}
        </div>
    );
};

export default AssignMachinePage;
