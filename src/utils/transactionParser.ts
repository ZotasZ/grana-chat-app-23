import { Transaction } from '../types/Transaction';

const CATEGORIAS: Record<string, { categoria: string; icone: string; cor: string }> = {
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
  'dermatologista': { categoria: 'Saúde', icone: '🧴', cor: '#45B7D1' },
  'oftalmologista': { categoria: 'Saúde', icone: '👁️', cor: '#45B7D1' },
  'óculos': { categoria: 'Saúde', icone: '👓', cor: '#45B7D1' },
  'oculos': { categoria: 'Saúde', icone: '👓', cor: '#45B7D1' },
  'academia': { categoria: 'Saúde', icone: '💪', cor: '#45B7D1' },
  'ginásio': { categoria: 'Saúde', icone: '💪', cor: '#45B7D1' },
  'ginasio': { categoria: 'Saúde', icone: '💪', cor: '#45B7D1' },

  // Lazer e Entretenimento
  'cinema': { categoria: 'Lazer', icone: '🎬', cor: '#F7DC6F' },
  'cin': { categoria: 'Lazer', icone: '🎬', cor: '#F7DC6F' },
  'streaming': { categoria: 'Lazer', icone: '📺', cor: '#F7DC6F' },
  'netflix': { categoria: 'Lazer', icone: '📺', cor: '#F7DC6F' },
  'spotify': { categoria: 'Lazer', icone: '🎵', cor: '#F7DC6F' },
  'parque': { categoria: 'Lazer', icone: '🎢', cor: '#F7DC6F' },
  'bar': { categoria: 'Lazer', icone: '🍺', cor: '#F7DC6F' },
  'show': { categoria: 'Lazer', icone: '🎤', cor: '#F7DC6F' },
  'concerto': { categoria: 'Lazer', icone: '🎼', cor: '#F7DC6F' },
  'teatro': { categoria: 'Lazer', icone: '🎭', cor: '#F7DC6F' },
  'museu': { categoria: 'Lazer', icone: '🏛️', cor: '#F7DC6F' },
  'exposição': { categoria: 'Lazer', icone: '🖼️', cor: '#F7DC6F' },
  'exposicao': { categoria: 'Lazer', icone: '🖼️', cor: '#F7DC6F' },
  'festa': { categoria: 'Lazer', icone: '🎉', cor: '#F7DC6F' },
  'balada': { categoria: 'Lazer', icone: '🕺', cor: '#F7DC6F' },
  'clube': { categoria: 'Lazer', icone: '🍸', cor: '#F7DC6F' },
  'jogo': { categoria: 'Lazer', icone: '🎮', cor: '#F7DC6F' },
  'games': { categoria: 'Lazer', icone: '🎮', cor: '#F7DC6F' },
  'steam': { categoria: 'Lazer', icone: '🎮', cor: '#F7DC6F' },
  'playstation': { categoria: 'Lazer', icone: '🎮', cor: '#F7DC6F' },
  'xbox': { categoria: 'Lazer', icone: '🎮', cor: '#F7DC6F' },
  'nintendo': { categoria: 'Lazer', icone: '🎮', cor: '#F7DC6F' },

  // Educação
  'curso': { categoria: 'Educação', icone: '📚', cor: '#BB8FCE' },
  'livro': { categoria: 'Educação', icone: '📖', cor: '#BB8FCE' },
  'faculdade': { categoria: 'Educação', icone: '🎓', cor: '#BB8FCE' },
  'universidade': { categoria: 'Educação', icone: '🎓', cor: '#BB8FCE' },
  'escola': { categoria: 'Educação', icone: '🏫', cor: '#BB8FCE' },
  'mensalidade': { categoria: 'Educação', icone: '💳', cor: '#BB8FCE' },
  'material escolar': { categoria: 'Educação', icone: '📝', cor: '#BB8FCE' },
  'caderno': { categoria: 'Educação', icone: '📓', cor: '#BB8FCE' },
  'caneta': { categoria: 'Educação', icone: '✏️', cor: '#BB8FCE' },
  'lápis': { categoria: 'Educação', icone: '✏️', cor: '#BB8FCE' },
  'lapis': { categoria: 'Educação', icone: '✏️', cor: '#BB8FCE' },
  'mochila': { categoria: 'Educação', icone: '🎒', cor: '#BB8FCE' },
  'estágio': { categoria: 'Educação', icone: '👔', cor: '#BB8FCE' },
  'estagio': { categoria: 'Educação', icone: '👔', cor: '#BB8FCE' },

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
  'iptu': { categoria: 'Casa', icone: '🏠', cor: '#82E0AA' },
  'móveis': { categoria: 'Casa', icone: '🛋️', cor: '#82E0AA' },
  'moveis': { categoria: 'Casa', icone: '🛋️', cor: '#82E0AA' },
  'eletrodoméstico': { categoria: 'Casa', icone: '🔌', cor: '#82E0AA' },
  'eletrodomestico': { categoria: 'Casa', icone: '🔌', cor: '#82E0AA' },
  'geladeira': { categoria: 'Casa', icone: '🧊', cor: '#82E0AA' },
  'fogão': { categoria: 'Casa', icone: '🔥', cor: '#82E0AA' },
  'fogao': { categoria: 'Casa', icone: '🔥', cor: '#82E0AA' },
  'microondas': { categoria: 'Casa', icone: '📻', cor: '#82E0AA' },
  'televisão': { categoria: 'Casa', icone: '📺', cor: '#82E0AA' },
  'televisao': { categoria: 'Casa', icone: '📺', cor: '#82E0AA' },
  'tv': { categoria: 'Casa', icone: '📺', cor: '#82E0AA' },
  'manutenção': { categoria: 'Casa', icone: '🔧', cor: '#82E0AA' },
  'manutencao': { categoria: 'Casa', icone: '🔧', cor: '#82E0AA' },
  'reforma': { categoria: 'Casa', icone: '🏗️', cor: '#82E0AA' },
  'pintura': { categoria: 'Casa', icone: '🎨', cor: '#82E0AA' },
  'encanador': { categoria: 'Casa', icone: '🔧', cor: '#82E0AA' },
  'eletricista': { categoria: 'Casa', icone: '⚡', cor: '#82E0AA' },
  'jardinagem': { categoria: 'Casa', icone: '🌱', cor: '#82E0AA' },

  // Vestuário e Beleza
  'roupa': { categoria: 'Vestuário', icone: '👕', cor: '#F8C471' },
  'tênis': { categoria: 'Vestuário', icone: '👟', cor: '#F8C471' },
  'tenis': { categoria: 'Vestuário', icone: '👟', cor: '#F8C471' },
  'sapato': { categoria: 'Vestuário', icone: '👞', cor: '#F8C471' },
  'camisa': { categoria: 'Vestuário', icone: '👔', cor: '#F8C471' },
  'calça': { categoria: 'Vestuário', icone: '👖', cor: '#F8C471' },
  'calca': { categoria: 'Vestuário', icone: '👖', cor: '#F8C471' },
  'vestido': { categoria: 'Vestuário', icone: '👗', cor: '#F8C471' },
  'blusa': { categoria: 'Vestuário', icone: '👚', cor: '#F8C471' },
  'camiseta': { categoria: 'Vestuário', icone: '👕', cor: '#F8C471' },
  'jaqueta': { categoria: 'Vestuário', icone: '🧥', cor: '#F8C471' },
  'casaco': { categoria: 'Vestuário', icone: '🧥', cor: '#F8C471' },
  'bermuda': { categoria: 'Vestuário', icone: '🩳', cor: '#F8C471' },
  'short': { categoria: 'Vestuário', icone: '🩳', cor: '#F8C471' },
  'meia': { categoria: 'Vestuário', icone: '🧦', cor: '#F8C471' },
  'cueca': { categoria: 'Vestuário', icone: '🩲', cor: '#F8C471' },
  'calcinha': { categoria: 'Vestuário', icone: '🩲', cor: '#F8C471' },
  'sutiã': { categoria: 'Vestuário', icone: '👙', cor: '#F8C471' },
  'sutia': { categoria: 'Vestuário', icone: '👙', cor: '#F8C471' },
  'bolsa': { categoria: 'Vestuário', icone: '👜', cor: '#F8C471' },
  'carteira': { categoria: 'Vestuário', icone: '👛', cor: '#F8C471' },
  'relógio': { categoria: 'Vestuário', icone: '⌚', cor: '#F8C471' },
  'relogio': { categoria: 'Vestuário', icone: '⌚', cor: '#F8C471' },
  'colar': { categoria: 'Vestuário', icone: '📿', cor: '#F8C471' },
  'anel': { categoria: 'Vestuário', icone: '💍', cor: '#F8C471' },
  'brinco': { categoria: 'Vestuário', icone: '💎', cor: '#F8C471' },
  'salão': { categoria: 'Beleza', icone: '💇', cor: '#E8DAEF' },
  'salao': { categoria: 'Beleza', icone: '💇', cor: '#E8DAEF' },
  'cabelo': { categoria: 'Beleza', icone: '💇', cor: '#E8DAEF' },
  'cabeleireiro': { categoria: 'Beleza', icone: '💇', cor: '#E8DAEF' },
  'manicure': { categoria: 'Beleza', icone: '💅', cor: '#E8DAEF' },
  'unha': { categoria: 'Beleza', icone: '💅', cor: '#E8DAEF' },
  'sobrancelha': { categoria: 'Beleza', icone: '👁️', cor: '#E8DAEF' },
  'depilação': { categoria: 'Beleza', icone: '🪒', cor: '#E8DAEF' },
  'depilacao': { categoria: 'Beleza', icone: '🪒', cor: '#E8DAEF' },
  'maquiagem': { categoria: 'Beleza', icone: '💄', cor: '#E8DAEF' },
  'perfume': { categoria: 'Beleza', icone: '🌸', cor: '#E8DAEF' },
  'shampoo': { categoria: 'Beleza', icone: '🧴', cor: '#E8DAEF' },
  'condicionador': { categoria: 'Beleza', icone: '🧴', cor: '#E8DAEF' },
  'creme': { categoria: 'Beleza', icone: '🧴', cor: '#E8DAEF' },
  'protetor solar': { categoria: 'Beleza', icone: '☀️', cor: '#E8DAEF' },

  // Tecnologia
  'celular': { categoria: 'Tecnologia', icone: '📱', cor: '#AED6F1' },
  'smartphone': { categoria: 'Tecnologia', icone: '📱', cor: '#AED6F1' },
  'computador': { categoria: 'Tecnologia', icone: '💻', cor: '#AED6F1' },
  'notebook': { categoria: 'Tecnologia', icone: '💻', cor: '#AED6F1' },
  'tablet': { categoria: 'Tecnologia', icone: '📟', cor: '#AED6F1' },
  'fone': { categoria: 'Tecnologia', icone: '🎧', cor: '#AED6F1' },
  'headphone': { categoria: 'Tecnologia', icone: '🎧', cor: '#AED6F1' },
  'carregador': { categoria: 'Tecnologia', icone: '🔌', cor: '#AED6F1' },
  'cabo': { categoria: 'Tecnologia', icone: '🔌', cor: '#AED6F1' },
  'impressora': { categoria: 'Tecnologia', icone: '🖨️', cor: '#AED6F1' },
  'mouse': { categoria: 'Tecnologia', icone: '🖱️', cor: '#AED6F1' },
  'teclado': { categoria: 'Tecnologia', icone: '⌨️', cor: '#AED6F1' },
  'monitor': { categoria: 'Tecnologia', icone: '🖥️', cor: '#AED6F1' },
  'software': { categoria: 'Tecnologia', icone: '💾', cor: '#AED6F1' },
  'aplicativo': { categoria: 'Tecnologia', icone: '📱', cor: '#AED6F1' },
  'app': { categoria: 'Tecnologia', icone: '📱', cor: '#AED6F1' },

  // Pets
  'veterinário': { categoria: 'Pets', icone: '🐕', cor: '#D2B4DE' },
  'veterinario': { categoria: 'Pets', icone: '🐕', cor: '#D2B4DE' },
  'ração': { categoria: 'Pets', icone: '🦴', cor: '#D2B4DE' },
  'racao': { categoria: 'Pets', icone: '🦴', cor: '#D2B4DE' },
  'pet shop': { categoria: 'Pets', icone: '🐕', cor: '#D2B4DE' },
  'petshop': { categoria: 'Pets', icone: '🐕', cor: '#D2B4DE' },
  'vacina': { categoria: 'Pets', icone: '💉', cor: '#D2B4DE' },
  'banho': { categoria: 'Pets', icone: '🛁', cor: '#D2B4DE' },
  'tosa': { categoria: 'Pets', icone: '✂️', cor: '#D2B4DE' },
  'brinquedo': { categoria: 'Pets', icone: '🎾', cor: '#D2B4DE' },
  'coleira': { categoria: 'Pets', icone: '🦮', cor: '#D2B4DE' },
  'cama pet': { categoria: 'Pets', icone: '🛏️', cor: '#D2B4DE' },
  'casinha pet': { categoria: 'Pets', icone: '🏠', cor: '#D2B4DE' },

  // Trabalho
  'material escritório': { categoria: 'Trabalho', icone: '📋', cor: '#A9DFBF' },
  'escritório': { categoria: 'Trabalho', icone: '🏢', cor: '#A9DFBF' },
  'escritorio': { categoria: 'Trabalho', icone: '🏢', cor: '#A9DFBF' },
  'impressão': { categoria: 'Trabalho', icone: '🖨️', cor: '#A9DFBF' },
  'impressao': { categoria: 'Trabalho', icone: '🖨️', cor: '#A9DFBF' },
  'xerox': { categoria: 'Trabalho', icone: '📄', cor: '#A9DFBF' },
  'papelaria': { categoria: 'Trabalho', icone: '📝', cor: '#A9DFBF' },
  'pasta': { categoria: 'Trabalho', icone: '📁', cor: '#A9DFBF' },
  'arquivo': { categoria: 'Trabalho', icone: '📋', cor: '#A9DFBF' },
  'reunião': { categoria: 'Trabalho', icone: '👔', cor: '#A9DFBF' },
  'reuniao': { categoria: 'Trabalho', icone: '👔', cor: '#A9DFBF' },

  // Presentes e Ocasiões Especiais
  'presente': { categoria: 'Presentes', icone: '🎁', cor: '#E67E22' },
  'gift': { categoria: 'Presentes', icone: '🎁', cor: '#E67E22' },
  'aniversário': { categoria: 'Presentes', icone: '🎂', cor: '#E67E22' },
  'aniversario': { categoria: 'Presentes', icone: '🎂', cor: '#E67E22' },
  'natal': { categoria: 'Presentes', icone: '🎄', cor: '#E67E22' },
  'páscoa': { categoria: 'Presentes', icone: '🐰', cor: '#E67E22' },
  'pascoa': { categoria: 'Presentes', icone: '🐰', cor: '#E67E22' },
  'dia das mães': { categoria: 'Presentes', icone: '💐', cor: '#E67E22' },
  'dia das maes': { categoria: 'Presentes', icone: '💐', cor: '#E67E22' },
  'dia dos pais': { categoria: 'Presentes', icone: '👔', cor: '#E67E22' },
  'casamento': { categoria: 'Presentes', icone: '💒', cor: '#E67E22' },
  'formatura': { categoria: 'Presentes', icone: '🎓', cor: '#E67E22' },
  'flores': { categoria: 'Presentes', icone: '🌸', cor: '#E67E22' },
  'buquê': { categoria: 'Presentes', icone: '💐', cor: '#E67E22' },
  'buque': { categoria: 'Presentes', icone: '💐', cor: '#E67E22' },

  // Seguros e Investimentos
  'seguro': { categoria: 'Financeiro', icone: '🛡️', cor: '#85929E' },
  'investimento': { categoria: 'Financeiro', icone: '📈', cor: '#85929E' },
  'banco': { categoria: 'Financeiro', icone: '🏦', cor: '#85929E' },
  'empréstimo': { categoria: 'Financeiro', icone: '💰', cor: '#85929E' },
  'emprestimo': { categoria: 'Financeiro', icone: '💰', cor: '#85929E' },
  'financiamento': { categoria: 'Financeiro', icone: '🏠', cor: '#85929E' },
  'cartão': { categoria: 'Financeiro', icone: '💳', cor: '#85929E' },
  'cartao': { categoria: 'Financeiro', icone: '💳', cor: '#85929E' },
  'anuidade': { categoria: 'Financeiro', icone: '💳', cor: '#85929E' },
  'taxa': { categoria: 'Financeiro', icone: '💸', cor: '#85929E' },
  'juros': { categoria: 'Financeiro', icone: '📊', cor: '#85929E' },
  'multa': { categoria: 'Financeiro', icone: '⚠️', cor: '#85929E' },
  'conta': { categoria: 'Financeiro', icone: '🏦', cor: '#85929E' }
};

