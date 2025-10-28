# Déploiement Backend sur AWS Elastic Beanstalk

## Prérequis

1. **Application Elastic Beanstalk créée** sur AWS
2. **Environnement configuré** (Node.js 18+)
3. **Secrets GitHub configurés** :
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (ex: eu-west-1)
   - `EB_APPLICATION_NAME` (nom de votre application EB)
   - `EB_ENVIRONMENT_NAME` (nom de votre environnement EB)
   - `EB_S3_BUCKET` (bucket S3 pour les déploiements, optionnel)

## Configuration AWS Elastic Beanstalk

### 1. Créer une application EB
```bash
# Via AWS CLI
aws elasticbeanstalk create-application \
  --application-name mon-backend-app \
  --description "Backend API Node.js"
```

### 2. Créer un environnement
```bash
aws elasticbeanstalk create-environment \
  --application-name mon-backend-app \
  --environment-name production \
  --platform-arn "arn:aws:elasticbeanstalk:eu-west-1::platform/Node.js 18 running on 64bit Amazon Linux 2/5.8.4" \
  --option-settings Namespace=aws:autoscaling:launchconfiguration,OptionName=InstanceType,Value=t3.micro
```

## Variables d'environnement à configurer dans EB

Dans la console AWS Elastic Beanstalk → Configuration → Software :

```
NODE_ENV=production
PORT=8080
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=votre-bucket-s3
FIREBASE_PROJECT_ID=votre-project-id
```

## Déploiement automatique

1. **Push sur main/master** déclenche automatiquement le déploiement
2. **Déploiement manuel** via GitHub Actions → Run workflow

## Structure des fichiers

```
.github/workflows/
├── deploy-backend.yml          # Workflow principal avec einaregilsson/beanstalk-deploy
└── deploy-backend-simple.yml   # Workflow alternatif avec AWS CLI

.ebextensions/
├── nodejs.config              # Configuration Node.js
└── app.config                 # Configuration application

backend/
├── server.js                  # Point d'entrée (PORT=8080)
├── package.json               # Dépendances et scripts
└── ...

Dockerfile                     # Optionnel pour conteneurisation
```

## Surveillance et logs

### Accéder aux logs
```bash
# Via AWS CLI
aws elasticbeanstalk describe-environment-resources \
  --environment-name production

# Télécharger les logs
aws elasticbeanstalk request-environment-info \
  --environment-name production \
  --info-type tail
```

### Monitoring
- CloudWatch automatiquement configuré
- Métriques CPU, mémoire, requêtes
- Alertes sur les erreurs

## Troubleshooting

### 1. Échec de déploiement
- Vérifier les logs dans EB Console
- Vérifier les secrets GitHub
- Tester localement avec `npm start`

### 2. Variables d'environnement
- Configurer dans EB Console → Software Configuration
- Ou via `.ebextensions/app.config`

### 3. Port incorrect
- EB utilise le port défini par `process.env.PORT`
- Par défaut 8080, pas 5000

### 4. Permissions AWS
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "elasticbeanstalk:*",
                "s3:*",
                "cloudformation:*",
                "ec2:*",
                "autoscaling:*",
                "cloudwatch:*",
                "logs:*"
            ],
            "Resource": "*"
        }
    ]
}
```

## Commandes utiles

### Déploiement manuel local
```bash
# Installer EB CLI
pip install awsebcli

# Initialiser
eb init

# Déployer
eb deploy
```

### Test local
```bash
cd backend
npm install
PORT=8080 npm start
```

## URLs de production

Une fois déployé, votre API sera disponible sur :
```
http://votre-env-name.region.elasticbeanstalk.com/
http://votre-env-name.region.elasticbeanstalk.com/hello
http://votre-env-name.region.elasticbeanstalk.com/todos
```