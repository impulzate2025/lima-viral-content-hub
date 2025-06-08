
import { 
  getDistrictData, 
  getRelevantSuccessStories, 
  getRelevantHashtags, 
  getRelevantMarketInsights,
  getRelevantTrends 
} from '../../local-insights';

export class ContextDataBuilder {
  static extractDistrictFromTopic(topic: string) {
    const topicLower = topic.toLowerCase();
    const districts = ['miraflores', 'san_isidro', 'surco', 'pueblo_libre', 'brena', 'jesus_maria', 'magdalena'];
    
    for (const district of districts) {
      if (topicLower.includes(district.replace('_', ' ')) || topicLower.includes(district)) {
        return getDistrictData(district);
      }
    }
    return null;
  }

  static buildContextualData(districtData: any, successStories: any[], marketInsights: any[], trends: string[]): string {
    let context = '';
    
    if (districtData) {
      context += `\n**Datos del Distrito ${districtData.name}:**\n`;
      context += `- Precio promedio por m²: S/${districtData.price_m2.toLocaleString()}\n`;
      context += `- Crecimiento proyectado: ${districtData.growth_percentage}%\n`;
      context += `- Rentabilidad anual: ${districtData.rental_yield}%\n`;
      context += `- Proyectos de infraestructura: ${districtData.infrastructure_projects.join(', ')}\n`;
      context += `- Características: ${districtData.characteristics.join(', ')}\n`;
    }
    
    if (successStories.length > 0) {
      context += `\n**Casos de Éxito Relevantes:**\n`;
      successStories.slice(0, 2).forEach(story => {
        context += `- ${story.client_type} en ${story.district}: ROI ${story.roi_percentage}% en ${story.timeframe_months} meses\n`;
      });
    }
    
    if (marketInsights.length > 0) {
      context += `\n**Insights de Mercado:**\n`;
      marketInsights.slice(0, 2).forEach(insight => {
        context += `- ${insight.insight}\n`;
      });
    }
    
    if (trends.length > 0) {
      context += `\n**Tendencias 2025:**\n`;
      trends.forEach(trend => {
        context += `- ${trend}\n`;
      });
    }
    
    return context;
  }

  static buildDetailedLimaContext(districtData: any, marketInsights: any[]): string {
    return `
- Distritos en crecimiento: Pueblo Libre, Breña, Jesús María, Magdalena
- Precios promedio por m²: Miraflores (S/8,500), San Isidro (S/9,200), Surco (S/6,800)
- Tendencias: Espacios híbridos trabajo-vivienda, sostenibilidad, conectividad
- Jerga local: "jalado", "bacán", "chévere", "pata" (amigo)
- Referencias culturales: Metro de Lima, tráfico de la Panamericana, fin de semana en Asia
${districtData ? `- Datos específicos de ${districtData.name}: ${districtData.characteristics.join(', ')}` : ''}
${marketInsights.length > 0 ? `- Insight clave: ${marketInsights[0].insight}` : ''}
    `;
  }

  static getLocalDataInstructions(districtData: any, successStories: any[], marketInsights: any[]): string {
    let instructions = '';
    
    if (districtData) {
      instructions += `- Menciona el precio específico de S/${districtData.price_m2.toLocaleString()} por m² en ${districtData.name}\n`;
      instructions += `- Destaca el crecimiento proyectado del ${districtData.growth_percentage}%\n`;
      instructions += `- Usa las características específicas: ${districtData.characteristics.slice(0, 2).join(', ')}\n`;
    }
    
    if (successStories.length > 0) {
      instructions += `- Puedes referenciar casos como: "${successStories[0].client_type} logró ${successStories[0].roi_percentage}% ROI"\n`;
    }
    
    if (marketInsights.length > 0) {
      instructions += `- Incorpora este insight: "${marketInsights[0].insight}"\n`;
    }
    
    return instructions || '- Usa datos generales del mercado limeño';
  }
}
