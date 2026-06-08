import { useState, useEffect } from 'react';
import { Save, User, Baby, DollarSign, FileText, Loader2 } from 'lucide-react';
import {
  AlunoService,
  TurmaService,
  ResponsavelService,
  MatriculaService,
  FuncionarioService,
  Turma,
  Funcionario,
} from '../services/api';

// ─── Estado inicial do formulário ────────────────────────────────────────────
const FORM_INICIAL = {
  // Passo 1 — Dados do aluno
  nome:       '',
  data_nasc:  '',
  cpf:        '',
  sexo:       '' as 'Masculino' | 'Feminino' | '',
  andarilha:  false,
  observacoes: '',
  cep:        '',
  endereco:   '',
  numero:     '',
  bairro:     '',
  complemento: '',

  // Passo 2 — Responsável principal
  resp_nome:              '',
  resp_cpf:               '',
  resp_cep:               '',
  resp_parentesco:        '',
  resp_profissao:         '',
  resp_finance:           false,

  // Passo 3 — Matrícula
  turma_id:         '',
  funcionario_id:   '',
  plano:            'Integral',
  valor_mensalidade: '',
  data_venc:        '10',
  inicio_vigencia:  '',
  fim_vigencia:     '',
  forma_pagamento:  'PIX',
};

export default function CadastroAluno() {
  const [step, setStep]                       = useState(1);
  const [turmas, setTurmas]                   = useState<Turma[]>([]);
  const [funcionarios, setFuncionarios]       = useState<Funcionario[]>([]);
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [formData, setFormData]               = useState(FORM_INICIAL);

  // Carrega turmas e funcionários ao montar o componente
  useEffect(() => {
    const carregar = async () => {
      try {
        const [resTurmas, resFuncs] = await Promise.all([
          TurmaService.getAll(),
          FuncionarioService.getAll(),
        ]);
        setTurmas(resTurmas.data);
        setFuncionarios(resFuncs.data);
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
        alert('Erro ao carregar turmas/funcionários. Verifique a conexão com o backend.');
      }
    };
    carregar();
  }, []);

  // Handler genérico para inputs, selects, textareas e checkboxes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submissão: salva aluno → responsável → matrícula em sequência
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ── 1. Criar o Aluno ──────────────────────────────────────────────────
      const cpfLimpo = formData.cpf.replace(/\D/g, ''); // remove pontos e traços
      const resAluno = await AlunoService.create({
        nome:                formData.nome,
        data_nasc:           formData.data_nasc,
        cpf:                 cpfLimpo,
        sexo:                formData.sexo as 'Masculino' | 'Feminino',
        andarilha:           formData.andarilha ? 1 : 0,
        observacoes:         formData.observacoes || null,
        cep:                 formData.cep || null,
        endereco:            formData.endereco
                               ? `${formData.endereco}, ${formData.numero}`
                               : null,
        bairro:              formData.bairro || null,
        complemento:         formData.complemento || null,
        turma_id:            Number(formData.turma_id),
        funcionario_id:      Number(formData.funcionario_id),
        // Campos de saúde — null por padrão, editáveis na ficha de anamnese
        autorizacao_img:     null,
        receita_antitermico: null,
        foto:                null,
        cirurgia_qual:       null,
        cirurgia_tempo:      null,
        problema_saude:      0,
        problema_saude_qual: null,
        alergia:             0,
        alergia_qual:        null,
        medicacao_continua:  0,
        medicacao_qual:      null,
        medicacao_tempo:     null,
        fratura:             0,
        fratura_qual:        null,
        fratura_tempo:       null,
        mamadeira:           0,
        formula_qual:        null,
        formula_quantidade_ml: null,
        chupeta:             0,
        fralda:              0,
        restricao_alimentar: 0,
        restricao_descricao: null,
      });

      const alunoId = resAluno.data.id;

      // ── 2. Criar o Responsável principal ─────────────────────────────────
      const cpfRespLimpo = formData.resp_cpf.replace(/\D/g, '');
      const cepRespLimpo = formData.resp_cep.replace(/\D/g, '');
      await ResponsavelService.create({
        nome:                formData.resp_nome,
        cpf:                 cpfRespLimpo,
        cep:                 cepRespLimpo,
        parentesco:          formData.resp_parentesco,
        profissao:           formData.resp_profissao || null,
        responsavel_finance: formData.resp_finance ? 1 : 0,
      });

      // ── 3. Criar a Matrícula ──────────────────────────────────────────────
      const valorNum = parseFloat(
        formData.valor_mensalidade.replace(/[R$\s]/g, '').replace(',', '.')
      );
      await MatriculaService.create({
        plano:            formData.plano,
        valor_mensalidade: valorNum,
        data_venc:        Number(formData.data_venc),
        inicio_vigencia:  formData.inicio_vigencia,
        fim_vigencia:     formData.fim_vigencia,
        forma_pagamento:  formData.forma_pagamento,
        data_saida:       null,
        aluno_id:         alunoId,
      });

      alert('Matrícula realizada com sucesso!');
      setFormData(FORM_INICIAL);
      setStep(1);

    } catch (err) {
      console.error('Erro ao salvar matrícula:', err);
      alert('Erro ao realizar a matrícula. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Passo 1: Dados do Aluno ─────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#4A7C4E] p-3 rounded-lg">
          <Baby className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">Dados do Aluno</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo *</label>
          <input
            type="text" name="nome" value={formData.nome} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Data de Nascimento *</label>
          <input
            type="date" name="data_nasc" value={formData.data_nasc} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">CPF *</label>
          <input
            type="text" name="cpf" value={formData.cpf} onChange={handleChange}
            placeholder="000.000.000-00"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Sexo *</label>
          <select
            name="sexo" value={formData.sexo} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          >
            <option value="">Selecione...</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
        </div>

        <div className="flex items-center gap-3 pt-6">
          <input
            type="checkbox" name="andarilha" checked={formData.andarilha} onChange={handleChange}
            className="w-5 h-5 text-[#4A7C4E] border-slate-300 rounded focus:ring-[#4A7C4E]"
          />
          <label className="text-sm font-medium text-slate-700">Criança Andarilha</label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Observações</label>
          <textarea
            name="observacoes" value={formData.observacoes} onChange={handleChange} rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">CEP</label>
          <input
            type="text" name="cep" value={formData.cep} onChange={handleChange}
            placeholder="00000-000"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Bairro</label>
          <input
            type="text" name="bairro" value={formData.bairro} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Endereço</label>
          <input
            type="text" name="endereco" value={formData.endereco} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Número</label>
          <input
            type="text" name="numero" value={formData.numero} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Complemento</label>
          <input
            type="text" name="complemento" value={formData.complemento} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  // ─── Passo 2: Responsável Principal ──────────────────────────────────────
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#4A7C4E] p-3 rounded-lg">
          <User className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">Responsável Principal</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo *</label>
          <input
            type="text" name="resp_nome" value={formData.resp_nome} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">CPF *</label>
          <input
            type="text" name="resp_cpf" value={formData.resp_cpf} onChange={handleChange}
            placeholder="000.000.000-00"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">CEP *</label>
          <input
            type="text" name="resp_cep" value={formData.resp_cep} onChange={handleChange}
            placeholder="00000-000"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Parentesco *</label>
          <select
            name="resp_parentesco" value={formData.resp_parentesco} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          >
            <option value="">Selecione...</option>
            <option value="Mãe">Mãe</option>
            <option value="Pai">Pai</option>
            <option value="Avó">Avó</option>
            <option value="Avô">Avô</option>
            <option value="Tio(a)">Tio(a)</option>
            <option value="Responsável Legal">Responsável Legal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Profissão</label>
          <input
            type="text" name="resp_profissao" value={formData.resp_profissao} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <input
            type="checkbox" name="resp_finance" checked={formData.resp_finance} onChange={handleChange}
            className="w-5 h-5 text-[#4A7C4E] border-slate-300 rounded focus:ring-[#4A7C4E]"
          />
          <label className="text-sm font-medium text-slate-700">É o responsável financeiro</label>
        </div>
      </div>
    </div>
  );

  // ─── Passo 3: Matrícula ───────────────────────────────────────────────────
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#4A7C4E] p-3 rounded-lg">
          <DollarSign className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">Dados da Matrícula</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Turma *</label>
          <select
            name="turma_id" value={formData.turma_id} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          >
            <option value="">Selecione...</option>
            {turmas.map(t => (
              <option key={t.id} value={t.id}>{t.nome} — {t.periodo}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Funcionário Responsável *</label>
          <select
            name="funcionario_id" value={formData.funcionario_id} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          >
            <option value="">Selecione...</option>
            {funcionarios.map(f => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Plano *</label>
          <select
            name="plano" value={formData.plano} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          >
            <option value="Integral">Integral</option>
            <option value="Parcial Manhã">Parcial Manhã</option>
            <option value="Parcial Tarde">Parcial Tarde</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Forma de Pagamento *</label>
          <select
            name="forma_pagamento" value={formData.forma_pagamento} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          >
            <option value="PIX">PIX</option>
            <option value="Boleto">Boleto</option>
            <option value="Cartão">Cartão</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Valor da Mensalidade (R$) *</label>
          <input
            type="number" name="valor_mensalidade" value={formData.valor_mensalidade}
            onChange={handleChange} placeholder="0.00" min="0" step="0.01"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Dia de Vencimento *</label>
          <select
            name="data_venc" value={formData.data_venc} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          >
            <option value="10">Dia 10</option>
            <option value="25">Dia 25</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Início da Vigência *</label>
          <input
            type="date" name="inicio_vigencia" value={formData.inicio_vigencia} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Fim da Vigência *</label>
          <input
            type="date" name="fim_vigencia" value={formData.fim_vigencia} onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#4A7C4E] focus:border-transparent"
            required
          />
        </div>
      </div>
    </div>
  );

  // ─── Passo 4: Resumo ──────────────────────────────────────────────────────
  const renderStep4 = () => {
    const turmaEscolhida     = turmas.find(t => t.id === Number(formData.turma_id));
    const funcionarioEscolhido = funcionarios.find(f => f.id === Number(formData.funcionario_id));

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#4A7C4E] p-3 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">Resumo da Matrícula</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Aluno',            valor: formData.nome },
            { label: 'CPF',              valor: formData.cpf },
            { label: 'Nascimento',       valor: formData.data_nasc },
            { label: 'Sexo',             valor: formData.sexo },
            { label: 'Responsável',      valor: formData.resp_nome },
            { label: 'Parentesco',       valor: formData.resp_parentesco },
            { label: 'Turma',            valor: turmaEscolhida?.nome ?? '—' },
            { label: 'Funcionário',      valor: funcionarioEscolhido?.nome ?? '—' },
            { label: 'Plano',            valor: formData.plano },
            { label: 'Mensalidade',      valor: `R$ ${formData.valor_mensalidade}` },
            { label: 'Vencimento',       valor: `Dia ${formData.data_venc}` },
            { label: 'Início',           valor: formData.inicio_vigencia },
            { label: 'Fim',              valor: formData.fim_vigencia },
            { label: 'Forma Pagamento',  valor: formData.forma_pagamento },
          ].map(({ label, valor }) => (
            <div key={label} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{label}</p>
              <p className="text-sm font-semibold text-slate-800">{valor || '—'}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-slate-500 italic">
          Confira os dados acima antes de finalizar. Clique em <strong>Finalizar Matrícula</strong> para salvar no sistema.
        </p>
      </div>
    );
  };

  // ─── Render principal ─────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg shadow-md border border-slate-200">

        {/* Indicador de progresso */}
        <div className="border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                  s <= step ? 'bg-[#4A7C4E] text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-[#4A7C4E]' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs font-medium">
            {['Dados do Aluno', 'Responsável', 'Matrícula', 'Resumo'].map((label, i) => (
              <span key={label} className={step >= i + 1 ? 'text-[#4A7C4E]' : 'text-slate-400'}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Conteúdo do passo atual */}
        <div className="p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Navegação */}
        <div className="border-t border-slate-200 px-8 py-6 flex justify-between">
          <button
            type="button"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1 || isSubmitting}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(s => Math.min(4, s + 1))}
              className="px-6 py-3 bg-[#4A7C4E] text-white rounded-lg hover:bg-[#3D6640] transition-colors"
            >
              Próximo
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#4A7C4E] text-white rounded-lg hover:bg-[#3D6640] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Finalizar Matrícula
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}