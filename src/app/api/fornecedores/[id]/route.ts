import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Buscar fornecedor por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const fornecedor = await prisma.fornecedores.findUnique({
      where: { id },
    });

    if (!fornecedor) {
      return NextResponse.json({ error: 'Fornecedor não encontrado' }, { status: 404 });
    }

    return NextResponse.json(fornecedor);
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    return NextResponse.json({ error: 'Falha ao buscar fornecedor' }, { status: 500 });
  }
}

// PUT - Atualizar fornecedor
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const fornecedor = await prisma.fornecedores.update({
      where: { id },
      data: {
        nome: data.nome,
        cnpj: data.cnpj || null,
        telefone: data.telefone || null,
        email: data.email || null,
        endereco: data.endereco || null,
        ativo: data.ativo !== undefined ? data.ativo : true,
      },
    });

    return NextResponse.json(fornecedor);
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    return NextResponse.json({ error: 'Falha ao atualizar fornecedor' }, { status: 500 });
  }
}

// DELETE - Excluir fornecedor
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.fornecedores.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir fornecedor:', error);
    return NextResponse.json({ error: 'Falha ao excluir fornecedor' }, { status: 500 });
  }
}