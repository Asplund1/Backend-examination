# Backend-examination
Swing notes API examination

## Beskrivning
Swing notes API är ett enkelt REST-baserat system för att hantera personliga anteckningar. Projektet är byggt med Node.js och Express och använder PostgreSQL som databas. Användaren kan registrera sig med ett användarnamn och lösenord, logga in för att få en JWT-token, och därefter skapa, läsa, uppdatera, ta bort och söka bland sina anteckningar.

## Förutsättningar
För att köra projektet lokalt behöver du ha Node.js och PostgreSQL . Börja med att klona ditt Git-repo och köra npm install i projektets rotmapp för att installera alla beroenden.

## Installation
Miljövariablerna styr koppling mot databas och hur JWT-token signeras. Kopiera .env.example till .env och fyll i dina egna värden för port, DATABASE_URL, JWT_SECRET och eventuellt annan konfiguration. Därefter initialiserar du databasen genom att köra SQL-skriptet database/schema.sql. skriv detta i terminalen: psql $DATABASE_URL -f database/schema.sql


När databasen är på plats startar du servern i utvecklingsläge med npm run dev (nodemon). Servern lyssnar som standard på port 4000, och all interaktiv dokumentation finns tillgänglig på http://localhost:4000/api/docs
där du med hjälp av Swagger kan testa och inspektera alla endpoints.

Exempel på hur du interagerar med API:t:

Registrera användare via POST /api/user/signup med en JSON-body som innehåller username och password.

Logga in via POST /api/user/login med samma uppgifter för att få tillbaka en JWT-token.

Läs alla anteckningar med GET /api/notes, uppdatera en med PUT /api/notes genom att skicka med anteckningens id och nya fält, och ta bort en anteckning med DELETE /api/notes genom att ange dess id.