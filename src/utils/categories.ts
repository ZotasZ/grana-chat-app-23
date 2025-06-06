
export interface CategoryInfo {
  categoria: string;
  icone: string;
  cor: string;
}

export const CATEGORIAS: Record<string, CategoryInfo> = {
  // Alimentação e Bebidas
  'ifood': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'ifd': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'uber eats': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'restaurante': { categoria: 'Alimentação', icone: '🍽️', cor: '#FF6B6B' },
  'lanche': { categoria: 'Alimentação', icone: '🥪', cor: '#FF6B6B' },
  'almoço': { categoria: 'Alimentação', icone: '🍽️', cor: '#FF6B6B' },
  'almoco': { categoria: 'Alimentação', icone: '🍽️', cor: '#FF6B6B' },
  'jantar': { categoria: 'Alimentação', icone: '🍽️', cor: '#FF6B6B' },
  'café': { categoria: 'Alimentação', icone: '☕', cor: '#FF6B6B' },
  'cafe': { categoria: 'Alimentação', icone: '☕', cor: '#FF6B6B' },
  'pizza': { categoria: 'Alimentação', icone: '🍕', cor: '#FF6B6B' },
  'mercado': { categoria: 'Alimentação', icone: '🛒', cor: '#FF6B6B' },
  'supermercado': { categoria: 'Alimentação', icone: '🛒', cor: '#FF6B6B' },
  'super': { categoria: 'Alimentação', icone: '🛒', cor: '#FF6B6B' },
  'padaria': { categoria: 'Alimentação', icone: '🥖', cor: '#FF6B6B' },
  'lanchonete': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'comida': { categoria: 'Alimentação', icone: '🍽️', cor: '#FF6B6B' },
  'açougue': { categoria: 'Alimentação', icone: '🥩', cor: '#FF6B6B' },
  'acougue': { categoria: 'Alimentação', icone: '🥩', cor: '#FF6B6B' },
  'peixaria': { categoria: 'Alimentação', icone: '🐟', cor: '#FF6B6B' },
  'hortifruti': { categoria: 'Alimentação', icone: '🥬', cor: '#FF6B6B' },
  'quitanda': { categoria: 'Alimentação', icone: '🥕', cor: '#FF6B6B' },
  'feira': { categoria: 'Alimentação', icone: '🥬', cor: '#FF6B6B' },
  'mcdonalds': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'mcdonald': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'burguer': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'burger': { categoria: 'Alimentação', icone: '🍔', cor: '#FF6B6B' },
  'kfc': { categoria: 'Alimentação', icone: '🍗', cor: '#FF6B6B' },
  'subway': { categoria: 'Alimentação', icone: '🥪', cor: '#FF6B6B' },
  'starbucks': { categoria: 'Alimentação', icone: '☕', cor: '#FF6B6B' },
  'coca cola': { categoria: 'Alimentação', icone: '🥤', cor: '#FF6B6B' },
  'água': { categoria: 'Alimentação', icone: '💧', cor: '#FF6B6B' },
  'agua': { categoria: 'Alimentação', icone: '💧', cor: '#FF6B6B' },
  'refrigerante': { categoria: 'Alimentação', icone: '🥤', cor: '#FF6B6B' },
  'cerveja': { categoria: 'Alimentação', icone: '🍺', cor: '#FF6B6B' },
  'vinho': { categoria: 'Alimentação', icone: '🍷', cor: '#FF6B6B' },
  'bebida': { categoria: 'Alimentação', icone: '🥤', cor: '#FF6B6B' },
  'doce': { categoria: 'Alimentação', icone: '🍰', cor: '#FF6B6B' },
  'sorvete': { categoria: 'Alimentação', icone: '🍦', cor: '#FF6B6B' },
  'chocolate': { categoria: 'Alimentação', icone: '🍫', cor: '#FF6B6B' },

  // Transporte
  'uber': { categoria: 'Transporte', icone: '🚗', cor: '#4ECDC4' },
  '99': { categoria: 'Transporte', icone: '🚗', cor: '#4ECDC4' },
  'taxi': { categoria: 'Transporte', icone: '🚕', cor: '#4ECDC4' },
  'gasolina': { categoria: 'Transporte', icone: '⛽', cor: '#4ECDC4' },
  'combustível': { categoria: 'Transporte', icone: '⛽', cor: '#4ECDC4' },
  'combustivel': { categoria: 'Transporte', icone: '⛽', cor: '#4ECDC4' },
  'ônibus': { categoria: 'Transporte', icone: '🚌', cor: '#4ECDC4' },
  'onibus': { categoria: 'Transporte', icone: '🚌', cor: '#4ECDC4' },
  'metro': { categoria: 'Transporte', icone: '🚇', cor: '#4ECDC4' },
  'metrô': { categoria: 'Transporte', icone: '🚇', cor: '#4ECDC4' },
  'estacionamento': { categoria: 'Transporte', icone: '🅿️', cor: '#4ECDC4' },
  'transporte': { categoria: 'Transporte', icone: '🚗', cor: '#4ECDC4' },
  'posto': { categoria: 'Transporte', icone: '⛽', cor: '#4ECDC4' },
  'pedágio': { categoria: 'Transporte', icone: '🛣️', cor: '#4ECDC4' },
  'pedagio': { categoria: 'Transporte', icone: '🛣️', cor: '#4ECDC4' },
  'mecânico': { categoria: 'Transporte', icone: '🔧', cor: '#4ECDC4' },
  'mecanico': { categoria: 'Transporte', icone: '🔧', cor: '#4ECDC4' },
  'oficina': { categoria: 'Transporte', icone: '🔧', cor: '#4ECDC4' },
  'lavagem': { categoria: 'Transporte', icone: '🚿', cor: '#4ECDC4' },
  'avião': { categoria: 'Transporte', icone: '✈️', cor: '#4ECDC4' },
  'aviao': { categoria: 'Transporte', icone: '✈️', cor: '#4ECDC4' },
  'passagem': { categoria: 'Transporte', icone: '🎫', cor: '#4ECDC4' },
  'viagem': { categoria: 'Transporte', icone: '✈️', cor: '#4ECDC4' },

  // Saúde e Bem-estar
  'farmácia': { categoria: 'Saúde', icone: '💊', cor: '#45B7D1' },
  'farmacia': { categoria: 'Saúde', icone: '💊', cor: '#45B7D1' },
  'médico': { categoria: 'Saúde', icone: '👨‍⚕️', cor: '#45B7D1' },
  'medico': { categoria: 'Saúde', icone: '👨‍⚕️', cor: '#45B7D1' },
  'dentista': { categoria: 'Saúde', icone: '🦷', cor: '#45B7D1' },
  'exame': { categoria: 'Saúde', icone: '🔬', cor: '#45B7D1' },
  'remédio': { categoria: 'Saúde', icone: '💊', cor: '#45B7D1' },
  'remedio': { categoria: 'Saúde', icone: '💊', cor: '#45B7D1' },
  'hospital': { categoria: 'Saúde', icone: '🏥', cor: '#45B7D1' },
  'clínica': { categoria: 'Saúde', icone: '🏥', cor: '#45B7D1' },
  'clinica': { categoria: 'Saúde', icone: '🏥', cor: '#45B7D1' },
  'consulta': { categoria: 'Saúde', icone: '👩‍⚕️', cor: '#45B7D1' },
  'fisioterapia': { categoria: 'Saúde', icone: '🤸', cor: '#45B7D1' },
  'psicólogo': { categoria: 'Saúde', icone: '🧠', cor: '#45B7D1' },
  'psicologo': { categoria: 'Saúde', icone: '🧠', cor: '#45B7D1' },
  'nutricionista': { categoria: 'Saúde', icone: '🥗', cor: '#45B7D1' },
  'oftalmologista': { categoria: 'Saúde', icone: '👁️', cor: '#45B7D1' },
  'óculos': { categoria: 'Saúde', icone: '👓', cor: '#45B7D1' },
  'oculos': { categoria: 'Saúde', icone: '👓', cor: '#45B7D1' },
  'academia': { categoria: 'Saúde', icone: '💪', cor: '#45B7D1' },

  // Lazer e Entretenimento
  'cinema': { categoria: 'Lazer', icone: '🎬', cor: '#F7DC6F' },
  'netflix': { categoria: 'Lazer', icone: '📺', cor: '#F7DC6F' },
  'spotify': { categoria: 'Lazer', icone: '🎵', cor: '#F7DC6F' },
  'parque': { categoria: 'Lazer', icone: '🎢', cor: '#F7DC6F' },
  'bar': { categoria: 'Lazer', icone: '🍺', cor: '#F7DC6F' },
  'show': { categoria: 'Lazer', icone: '🎤', cor: '#F7DC6F' },
  'teatro': { categoria: 'Lazer', icone: '🎭', cor: '#F7DC6F' },
  'festa': { categoria: 'Lazer', icone: '🎉', cor: '#F7DC6F' },
  'jogo': { categoria: 'Lazer', icone: '🎮', cor: '#F7DC6F' },
  'games': { categoria: 'Lazer', icone: '🎮', cor: '#F7DC6F' },

  // Educação
  'curso': { categoria: 'Educação', icone: '📚', cor: '#BB8FCE' },
  'livro': { categoria: 'Educação', icone: '📖', cor: '#BB8FCE' },
  'faculdade': { categoria: 'Educação', icone: '🎓', cor: '#BB8FCE' },
  'escola': { categoria: 'Educação', icone: '🏫', cor: '#BB8FCE' },
  'mensalidade': { categoria: 'Educação', icone: '💳', cor: '#BB8FCE' },

  // Casa e Moradia
  'casa': { categoria: 'Casa', icone: '🏠', cor: '#82E0AA' },
  'aluguel': { categoria: 'Casa', icone: '🏠', cor: '#82E0AA' },
  'luz': { categoria: 'Casa', icone: '💡', cor: '#82E0AA' },
  'energia': { categoria: 'Casa', icone: '💡', cor: '#82E0AA' },
  'internet': { categoria: 'Casa', icone: '📶', cor: '#82E0AA' },
  'limpeza': { categoria: 'Casa', icone: '🧽', cor: '#82E0AA' },
  'gás': { categoria: 'Casa', icone: '🔥', cor: '#82E0AA' },
  'gas': { categoria: 'Casa', icone: '🔥', cor: '#82E0AA' },
  'condomínio': { categoria: 'Casa', icone: '🏢', cor: '#82E0AA' },
  'condominio': { categoria: 'Casa', icone: '🏢', cor: '#82E0AA' },
  'móveis': { categoria: 'Casa', icone: '🛋️', cor: '#82E0AA' },
  'moveis': { categoria: 'Casa', icone: '🛋️', cor: '#82E0AA' },

  // Vestuário
  'roupa': { categoria: 'Vestuário', icone: '👕', cor: '#F8C471' },
  'tênis': { categoria: 'Vestuário', icone: '👟', cor: '#F8C471' },
  'tenis': { categoria: 'Vestuário', icone: '👟', cor: '#F8C471' },
  'sapato': { categoria: 'Vestuário', icone: '👞', cor: '#F8C471' },
  'camisa': { categoria: 'Vestuário', icone: '👔', cor: '#F8C471' },
  'calça': { categoria: 'Vestuário', icone: '👖', cor: '#F8C471' },
  'calca': { categoria: 'Vestuário', icone: '👖', cor: '#F8C471' },

  // Beleza
  'salão': { categoria: 'Beleza', icone: '💇', cor: '#E8DAEF' },
  'salao': { categoria: 'Beleza', icone: '💇', cor: '#E8DAEF' },
  'cabelo': { categoria: 'Beleza', icone: '💇', cor: '#E8DAEF' },
  'perfume': { categoria: 'Beleza', icone: '🌸', cor: '#E8DAEF' },

  // Tecnologia
  'celular': { categoria: 'Tecnologia', icone: '📱', cor: '#AED6F1' },
  'computador': { categoria: 'Tecnologia', icone: '💻', cor: '#AED6F1' },
  'notebook': { categoria: 'Tecnologia', icone: '💻', cor: '#AED6F1' },

  // Pets
  'veterinário': { categoria: 'Pets', icone: '🐕', cor: '#D2B4DE' },
  'veterinario': { categoria: 'Pets', icone: '🐕', cor: '#D2B4DE' },
  'ração': { categoria: 'Pets', icone: '🦴', cor: '#D2B4DE' },
  'racao': { categoria: 'Pets', icone: '🦴', cor: '#D2B4DE' },
  'pet shop': { categoria: 'Pets', icone: '🐕', cor: '#D2B4DE' },
  'petshop': { categoria: 'Pets', icone: '🐕', cor: '#D2B4DE' },

  // Trabalho
  'escritório': { categoria: 'Trabalho', icone: '🏢', cor: '#A9DFBF' },
  'escritorio': { categoria: 'Trabalho', icone: '🏢', cor: '#A9DFBF' },

  // Presentes
  'presente': { categoria: 'Presentes', icone: '🎁', cor: '#E67E22' },
  'aniversário': { categoria: 'Presentes', icone: '🎂', cor: '#E67E22' },
  'aniversario': { categoria: 'Presentes', icone: '🎂', cor: '#E67E22' },

  // Financeiro
  'seguro': { categoria: 'Financeiro', icone: '🛡️', cor: '#85929E' },
  'banco': { categoria: 'Financeiro', icone: '🏦', cor: '#85929E' },
  'cartão': { categoria: 'Financeiro', icone: '💳', cor: '#85929E' },
  'cartao': { categoria: 'Financeiro', icone: '💳', cor: '#85929E' }
};

export const DEFAULT_CATEGORY: CategoryInfo = { 
  categoria: 'Outros', 
  icone: '💸', 
  cor: '#95A5A6' 
};
