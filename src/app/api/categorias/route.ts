import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Listar todas as categorias
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany();
    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json({ error: 'Falha ao buscar categorias' }, { status: 500 });
  }
}

// POST - Criar nova categoria
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const categoria = await prisma.categoria.create({
      data: {
        nome: data.nome,
        descricao: data.descricao || null,
        cor: data.cor || null,
      },
    });

    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return NextResponse.json({ error: 'Falha ao criar categoria' }, { status: 500 });
  }
}