
import { CATEGORIAS, DEFAULT_CATEGORY, CategoryInfo } from './categories';

// Cache para melhorar performance
const categoryCache = new Map<string, CategoryInfo>();

export function findCategory(descricao: string): CategoryInfo {
  const descricaoLower = descricao.toLowerCase();
  
  // Verificar cache primeiro
  if (categoryCache.has(descricaoLower)) {
    return categoryCache.get(descricaoLower)!;
  }
  
  // Buscar correspondência - palavras mais específicas primeiro
  const sortedKeys = Object.keys(CATEGORIAS).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    if (descricaoLower.includes(key) || key.includes(descricaoLower)) {
      const info = CATEGORIAS[key];
      categoryCache.set(descricaoLower, info);
      return info;
    }
  }
  
  // Categoria padrão
  categoryCache.set(descricaoLower, DEFAULT_CATEGORY);
  return DEFAULT_CATEGORY;
}

export function getSuggestedValue(categoria: string): number {
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
