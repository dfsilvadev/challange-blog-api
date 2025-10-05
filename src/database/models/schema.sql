-- Extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para papéis de usuário
CREATE TYPE tb_role_enum AS ENUM (
    'admin', 'teacher', 'student'
);

-- Enum para categorias/disciplines escolares
CREATE TYPE tb_category_enum AS ENUM (
    'portuguese', 'mathematics', 'history', 'geography',
    'science', 'art', 'physical_education'
);

-- Tabela de papéis
CREATE TABLE IF NOT EXISTS tb_role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name tb_role_enum NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias/disciplines
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

-- Indexes para usuários
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

-- Indexes para posts
CREATE INDEX idx_tb_post_is_active ON tb_post (is_active);
CREATE INDEX idx_tb_post_created_at ON tb_post (created_at);
CREATE INDEX idx_tb_post_user_id_created_at ON tb_post (user_id, created_at);
CREATE INDEX idx_tb_post_category_id ON tb_post (category_id);

-- Trigger para atualizar updated_at automaticamente
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

-- Migration para inserir role 'teacher' e usuário padrão
DO $$
DECLARE
    teacher_role_id UUID;
    teacher_user_id UUID := uuid_generate_v4();
BEGIN
    IF NOT EXISTS (SELECT 1 FROM tb_role WHERE name = 'teacher') THEN
        INSERT INTO tb_role (name) VALUES ('teacher');
    END IF;

    SELECT id INTO teacher_role_id FROM tb_role WHERE name = 'teacher';

    IF NOT EXISTS (SELECT 1 FROM tb_user WHERE email = 'teacher@blog.com') THEN
        INSERT INTO tb_user (id, name, email, phone, password_hash, role_id)
        VALUES (
            teacher_user_id,
            'Teacher Padrão',
            'teacher@blog.com',
            '+5500000000000',
            '$2a$12$ej5.hLFzE.deiyIpm51lSOUSlZnmwn1P9x2KWuGW7lOAVBwJUpDhC',
            teacher_role_id
        );        
        INSERT INTO tb_user (id, name, email, phone, password_hash, role_id)
        VALUES (
            teacher_user_id,
            'Substitute teacher',
            'substitute@blog.com',
            '+5500000000000',
            '$2a$12$ej5.hLFzE.deiyIpm51lSOUSlZnmwn1P9x2KWuGW7lOAVBwJUpDhC',
            teacher_role_id
        );
    END IF;
END $$;

    'portuguese', 'mathematics', 'history', 'geography',
    'science', 'art', 'physical_education'
-- Migration para inserir posts do Substitute teacher sem duplicação
DO $$
DECLARE
    substitute_user_id UUID;
    category_name tb_category_enum;
    post_titles TEXT[] := ARRAY[
        'portuguese', 
        'mathematics', 
        'history',
        'geography',
        'science',
        'art', 
        'physical_education'
    ];
    post_contents TEXT[] := ARRAY[
        'Conteúdo de Português criado pelo Substitute teacher.',
        'Conteúdo de Matemática criado pelo Substitute teacher.',
        'Conteúdo de História criado pelo Substitute teacher.',
        'Conteúdo de Geografia criado pelo Substitute teacher.',
        'Conteúdo de Ciência criado pelo Substitute teacher.',
        'Conteúdo de Artes criado pelo Substitute teacher.',
        'Conteúdo de Educação Física criado pelo Substitute teacher.'
    ];
    i INT;
    category_id UUID;
BEGIN
    -- Buscar o id do usuário Substitute teacher
    SELECT id INTO substitute_user_id FROM tb_user WHERE email = 'substitute@blog.com';

    -- Loop para inserir os posts
    FOR i IN 1..array_length(post_titles, 1) LOOP
        category_name := post_titles[i];
        SELECT id INTO category_id FROM tb_category WHERE name = category_name;

        -- Inserir apenas se não existir
        IF NOT EXISTS (SELECT 1 FROM tb_post WHERE user_id = substitute_user_id AND category_id = category_id) THEN
            INSERT INTO tb_post (title, content, is_active, user_id, category_id)
            VALUES (
                'Post de ' || INITCAP(REPLACE(category_name, '_', ' ')),
                post_contents[i],
                true,
                substitute_user_id,
                category_id
            );
        END IF;
    END LOOP;
END $$;
