'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Produtos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const response = await fetch('/api/produtos');
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos');
        }
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    (produto.codigo_sku?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
    (produto.codigo_barras?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
    (produto.categoria?.nome?.toLowerCase() || '').includes(filtro.toLowerCase())
  );

  const excluirProduto = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const response = await fetch(`/api/produtos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProdutos(produtos.filter(produto => produto.id !== id));
        } else {
          throw new Error('Erro ao excluir produto');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir o produto');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Link href="/produtos/novo" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Novo Produto
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar produtos por nome, SKU, código de barras ou categoria..."
            className="w-full p-2 border rounded"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {isLoading ? (
          <p>Carregando produtos...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Nome</th>
                  <th className="py-2 px-4 text-left">SKU</th>
                  <th className="py-2 px-4 text-left">Categoria</th>
                  <th className="py-2 px-4 text-left">Quantidade</th>
                  <th className="py-2 px-4 text-left">Preço Venda</th>
                  <th className="py-2 px-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((produto) => (
                  <tr key={produto.id} className="border-b">
                    <td className="py-2 px-4">{produto.nome}</td>
                    <td className="py-2 px-4">{produto.codigo_sku || '-'}</td>
                    <td className="py-2 px-4">
                      {produto.categoria ? (
                        <div className="flex items-center">
                          {produto.categoria.cor && (
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: produto.categoria.cor }}
                            ></div>
                          )}
                          {produto.categoria.nome}
                        </div>
                      ) : '-'}
                    </td>
                    <td className={`py-2 px-4 ${produto.quantidade <= produto.estoque_minimo ? 'text-red-600 font-medium' : ''}`}>
                      {produto.quantidade}
                    </td>
                    <td className="py-2 px-4">
                      {produto.preco_venda ? `R$ ${parseFloat(produto.preco_venda).toFixed(2)}` : '-'}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <Link href={`/produtos/${produto.id}`} className="text-blue-600 hover:underline">
                          Detalhes
                        </Link>
                        <Link href={`/produtos/${produto.id}/editar`} className="text-green-600 hover:underline">
                          Editar
                        </Link>
                        <button
                          onClick={() => excluirProduto(produto.id)}
                          className="text-red-600 hover:underline"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}