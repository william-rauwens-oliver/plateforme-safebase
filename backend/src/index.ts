import { createServer } from './server.js';

const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || '0.0.0.0'; // Écouter sur toutes les interfaces

async function start() {
  try {
    console.log('🚀 Démarrage de l\'API SafeBase...');
    const server = await createServer();
    
    await server.listen({ port, host });
    console.log(`✅ API SafeBase démarrée avec succès sur http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
    console.log(`📊 Health check: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/health`);
  } catch (err) {
    console.error('❌ Erreur fatale lors du démarrage:', err);
    process.exit(1);
  }
}

start();
