// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; 

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            console.log("Login bem-sucedido! Redirecionando para a dashboard...");
            const data = await res.json();
            // Armazena o username no localStorage, se necessário
            localStorage.setItem('username', data.username);
            router.push('/dashboard');
        } else {
            const errorData = await res.json();
            console.error(errorData.message);
            alert('Credenciais inválidas. Tente novamente.'); // Alerta ao usuário
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-gray-800 border-4 border-blue-500 p-10 rounded-lg shadow-lg max-w-md w-full transition duration-300 transform hover:scale-105">
                <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">Login</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded transition duration-200"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-blue-300">
                    Não tem conta? <Link href="/register" className="text-blue-400 hover:underline">Registre-se</Link>
                </p>
            </div>
        </div>
    );
}
