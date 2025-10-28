@echo off
REM Quick EmailJS Setup Script for Windows
REM This script will guide you through getting your EmailJS credentials

echo.
echo ===========================================
echo EmailJS Setup Helper
echo ===========================================
echo.
echo Your public key is already configured:
echo   X Public Key: ihlv_qkqYTcY_gCw7
echo.
echo You still need two more credentials:
echo.
echo 1. SERVICE ID - From your email service connection
echo    - Go to: https://dashboard.emailjs.com/admin/services
echo    - You should see your Gmail connection
echo    - Copy the Service ID (starts with 'service_')
echo.
echo 2. TEMPLATE ID - From your email template
echo    - Go to: https://dashboard.emailjs.com/admin/templates
echo    - You should see your email template
echo    - Copy the Template ID
echo.
echo ===========================================
echo Once you have those, update script.js:
echo ===========================================
echo.
echo Replace: 'YOUR_SERVICE_ID_HERE'
echo With:    Your actual Service ID
echo.
echo Replace: 'YOUR_TEMPLATE_ID_HERE'
echo With:    Your actual Template ID
echo.
echo Then test it on GitHub.dev!
echo.
pause
