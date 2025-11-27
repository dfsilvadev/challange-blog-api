-- Extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para papéis de usuário
CREATE TYPE tb_role_enum AS ENUM (
    'coordinator', 'teacher', 'student'
);

-- Enum para categorias/disciplines escolares
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

-- Tabela de comentários
CREATE TABLE IF NOT EXISTS tb_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    post_id UUID NOT NULL,
    CONSTRAINT fk_post_tb_comment
        FOREIGN KEY (post_id)
        REFERENCES tb_post (id)
        ON DELETE CASCADE
);

-- Indexes para posts
CREATE INDEX idx_tb_post_is_active ON tb_post (is_active);
CREATE INDEX idx_tb_post_created_at ON tb_post (created_at);
CREATE INDEX idx_tb_post_user_id_created_at ON tb_post (user_id, created_at);
CREATE INDEX idx_tb_post_category_id ON tb_post (category_id);
CREATE INDEX idx_tb_comments_post_id ON tb_comments (post_id);

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

CREATE TRIGGER trg_tb_comments_updated_at
BEFORE UPDATE ON tb_comments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Inserir roles e usuários sem duplicação
DO $$
DECLARE
    coordinator_role_id UUID;
    teacher_role_id UUID;
BEGIN
    -- Inserir role 'coordinator'
    IF NOT EXISTS (SELECT 1 FROM tb_role WHERE name = 'coordinator') THEN
        INSERT INTO tb_role (name) VALUES ('coordinator');
    END IF;

    SELECT id INTO coordinator_role_id FROM tb_role WHERE name = 'coordinator';

    -- Inserir Teacher Padrão
    IF NOT EXISTS (SELECT 1 FROM tb_user WHERE email = 'coordinator@blog.com') THEN
        INSERT INTO tb_user (name, email, phone, password_hash, role_id)
        VALUES ('Coordinator Padrão', 'coordinator@blog.com', '+5500000000000',
                '$2a$12$ej5.hLFzE.deiyIpm51lSOUSlZnmwn1P9x2KWuGW7lOAVBwJUpDhC',
                coordinator_role_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM tb_role WHERE name = 'teacher') THEN
        INSERT INTO tb_role (name) VALUES ('teacher');
    END IF;

    SELECT id INTO teacher_role_id FROM tb_role WHERE name = 'teacher';
    -- Inserir teacher Teacher
    IF NOT EXISTS (SELECT 1 FROM tb_user WHERE email = 'teacher@blog.com') THEN
        INSERT INTO tb_user (name, email, phone, password_hash, role_id)
        VALUES ('Teacher', 'teacher@blog.com', '+5500000000001',
                '$2a$12$ej5.hLFzE.deiyIpm51lSOUSlZnmwn1P9x2KWuGW7lOAVBwJUpDhC',
                teacher_role_id);
    END IF;
END $$;

-- Inserir categorias sem duplicação
DO $$
DECLARE
    category_name tb_category_enum;
BEGIN
    FOR category_name IN SELECT unnest(ARRAY[
        'portuguese', 'mathematics', 'history', 'geography', 'science', 'art', 'physical education'
    ]::tb_category_enum[])
    LOOP
        IF NOT EXISTS (SELECT 1 FROM tb_category WHERE name = category_name) THEN
            INSERT INTO tb_category (name) VALUES (category_name);
        END IF;
    END LOOP;
END $$;

-- Inserir posts do teacher Teacher
DO $$
DECLARE
    teacher_user_id UUID;
    rec RECORD;
BEGIN
    SELECT id INTO teacher_user_id FROM tb_user WHERE email = 'teacher@blog.com';

    FOR rec IN
        SELECT id AS category_id,
               name AS category_name,
               CASE name
                   WHEN 'portuguese' THEN 'Conteúdo de Português criado pelo teacher teacher.'
                   WHEN 'mathematics' THEN 'Conteúdo de Matemática criado pelo teacher teacher.'
                   WHEN 'history' THEN 'Conteúdo de História criado pelo teacher teacher.'
                   WHEN 'geography' THEN 'Conteúdo de Geografia criado pelo teacher teacher.'
                   WHEN 'science' THEN 'Conteúdo de Ciência criado pelo teacher teacher.'
                   WHEN 'art' THEN 'Conteúdo de Artes criado pelo teacher teacher.'
                   WHEN 'physical education' THEN 'Conteúdo de Educação Física criado pelo teacher teacher.'
               END AS content
        FROM tb_category
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM tb_post p 
            WHERE p.user_id = teacher_user_id 
              AND p.category_id = rec.category_id
        ) THEN
            INSERT INTO tb_post (title, content, is_active, user_id, category_id)
            VALUES (
                'Post de ' || INITCAP(rec.category_name::TEXT),  -- <-- cast ENUM para TEXT
                rec.content,
                true,
                teacher_user_id,
                rec.category_id
            );
        END IF;
    END LOOP;
END $$;
