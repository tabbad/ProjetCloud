# Test de connectivité entre Frontend et Backend
# À exécuter après déploiement

Write-Host "=== Test de connectivité Frontend ↔ Backend ===" -ForegroundColor Green

$FRONTEND_URL = "https://projetcloud-476413.ey.r.appspot.com"
$BACKEND_URL = "http://backendprojetcloud-env.eba-s5fadmwy.eu-west-3.elasticbeanstalk.com"

Write-Host "`n1. Test Backend - Route /health" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/health" -Method Get
    Write-Host "✅ Backend /health OK" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "❌ Backend /health ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Test Backend - Route /hello" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/hello" -Method Get
    Write-Host "✅ Backend /hello OK" -ForegroundColor Green
    Write-Host "Message: $($response.message)" -ForegroundColor White
} catch {
    Write-Host "❌ Backend /hello ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Test Backend - Route /todos" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/todos" -Method Get
    Write-Host "✅ Backend /todos OK" -ForegroundColor Green
    Write-Host "TODOs count: $($response.count)" -ForegroundColor White
} catch {
    Write-Host "❌ Backend /todos ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Test Frontend" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $FRONTEND_URL -Method Get
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend OK (Status: $($response.StatusCode))" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5. Test CORS (simulation)" -ForegroundColor Yellow
Write-Host "Frontend: $FRONTEND_URL" -ForegroundColor Cyan
Write-Host "Backend:  $BACKEND_URL" -ForegroundColor Cyan
Write-Host "Si vous voyez des erreurs CORS dans la console du navigateur," -ForegroundColor Yellow
Write-Host "vérifiez que le backend autorise l'origine du frontend." -ForegroundColor Yellow

Write-Host "`n=== Instructions ===" -ForegroundColor Green
Write-Host "1. Ouvrez votre frontend: $FRONTEND_URL" -ForegroundColor White
Write-Host "2. Ouvrez les outils de développement (F12)" -ForegroundColor White
Write-Host "3. Cliquez sur 'Appeler /hello' dans l'interface" -ForegroundColor White
Write-Host "4. Vérifiez qu'il n'y a pas d'erreurs CORS dans la console" -ForegroundColor White