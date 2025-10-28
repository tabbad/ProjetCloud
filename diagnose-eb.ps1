# Script de diagnostic EB - À exécuter avec vos vraies valeurs
# Remplacez les variables par vos vraies valeurs

# Variables à personnaliser
$APP_NAME = "votre-app-name"
$ENV_NAME = "votre-env-name" 
$REGION = "votre-region"

Write-Host "=== Diagnostic Elastic Beanstalk ===" -ForegroundColor Green

Write-Host "`n1. État de l'environnement :" -ForegroundColor Yellow
aws elasticbeanstalk describe-environment-health --environment-name $ENV_NAME --attribute-names All --region $REGION

Write-Host "`n2. Événements récents :" -ForegroundColor Yellow
aws elasticbeanstalk describe-events --environment-name $ENV_NAME --max-records 20 --region $REGION

Write-Host "`n3. Ressources de l'environnement :" -ForegroundColor Yellow
aws elasticbeanstalk describe-environment-resources --environment-name $ENV_NAME --region $REGION

Write-Host "`n4. Configuration de l'environnement :" -ForegroundColor Yellow
aws elasticbeanstalk describe-configuration-settings --application-name $APP_NAME --environment-name $ENV_NAME --region $REGION

Write-Host "`n5. Logs de l'application (dernière heure) :" -ForegroundColor Yellow
aws elasticbeanstalk request-environment-info --environment-name $ENV_NAME --info-type tail --region $REGION
Start-Sleep -Seconds 10
aws elasticbeanstalk retrieve-environment-info --environment-name $ENV_NAME --info-type tail --region $REGION