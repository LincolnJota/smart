"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewFornecedor() {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");

  const handleSave = async () => {
    const response = await fetch("/api/fornecedores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, cnpj, telefone, email, endereco }),
    });

    if (response.ok) {
      alert("Fornecedor cadastrado com sucesso!");
    } else {
      alert("Erro ao cadastrar fornecedor.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Fornecedor</h1>
      <div className="space-y-4">
        <Input placeholder="Nome do Fornecedor" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Input placeholder="CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
        <Input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <Input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
        <Button onClick={handleSave}>Cadastrar</Button>
      </div>
    </div>
  );
}