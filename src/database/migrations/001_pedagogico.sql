-- Migration 001: Módulo pedagógico (MVP)
-- Referência: docs/CHECKLIST_IMPLEMENTACAO_MVP.md Parte 1, docs/DATA_MODEL.md
-- Executar após o schema base (src/database/models/schema.sql).
-- Exemplo: psql $DATABASE_URL -f src/database/migrations/001_pedagogico.sql

-- =============================================================================
-- 1. Expandir tb_user (aluno: date_of_birth, current_grade, guardians; desativar: is_active)
-- =============================================================================
ALTER TABLE tb_user ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE tb_user ADD COLUMN IF NOT EXISTS current_grade VARCHAR(10);
ALTER TABLE tb_user ADD COLUMN IF NOT EXISTS guardians JSONB;
ALTER TABLE tb_user ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_tb_user_current_grade ON tb_user(current_grade);
CREATE INDEX IF NOT EXISTS idx_tb_user_role_id_grade ON tb_user(role_id, current_grade);
CREATE INDEX IF NOT EXISTS idx_tb_user_is_active ON tb_user(is_active);

-- =============================================================================
-- 2. tb_teacher_subject (professor × matéria — MVP; não confundir com tb_class_teacher_subject, Fase 2)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tb_teacher_subject (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES tb_user(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES tb_category(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_teacher_category UNIQUE (teacher_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_tb_teacher_subject_teacher ON tb_teacher_subject(teacher_id);
CREATE INDEX IF NOT EXISTS idx_tb_teacher_subject_category ON tb_teacher_subject(category_id);

-- =============================================================================
-- 3. tb_student_learning_level (nível do aluno por matéria)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tb_student_learning_level (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES tb_user(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES tb_category(id) ON DELETE CASCADE,
    level VARCHAR(20) NOT NULL CHECK (level IN ('1', '2', '3')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_category_level UNIQUE (student_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_tb_student_learning_level_student ON tb_student_learning_level(student_id);
CREATE INDEX IF NOT EXISTS idx_tb_student_learning_level_category ON tb_student_learning_level(category_id);
CREATE INDEX IF NOT EXISTS idx_tb_student_learning_level_level ON tb_student_learning_level(level);

-- =============================================================================
-- 4. tb_content (conteúdo pedagógico)
-- Ordem de aprendizado no MVP: tb_learning_path_content.order_number (ver nota em docs/DATA_MODEL.md)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tb_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content_text TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES tb_category(id) ON DELETE RESTRICT,
    grade VARCHAR(10) NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('1', '2', '3', 'reforco')),
    order_number INTEGER NOT NULL,
    user_id UUID NOT NULL REFERENCES tb_user(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    topics JSONB,
    glossary JSONB,
    accessibility_metadata JSONB,
    tags JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_content_order UNIQUE (category_id, grade, level, order_number)
);

CREATE INDEX IF NOT EXISTS idx_tb_content_category_grade ON tb_content(category_id, grade);
CREATE INDEX IF NOT EXISTS idx_tb_content_level ON tb_content(level);
CREATE INDEX IF NOT EXISTS idx_tb_content_user_id ON tb_content(user_id);
CREATE INDEX IF NOT EXISTS idx_tb_content_is_active ON tb_content(is_active);

-- =============================================================================
-- 5. tb_learning_path (trilha por matéria/série)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tb_learning_path (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    category_id UUID NOT NULL REFERENCES tb_category(id) ON DELETE CASCADE,
    grade VARCHAR(10) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    created_by UUID NOT NULL REFERENCES tb_user(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tb_learning_path_category_grade ON tb_learning_path(category_id, grade);
CREATE INDEX IF NOT EXISTS idx_tb_learning_path_created_by ON tb_learning_path(created_by);
CREATE INDEX IF NOT EXISTS idx_tb_learning_path_is_active ON tb_learning_path(is_active);

-- =============================================================================
-- 6. tb_learning_path_content (conteúdos na trilha — ordem efetiva no MVP)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tb_learning_path_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learning_path_id UUID NOT NULL REFERENCES tb_learning_path(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES tb_content(id) ON DELETE CASCADE,
    order_number INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_learning_path_order UNIQUE (learning_path_id, order_number),
    CONSTRAINT unique_learning_path_content UNIQUE (learning_path_id, content_id)
);

CREATE INDEX IF NOT EXISTS idx_tb_learning_path_content_path ON tb_learning_path_content(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_tb_learning_path_content_content ON tb_learning_path_content(content_id);

-- =============================================================================
-- 7. tb_assessment (avaliação por nível/matéria)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tb_assessment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES tb_category(id) ON DELETE RESTRICT,
    level VARCHAR(20) NOT NULL CHECK (level IN ('1', '2', '3')),
    content_id UUID REFERENCES tb_content(id) ON DELETE SET NULL,
    teacher_id UUID NOT NULL REFERENCES tb_user(id) ON DELETE RESTRICT,
    min_score DECIMAL(5,2) NOT NULL DEFAULT 70.00,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tb_assessment_category_level ON tb_assessment(category_id, level);
CREATE INDEX IF NOT EXISTS idx_tb_assessment_teacher_id ON tb_assessment(teacher_id);
CREATE INDEX IF NOT EXISTS idx_tb_assessment_content_id ON tb_assessment(content_id);
CREATE INDEX IF NOT EXISTS idx_tb_assessment_is_active ON tb_assessment(is_active);

-- =============================================================================
-- 8. tb_question (questão da avaliação)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tb_question (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES tb_assessment(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'text')),
    options JSONB,
    correct_answer TEXT NOT NULL,
    points DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    tags JSONB,
    order_number INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tb_question_assessment_id ON tb_question(assessment_id);
CREATE INDEX IF NOT EXISTS idx_tb_question_order ON tb_question(assessment_id, order_number);

-- =============================================================================
-- 9. tb_student_answer (resposta do aluno por questão)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tb_student_answer (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES tb_user(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES tb_assessment(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES tb_question(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    points_earned DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    answered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_question_answer UNIQUE (student_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_tb_student_answer_student_assessment ON tb_student_answer(student_id, assessment_id);
CREATE INDEX IF NOT EXISTS idx_tb_student_answer_question ON tb_student_answer(question_id);
CREATE INDEX IF NOT EXISTS idx_tb_student_answer_is_correct ON tb_student_answer(is_correct);

-- =============================================================================
-- 10. tb_assessment_result (resultado por aluno/avaliação)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tb_assessment_result (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES tb_user(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES tb_assessment(id) ON DELETE CASCADE,
    total_score DECIMAL(10,2) NOT NULL,
    max_score DECIMAL(10,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    level_updated BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_assessment_result UNIQUE (student_id, assessment_id)
);

CREATE INDEX IF NOT EXISTS idx_tb_assessment_result_student ON tb_assessment_result(student_id);
CREATE INDEX IF NOT EXISTS idx_tb_assessment_result_assessment ON tb_assessment_result(assessment_id);
CREATE INDEX IF NOT EXISTS idx_tb_assessment_result_percentage ON tb_assessment_result(percentage);

-- =============================================================================
-- 11. tb_recommendation (recomendações de conteúdo para o aluno)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tb_recommendation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES tb_user(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES tb_content(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('assessment', 'manual', 'system')),
    source_id UUID,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'dismissed')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tb_recommendation_student ON tb_recommendation(student_id);
CREATE INDEX IF NOT EXISTS idx_tb_recommendation_content ON tb_recommendation(content_id);
CREATE INDEX IF NOT EXISTS idx_tb_recommendation_status ON tb_recommendation(status);

-- =============================================================================
-- 12. tb_student_progress (progresso do aluno em conteúdo)
-- =============================================================================
CREATE TABLE IF NOT EXISTS tb_student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES tb_user(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES tb_content(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    time_spent INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_content_progress UNIQUE (student_id, content_id)
);

CREATE INDEX IF NOT EXISTS idx_tb_student_progress_student ON tb_student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_tb_student_progress_content ON tb_student_progress(content_id);
CREATE INDEX IF NOT EXISTS idx_tb_student_progress_status ON tb_student_progress(status);

-- =============================================================================
-- 13. Triggers updated_at (função set_updated_at já existe no schema base)
-- =============================================================================
DROP TRIGGER IF EXISTS trg_tb_teacher_subject_updated_at ON tb_teacher_subject;
CREATE TRIGGER trg_tb_teacher_subject_updated_at BEFORE UPDATE ON tb_teacher_subject FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tb_student_learning_level_updated_at ON tb_student_learning_level;
CREATE TRIGGER trg_tb_student_learning_level_updated_at BEFORE UPDATE ON tb_student_learning_level FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tb_content_updated_at ON tb_content;
CREATE TRIGGER trg_tb_content_updated_at BEFORE UPDATE ON tb_content FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tb_learning_path_updated_at ON tb_learning_path;
CREATE TRIGGER trg_tb_learning_path_updated_at BEFORE UPDATE ON tb_learning_path FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tb_assessment_updated_at ON tb_assessment;
CREATE TRIGGER trg_tb_assessment_updated_at BEFORE UPDATE ON tb_assessment FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tb_question_updated_at ON tb_question;
CREATE TRIGGER trg_tb_question_updated_at BEFORE UPDATE ON tb_question FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tb_recommendation_updated_at ON tb_recommendation;
CREATE TRIGGER trg_tb_recommendation_updated_at BEFORE UPDATE ON tb_recommendation FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tb_student_progress_updated_at ON tb_student_progress;
CREATE TRIGGER trg_tb_student_progress_updated_at BEFORE UPDATE ON tb_student_progress FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- 14. Função e trigger: atualizar nível do aluno após resultado de avaliação
-- (BEFORE INSERT para permitir setar level_updated no mesmo row)
-- =============================================================================
CREATE OR REPLACE FUNCTION update_student_learning_level()
RETURNS TRIGGER AS $$
DECLARE
    assessment_level VARCHAR(20);
    assessment_category_id UUID;
    current_level VARCHAR(20);
    new_level VARCHAR(20);
BEGIN
    SELECT a.level, a.category_id INTO assessment_level, assessment_category_id
    FROM tb_assessment a
    WHERE a.id = NEW.assessment_id;

    SELECT level INTO current_level
    FROM tb_student_learning_level
    WHERE student_id = NEW.student_id AND category_id = assessment_category_id;

    IF current_level IS NULL THEN
        INSERT INTO tb_student_learning_level (student_id, category_id, level)
        VALUES (NEW.student_id, assessment_category_id, '1')
        ON CONFLICT (student_id, category_id) DO NOTHING;
        current_level := '1';
    END IF;

    IF NEW.percentage >= 70.00 THEN
        IF assessment_level::INTEGER >= current_level::INTEGER THEN
            new_level := assessment_level;
        ELSE
            new_level := current_level;
        END IF;
    ELSE
        new_level := current_level;
    END IF;

    UPDATE tb_student_learning_level
    SET level = new_level, updated_at = CURRENT_TIMESTAMP
    WHERE student_id = NEW.student_id AND category_id = assessment_category_id;

    NEW.level_updated := (new_level != current_level);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_learning_level ON tb_assessment_result;
CREATE TRIGGER trg_update_learning_level
BEFORE INSERT ON tb_assessment_result
FOR EACH ROW
EXECUTE FUNCTION update_student_learning_level();
