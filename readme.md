![Peaqplus](images/peaqplus.webp)

# Booking Engine API Documentation

## Language Selection / Nyelv Választás

- [🇬🇧 English Documentation](#english-documentation)
- [🇭🇺 Magyar Dokumentáció](#magyar-dokumentáció)

---

## English Documentation

### Overview
The Booking Engine API provides endpoints for recording search activities in hotel booking systems. This API helps track user search behavior for analytics and reporting purposes.

### Base URL
```
https://peaqplus.com/api
```

### Authentication
All requests require proper third-party token authentication in the header:
```
X-Third-Party-Token: YOUR_THIRD_PARTY_TOKEN
```

The middleware validates the token and automatically extracts subhotel_id and third-party information from the token. The system also performs URL validation if enabled for the third party.

---

### POST /booking-engine-search

Records search activities in the booking engine system for analytics and tracking purposes.

#### Endpoint
```
POST /api/booking-engine-search
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date_from` | string | Yes | Check-in date in YYYY-MM-DD format |
| `date_to` | string | Yes | Check-out date in YYYY-MM-DD format (must be after or equal to date_from) |

#### Request Example
```json
{
  "date_from": "2025-06-01",
  "date_to": "2025-06-05"
}
```

#### Response Format

##### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Booking engine search recorded successfully",
  "data": {
    "days_recorded": 4,
    "subhotel_id": 123,
    "date_from": "2025-06-01",
    "date_to": "2025-06-05"
  }
}
```

##### Error Responses

**Authentication Error (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Third party token is missing"
}
```

**Invalid Token (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Invalid third party token"
}
```

**URL Validation Error (401 Unauthorized)**
```json
{
  "success": false,
  "message": "URL validation failed: missing referer or origin"
}
```

**Validation Error (422 Unprocessable Entity)**
```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "date_from": ["The date from field is required."],
    "date_to": ["The date to must be a date after or equal to date from."]
  }
}
```

**Missing Subhotel ID (400 Bad Request)**
```json
{
  "success": false,
  "message": "Invalid subhotel_id"
}
```

**Server Error (500 Internal Server Error)**
```json
{
  "success": false,
  "message": "Error processing booking engine search",
  "error": "Database connection failed"
}
```

---

### POST /test/booking-engine-search

Test endpoint that mimics the search recording functionality without saving data to the database. Used for testing and development purposes.

#### Endpoint
```
POST /api/test/booking-engine-search
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date_from` | string | Yes | Check-in date in YYYY-MM-DD format |
| `date_to` | string | Yes | Check-out date in YYYY-MM-DD format (must be after or equal to date_from) |

#### Request Example
```json
{
  "date_from": "2025-06-01",
  "date_to": "2025-06-05"
}
```

#### Response Format

##### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Booking engine search test completed successfully (no data saved)",
  "data": {
    "days_recorded": 4,
    "subhotel_id": 123,
    "date_from": "2025-06-01",
    "date_to": "2025-06-05",
    "test_mode": true,
    "would_insert": [
      {
        "date": "2025-06-01",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-06-02",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      }
    ]
  }
}
```

---

### Integration Guide

#### Step 1: Setup
Ensure you have the proper third-party token for your environment and that your domain is registered in the system.

#### Step 2: Implementation
For detailed implementation examples in various programming languages, please see:

**[📁 View Code Examples](./examples/)**

The examples folder contains implementation samples for:
- JavaScript
- TypeScript
- PHP
- Python

#### Step 3: Error Handling
Always implement proper error handling to manage different response scenarios:

- **Authentication errors**: Missing or invalid third-party token
- **URL validation errors**: Request origin doesn't match registered domain
- **Validation errors**: Display user-friendly messages for invalid dates
- **Server errors**: Show generic error message and retry mechanism

#### Important Notes
- All requests are logged by the middleware for audit purposes
- URL validation may be enforced depending on third-party configuration
- Ensure requests are made from registered domains if URL validation is enabled
- Sensitive data in request bodies (passwords, tokens) are automatically masked in logs

### Rate Limiting
- Maximum 100 requests per minute per IP address
- Bulk operations are recommended for multiple searches

### Best Practices
1. **Date Validation**: Always validate dates on the client side before sending requests
2. **Error Handling**: Implement comprehensive error handling for all possible scenarios
3. **Logging**: Log successful searches for your own analytics
4. **Retry Logic**: Implement exponential backoff for failed requests

### Additional Information

#### Support
For technical support, please contact: hello@peaqplus.com

#### API Versioning
Current version: v1

#### Changelog
- v1.0.0: Initial release

---

## Magyar Dokumentáció

### Áttekintés
A Szállás Foglalási Motor API végpontokat biztosít a keresési tevékenységek rögzítéséhez szállodai foglalási rendszerekben. Ez az API segít nyomon követni a felhasználói keresési viselkedést elemzési és jelentéskészítési célokból.

### URL
```
https://peaqplus.com/api
```

### Hitelesítés
Minden kérés megfelelő harmadik fél token hitelesítést igényel a header-ben:
```
X-Third-Party-Token: YOUR_THIRD_PARTY_TOKEN
```

A middleware validálja a tokent és automatikusan kinyeri a subhotel_id és harmadik fél információkat a tokenből. A rendszer URL validációt is végez, ha az engedélyezve van a harmadik fél számára.

---

### POST /booking-engine-search

Rögzíti a keresési tevékenységeket a foglalási motor rendszerében elemzési és nyomon követési célokból.