// Mapeamento robusto para formas de pagamento - separando claramente crédito e débito
const PAYMENT_KEYWORDS = {
  // CRÉDITO - palavras que indicam especificamente cartão de crédito
  credito: [
    'credito', 'crédito', 'credit', 'cc', 'cartao credito', 'cartão crédito',
    'cartao de credito', 'cartão de crédito', 'cartaocredito', 'cartãocrédito',
    'visa credito', 'visa crédito', 'master credito', 'mastercard credito',
    'elo credito', 'hipercard', 'american express', 'amex', 'cartcred',
    'cred', 'credcard', 'creditcard', 'c6'
  ],
  
  // DÉBITO - palavras que indicam especificamente cartão de débito
  debito: [
    'debito', 'débito', 'debit', 'cd', 'cartao debito', 'cartão débito',
    'cartao de debito', 'cartão de débito', 'cartaodebito', 'cartãodébito',
    'visa debito', 'visa débito', 'master debito', 'mastercard debito',
    'elo debito', 'cartdeb', 'deb', 'debcard', 'debitcard'
  ],
  
  // PIX
  pix: [
    'pix', 'px', 'pixe', 'fotos', 'pixels', 'pic', 'pik'
  ],
  
  // DINHEIRO
  dinheiro: [
    'dinheiro', 'din', 'especie', 'espécie', 'cash', 'money', 'grana',
    'nota', 'papel', 'fisico', 'físico'
  ],
  
  // BOLETO
  boleto: [
    'boleto', 'bol', 'bloco', 'bancario', 'bancário', 'cobranca', 'cobrança'
  ],
  
  // CARTEIRAS DIGITAIS
  mercadopago: [
    'mercado pago', 'mercadopago', 'mpago', 'mp', 'mercado'
  ],
  
  picpay: [
    'picpay', 'pic pay', 'pp', 'pic'
  ],
  
  // VALE ALIMENTAÇÃO/REFEIÇÃO
  valealimentacao: [
    'vale alimentacao', 'vale alimentação', 'va', 'valeal', 'sodexo',
    'alelo', 'ticket', 'vr', 'ben', 'flash', 'up', 'verde'
  ],
  
  valerefeicao: [
    'vale refeicao', 'vale refeição', 'vr', 'valref', 'refeicao',
    'refeição', 'almoco', 'almoço'
  ],
  
  // TRANSFERÊNCIA
  transferencia: [
    'transferencia', 'transferência', 'ted', 'doc', 'transf'
  ],
  
  // OUTROS
  outros: [
    'cheque', 'automatico', 'automático', 'conta'
  ]
};

