-- CreateTable
CREATE TABLE `estoque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `codigo_sku` VARCHAR(50) NULL,
    `codigo_barras` VARCHAR(100) NULL,
    `categoria` VARCHAR(100) NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 0,
    `estoque_minimo` INTEGER NOT NULL DEFAULT 0,
    `preco_venda` DECIMAL(10, 2) NULL,
    `preco_custo` DECIMAL(10, 2) NULL,
    `localizacao` VARCHAR(255) NULL,
    `criado_em` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `codigo_sku`(`codigo_sku`),
    INDEX `idx_categoria`(`categoria`),
    INDEX `idx_nome`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fornecedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cnpj` VARCHAR(18) NULL,
    `telefone` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `endereco` TEXT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `cnpj`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtos_fornecedores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produto_id` INTEGER NOT NULL,
    `fornecedor_id` INTEGER NOT NULL,
    `preco_custo` DECIMAL(10, 2) NOT NULL,
    `prazo_entrega` INTEGER NOT NULL,
    `quantidade_minima` INTEGER NOT NULL DEFAULT 1,
    `criado_em` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizado_em` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fornecedor_id`(`fornecedor_id`),
    INDEX `produto_id`(`produto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `produtos_fornecedores` ADD CONSTRAINT `produtos_fornecedores_ibfk_1` FOREIGN KEY (`produto_id`) REFERENCES `estoque`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `produtos_fornecedores` ADD CONSTRAINT `produtos_fornecedores_ibfk_2` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
