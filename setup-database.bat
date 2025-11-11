@echo off
echo Setting up PostgreSQL database for MediQueue...
echo.
echo This script will create the database and user.
echo You'll need to enter your PostgreSQL password when prompted.
echo.
pause

echo Creating database and user...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE mediqueue;"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE USER mediqueue_user WITH PASSWORD 'password';"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE mediqueue TO mediqueue_user;"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d mediqueue -c "GRANT ALL ON SCHEMA public TO mediqueue_user;"

echo.
echo Database setup complete!
echo Now you can run: npm run test:db
pause