// Palavras que indicam frases naturais para filtrar
const NATURAL_WORDS = [
  'gastei', 'paguei', 'comprei', 'pago', 'gasto', 'compra',
  'no', 'na', 'do', 'da', 'com', 'via', 'pelo', 'pela',
  'hoje', 'ontem', 'amanha', 'amanhã', 'semana', 'mês', 'mes',
  'reais', 'real', 'r$', 'rs', 'brl',
  'pagamento', 'transação', 'transacao', 'valor', 'cartao', 'cartão'
];

interface PaymentValidationResult {
  formaPagamento: string;
  confianca: number;
  conflitos: string[];
}

interface ParsedTransaction {
  descricao: string; 
  valor: number; 
  formaPagamento?: string;
  categoria: string;
  icone: string;
  cor: string;
  validacao?: PaymentValidationResult;
  // Novos campos para parcelas
  totalParcelas?: number;
  valorParcela?: number;
}

export function parseTransactionMessage(message: string): ParsedTransaction | null {
  console.log('🔍 Parsing message:', message);
  
  // Limpar e normalizar a mensagem
  let cleanMessage = message.trim().toLowerCase();
  
  // Verificar se há informação de parcelas (ex: "2x", "3x", "10x")
  const parcelaMatch = cleanMessage.match(/(\d{1,2})x\b/);
  let totalParcelas = 1;
  
  if (parcelaMatch) {
    totalParcelas = parseInt(parcelaMatch[1]);
    console.log('📊 Parcelas detectadas:', totalParcelas);
    // Remover a informação de parcelas da mensagem
    cleanMessage = cleanMessage.replace(parcelaMatch[0], '').trim();
  }
  
  // Remover símbolos de moeda
  cleanMessage = cleanMessage.replace(/r\$\s*/g, '');
  
  // Extrair valor usando regex mais robusta
  const valorMatches = cleanMessage.match(/\b(\d{1,6}(?:[,\.]\d{1,2})?)\b/g);
  let valor = 0;
  let valorStr = '';
  
  if (valorMatches && valorMatches.length > 0) {
    valorStr = valorMatches[0].replace(',', '.');
    valor = parseFloat(valorStr);
    console.log('💰 Valor total encontrado:', valor);
  } else {
    // Se não encontrou valor, assumir valor padrão
    console.log('💰 Nenhum valor específico encontrado, usando valor padrão');
    valor = 0;
  }
  
  // Calcular valor da parcela - mudando para let para permitir reatribuição
  let valorParcela = totalParcelas > 1 ? valor / totalParcelas : valor;
  
  // Remover o valor da mensagem para processar o resto
  let remainingMessage = cleanMessage;
  if (valorStr) {
    remainingMessage = cleanMessage.replace(valorStr.replace('.', ','), '').replace(valorStr, '');
  }
  
  // Dividir em tokens
  const tokens = remainingMessage.split(/\s+/).filter(token => 
    token.length > 0 && 
    !['gastei', 'paguei', 'comprei', 'pago', 'gasto', 'compra', 'no', 'na', 'do', 'da', 'com', 'via', 'pelo', 'pela'].includes(token) &&
    token !== valorStr &&
    token !== valorStr.replace('.', ',')
  );
  
  console.log('🔤 Tokens extraídos:', tokens);
  
  if (tokens.length === 0) {
    console.log('❌ Nenhum token válido encontrado');
    return null;
  }
  
  // Identificar forma de pagamento
  const paymentValidation = validatePaymentMethod(tokens, remainingMessage);
  let descriptionTokens: string[] = [];
  
  // Remover tokens de pagamento dos tokens de descrição
  if (paymentValidation.formaPagamento) {
    descriptionTokens = tokens.filter(token => !isPaymentToken(token));
  } else {
    descriptionTokens = tokens;
  }
  
  // Criar descrição
  let descricao = descriptionTokens.join(' ').trim();
  
  if (!descricao && tokens.length > 0) {
    descricao = tokens.filter(token => !isPaymentToken(token)).join(' ') || 'Gasto';
  } else if (!descricao) {
    descricao = 'Gasto';
  }
  
  // Limpar descrição
  descricao = descricao.replace(/\b(de|do|da|no|na|com|via|pelo|pela)\b/g, '').trim();
  
  console.log('📝 Descrição final:', descricao);
  
  // Buscar categoria
  const categoriaInfo = findCategory(descricao);
  console.log('📂 Categoria identificada:', categoriaInfo.categoria);
  
  // Se valor é 0, sugerir um valor padrão
  if (valor === 0) {
    valor = getSuggestedValue(categoriaInfo.categoria);
    valorParcela = totalParcelas > 1 ? valor / totalParcelas : valor;
    console.log('💡 Valor sugerido:', valor);
  }
  
  const result: ParsedTransaction = {
    descricao,
    valor: valorParcela, // Retorna o valor da parcela
    formaPagamento: paymentValidation.formaPagamento,
    validacao: paymentValidation,
    totalParcelas: totalParcelas > 1 ? totalParcelas : undefined,
    valorParcela: totalParcelas > 1 ? valorParcela : undefined,
    ...categoriaInfo
  };
  
  console.log('✅ Resultado final:', result);
  return result;
}

