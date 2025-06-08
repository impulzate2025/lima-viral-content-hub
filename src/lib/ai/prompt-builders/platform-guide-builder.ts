
export class PlatformGuideBuilder {
  static getPlatformVisualGuide(platform: string): string {
    const guides = {
      'TikTok': 'Transiciones rápidas, música trending, texto overlay dinámico, tomas verticales, cambios de escenario cada 3-5 segundos, mapas animados de Lima, gráficos simples con números grandes.',
      'Instagram': 'Reels dinámicos con transiciones suaves, carruseles informativos, stories interactivas, imágenes de alta calidad de propiedades, antes/después, gráficos estéticamente atractivos.',
      'YouTube': 'Tomas más largas y profesionales, gráficos detallados, B-roll de propiedades, entrevistas, mapas interactivos, animaciones explicativas, intro y outro consistentes.',
      'LinkedIn': 'Gráficos profesionales e informativos, datos y estadísticas, videos de alta calidad con presentador, infografías, testimoniales de clientes, casos de estudio visuales.'
    };

    return guides[platform] || guides['Instagram'];
  }

  static getPlatformTimingGuide(platform: string): string {
    const guides = {
      'TikTok': 'Mejores horarios en Lima: 7 PM - 10 PM L-V (jóvenes post-trabajo), 1 PM - 4 PM S-D (tiempo libre), 11 AM - 1 PM (pausa almuerzo).',
      'Instagram': 'Óptimo: 6 PM - 9 PM L-V (engagement máximo), 10 AM - 12 PM S-D (navegación relajada), evitar 2 PM - 4 PM (siesta).',
      'YouTube': 'Prime time: 8 PM - 11 PM todos los días (contenido largo), 12 PM - 2 PM (almuerzo), fines de semana 3 PM - 6 PM.',
      'LinkedIn': 'Horarios laborales: 8 AM - 10 AM (inicio día), 12 PM - 2 PM (almuerzo), 5 PM - 7 PM (final jornada), evitar fines de semana.'
    };

    return guides[platform] || guides['Instagram'];
  }
}