#### Végpont
```
POST /api/booking-engine-search
```

#### Kérés Paraméterei

| Paraméter | Típus | Kötelező | Leírás |
|-----------|-------|----------|---------|
| `date_from` | string | Igen | Bejelentkezés dátuma YYYY-MM-DD formátumban |
| `date_to` | string | Igen | Kijelentkezés dátuma YYYY-MM-DD formátumban (date_from után vagy azzal egyenlő kell legyen) |

#### Kérés Példa
```json
{
  "date_from": "2025-06-01",
  "date_to": "2025-06-05"
}
```

#### Válasz Formátum

##### Sikeres Válasz (200 OK)
```json
{
  "success": true,
  "message": "Booking engine search recorded successfully",
  "data": {
    "days_recorded": 4,
    "subhotel_id": 123,
    "date_from": "2025-06-01",
    "date_to": "2025-06-05"
  }
}
```

##### Hiba Válaszok

**Hitelesítési Hiba (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Third party token is missing"
}
```

**Érvénytelen Token (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Invalid third party token"
}
```

**URL Validációs Hiba (401 Unauthorized)**
```json
{
  "success": false,
  "message": "URL validation failed: missing referer or origin"
}
```

**Validációs Hiba (422 Unprocessable Entity)**
```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "date_from": ["The date from field is required."],
    "date_to": ["The date to must be a date after or equal to date from."]
  }
}
```

**Hiányzó Subhotel ID (400 Bad Request)**
```json
{
  "success": false,
  "message": "Invalid subhotel_id"
}
```

**Szerver Hiba (500 Internal Server Error)**
```json
{
  "success": false,
  "message": "Error processing booking engine search",
  "error": "Database connection failed"
}
```

---

### POST /test/booking-engine-search

Teszt végpont, amely utánozza a keresés rögzítési funkcionalitást anélkül, hogy adatokat mentene az adatbázisba. Tesztelési és fejlesztési célokra használatos.

#### Végpont
```
POST /api/test/booking-engine-search
```

#### Kérés Paraméterei

| Paraméter | Típus | Kötelező | Leírás |
|-----------|-------|----------|---------|
| `date_from` | string | Igen | Bejelentkezés dátuma YYYY-MM-DD formátumban |
| `date_to` | string | Igen | Kijelentkezés dátuma YYYY-MM-DD formátumban (date_from után vagy azzal egyenlő kell legyen) |

#### Kérés Példa
```json
{
  "date_from": "2025-06-01",
  "date_to": "2025-06-05"
}
```

#### Válasz Formátum

##### Sikeres Válasz (200 OK)
```json
{
  "success": true,
  "message": "Booking engine search test completed successfully (no data saved)",
  "data": {
    "days_recorded": 4,
    "subhotel_id": 123,
    "date_from": "2025-06-01",
    "date_to": "2025-06-05",
    "test_mode": true,
    "would_insert": [
      {
        "date": "2025-06-01",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-06-02",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      }
    ]
  }
}
```

---

### Integráció Útmutató

#### 1. lépés: Beállítás
Győződjön meg róla, hogy rendelkezik a megfelelő harmadik fél tokennel a környezetéhez, és hogy a domain regisztrálva van a rendszerben.

#### 2. lépés: Implementáció
Részletes implementációs példákért különböző programozási nyelveken, kérjük tekintse meg:

**[📁 Kód Példák Megtekintése](./examples/)**

A példák mappa implementációs mintákat tartalmaz a következőkhöz:
- JavaScript
- TypeScript
- PHP
- Python

#### 3. lépés: Hibakezelés
Mindig implementáljon megfelelő hibakezelést a különböző válasz forgatókönyvek kezeléséhez:

- **Hitelesítési hibák**: Hiányzó vagy érvénytelen harmadik fél token
- **URL validációs hibák**: A kérés eredete nem egyezik a regisztrált domain-nel
- **Validációs hibák**: Felhasználóbarát üzenetek megjelenítése érvénytelen dátumok esetén
- **Szerver hibák**: Általános hibaüzenet megjelenítése és újrapróbálkozási mechanizmus

#### Fontos Megjegyzések
- Minden kérés naplózásra kerül a middleware által audit célokra
- URL validáció a harmadik fél konfigurációjától függően lehet kötelező
- Győződjön meg róla, hogy a kérések regisztrált domain-ekről érkeznek, ha az URL validáció engedélyezve van
- A kérés törzsében lévő érzékeny adatok (jelszavak, tokenek) automatikusan maszkolt formában kerülnek naplózásra

### Sebesség Korlátozás
- Maximum 100 kérés percenként IP címenként
- Tömeges műveletek ajánlottak több kereséshez

### Legjobb Gyakorlatok
1. **Dátum Validáció**: Mindig validálja a dátumokat a kliens oldalon a kérések elküldése előtt
2. **Hibakezelés**: Átfogó hibakezelést implementáljon minden lehetséges forgatókönyvhöz
3. **Naplózás**: Naplózza a sikeres kereséseket saját elemzési célokra
4. **Újrapróbálkozási Logika**: Exponenciális visszatartást implementáljon sikertelen kérésekhez

### További Információk

#### Támogatás
Technikai támogatásért forduljon ide: hello@peaqplus.com

#### API Verziókezelés
Jelenlegi verzió: v1

#### Változásnapló
- v1.0.0: Első kiadás

---

[⬆️ Back to Language Selection / Vissza a Nyelv Választáshoz](#language-selection--nyelv-választás)
