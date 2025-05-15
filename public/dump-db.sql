CREATE TABLE estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identificador único (chave primária)
    nome VARCHAR(255) NOT NULL,                 -- Nome do produto
    codigo_sku VARCHAR(50) UNIQUE,              -- Código único de identificação (SKU)
    categoria VARCHAR(100),                     -- Categoria do produto (ex.: Material Escolar, Escritório)
    quantidade INT NOT NULL CHECK (quantidade >= 0), -- Quantidade atual em estoque
    estoque_minimo INT NOT NULL DEFAULT 0 CHECK (estoque_minimo >= 0), -- Nível mínimo para alertas
    preco_venda DECIMAL(10, 2),                 -- Preço de venda ao cliente
    preco_custo DECIMAL(10, 2),                 -- Preço de custo do produto
    localizacao VARCHAR(255)                    -- Localização física no estoque (opcional)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identificador único do fornecedor
    nome VARCHAR(255) NOT NULL,                 -- Nome do fornecedor
    cnpj VARCHAR(18) UNIQUE,                    -- CNPJ do fornecedor (opcional, caso no Brasil)
    telefone VARCHAR(20),                       -- Telefone de contato
    email VARCHAR(255),                         -- E-mail de contato
    endereco TEXT,                              -- Endereço completo do fornecedor
    ativo BOOLEAN NOT NULL DEFAULT TRUE,        -- Indica se o fornecedor está ativo
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data de criação do registro
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Última atualização
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE produtos_fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- Identificador único do relacionamento
    produto_id INT NOT NULL,                   -- Identificador do produto
    fornecedor_id INT NOT NULL,                -- Identificador do fornecedor
    preco_custo DECIMAL(10, 2) NOT NULL,       -- Preço de custo do produto para o fornecedor
    prazo_entrega INT NOT NULL,                -- Prazo de entrega em dias
    quantidade_minima INT NOT NULL DEFAULT 1,  -- Quantidade mínima exigida pelo fornecedor
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data da criação do registro
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Última atualização
    FOREIGN KEY (produto_id) REFERENCES estoque(id) ON DELETE CASCADE, -- Relaciona com tabela de estoque
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE -- Relaciona com tabela de fornecedores
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;