function getSuggestedValue(categoria: string): number {
  const defaultValues: Record<string, number> = {
    'Alimentação': 25.00,
    'Transporte': 15.00,
    'Presentes': 50.00,
    'Saúde': 30.00,
    'Lazer': 40.00,
    'Educação': 100.00,
    'Casa': 80.00,
    'Vestuário': 60.00,
    'Beleza': 40.00,
    'Tecnologia': 150.00,
    'Pets': 35.00,
    'Trabalho': 25.00,
    'Financeiro': 100.00,
    'Outros': 20.00
  };
  
  return defaultValues[categoria] || 20.00;
}

function validatePaymentMethod(tokens: string[], fullMessage: string): PaymentValidationResult {
  console.log('🔧 Validando forma de pagamento:', tokens);
  
  const detectedPayments: { tipo: string; confianca: number; palavras: string[] }[] = [];
  const conflitos: string[] = [];
  
  // Verificar cada categoria de pagamento
  for (const [categoria, keywords] of Object.entries(PAYMENT_KEYWORDS)) {
    const foundKeywords: string[] = [];
    let maxConfianca = 0;
    
    for (const keyword of keywords) {
      // Verificar se algum token contém a palavra-chave
      for (const token of tokens) {
        if (token.includes(keyword) || keyword.includes(token)) {
          foundKeywords.push(keyword);
          const confianca = token === keyword ? 1.0 : 0.7;
          maxConfianca = Math.max(maxConfianca, confianca);
        }
      }
      
      if (fullMessage.includes(keyword)) {
        foundKeywords.push(keyword);
        maxConfianca = Math.max(maxConfianca, 0.8);
      }
    }
    
    if (foundKeywords.length > 0) {
      detectedPayments.push({
        tipo: categoria,
        confianca: maxConfianca,
        palavras: foundKeywords
      });
    }
  }
  
  console.log('🎯 Pagamentos detectados:', detectedPayments);
  
  // Verificar conflitos entre crédito e débito
  const hasCredito = detectedPayments.some(p => p.tipo === 'credito');
  const hasDebito = detectedPayments.some(p => p.tipo === 'debito');
  
  if (hasCredito && hasDebito) {
    conflitos.push('Conflito detectado entre crédito e débito');
    console.log('⚠️ Conflito: crédito e débito detectados simultaneamente');
  }
  
  // Selecionar o pagamento com maior confiança
  let selectedPayment = detectedPayments.reduce((prev, current) => 
    (current.confianca > prev.confianca) ? current : prev, 
    { tipo: '', confianca: 0, palavras: [] }
  );
  
  // Se há conflito, priorizar a palavra mais específica
  if (conflitos.length > 0) {
    const creditoPayment = detectedPayments.find(p => p.tipo === 'credito');
    const debitoPayment = detectedPayments.find(p => p.tipo === 'debito');
    
    if (creditoPayment && debitoPayment) {
      const creditoEspecifico = creditoPayment.palavras.some(p => 
        ['cartao credito', 'cartão crédito', 'credito', 'crédito'].includes(p)
      );
      const debitoEspecifico = debitoPayment.palavras.some(p => 
        ['cartao debito', 'cartão débito', 'debito', 'débito'].includes(p)
      );
      
      if (creditoEspecifico && !debitoEspecifico) {
        selectedPayment = creditoPayment;
      } else if (debitoEspecifico && !creditoEspecifico) {
        selectedPayment = debitoPayment;
      }
    }
  }
  
  // Mapear para nome amigável
  const paymentNames: Record<string, string> = {
    credito: 'Cartão de Crédito',
    debito: 'Cartão de Débito',
    pix: 'PIX',
    dinheiro: 'Dinheiro',
    boleto: 'Boleto',
    mercadopago: 'Mercado Pago',
    picpay: 'PicPay',
    valealimentacao: 'Vale Alimentação',
    valerefeicao: 'Vale Refeição',
    transferencia: 'Transferência',
    outros: 'Outros'
  };
  
  const result: PaymentValidationResult = {
    formaPagamento: selectedPayment.tipo ? paymentNames[selectedPayment.tipo] || 'Outros' : '',
    confianca: selectedPayment.confianca,
    conflitos
  };
  
  console.log('💳 Validação de pagamento:', result);
  return result;
}

function isPaymentToken(token: string): boolean {
  for (const keywords of Object.values(PAYMENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (token.includes(keyword) || keyword.includes(token)) {
        return true;
      }
    }
  }
  return false;
}

function findCategory(descricao: string): { categoria: string; icone: string; cor: string } {
  const descricaoLower = descricao.toLowerCase();
  
  console.log('🏷️ Buscando categoria para:', descricaoLower);
  
  // Buscar correspondência exata ou parcial - busca mais específica primeiro
  const sortedKeys = Object.keys(CATEGORIAS).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    if (descricaoLower.includes(key) || key.includes(descricaoLower)) {
      const info = CATEGORIAS[key];
      console.log('✅ Categoria encontrada:', info.categoria);
      return info;
    }
  }
  
  // Categoria padrão
  console.log('📂 Usando categoria padrão: Outros');
  return { categoria: 'Outros', icone: '💸', cor: '#95A5A6' };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
