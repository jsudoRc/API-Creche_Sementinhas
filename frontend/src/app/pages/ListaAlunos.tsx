import { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { Search, Filter, Edit2, FileText, Eye, Trash2, Baby, Loader2, AlertCircle, X, Save } from 'lucide-react';
import { AlunoService, TurmaService, ArquivoService, Aluno, Turma, Arquivo } from '../services/api';

// Interface estendida para o Front-end, juntando os dados do Aluno com o Nome da Turma
interface AlunoExpandido extends Aluno {
  turma_nome: string;
  responsavel_nome?: string; // Opcional: dependerá do seu backend enviar via JOIN
  telefone_principal?: string; // Opcional: dependerá do seu backend enviar via JOIN
}

const FORM_EDICAO_INICIAL = {
  nome: '',
  data_nasc: '',
  cpf: '',
  sexo: 'Masculino' as Aluno['sexo'],
  andarilha: false,
  turma_id: '',
  cep: '',
  endereco: '',
  bairro: '',
  complemento: '',
  observacoes: '',
};

const FORM_ARQUIVO_INICIAL = {
  tipo_arquivo: '',
  caminho_arquivo: '',
};

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState<AlunoExpandido[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedAluno, setSelectedAluno] = useState<AlunoExpandido | null>(null);
  const [loadingDetailsId, setLoadingDetailsId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingAluno, setEditingAluno] = useState<AlunoExpandido | null>(null);
  const [editForm, setEditForm] = useState(FORM_EDICAO_INICIAL);
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [documentAluno, setDocumentAluno] = useState<AlunoExpandido | null>(null);
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [arquivoForm, setArquivoForm] = useState(FORM_ARQUIVO_INICIAL);
  const [arquivoError, setArquivoError] = useState<string | null>(null);
  const [loadingArquivosId, setLoadingArquivosId] = useState<number | null>(null);
  const [savingArquivo, setSavingArquivo] = useState(false);
  const [deletingArquivoId, setDeletingArquivoId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTurma, setFilterTurma] = useState('todas');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      setActionError(null);

      // Busca Alunos e Turmas em paralelo
      const [alunosResponse, turmasResponse] = await Promise.all([
        AlunoService.getAll(),
        TurmaService.getAll()
      ]);

      const listaAlunos: Aluno[] = alunosResponse.data;
      const listaTurmas: Turma[] = turmasResponse.data;

      setTurmas(listaTurmas);

      // Cruza o turma_id do Aluno com o id da Turma para pegar o Nome
      const alunosMapeados: AlunoExpandido[] = listaAlunos.map(aluno => mapearAluno(aluno, listaTurmas));

      setAlunos(alunosMapeados);
    } catch (err) {
      console.error("Erro ao carregar alunos:", err);
      setError(getApiErrorMessage(err, "Não foi possível carregar a lista de alunos."));
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

  const mapearAluno = (aluno: Aluno, listaTurmas = turmas): AlunoExpandido => {
    const turmaDoAluno = listaTurmas.find(t => t.id === aluno.turma_id);

    return {
      ...aluno,
      turma_nome: turmaDoAluno ? turmaDoAluno.nome : 'Turma não encontrada',
      // O backend ainda não possui endpoint de vínculo aluno-responsável para popular esses campos.
      responsavel_nome: 'Aguardando vínculo...',
      telefone_principal: 'Aguardando vínculo...',
    };
  };

  const visualizarAluno = async (id: number) => {
    try {
      setLoadingDetailsId(id);
      setActionError(null);
      setEditingAluno(null);
      setDocumentAluno(null);
      const response = await AlunoService.getById(id);
      setSelectedAluno(mapearAluno(response.data));
    } catch (err) {
      console.error("Erro ao carregar detalhes do aluno:", err);
      setActionError(getApiErrorMessage(err, "Erro ao carregar detalhes do aluno."));
    } finally {
      setLoadingDetailsId(null);
    }
  };

  const limparNumeros = (valor: string) => valor.replace(/\D/g, '');

  const iniciarEdicao = (aluno: AlunoExpandido) => {
    setSelectedAluno(null);
    setDocumentAluno(null);
    setActionError(null);
    setEditError(null);
    setEditingAluno(aluno);
    setEditForm({
      nome: aluno.nome,
      data_nasc: aluno.data_nasc,
      cpf: aluno.cpf,
      sexo: aluno.sexo,
      andarilha: aluno.andarilha === 1,
      turma_id: String(aluno.turma_id),
      cep: aluno.cep || '',
      endereco: aluno.endereco || '',
      bairro: aluno.bairro || '',
      complemento: aluno.complemento || '',
      observacoes: aluno.observacoes || '',
    });
  };

  const cancelarEdicao = () => {
    setEditingAluno(null);
    setEditForm(FORM_EDICAO_INICIAL);
    setEditError(null);
  };

  const fecharDocumentos = () => {
    setDocumentAluno(null);
    setArquivos([]);
    setArquivoForm(FORM_ARQUIVO_INICIAL);
    setArquivoError(null);
  };

  const carregarArquivosDoAluno = async (aluno: AlunoExpandido) => {
    try {
      setLoadingArquivosId(aluno.id);
      setActionError(null);
      setArquivoError(null);
      setSelectedAluno(null);
      setEditingAluno(null);

      const response = await ArquivoService.getAll();
      setArquivos(response.data.filter(arquivo => arquivo.aluno_id === aluno.id));
      setDocumentAluno(aluno);
    } catch (err) {
      console.error("Erro ao carregar documentos do aluno:", err);
      setActionError(getApiErrorMessage(err, "Erro ao carregar documentos do aluno."));
    } finally {
      setLoadingArquivosId(null);
    }
  };

  const handleArquivoChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setArquivoError(null);
    setArquivoForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const salvarArquivo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!documentAluno) return;

    if (!arquivoForm.tipo_arquivo.trim()) {
      setArquivoError('Informe o tipo do documento.');
      return;
    }

    if (!arquivoForm.caminho_arquivo.trim()) {
      setArquivoError('Informe o caminho ou URL do documento.');
      return;
    }

    try {
      setSavingArquivo(true);
      setArquivoError(null);

      const response = await ArquivoService.create({
        tipo_arquivo: arquivoForm.tipo_arquivo.trim(),
        caminho_arquivo: arquivoForm.caminho_arquivo.trim(),
        aluno_id: documentAluno.id,
      });

      setArquivos(prev => [...prev, response.data]);
      setArquivoForm(FORM_ARQUIVO_INICIAL);
    } catch (err) {
      console.error("Erro ao cadastrar documento:", err);
      setArquivoError(getApiErrorMessage(err, "Erro ao cadastrar documento. Verifique os dados e tente novamente."));
    } finally {
      setSavingArquivo(false);
    }
  };

  const excluirArquivo = async (arquivoId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      setDeletingArquivoId(arquivoId);
      setArquivoError(null);
      await ArquivoService.delete(arquivoId);
      setArquivos(prev => prev.filter(arquivo => arquivo.id !== arquivoId));
    } catch (err) {
      console.error("Erro ao excluir documento:", err);
      setArquivoError(getApiErrorMessage(err, "Erro ao excluir documento. Tente novamente."));
    } finally {
      setDeletingArquivoId(null);
    }
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;
    setEditError(null);
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validarEdicao = () => {
    if (editForm.nome.trim().length < 2) return 'Informe o nome completo do aluno.';
    if (!editForm.data_nasc) return 'Informe a data de nascimento.';
    if (limparNumeros(editForm.cpf).length !== 11) return 'Informe um CPF com 11 dígitos.';
    if (!editForm.sexo) return 'Selecione o sexo.';
    if (!editForm.turma_id) return 'Selecione uma turma.';

    return null;
  };

  const salvarEdicao = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingAluno) return;

    const erroValidacao = validarEdicao();
    if (erroValidacao) {
      setEditError(erroValidacao);
      return;
    }

    try {
      setSavingEdit(true);
      setEditError(null);
      setActionError(null);

      const response = await AlunoService.update(editingAluno.id, {
        nome: editForm.nome.trim(),
        data_nasc: editForm.data_nasc,
        cpf: limparNumeros(editForm.cpf),
        sexo: editForm.sexo,
        andarilha: editForm.andarilha ? 1 : 0,
        turma_id: Number(editForm.turma_id),
        cep: editForm.cep.trim() || null,
        endereco: editForm.endereco.trim() || null,
        bairro: editForm.bairro.trim() || null,
        complemento: editForm.complemento.trim() || null,
        observacoes: editForm.observacoes.trim() || null,
      });

      const alunoAtualizado = mapearAluno(response.data);
      setAlunos(prev => prev.map(aluno => aluno.id === alunoAtualizado.id ? alunoAtualizado : aluno));
      setSelectedAluno(alunoAtualizado);
      cancelarEdicao();
    } catch (err) {
      console.error("Erro ao atualizar aluno:", err);
      setEditError(getApiErrorMessage(err, "Erro ao atualizar aluno. Verifique os dados e tente novamente."));
    } finally {
      setSavingEdit(false);
    }
  };

  const deletarAluno = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja desativar/excluir este aluno?")) return;

    try {
      setDeletingId(id);
      setActionError(null);
      await AlunoService.delete(id);
      setAlunos(prev => prev.filter(aluno => aluno.id !== id));
      if (selectedAluno?.id === id) setSelectedAluno(null);
      if (editingAluno?.id === id) cancelarEdicao();
      if (documentAluno?.id === id) fecharDocumentos();
    } catch (err) {
      console.error("Erro ao deletar aluno:", err);
      setActionError(getApiErrorMessage(err, "Erro ao excluir o aluno. Tente novamente."));
    } finally {
      setDeletingId(null);
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
      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-700 font-medium">{actionError}</p>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Fechar erro"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {editingAluno && (
        <form onSubmit={salvarEdicao} className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#4A7C4E] p-3 rounded-lg">
                <Edit2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Editar Aluno</h3>
                <p className="text-sm text-slate-500">Atualize os dados principais de {editingAluno.nome}.</p>
              </div>
            </div>
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
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">{editError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome completo *</label>
              <input
                type="text"
                name="nome"
                value={editForm.nome}
                onChange={handleEditChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">CPF *</label>
              <input
                type="text"
                name="cpf"
                value={editForm.cpf}
                onChange={handleEditChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Data de nascimento *</label>
              <input
                type="date"
                name="data_nasc"
                value={editForm.data_nasc}
                onChange={handleEditChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sexo *</label>
              <select
                name="sexo"
                value={editForm.sexo}
                onChange={handleEditChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                required
              >
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Turma *</label>
              <select
                name="turma_id"
                value={editForm.turma_id}
                onChange={handleEditChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                required
              >
                <option value="">Selecione...</option>
                {turmas.map(turma => (
                  <option key={turma.id} value={turma.id.toString()}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-8">
              <input
                type="checkbox"
                name="andarilha"
                checked={editForm.andarilha}
                onChange={handleEditChange}
                className="w-5 h-5 text-[#4A7C4E] border-slate-300 rounded focus:ring-[#4A7C4E]"
              />
              <label className="text-sm font-medium text-slate-700">Criança Andarilha</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">CEP</label>
              <input
                type="text"
                name="cep"
                value={editForm.cep}
                onChange={handleEditChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Endereço</label>
              <input
                type="text"
                name="endereco"
                value={editForm.endereco}
                onChange={handleEditChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bairro</label>
              <input
                type="text"
                name="bairro"
                value={editForm.bairro}
                onChange={handleEditChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Complemento</label>
              <input
                type="text"
                name="complemento"
                value={editForm.complemento}
                onChange={handleEditChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-2">Observações</label>
              <textarea
                name="observacoes"
                value={editForm.observacoes}
                onChange={handleEditChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={cancelarEdicao}
              disabled={savingEdit}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={savingEdit}
              className="px-6 py-3 bg-[#4A7C4E] text-white rounded-lg hover:bg-[#3D6640] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {savingEdit ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              Salvar Alterações
            </button>
          </div>
        </form>
      )}

      {documentAluno && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Documentos do Aluno</h3>
                <p className="text-sm text-slate-500">{documentAluno.nome}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fecharDocumentos}
              className="text-slate-500 hover:text-slate-700 transition-colors"
              aria-label="Fechar documentos"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {arquivoError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">{arquivoError}</p>
            </div>
          )}

          <form onSubmit={salvarArquivo} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo *</label>
              <select
                name="tipo_arquivo"
                value={arquivoForm.tipo_arquivo}
                onChange={handleArquivoChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                required
              >
                <option value="">Selecione...</option>
                <option value="foto">Foto</option>
                <option value="autorizacao_img">Autorização de imagem</option>
                <option value="receita_antitermico">Receita antitérmico</option>
                <option value="documento">Documento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Caminho ou URL *</label>
              <input
                type="text"
                name="caminho_arquivo"
                value={arquivoForm.caminho_arquivo}
                onChange={handleArquivoChange}
                placeholder="Ex: uploads/ficha.pdf ou https://..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={savingArquivo}
                className="w-full md:w-auto px-6 py-3 bg-[#4A7C4E] text-white rounded-lg hover:bg-[#3D6640] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {savingArquivo ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                Salvar
              </button>
            </div>
          </form>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            {arquivos.length === 0 ? (
              <p className="text-sm text-slate-500 p-4">Nenhum documento cadastrado para este aluno.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Caminho</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Upload</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {arquivos.map(arquivo => (
                      <tr key={arquivo.id}>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{arquivo.tipo_arquivo}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 max-w-md break-all">{arquivo.caminho_arquivo}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{arquivo.data_upload ? formatarData(arquivo.data_upload.slice(0, 10)) : '—'}</td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            type="button"
                            onClick={() => excluirArquivo(arquivo.id)}
                            disabled={deletingArquivoId === arquivo.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            title="Excluir documento"
                          >
                            {deletingArquivoId === arquivo.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Esta integração usa o endpoint atual de arquivos, que cadastra metadados. Upload físico de arquivo ainda depende de suporte específico no backend.
          </p>
        </div>
      )}

      {selectedAluno && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#4A7C4E] text-white flex items-center justify-center font-semibold">
                {selectedAluno.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{selectedAluno.nome}</h3>
                <p className="text-sm text-slate-500">Ficha rápida do aluno</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedAluno(null)}
              className="text-slate-500 hover:text-slate-700 transition-colors"
              aria-label="Fechar detalhes"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'CPF', value: selectedAluno.cpf },
              { label: 'Nascimento', value: formatarData(selectedAluno.data_nasc) },
              { label: 'Idade', value: formatarIdade(selectedAluno.data_nasc) },
              { label: 'Sexo', value: selectedAluno.sexo },
              { label: 'Turma', value: selectedAluno.turma_nome },
              { label: 'Andarilha', value: selectedAluno.andarilha === 1 ? 'Sim' : 'Não' },
              { label: 'CEP', value: selectedAluno.cep || 'Não informado' },
              { label: 'Endereço', value: selectedAluno.endereco || 'Não informado' },
              { label: 'Bairro', value: selectedAluno.bairro || 'Não informado' },
              { label: 'Complemento', value: selectedAluno.complemento || 'Não informado' },
              { label: 'Observações', value: selectedAluno.observacoes || 'Sem observações' },
              { label: 'Restrição alimentar', value: selectedAluno.restricao_alimentar === 1 ? selectedAluno.restricao_descricao || 'Sim' : 'Não' },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
                      <button
                        onClick={() => visualizarAluno(student.id)}
                        disabled={loadingDetailsId === student.id}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        title="Visualizar"
                      >
                        {loadingDetailsId === student.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => iniciarEdicao(student)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => carregarArquivosDoAluno(student)}
                        disabled={loadingArquivosId === student.id}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        title="Documentos"
                      >
                        {loadingArquivosId === student.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </button>
                      <button 
                        onClick={() => deletarAluno(student.id)}
                        disabled={deletingId === student.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
                        title="Desativar"
                      >
                        {deletingId === student.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
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
