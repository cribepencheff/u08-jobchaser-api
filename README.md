# u08 – JobChaser Backend

## 📌 Projektbeskrivning
Detta är backend för en jobbsökar-tjänst. API:et hanterar användarregistrering, inloggning och sparade jobb.  
Jobbannonser hämtas från ett externt API och lagras inte i systemet, vilket gör att vi endast sparar referenser till dessa jobb.  

### Konceptuell modellering  
Backend hanterar användare och deras sparade jobb. Jobbannonser hämtas från ett externt API och lagras inte i databasen, vilket gör systemet mer effektivt och skalbart.  

Modellen består av:  
- **Användare** – Kan skapa konton med e-post och lösenord.
- **Jobb** – Jobbannonser hämtas från ett externt API och lagras inte i backend. Backend sparar endast referenser (ID) till jobb som användarna har sparat som favoriter.
- **Favoriter** – Kopplar användare till jobb så att de kan spara och ta bort jobb från sina favoriter.

(Se ER-diagrammet nedan för en visuell översikt)

![JobChaser ER-Diagram](https://github.com/sandra-chas-academy/u08-skapa-backend-f-r-jobchaser-cribepencheff/raw/main/jobchaser-ER-diagram.png)

**Varför inte many-to-many?**
Relationen mellan **user** och **saved_jobs** är **en-till-många** (one-to-many), eftersom varje användare kan ha flera sparade jobb, men varje sparat jobb kan bara tillhöra en användare.  

## 📌 Teknikstack

- **Node.js**: Används för att köra backend-servern och hantera API-förfrågningar.

- **Express**: För routing och API-hantering.

- **Prisma**: ORM för att hantera databasen (MySQL).

- **JWT**: För autentisering och åtkomstkontroll via token.

- **dotenv**: För miljövariabler och säker lagring av känslig information.

- **CORS**: För att kontrollera kommunikation mellan frontend och backend.

- **bcryptjs**: För att hasha användarlösenord och förbättra säkerheten.


## 📌 API dokumentation

### 🌐 Användarrutter (User Routes)
Denna sektion beskriver alla API-rutter relaterade till användarhantering, inklusive registrering, inloggning och profiluppdatering.  

#### POST /api/auth/signup (Skapar ett nytt användarkonto):
```
// Request body:
{
  "email": "user@example.com",
  "password": "securePassword"
}

// Response:
{
  "message": "User created successfully"
}
```  

#### POST /api/auth/login (Loggar in en användare och returnerar en JWT-token):
```
// Request body:
{
  "email": "user@example.com",
  "password": "securePassword"
}

// Response [Status: 200 OK]:
{
  "token": "your.jwt.token"
}
```  

#### POST /api/auth/logout (Loggar ut en användare och rensar JWT-token.):
```
// Request body: Ingen request body krävs för utloggning.

// Response [Status: 200 OK]:
{
  "message": "Logged out successfully."
}
```  

#### GET /api/users/profile (Hämtar användarprofilen baserat på JWT-token):
```
// Request: Skickar med JWT i Authorization-headern som en Bearer-token
// Exempel på header:
// Authorization: Bearer <your.jwt.token>

// Response [Status: 200 OK]:
{
  "id": "user-id",
  "email": "user@example.com",
  "createdAt": "2025-03-22T12:34:56.789Z",
  "updatedAt": "2025-03-22T12:34:56.789Z"
}
```  

#### PUT /api/users/profile (Uppdaterar användarens lösenord):
```
// Request: Skickar med JWT i Authorization-headern som en Bearer-token
// Exempel på header:
// Authorization: Bearer <your.jwt.token>
// Request body:
{
  "oldPassword": "currentPassword",
  "newPassword": "newSecurePassword"
}

// Response [Status: 200 OK]:
{
  "message": "Password updated successfully.",
  "user": "user@example.com"
}
```  

#### DELETE /api/users/delete (Raderar användaren baserat på JWT-token):
```
// !!Autentisering krävs: Användaren måste vara inloggad för att kunna radera sitt konto.

// Request: Skickar med JWT i Authorization-headern som en Bearer-token
// Exempel på header:
// Authorization: Bearer <your.jwt.token>'

// Response [Status: 200 OK]:
{
  "message": "User deleted successfully."
}
```  

### 🌐 Favoritrutter (Saved Jobs Routes)  
Denna sektion beskriver alla API-rutter relaterade till hantering av sparade jobb, inklusive att spara och ta bort jobb från favoritlistan.  

#### GET /api/saved-jobs (Hämtar alla sparade jobb för användaren baserat på JWT-token):
```
// Request: Skickar med JWT i Authorization-headern som en Bearer-token
// Exempel på header:
// Authorization: Bearer <your.jwt.token>'

// Response [Status: 200 OK]:
{
  "savedJobs": [
    {
      "jobId": "job-id-1",
      "userId": "user-id",
      // Andra fält som jobbinformation kan finnas här
    },
    {
      "jobId": "job-id-2",
      "userId": "user-id",
      // Andra fält som jobbinformation kan finnas här
    }
  ]
}
```  

#### POST /api/saved-jobs (Sparar ett jobb som favorit för användaren):
```
// Request: Skickar med JWT i Authorization-headern som en Bearer-token
// Exempel på header:
// Authorization: Bearer <your.jwt.token>'

// Response [Status: 201 Created]:
{
  "savedJob": {
    "jobId": "job-id-1",
    "userId": "user-id"
  },
  "links": {
    "viewAllSavedJobs": "/api/saved-jobs",
    "removeSavedJob": "/api/saved-jobs/job-id-1"
  }
}

// !!Om användaren försöker spara ett jobb som redan finns i favoriterna, kommer ett fel (409 Conflict) att returneras.
{
  "message": "This job has already been saved."
}
```  

#### DELETE /api/saved-jobs/:jobId (Tar bort ett jobb från de sparade jobben):
```
// Request: Skickar med JWT i Authorization-headern som en Bearer-token
// Exempel på header:
// Authorization: Bearer <your.jwt.token>'

// Response [Status: 200 OK]:
{
  "message": "Job removed from saved jobs.",
  "links": {
    "viewAllSavedJobs": "/api/saved-jobs"
  }
}

// !!Om användaren försöker radera ett jobb som inte finns i favoriterna, kommer ett fel (404 Not Found) att returneras.
{
  "message": "Saved job ID not found."
}
```  

## 📌 Komma igång  

**1. Installera beroenden**

```bash
npm install
```

**2. Konfigurera miljövariabler**
Skapa en `.env`-fil i projektets rotmapp och lägg till följande:

```bash
DATABASE_URL='Anslutningssträngen till din MySQL-databas enligt Proismas dokumentation'  

JWT_SECRET='Hemlig nyckel som används för att signera och verifiera JSON Web Tokens (JWT)'
```

**3. Installera och konfigurera Prisma**  
Använd följande kommandon för att konfigurera databasen enligt [Prismas dokumentation](https://www.prisma.io/docs):

1. Kör Prisma-migreringar för att skapa databasschemat:
    ```bash
    npx prisma migrate dev
    ```

2. Kör detta kommando för att synkronisera Prisma-modeller med databasen:
    ```bash
    npx prisma db push
    ```


**4. Starta utvecklingsmiljön**  
För att starta servern i utvecklingsläge:

```bash
npm run dev
```
Det här kommandot använder `nodemon` för att automatiskt återstarta servern när det sker ändringar i koden.



**5. Bygg och starta för produktion (valfritt):**

```bash
npm run build    # Bygg TypeScript till JavaScript
npm start        # Starta servern i produktionsläge
```

