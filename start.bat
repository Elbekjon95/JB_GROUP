@echo off
chcp 65001 >nul
echo ========================================================
echo          JB GROUP - Bojxona va Omborxona Tizimi
echo ========================================================
echo.

echo [1/2] PostgreSQL bazasi tekshirilmoqda...
"C:\Users\Elbek\pgsql\bin\pg_ctl.exe" status -D "C:\Users\Elbek\pgsql\data" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [i] PostgreSQL serveri ishga tushirilmoqda...
    "C:\Users\Elbek\pgsql\bin\pg_ctl.exe" -D "C:\Users\Elbek\pgsql\data" -l "C:\Users\Elbek\pgsql\data\server.log" start
    timeout /t 2 >nul
) else (
    echo [OK] PostgreSQL allaqachon ishlab turibdi.
)

echo.
echo [2/2] Next.js veb-server ishga tushirilmoqda (http://localhost:3000)...
echo.
npm run dev
