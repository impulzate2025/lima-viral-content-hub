
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestCase {
  name: string;
  hook: string;
  script: string;
  expectedIssues: string[];
  shouldPass: boolean;
}

class TestSuite {
  private testCases: TestCase[] = [
    {
      name: 'Hook con palabra prohibida',
      hook: '¡Tu primer ahorro en Lima? ¡Estos 3 distritos explotarán en 2025! 🤯',
      script: 'Los distritos de San Isidro, Miraflores y Jesús María están experimentando un crecimiento significativo. Los precios por metro cuadrado han aumentado consistentemente. Las proyecciones para 2025 indican una revalorización del 15%. Factores como el Metro de Lima y nuevos centros comerciales impulsan esta tendencia. Para aprovechar estas oportunidades, agenda una consulta gratuita conmigo.',
      expectedIssues: ['BANNED_WORD', 'INAPPROPRIATE_EMOJI'],
      shouldPass: false
    },
    {
      name: 'Hook correcto',
      hook: '3 distritos de Lima se revalorizarán 15% en 2025 📈',
      script: 'San Isidro, Miraflores y Jesús María muestran indicadores excepcionales de crecimiento. Los datos del mercado confirman una tendencia alcista sostenida. Las mejoras en infraestructura y conectividad impulsan la demanda. Expertos proyectan un incremento del 15% en valores inmobiliarios para 2025. Contacta ahora conmigo para una asesoría personalizada sobre oportunidades de inversión.',
      expectedIssues: [],
      shouldPass: true
    },
    {
      name: 'Hook muy largo',
      hook: 'Descubre los secretos que los expertos no quieren que sepas sobre los tres distritos más prometedores de Lima',
      script: 'Script normal de longitud apropiada con información relevante. Agenda una consulta conmigo para más información específica.',
      expectedIssues: ['LENGTH_ERROR'],
      shouldPass: false
    },
    {
      name: 'Script con CTA genérico',
      hook: 'Inversión inteligente en Lima 2025 🏠',
      script: 'Los precios en Lima han mostrado una tendencia positiva. Varios distritos ofrecen oportunidades interesantes. La ubicación y la infraestructura son factores clave. Es importante analizar cada zona específicamente. Busca asesoría profesional para tomar decisiones inteligentes.',
      expectedIssues: ['GENERIC_CTA'],
      shouldPass: false
    },
    {
      name: 'Script con madre (palabra prohibida)',
      hook: 'Casos de éxito en Lima 📈',
      script: 'Una madre soltera en Pueblo Libre obtuvo un ROI del 35% en 18 meses. Los factores que contribuyeron a este éxito fueron la ubicación estratégica y el momento de compra. La revalorización fue significativa debido a las mejoras en infraestructura. Te ayudo a identificar oportunidades similares en tu caso específico.',
      expectedIssues: ['BANNED_WORD'],
      shouldPass: false
    },
    {
      name: 'Contenido perfecto',
      hook: 'Oportunidad única: 3 distritos con 15% de crecimiento 📈',
      script: 'El mercado inmobiliario de Lima presenta oportunidades excepcionales en tres distritos estratégicos. San Isidro mantiene su posición como zona premium con demanda constante. Miraflores atrae inversión por su potencial turístico y gastronómico. Jesús María emerge como alternativa accesible con excelente conectividad. Las proyecciones para 2025 indican un crecimiento del 15% en valores inmobiliarios. Agenda una consulta gratuita conmigo para analizar tu estrategia de inversión personalizada.',
      expectedIssues: [],
      shouldPass: true
    }
  ];

  async runAllTests(): Promise<any> {
    console.log('🧪 INICIANDO SUITE DE PRUEBAS - VALIDACIÓN DE CONTENIDO IA');
    console.log('='.repeat(60));
    
    let passedTests = 0;
    const totalTests = this.testCases.length;
    const results: any[] = [];
    
    for (let i = 0; i < this.testCases.length; i++) {
      const testCase = this.testCases[i];
      console.log(`\n📝 TEST ${i + 1}: ${testCase.name}`);
      console.log('-'.repeat(40));
      
      try {
        // Simular llamada a la función de validación
        const validationResponse = await fetch('http://127.0.0.1:54321/functions/v1/validate-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hook: testCase.hook,
            script: testCase.script,
            action: 'validate'
          })
        });
        
        const report = await validationResponse.json();
        
        console.log(`Hook: "${testCase.hook}"`);
        console.log(`Score Total: ${report.totalScore}/100 (${report.quality})`);
        
        // Verificar si el resultado coincide con lo esperado
        const actualPassed = report.totalScore >= 80;
        const testPassed = actualPassed === testCase.shouldPass;
        
        if (testPassed) {
          console.log('✅ TEST PASSED');
          passedTests++;
        } else {
          console.log('❌ TEST FAILED');
          console.log(`   Esperado: ${testCase.shouldPass ? 'PASS' : 'FAIL'}`);
          console.log(`   Actual: ${actualPassed ? 'PASS' : 'FAIL'}`);
        }
        
        if (report.hookAnalysis.issues.length > 0 || report.scriptAnalysis.issues.length > 0) {
          console.log('\n⚠️ Issues encontrados:');
          [...report.hookAnalysis.issues, ...report.scriptAnalysis.issues].forEach((issue: any) => {
            console.log(`   - ${issue.type}: ${issue.message}`);
            if (issue.suggestion) {
              console.log(`     Sugerencia: ${issue.suggestion}`);
            }
          });
        }
        
        results.push({
          testName: testCase.name,
          passed: testPassed,
          score: report.totalScore,
          issues: [...report.hookAnalysis.issues, ...report.scriptAnalysis.issues]
        });
        
      } catch (error) {
        console.log(`❌ TEST ERROR: ${error.message}`);
        results.push({
          testName: testCase.name,
          passed: false,
          error: error.message
        });
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`📊 RESULTADOS FINALES: ${passedTests}/${totalTests} tests passed`);
    console.log(`🎯 Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);
    
    return {
      totalTests,
      passedTests,
      successRate: Math.round((passedTests/totalTests) * 100),
      results,
      summary: passedTests === totalTests 
        ? '🎉 ¡TODOS LOS TESTS PASARON! El sistema de validación funciona correctamente.'
        : '⚠️ Algunos tests fallaron. Revisar la implementación del validador.'
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const testSuite = new TestSuite();
    const results = await testSuite.runAllTests();

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in test-validation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
