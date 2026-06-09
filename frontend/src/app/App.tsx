import { useState } from 'react';
import { Users, UserPlus, BookOpen, Calendar, FileText, Menu, Baby } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CadastroAluno from './pages/CadastroAluno';
import ListaAlunos from './pages/ListaAlunos';
import Turmas from './pages/Turmas';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Calendar },
    { id: 'cadastro', name: 'Nova Matrícula', icon: UserPlus },
    { id: 'alunos', name: 'Alunos', icon: Users },
    { id: 'turmas', name: 'Turmas', icon: BookOpen },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'cadastro':
        return <CadastroAluno />;
      case 'alunos':
        return <ListaAlunos />;
      case 'turmas':
        return <Turmas />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`bg-[#4A7C4E] text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between border-b border-[#3D6640]">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <Baby className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">Sementinhas</h1>
                <p className="text-xs text-green-100">Creche e Berçário</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#3D6640] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-white text-[#4A7C4E] shadow-md'
                    : 'hover:bg-[#3D6640] text-white'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">
            {menuItems.find(item => item.id === currentPage)?.name || 'Dashboard'}
          </h2>
        </div>
        <div className="p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
