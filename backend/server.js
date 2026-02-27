// Configuration dotenv uniquement en développement
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const { db } = require('./firebase');
const s3Service = require('./s3service');

const app = express();
const PORT = process.env.PORT || 8080; // Elastic Beanstalk utilise le port 8080 par défaut


// Configuration CORS pour la production et le développement
const allowedOrigins = [
  // Frontend App Engine
  'https://projetcloud-476413.ey.r.appspot.com',
  'https://projetcloud-476413.appspot.com',
  // Backend Cloud Run (utile pour certains outils)
  'https://backend-api-349217030551.europe-west1.run.app',
  // Dev local
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8080'
];

const corsOptions = {
  origin(origin, callback) {
    // Permettre les requêtes sans origin (comme Postman, mobile apps, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log('CORS blocked for origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Middleware de debug pour voir les requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});

// Route de test S3
app.get('/test-s3', async (req, res) => {
  try {
    const result = await s3Service.testConnection();
    res.json({
      ...result,
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur test S3:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Routes S3
// GET - Lister les fichiers
app.get('/files', async (req, res) => {
  try {
    const { prefix } = req.query;
    const result = await s3Service.listFiles(prefix);
    
    const files = result.Contents?.map(file => ({
      key: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
      etag: file.ETag
    })) || [];

    res.json({
      success: true,
      data: files,
      count: files.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur S3 GET files:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST - Upload un fichièer
// app.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         error: 'Aucun fichier fourni',
//         timestamp: new Date().toISOString()
//       });
//     }

//     const { originalname, buffer, mimetype } = req.file;
//     const key = `uploads/${Date.now()}-${originalname}`;

//     await s3Service.uploadFile(key, buffer, mimetype);

//     res.status(201).json({
//       success: true,
//       data: {
//         key,
//         originalName: originalname,
//         size: buffer.length,
//         contentType: mimetype
//       },
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     console.error('Erreur S3 upload:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       timestamp: new Date().toISOString()
//     });
//   }
// });
// Route /hello
app.get('/hello', (req, res) => {
  res.json({
    message: 'Hello World! mec',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Backend avec Firestore',
    version: '1.0.0',
    endpoints: ['/hello', '/todos', '/todos/:id', '/test-firebase', '/health']
  });
});

// Route de health check pour Elastic Beanstalk
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route de test Firebase
app.get('/test-firebase', async (req, res) => {
  try {
    // Test simple de connexion à Firestore
    const testDoc = await db.collection('_test').doc('connection').get();
    res.json({
      success: true,
      message: 'Connexion Firebase OK',
      firestore: 'Connecté',
      projectId: db.app.options.projectId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur test Firebase:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      solution: 'Exécutez: gcloud auth application-default login',
      timestamp: new Date().toISOString()
    });
  }
});

// Routes Firestore - Collection TODO
// GET - Lire tous les TODOs
app.get('/todos', async (req, res) => {
  try {
    const todosRef = db.collection('TODO');
    const snapshot = await todosRef.get();
    
    const todos = [];
    snapshot.forEach(doc => {
      todos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: todos,
      count: todos.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur Firestore GET:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET - Lire un TODO spécifique
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('TODO').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'TODO non trouvé',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur Firestore GET ID:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST - Créer/Ajouter un TODO
app.post('/todos', async (req, res) => {
  try {
    const { title, description, completed = false } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Titre requis',
        timestamp: new Date().toISOString()
      });
    }

    const todoData = {
      title,
      description: description || '',
      completed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('TODO').add(todoData);
    
    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        ...todoData
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur Firestore POST:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// PUT - Mettre à jour un TODO
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    const updateData = {
      updatedAt: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const docRef = db.collection('TODO').doc(id);
    await docRef.update(updateData);
    
    // Récupérer le document mis à jour
    const updatedDoc = await docRef.get();
    
    res.json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur Firestore PUT:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// DELETE - Supprimer un TODO
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('TODO').doc(id).delete();
    
    res.json({
      success: true,
      message: 'TODO supprimé',
      id: id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur Firestore DELETE:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`👋 Route /hello disponible sur http://localhost:${PORT}/hello`);
  console.log(`📝 Routes /todos disponibles sur http://localhost:${PORT}/todos`);
  console.log(`❤️ Health check disponible sur http://localhost:${PORT}/health`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Démarrage terminé à: ${new Date().toISOString()}`);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non capturée:', error);
  console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée non gérée:', promise, 'raison:', reason);
});

module.exports = app;