export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
          <div className="flex flex-col space-y-2">
            <a href="/produtos/novo" className="text-blue-600 hover:underline">Cadastrar novo produto</a>
            <a href="/produtos" className="text-blue-600 hover:underline">Listar todos os produtos</a>
            <a href="/fornecedores/novo" className="text-blue-600 hover:underline">Cadastrar novo fornecedor</a>
            <a href="/fornecedores" className="text-blue-600 hover:underline">Listar todos os fornecedores</a>
            <a href="/categorias/nova" className="text-blue-600 hover:underline">Cadastrar nova categoria</a>
            <a href="/categorias" className="text-blue-600 hover:underline">Listar todas as categorias</a>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sobre o Sistema</h2>
          <p>
            Sistema simplificado para gerenciamento de estoque e fornecedores.
            Utilize o menu lateral para navegar entre as funcionalidades.
          </p>
        </div>
      </div>
    </div>
  );
}