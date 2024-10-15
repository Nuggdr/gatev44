import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaLock, FaUserAlt, FaDesktop } from 'react-icons/fa';

// Definindo a interface para o modelo de dados do usuário
interface Machine {
  ip: string;
  username: string;
  password: string;
}

interface UserData {
  machine: Machine | null; // máquina pode ser nula
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notification, setNotification] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const username = localStorage.getItem('username');
      
      if (!username) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/user-data', {
          headers: { 'username': username },
        });

        if (res.ok) {
          const data: UserData = await res.json();
          setUserData(data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setNotification('Erro ao carregar dados do usuário.');
      }
    };

    fetchData();
  }, [router]);

  const handlePowerOn = async () => {
    if (isDisabled) return;

    try {
      const webhookUrl = "https://discord.com/api/webhooks/1294002400129974302/_mb9MGycInAQkQm7w_-eG6QXslh7hylpMjPFK_Vq4FL7Irt4MPDLiInHCh-LETqTdO4h";
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `<@1232269234818646087>\nO usuário da máquina ${userData?.machine?.ip || 'sem IP'} solicitou ligamento.`,
        }),
      });

      setNotification('Sua máquina será ligada em até 1 hora, fique atento pois pode ser antes.');
      setIsDisabled(true);
      setTimeout(() => setNotification(''), 10000);
      setTimeout(() => setIsDisabled(false), 5 * 60 * 60 * 1000); // 5 horas
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
      setNotification('Erro ao enviar a solicitação de ligação.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {userData ? (
        <div className="bg-gray-800 p-10 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold text-blue-400 mb-5">Dashboard</h1>
          <div className="space-y-4">
            <p className="flex items-center justify-center text-white">
              <FaDesktop className="mr-2 text-blue-400" />
              IP: {userData.machine ? userData.machine.ip : 'sem assinatura'}
            </p>
            <p className="flex items-center justify-center text-white">
              <FaUserAlt className="mr-2 text-blue-400" />
              Usuário: {userData.machine ? userData.machine.username : 'sem assinatura'}
            </p>
            <p className="flex items-center justify-center text-white">
              <FaLock className="mr-2 text-blue-400" />
              Senha: {userData.machine ? userData.machine.password : 'sem assinatura'}
            </p>
            <button
              onClick={handlePowerOn}
              className={`mt-5 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md ${
                isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'
              }`}
              disabled={isDisabled}
            >
              Ligar
            </button>
          </div>

          {notification && (
            <div className="mt-5 p-4 text-blue-400 border border-blue-400 rounded-lg">
              {notification}
            </div>
          )}
        </div>
      ) : (
        <p className="text-white">Carregando...</p>
      )}
    </div>
  );
};

export default Dashboard;
