-- Extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para papéis de usuário
CREATE TYPE tb_role_enum AS ENUM (
    'admin', 'teacher', 'student'
);

-- Enum para categorias de post
CREATE TYPE tb_category_enum AS ENUM (
    'portuguese', 'mathematics', 'history', 'geography',
    'science', 'art', 'physical education'
);

-- Tabela de papéis
CREATE TABLE IF NOT EXISTS tb_role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name tb_role_enum NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS tb_category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name tb_category_enum NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS tb_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    phone VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    role_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tb_user_role FOREIGN KEY (role_id) REFERENCES tb_role(id)
);

CREATE INDEX idx_tb_user_email ON tb_user (email);
CREATE INDEX idx_tb_user_role_id ON tb_user (role_id);

-- Tabela de posts
CREATE TABLE IF NOT EXISTS tb_post (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id UUID NOT NULL,
    category_id UUID NOT NULL,
    CONSTRAINT fk_tb_post_user FOREIGN KEY (user_id) REFERENCES tb_user(id),
    CONSTRAINT fk_tb_post_category FOREIGN KEY (category_id) REFERENCES tb_category(id)
);

CREATE INDEX idx_tb_post_is_active ON tb_post (is_active);
CREATE INDEX idx_tb_post_created_at ON tb_post (created_at);
CREATE INDEX idx_tb_post_user_id_created_at ON tb_post (user_id, created_at);
CREATE INDEX idx_tb_post_category_id ON tb_post (category_id);

-- Trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tb_user_updated_at
BEFORE UPDATE ON tb_user
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tb_post_updated_at
BEFORE UPDATE ON tb_post
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tb_role_updated_at
BEFORE UPDATE ON tb_role
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tb_category_updated_at
BEFORE UPDATE ON tb_category
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
