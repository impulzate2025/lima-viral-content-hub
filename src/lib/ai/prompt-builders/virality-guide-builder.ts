
export class ViralityGuideBuilder {
  static getViralityGuide(viralScore: number): string {
    if (viralScore <= 3) {
      return `**1-3 (Bajo Impacto):** Tono informativo, directo, claro. Enfocado en la utilidad o dato específico. Menos emocional. Ejemplo: "3 distritos de Lima con mejor proyección inmobiliaria 2025"`;
    } else if (viralScore <= 6) {
      return `**4-6 (Moderado Impacto):** Un poco más de emoción o una pregunta que invite a la reflexión. Introduce un elemento de novedad o beneficio. Ejemplo: "¿Conoces estos 3 distritos que van a cambiar en 2025?"`;
    } else if (viralScore <= 8) {
      return `**7-8 (Alto Impacto):** Lenguaje más enérgico, uso de preguntas retóricas, misterio, o una promesa clara. Juega con la emoción y la curiosidad. Ejemplo: "¡Los 3 distritos de Lima que se revalorizarán significativamente en 2025!"`;
    } else {
      return `**9-10 (Viral Masivo):** Lenguaje muy ENÉRGICO, que desafíe la norma, que genere asombro, urgencia o conocimiento exclusivo. Usa emojis profesionales para enfatizar. Ejemplo: "Lima 2025: 3 distritos con potencial de revalorización que pocos conocen 🤫 ¿Te quedarás sin esta oportunidad?"`;
    }
  }

  static getEnhancedExampleHook(type: string, viralScore: number, districtData: any): string {
    const baseExamples = {
      'Autoridad': viralScore >= 8 
        ? `Lima 2025: 3 distritos con alto potencial de revalorización 📈` 
        : `Como experto inmobiliario, te revelo los 3 distritos con mayor potencial 2025`,
      'Controversial': viralScore >= 8 
        ? `¿Sigues pensando que Miraflores es la mejor inversión? 🤔` 
        : `Olvídate de Miraflores, estos 3 distritos son mejores inversiones`,
      'Shock': viralScore >= 8 
        ? `95% de limeños NO conoce estos distritos de alta revalorización 😱` 
        : `El error que cometen 9 de cada 10 compradores en Lima`,
      'Predictivo': viralScore >= 8 
        ? `Crecimiento inmobiliario 2025: 3 distritos que se revalorizarán significativamente` 
        : `Estos 3 distritos tendrán el mayor crecimiento en 2025`
    };
    
    let example = baseExamples[type] || "Hook optimizado para tu tipo de contenido y nivel de viralidad";
    
    if (districtData) {
      example = example.replace('3 distritos', `${districtData.name} y 2 distritos más`);
    }
    
    return example;
  }

  static getMetricsGuide(viralScore: number, platform: string): string {
    if (viralScore <= 3) {
      return 'Haz una estimación conservadora: Views: 1k-5k | Engagement: 3-6% | Shares: 0.2-1%. Justifica: "Contenido informativo con audiencia específica interesada en el tema."';
    } else if (viralScore <= 6) {
      return 'Estimación moderada: Views: 5k-20k | Engagement: 5-8% | Shares: 1-3%. Justifica: "Contenido con elementos de curiosidad que invita a la interacción."';
    } else if (viralScore <= 8) {
      return 'Estimación alta: Views: 20k-80k | Engagement: 8-12% | Shares: 3-6%. Justifica: "Hook impactante y tema relevante que genera discusión y compartidos."';
    } else {
      return 'Estimación viral: Views: 50k-300k+ | Engagement: 10-20% | Shares: 5-15%. Justifica: "Contenido controvertial/impactante con alto potencial viral por su naturaleza disruptiva."';
    }
  }
}
