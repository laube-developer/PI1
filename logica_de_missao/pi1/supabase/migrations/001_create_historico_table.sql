CREATE TABLE historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    comandos JSONB,
    deslocamento_comandado JSONB,
    deslocamento_real JSONB
);