import { useState, useEffect } from 'react';
import { Search, Filter, Edit2, FileText, Eye, Trash2, Baby, Loader2, AlertCircle } from 'lucide-react';
import { AlunoService, TurmaService, Aluno, Turma } from '../services/api'; // Ajuste o caminho

// Interface estendida para o Front-end, juntando os dados do Aluno com o Nome da Turma
interface AlunoExpandido extends Aluno {
  turma_nome: string;
  responsavel_nome?: string; // Opcional: dependerá do seu backend enviar via JOIN
  telefone_principal?: string; // Opcional: dependerá do seu backend enviar via JOIN
}

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState<AlunoExpandido[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTurma, setFilterTurma] = useState('todas');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      // Busca Alunos e Turmas em paralelo
      const [alunosResponse, turmasResponse] = await Promise.all([
        AlunoService.getAll(),
        TurmaService.getAll()
      ]);

      const listaAlunos: Aluno[] = alunosResponse.data;
      const listaTurmas: Turma[] = turmasResponse.data;

      setTurmas(listaTurmas);

      // Cruza o turma_id do Aluno com o id da Turma para pegar o Nome
      const alunosMapeados: AlunoExpandido[] = listaAlunos.map(aluno => {
        const turmaDoAluno = listaTurmas.find(t => t.id === aluno.turma_id);
        
        return {
          ...aluno,
          turma_nome: turmaDoAluno ? turmaDoAluno.nome : 'Turma não encontrada',
          // Preenchendo com placeholders até o backend entregar esses dados na rota /alunos
          responsavel_nome: 'Aguardando vínculo...',
          telefone_principal: 'Aguardando vínculo...',
        };
      });

      setAlunos(alunosMapeados);
    } catch (err) {
      console.error("Erro ao carregar alunos:", err);
      setError("Não foi possível carregar a lista de alunos.");
    } finally {
      setLoading(false);
    }
  };

  const deletarAluno = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja desativar/excluir este aluno?")) return;

    try {
      await AlunoService.delete(id);
      // Remove o aluno da lista na tela sem precisar recarregar a página
      setAlunos(alunos.filter(aluno => aluno.id !== id));
    } catch (err) {
      console.error("Erro ao deletar aluno:", err);
      alert("Erro ao excluir o aluno. Tente novamente.");
    }
  };

  // Funcionalidade de Filtro e Busca
  const filteredStudents = alunos.filter(student => {
    const nomeAluno = student.nome.toLowerCase();
    const nomeResponsavel = (student.responsavel_nome || '').toLowerCase();
    const termoBusca = searchTerm.toLowerCase();

    const matchesSearch = nomeAluno.includes(termoBusca) || nomeResponsavel.includes(termoBusca);
    // Filtra pelo ID da turma ou "todas"
    const matchesTurma = filterTurma === 'todas' || student.turma_id.toString() === filterTurma;
    
    return matchesSearch && matchesTurma;
  });

  // Utilitários de Formatação
  const formatarData = (dataIso: string) => {
    if (!dataIso) return '';
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarIdade = (dataNasc: string) => {
    if (!dataNasc) return '';
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();

    if (meses < 0 || (meses === 0 && hoje.getDate() < nascimento.getDate())) {
      anos--;
      meses += 12;
    }

    if (anos === 0) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  };

  const getTurmaColor = (nomeTurma: string) => {
    const nomeNormalizado = nomeTurma.toLowerCase();
    if (nomeNormalizado.includes('berçário')) return 'bg-pink-100 text-pink-700';
    if (nomeNormalizado.includes('1')) return 'bg-blue-100 text-blue-700';
    if (nomeNormalizado.includes('2')) return 'bg-green-100 text-green-700';
    if (nomeNormalizado.includes('3')) return 'bg-purple-100 text-purple-700';
    return 'bg-slate-100 text-slate-700';
  };

  // Telas de Feedback
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#4A7C4E]" />
        <p className="text-slate-600 text-sm font-medium">Carregando lista de alunos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-xl mx-auto my-8">
        <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-900 mb-1">Erro de Conexão</h3>
        <p className="text-red-700 text-sm mb-4">{error}</p>
        <button onClick={carregarDados} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome do aluno ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-slate-600" />
            <select
              value={filterTurma}
              onChange={(e) => setFilterTurma(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            >
              <option value="todas">Todas as Turmas</option>
              {turmas.map(turma => (
                <option key={turma.id} value={turma.id.toString()}>
                  {turma.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          Exibindo <span className="font-semibold text-slate-900">{filteredStudents.length}</span> aluno(s)
        </p>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Aluno</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Idade</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Turma</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Responsável</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#4A7C4E] text-white flex items-center justify-center font-medium flex-shrink-0">
                        {student.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 flex items-center gap-2">
                          {student.nome}
                          {student.andarilha === 1 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                              <Baby className="h-3 w-3" />
                              Andarilha
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">Nasc: {formatarData(student.data_nasc)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {formatarIdade(student.data_nasc)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getTurmaColor(student.turma_nome)}`}>
                      {student.turma_nome}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-opacity-60 italic">
                    {student.responsavel_nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-opacity-60 italic">
                    {student.telefone_principal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Editar">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Documentos">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deletarAluno(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Desativar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum aluno encontrado</h3>
          <p className="text-slate-600">Tente ajustar os filtros ou termo de busca.</p>
        </div>
      )}
    </div>
  );
}