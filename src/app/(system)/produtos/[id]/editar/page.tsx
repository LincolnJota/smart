'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function EditarProduto({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const produtoId = resolvedParams.id;

  const [formData, setFormData] = useState({
    nome: '',
    codigo_sku: '',
    codigo_barras: '',
    categoriaId: '',
    quantidade: 0,
    estoque_minimo: 0,
    preco_venda: '',
    preco_custo: '',
    localizacao: '',
  });

  const [categorias, setCategorias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [erro, setErro] = useState('');

  // Carregar dados do produto
  useEffect(() => {
    async function carregarDados() {
      try {
        // Carregar categorias
        const categoriasResponse = await fetch('/api/categorias');
        if (!categoriasResponse.ok) {
          throw new Error('Erro ao buscar categorias');
        }
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);

        // Carregar produto
        const produtoResponse = await fetch(`/api/produtos/${produtoId}`);
        if (!produtoResponse.ok) {
          throw new Error('Produto não encontrado');
        }

        const produto = await produtoResponse.json();
        setFormData({
          nome: produto.nome,
          codigo_sku: produto.codigo_sku || '',
          codigo_barras: produto.codigo_barras || '',
          categoriaId: produto.categoriaId ? produto.categoriaId.toString() : '',
          quantidade: produto.quantidade,
          estoque_minimo: produto.estoque_minimo,
          preco_venda: produto.preco_venda ? produto.preco_venda.toString() : '',
          preco_custo: produto.preco_custo ? produto.preco_custo.toString() : '',
          localizacao: produto.localizacao || '',
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro('Não foi possível carregar os dados necessários.');
      } finally {
        setIsLoading(false);
      }
    }

    carregarDados();
  }, [produtoId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantidade' || name === 'estoque_minimo'
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErro('');

    try {
      const res = await fetch(`/api/produtos/${produtoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Erro ao atualizar produto');
      }

      router.push('/produtos');
    } catch (error) {
      console.error('Erro:', error);
      setErro('Falha ao atualizar o produto. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Carregando dados do produto...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Produto</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        {erro && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="nome" className="block mb-1 font-medium">
                Nome*
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="codigo_sku" className="block mb-1 font-medium">
                Código SKU
              </label>
              <input
                type="text"
                id="codigo_sku"
                name="codigo_sku"
                value={formData.codigo_sku}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="codigo_barras" className="block mb-1 font-medium">
                Código de Barras
              </label>
              <input
                type="text"
                id="codigo_barras"
                name="codigo_barras"
                value={formData.codigo_barras}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="categoriaId" className="block mb-1 font-medium">
                Categoria
              </label>
              <select
                id="categoriaId"
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quantidade" className="block mb-1 font-medium">
                Quantidade*
              </label>
              <input
                type="number"
                id="quantidade"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="estoque_minimo" className="block mb-1 font-medium">
                Estoque Mínimo*
              </label>
              <input
                type="number"
                id="estoque_minimo"
                name="estoque_minimo"
                value={formData.estoque_minimo}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="preco_venda" className="block mb-1 font-medium">
                Preço de Venda (R$)
              </label>
              <input
                type="text"
                id="preco_venda"
                name="preco_venda"
                value={formData.preco_venda}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="preco_custo" className="block mb-1 font-medium">
                Preço de Custo (R$)
              </label>
              <input
                type="text"
                id="preco_custo"
                name="preco_custo"
                value={formData.preco_custo}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="localizacao" className="block mb-1 font-medium">
                Localização no Estoque
              </label>
              <input
                type="text"
                id="localizacao"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}