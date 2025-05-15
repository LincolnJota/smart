import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Listar todos os fornecedores
export async function GET() {
  try {
    const fornecedores = await prisma.fornecedores.findMany();
    return NextResponse.json(fornecedores);
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    return NextResponse.json({ error: 'Falha ao buscar fornecedores' }, { status: 500 });
  }
}

// POST - Criar novo fornecedor
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fornecedor = await prisma.fornecedores.create({
      data: {
        nome: data.nome,
        cnpj: data.cnpj || null,
        telefone: data.telefone || null,
        email: data.email || null,
        endereco: data.endereco || null,
        ativo: data.ativo !== undefined ? data.ativo : true,
      },
    });

    return NextResponse.json(fornecedor, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    return NextResponse.json({ error: 'Falha ao criar fornecedor' }, { status: 500 });
  }
}