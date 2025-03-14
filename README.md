# JobChaser-API

## 📌 Projektbeskrivning  
Detta är backend för en jobbsökar-tjänst. API:et hanterar användarregistrering, inloggning och sparade jobb. Jobb hämtas från ett externt API och lagras inte lokalt i systemet.  

### Konceptuell modellering  
Backend hanterar användare och deras sparade jobb. Jobbannonser hämtas från ett externt API och lagras inte i databasen, vilket gör systemet mer effektivt och skalbart.  

Modellen består av:  
- **Användare** – Kan skapa konton med e-post och lösenord.
- **Jobb** – Jobbannonser hämtas från ett externt API och lagras inte i backend. Backend sparar endast referenser (ID) till jobb som användarna har sparat som favoriter.
- **Favoriter** – Kopplar användare till jobb så att de kan spara och ta bort jobb från sina favoriter.  

(Se ER-diagrammet nedan för en visuell översikt)  

![JobChaser ER-Diagram](https://github.com/sandra-chas-academy/u08-skapa-backend-f-r-jobchaser-cribepencheff/raw/main/jobchaser-ER-diagram.png)  

**Varför inte many-to-many?**  
Relationen mellan **User** och **SavedJobs** är **en-till-många** (one-to-many) eftersom varje användare kan ha flera sparade jobb, men varje rad i **SavedJobs** är kopplad till en specifik användare, vilket innebär att ett jobb inte kan tillhöra flera användare samtidigt.
