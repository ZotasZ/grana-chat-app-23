
-- Criar tabela para contas recorrentes com associação ao usuário
CREATE TABLE public.recurring_bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  categoria TEXT NOT NULL,
  data_vencimento INTEGER NOT NULL CHECK (data_vencimento >= 1 AND data_vencimento <= 31),
  descricao TEXT,
  imagem_boleto TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  proximo_vencimento DATE NOT NULL,
  alerta_um_dia BOOLEAN DEFAULT false,
  alerta_dia_vencimento BOOLEAN DEFAULT false,
  eh_parcelado BOOLEAN DEFAULT false,
  valor_total DECIMAL(10,2),
  numero_parcelas INTEGER,
  parcela_atual INTEGER,
  grupo_parcela_id UUID,
  status_pagamento TEXT DEFAULT 'pendente' CHECK (status_pagamento IN ('pendente', 'pago')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para transações com associação ao usuário
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ativar RLS (Row Level Security) nas tabelas
ALTER TABLE public.recurring_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para recurring_bills - usuários só podem ver/modificar suas próprias contas
CREATE POLICY "Users can view their own recurring bills" 
  ON public.recurring_bills 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recurring bills" 
  ON public.recurring_bills 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring bills" 
  ON public.recurring_bills 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring bills" 
  ON public.recurring_bills 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para transactions - usuários só podem ver/modificar suas próprias transações
CREATE POLICY "Users can view their own transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
  ON public.transactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
  ON public.transactions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Atualizar trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  
  -- Log de auditoria para novo usuário
  INSERT INTO public.audit_logs (user_id, action, details)
  VALUES (
    new.id,
    'user_created',
    jsonb_build_object(
      'email', new.email,
      'provider', new.raw_app_meta_data ->> 'provider',
      'created_at', new.created_at
    )
  );
  
  RETURN new;
END;
$$;

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
