const admin = require('firebase-admin');

// Configuration Firebase pour Firestore
let app;

if (!admin.apps.length) {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.GAE_ENV) {
      // Production : Google App Engine avec service account par défaut
      app = admin.initializeApp({
        projectId: "projetcloudfirebase-777ce",
        // Explicitement spécifier le service account pour App Engine
        credential: admin.credential.applicationDefault()
      });
      console.log('✅ Firebase initialisé en production (App Engine)');
    } else {
      // Développement : utilise les Application Default Credentials
      app = admin.initializeApp({
        projectId: "projetcloudfirebase-777ce"
      });
      console.log('✅ Firebase initialisé en développement (ADC)');
    }
  } catch (error) {
    console.error('❌ Erreur d\'initialisation Firebase:', error.message);
    if (error.message.includes('credentials')) {
      console.log('💡 Développement: Exécutez gcloud auth application-default login');
      console.log('💡 Production: Vérifiez les permissions IAM du service account');
    }
    throw error;
  }
} else {
  app = admin.app();
}


const db = admin.firestore();
// Configuration Firestore
db.settings({
  ignoreUndefinedProperties: true
});

// Test de connexion en développement seulement
if (process.env.NODE_ENV !== 'production' && !process.env.GAE_ENV) {
  db.collection('_test').limit(1).get()
    .then(() => console.log('🔥 Connexion Firestore OK'))
    .catch(err => console.warn('⚠️ Test connexion Firestore:', err.message));
}
//

module.exports = { admin, db };