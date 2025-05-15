import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Estoque',
  description: 'Gerenciamento de estoque e fornecedores',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 text-white">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-6">Sistema de Estoque</h2>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="block py-2 px-4 hover:bg-gray-700 rounded">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/produtos" className="block py-2 px-4 hover:bg-gray-700 rounded">
                      Produtos
                    </Link>
                  </li>
                  <li>
                    <Link href="/categorias" className="block py-2 px-4 hover:bg-gray-700 rounded">
                      Categorias
                    </Link>
                  </li>
                  <li>
                    <Link href="/fornecedores" className="block py-2 px-4 hover:bg-gray-700 rounded">
                      Fornecedores
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Conteúdo principal */}
          <main className="flex-1 p-6 overflow-auto bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}