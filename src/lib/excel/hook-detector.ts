
export function detectHookType(hook: string, context: string = '', aiTools: string = ''): string {
  const text = `${hook} ${context} ${aiTools}`.toLowerCase();
  
  if (text.includes('shock') || text.includes('impactante') || text.includes('sorprend') || 
      text.includes('no vas a creer') || text.includes('increíble')) {
    return 'Gancho de Shock';
  }
  
  if (text.includes('storytelling') || text.includes('historia') || text.includes('narrativa') ||
      text.includes('te voy a contar') || text.includes('érase una vez')) {
    return 'Gancho de Storytelling';
  }
  
  if (text.includes('polémico') || text.includes('controversial') || text.includes('debate') ||
      text.includes('nadie te dice') || text.includes('la verdad sobre')) {
    return 'Gancho Polémico';
  }
  
  if (text.includes('reto') || text.includes('challenge') || text.includes('desafío') ||
      text.includes('si puedes') || text.includes('atrévete')) {
    return 'Gancho de Reto';
  }
  
  if (text.includes('autoridad') || text.includes('experto') || text.includes('años de experiencia') ||
      text.includes('como experto') || text.includes('en mi experiencia')) {
    return 'Gancho de Autoridad';
  }
  
  return 'Sin clasificar';
}
