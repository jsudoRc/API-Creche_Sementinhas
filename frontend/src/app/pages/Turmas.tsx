import { isAxiosError } from 'axios';
import { Baby, Users, Clock, AlertCircle, Loader2, PlusCircle, Edit2, Trash2, X, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TurmaService, AlunoService, Turma, Aluno } from '../services/api';

// Criamos uma interface estendida para o Frontend que une a Turma com seus respectivos Alunos
interface TurmaComAlunos extends Turma {
  alunos: Aluno[];
}

const FORM_INICIAL = {
  nome: '',
  idade_min: '',
  idade_max: '',
  capacidade: '',
  valor_mensal: '',
  periodo: 'integral' as Turma['periodo'],
};

export default function Turmas() {
  const [turmas, setTurmas] = useState<TurmaComAlunos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState(FORM_INICIAL);
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEditId, setSavingEditId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Estados para os cards de estatísticas globais
  const [stats, setStats] = useState({
    totalTurmas: 0,
    totalAlunos: 0,
    capacidadeTotal: 0,
    vagasDisponiveis: 0
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscando turmas e alunos em paralelo para otimizar a performance
      const [turmasResponse, alunosResponse] = await Promise.all([
        TurmaService.getAll(),
        AlunoService.getAll()
      ]);

      const listaTurmas: Turma[] = turmasResponse.data;
      const listaAlunos: Aluno[] = alunosResponse.data;

      // Cruza os dados: Vincula cada aluno à sua respectiva turma pelo turma_id
      const turmasFormatadas: TurmaComAlunos[] = listaTurmas.map((turma) => ({
        ...turma,
        alunos: listaAlunos.filter((aluno) => aluno.turma_id === turma.id)
      }));

      // Calcula os indicadores gerais dinamicamente com base no Banco de Dados
      const totalTurmas = turmasFormatadas.length;
      const totalAlunos = listaAlunos.length;
      const capacidadeTotal = turmasFormatadas.reduce((acc, t) => acc + t.capacidade, 0);
      const vagasDisponiveis = Math.max(0, capacidadeTotal - totalAlunos);

      setTurmas(turmasFormatadas);
      setStats({
        totalTurmas,
        totalAlunos,
        capacidadeTotal,
        vagasDisponiveis
      });

    } catch (err) {
      console.error("Erro ao carregar dados das turmas:", err);
      setError("Não foi possível carregar as informações das turmas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const getApiErrorMessage = (err: unknown, fallback: string) => {
    if (isAxiosError(err)) {
      const data = err.response?.data as { message?: string; error?: string; details?: Array<{ message?: string }> } | undefined;
      const detail = data?.details?.find(item => item.message)?.message;
      return detail || data?.message || data?.error || fallback;
    }

    return fallback;
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormError(null);
    setFormSuccess(null);
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validarFormulario = (dados = formData) => {
    const idadeMin = Number(dados.idade_min);
    const idadeMax = Number(dados.idade_max);
    const capacidade = Number(dados.capacidade);
    const valorMensal = Number(dados.valor_mensal);

    if (!dados.nome.trim()) return 'Informe o nome da turma.';
    if (!Number.isInteger(idadeMin) || idadeMin < 0) return 'A idade mínima deve ser um número inteiro não negativo.';
    if (!Number.isInteger(idadeMax) || idadeMax <= 0) return 'A idade máxima deve ser um número inteiro maior que zero.';
    if (idadeMin > idadeMax) return 'A idade mínima deve ser menor ou igual à idade máxima.';
    if (!Number.isInteger(capacidade) || capacidade <= 0) return 'A capacidade deve ser um número inteiro maior que zero.';
    if (!Number.isFinite(valorMensal) || valorMensal <= 0) return 'O valor mensal deve ser maior que zero.';

    return null;
  };

  const cadastrarTurma = async (event: React.FormEvent) => {
    event.preventDefault();

    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      setFormError(erroValidacao);
      return;
    }

    try {
      setIsSaving(true);
      setFormError(null);
      setFormSuccess(null);

      await TurmaService.create({
        nome: formData.nome.trim(),
        idade_min: Number(formData.idade_min),
        idade_max: Number(formData.idade_max),
        capacidade: Number(formData.capacidade),
        valor_mensal: Number(formData.valor_mensal),
        periodo: formData.periodo,
      });

      setFormData(FORM_INICIAL);
      setFormSuccess('Turma cadastrada com sucesso.');
      await carregarDados();
    } catch (err) {
      console.error('Erro ao cadastrar turma:', err);
      setFormError(getApiErrorMessage(err, 'Erro ao cadastrar turma. Verifique os dados e tente novamente.'));
    } finally {
      setIsSaving(false);
    }
  };

  const iniciarEdicao = (turma: Turma) => {
    setEditingId(turma.id);
    setEditError(null);
    setFormError(null);
    setFormSuccess(null);
    setEditData({
      nome: turma.nome,
      idade_min: String(turma.idade_min),
      idade_max: String(turma.idade_max),
      capacidade: String(turma.capacidade),
      valor_mensal: String(turma.valor_mensal),
      periodo: turma.periodo,
    });
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setEditData(FORM_INICIAL);
    setEditError(null);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setEditError(null);
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const salvarEdicao = async (turmaId: number) => {
    const erroValidacao = validarFormulario(editData);
    if (erroValidacao) {
      setEditError(erroValidacao);
      return;
    }

    try {
      setSavingEditId(turmaId);
      setEditError(null);

      await TurmaService.update(turmaId, {
        nome: editData.nome.trim(),
        idade_min: Number(editData.idade_min),
        idade_max: Number(editData.idade_max),
        capacidade: Number(editData.capacidade),
        valor_mensal: Number(editData.valor_mensal),
        periodo: editData.periodo,
      });

      cancelarEdicao();
      setFormSuccess('Turma atualizada com sucesso.');
      await carregarDados();
    } catch (err) {
      console.error('Erro ao atualizar turma:', err);
      setEditError(getApiErrorMessage(err, 'Erro ao atualizar turma. Verifique os dados e tente novamente.'));
    } finally {
      setSavingEditId(null);
    }
  };

  const excluirTurma = async (turma: TurmaComAlunos) => {
    if (turma.alunos.length > 0) {
      iniciarEdicao(turma);
      setEditError('Não é possível excluir uma turma com alunos vinculados.');
      return;
    }

    if (!window.confirm(`Tem certeza que deseja excluir a turma "${turma.nome}"?`)) return;

    try {
      setDeletingId(turma.id);
      setFormError(null);
      setFormSuccess(null);
      await TurmaService.delete(turma.id);
      setFormSuccess('Turma excluída com sucesso.');
      await carregarDados();
    } catch (err) {
      console.error('Erro ao excluir turma:', err);
      setFormError(getApiErrorMessage(err, 'Erro ao excluir turma. Tente novamente.'));
    } finally {
      setDeletingId(null);
    }
  };

  // Helper para mapear cores dinâmicas baseadas no ID ou nome da turma (já que o banco não guarda a cor do Tailwind)
  const getTurmaColor = (periodo: string) => {
    if (periodo.toLowerCase().includes('integral')) return 'bg-purple-500';
    if (periodo.toLowerCase().includes('manhã')) return 'bg-blue-500';
    return 'bg-pink-500';
  };

  // Função auxiliar para calcular a idade a partir da data de nascimento (YYYY-MM-DD)
  const formatarIdade = (dataNasc: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();

    if (meses < 0 || (meses === 0 && hoje.getDate() < nascimento.getDate())) {
      anos--;
      meses += 12;
    }

    if (anos === 0) {
      return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    }
    
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}${meses > 0 ? ` e ${meses} ${meses === 1 ? 'mês' : 'meses'}` : ''}`;
  };

  const getOcupacaoPercent = (matriculados: number, capacidade: number) => {
    if (capacidade === 0) return 0;
    return (matriculados / capacidade) * 100;
  };

  const getOcupacaoColor = (percent: number) => {
    if (percent >= 90) return 'text-red-600';
    if (percent >= 70) return 'text-amber-600';
    return 'text-green-600';
  };

  // Tela de carregamento (Feedback visual)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#4A7C4E]" />
        <p className="text-slate-600 text-sm font-medium">Carregando informações das turmas...</p>
      </div>
    );
  }

  // Tela de erro amigável
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-xl mx-auto my-8">
        <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-900 mb-1">Erro de Conexão</h3>
        <p className="text-red-700 text-sm mb-4">{error}</p>
        <button 
          onClick={carregarDados}
          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cadastro de Turma */}
      <form onSubmit={cadastrarTurma} className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#4A7C4E] p-3 rounded-lg">
            <PlusCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Cadastrar Turma</h3>
            <p className="text-sm text-slate-500">Crie uma turma usando os campos exigidos pelo backend.</p>
          </div>
        </div>

        {formError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700 font-medium">{formError}</p>
          </div>
        )}

        {formSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium">{formSuccess}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Nome da Turma *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
              placeholder="Ex: Maternal 1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Período *</label>
            <select
              name="periodo"
              value={formData.periodo}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
              required
            >
              <option value="manhã">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="integral">Integral</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Idade mínima *</label>
            <input
              type="number"
              name="idade_min"
              value={formData.idade_min}
              onChange={handleFormChange}
              min="0"
              step="1"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Idade máxima *</label>
            <input
              type="number"
              name="idade_max"
              value={formData.idade_max}
              onChange={handleFormChange}
              min="1"
              step="1"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Capacidade *</label>
            <input
              type="number"
              name="capacidade"
              value={formData.capacidade}
              onChange={handleFormChange}
              min="1"
              step="1"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Valor mensal (R$) *</label>
            <input
              type="number"
              name="valor_mensal"
              value={formData.valor_mensal}
              onChange={handleFormChange}
              min="0.01"
              step="0.01"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-[#4A7C4E] text-white rounded-lg hover:bg-[#3D6640] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                Cadastrar Turma
              </>
            )}
          </button>
        </div>
      </form>

      {/* Overview Stats (Dinâmicos) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-[#4A7C4E]" />
            <span className="text-sm font-medium text-slate-600">Total de Turmas</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalTurmas}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Baby className="h-5 w-5 text-[#4A7C4E]" />
            <span className="text-sm font-medium text-slate-600">Total de Alunos</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalAlunos}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-[#4A7C4E]" />
            <span className="text-sm font-medium text-slate-600">Capacidade Total</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.capacidadeTotal}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-[#4A7C4E]" />
            <span className="text-sm font-medium text-slate-600">Vagas Disponíveis</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.vagasDisponiveis}</p>
        </div>
      </div>

      {/* Turmas List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {turmas.map((turma) => {
          const matriculadosCount = turma.alunos.length;
          const ocupacaoPercent = getOcupacaoPercent(matriculadosCount, turma.capacidade);
          const turmaCor = getTurmaColor(turma.periodo);

          return (
            <div key={turma.id} className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className={`${turmaCor} p-4 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Baby className="h-6 w-6" />
                    <div>
                      <h3 className="text-lg font-bold">{turma.nome}</h3>
                      <p className="text-sm opacity-90">Idade: {turma.idade_min} a {turma.idade_max} anos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{matriculadosCount}/{turma.capacidade}</p>
                    <p className="text-xs opacity-90">alunos</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-300"
                    style={{ width: `${ocupacaoPercent}%` }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-end gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => iniciarEdicao(turma)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => excluirTurma(turma)}
                    disabled={deletingId === turma.id}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {deletingId === turma.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Excluir
                  </button>
                </div>

                {editingId === turma.id && (
                  <div className="mb-4 border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h4 className="text-sm font-semibold text-slate-800">Editar turma</h4>
                      <button
                        type="button"
                        onClick={cancelarEdicao}
                        className="text-slate-500 hover:text-slate-700 transition-colors"
                        aria-label="Cancelar edição"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {editError && (
                      <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700 font-medium">{editError}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Nome da Turma</label>
                        <input
                          type="text"
                          name="nome"
                          value={editData.nome}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Período</label>
                        <select
                          name="periodo"
                          value={editData.periodo}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                        >
                          <option value="manhã">Manhã</option>
                          <option value="tarde">Tarde</option>
                          <option value="integral">Integral</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Capacidade</label>
                        <input
                          type="number"
                          name="capacidade"
                          value={editData.capacidade}
                          onChange={handleEditChange}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Idade mínima</label>
                        <input
                          type="number"
                          name="idade_min"
                          value={editData.idade_min}
                          onChange={handleEditChange}
                          min="0"
                          step="1"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Idade máxima</label>
                        <input
                          type="number"
                          name="idade_max"
                          value={editData.idade_max}
                          onChange={handleEditChange}
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Valor mensal (R$)</label>
                        <input
                          type="number"
                          name="valor_mensal"
                          value={editData.valor_mensal}
                          onChange={handleEditChange}
                          min="0.01"
                          step="0.01"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={cancelarEdicao}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => salvarEdicao(turma.id)}
                        disabled={savingEditId === turma.id}
                        className="px-4 py-2 bg-[#4A7C4E] text-white rounded-lg hover:bg-[#3D6640] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {savingEditId === turma.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Salvar
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Período: {turma.periodo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      Mensalidade: R$ {turma.valor_mensal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Occupancy Alert */}
                {ocupacaoPercent >= 80 && (
                  <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
                    ocupacaoPercent >= 90 ? 'bg-red-50' : 'bg-amber-50'
                  }`}>
                    <AlertCircle className={`h-4 w-4 flex-shrink-0 ${getOcupacaoColor(ocupacaoPercent)}`} />
                    <p className={`text-sm ${getOcupacaoColor(ocupacaoPercent)}`}>
                      {ocupacaoPercent >= 90
                        ? `Turma quase cheia! Apenas ${turma.capacidade - matriculadosCount} vaga(s) disponível(is).`
                        : 'Turma com alta ocupação'}
                    </p>
                  </div>
                )}

                {/* Student List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Alunos Matriculados nesta Turma:</h4>
                  
                  {matriculadosCount === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">Nenhum aluno matriculado nesta turma ainda.</p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {turma.alunos.map((aluno) => (
                        <div key={aluno.id} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#4A7C4E] text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                              {aluno.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{aluno.nome}</p>
                              <p className="text-xs text-slate-500">{formatarIdade(aluno.data_nasc)}</p>
                            </div>
                          </div>
                          
                          {/* Em conformidade com o campo "andarilha" (INTEGER 0 ou 1) da sua tabela do Banco */}
                          {aluno.andarilha === 1 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full" title="Criança andarilha">
                              <Baby className="h-3 w-3" />
                              <span className="text-[10px]">Andarilha</span>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
