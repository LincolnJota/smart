'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react';

export default function DetalhesProduto({ params }: { params: Promise<{ id: string }> }) {
  // Usar React.use() para desempacotar os parâmetros que são uma Promise
  const resolvedParams = use(params);
  const produtoId = resolvedParams.id;

  const router = useRouter();
  const [produto, setProduto] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarProduto() {
      try {
        const response = await fetch(`/api/produtos/${produtoId}`);

        if (!response.ok) {
          throw new Error('Produto não encontrado');
        }

        const data = await response.json();
        setProduto(data);
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        setErro('Não foi possível carregar os dados do produto.');
      } finally {
        setIsLoading(false);
      }
    }

    carregarProduto();
  }, [produtoId]);

  const handleExcluir = async () => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const response = await fetch(`/api/produtos/${produtoId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.push('/produtos');
        } else {
          throw new Error('Erro ao excluir produto');
        }
      } catch (error) {
        console.error('Erro:', error);
        setErro('Falha ao excluir o produto.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Carregando dados do produto...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
        <p>{erro}</p>
        <Link href="/produtos" className="text-blue-600 hover:underline mt-2 inline-block">
          Voltar para lista de produtos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Detalhes do Produto</h1>
        <div className="flex space-x-2">
          <Link
            href={`/produtos/${produtoId}/editar`}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Editar
          </Link>
          <button
            onClick={handleExcluir}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Excluir
          </button>
          <Link
            href="/produtos"
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
          >
            Voltar
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Nome</h2>
            <p className="mt-1 text-lg">{produto.nome}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Código SKU</h2>
            <p className="mt-1 text-lg">{produto.codigo_sku || '-'}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Código de Barras</h2>
            <p className="mt-1 text-lg">{produto.codigo_barras || '-'}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Categoria</h2>
            <p className="mt-1 text-lg">{produto.categoria || '-'}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Quantidade em Estoque</h2>
            <p className={`mt-1 text-lg ${produto.quantidade <= produto.estoque_minimo ? 'text-red-600 font-bold' : ''}`}>
              {produto.quantidade}
              {produto.quantidade <= produto.estoque_minimo &&
                <span className="ml-2 text-sm bg-red-100 text-red-800 py-0.5 px-1 rounded">Abaixo do mínimo</span>
              }
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Estoque Mínimo</h2>
            <p className="mt-1 text-lg">{produto.estoque_minimo}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Preço de Venda</h2>
            <p className="mt-1 text-lg">
              {produto.preco_venda ? `R$ ${Number(produto.preco_venda).toFixed(2)}` : '-'}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Preço de Custo</h2>
            <p className="mt-1 text-lg">
              {produto.preco_custo ? `R$ ${Number(produto.preco_custo).toFixed(2)}` : '-'}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Localização no Estoque</h2>
            <p className="mt-1 text-lg">{produto.localizacao || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}