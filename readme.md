![Peaqplus](images/peaqplus.jpg)

# Booking Engine API Documentation

## Language Selection / Nyelv Választás

- [🇬🇧 English Documentation](#english-documentation)
- [🇭🇺 Magyar Dokumentáció](#magyar-dokumentáció)

---

## English Documentation

### Overview
The Booking Engine API provides endpoints for recording search activities in hotel booking systems. This API helps track user search behavior for analytics and reporting purposes.

### Base URLs

**Production Environment:**
```
https://app.peaqplus.com/api/v1
```

**Development Environment:**
```
https://beta.peaqplus.com/api/v1
```

### Authentication
All requests require proper third-party token authentication in the header:
```
X-Third-Party-Token: YOUR_THIRD_PARTY_TOKEN
```

The middleware validates the token and automatically extracts subhotel_id and third-party information from the token. The system also performs URL validation if enabled for the third party.

---

### POST /booking-engine-search

Records search activities in the booking engine system for analytics and tracking purposes. This endpoint accepts both single search objects and arrays of multiple search objects for bulk processing.

#### Endpoint
```
POST /api/v1/booking-engine-search
```

#### Request Parameters

The endpoint can accept either a **single search object** or an **array of search objects**.

##### Single Search Object

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date_from` | string | Yes | Check-in date in YYYY-MM-DD format |
| `date_to` | string | Yes | Check-out date in YYYY-MM-DD format (must be after or equal to date_from) |

##### Array of Search Objects

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `[].date_from` | string | Yes | Check-in date in YYYY-MM-DD format |
| `[].date_to` | string | Yes | Check-out date in YYYY-MM-DD format (must be after or equal to date_from) |

#### Request Examples

##### Single Search Object
```json
{
  "date_from": "2025-06-01",
  "date_to": "2025-06-05"
}
```

##### Multiple Search Objects (Array)
```json
[
  {
    "date_from": "2025-06-01",
    "date_to": "2025-06-05"
  },
  {
    "date_from": "2025-07-15",
    "date_to": "2025-07-20"
  },
  {
    "date_from": "2025-08-10",
    "date_to": "2025-08-12"
  }
]
```

#### Response Format

##### Success Response (200 OK)

**Single Search Object Response:**
```json
{
  "success": true,
  "message": "Booking engine searches recorded successfully",
  "data": {
    "total_days_recorded": 4,
    "subhotel_id": 123,
    "processed_ranges": [
      {
        "days_recorded": 4,
        "date_from": "2025-06-01",
        "date_to": "2025-06-05"
      }
    ]
  }
}
```

**Multiple Search Objects Response:**
```json
{
  "success": true,
  "message": "Booking engine searches recorded successfully",
  "data": {
    "total_days_recorded": 11,
    "subhotel_id": 123,
    "processed_ranges": [
      {
        "days_recorded": 4,
        "date_from": "2025-06-01",
        "date_to": "2025-06-05"
      },
      {
        "days_recorded": 5,
        "date_from": "2025-07-15",
        "date_to": "2025-07-20"
      },
      {
        "days_recorded": 2,
        "date_from": "2025-08-10",
        "date_to": "2025-08-12"
      }
    ]
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

**Validation Error - Single Object (422 Unprocessable Entity)**
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

**Validation Error - Array (422 Unprocessable Entity)**
```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "0.date_from": ["The 0.date from field is required."],
    "1.date_to": ["The 1.date to must be a date after or equal to 1.date from."]
  }
}
```

**Server Error (500 Internal Server Error)**
```json
{
  "success": false,
  "message": "Error processing booking engine searches",
  "error": "Database connection failed"
}
```

---

### POST /test/booking-engine-search

Test endpoint that mimics the search recording functionality without saving data to the database. Used for testing and development purposes. This endpoint also accepts both single search objects and arrays of multiple search objects.

#### Endpoint
```
POST /api/v1/test/booking-engine-search
```

#### Request Parameters

The endpoint can accept either a **single search object** or an **array of search objects**.

##### Single Search Object

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date_from` | string | Yes | Check-in date in YYYY-MM-DD format |
| `date_to` | string | Yes | Check-out date in YYYY-MM-DD format (must be after or equal to date_from) |

##### Array of Search Objects

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `[].date_from` | string | Yes | Check-in date in YYYY-MM-DD format |
| `[].date_to` | string | Yes | Check-out date in YYYY-MM-DD format (must be after or equal to date_from) |

#### Request Examples

##### Single Search Object
```json
{
  "date_from": "2025-06-01",
  "date_to": "2025-06-05"
}
```

##### Multiple Search Objects (Array)
```json
[
  {
    "date_from": "2025-06-01",
    "date_to": "2025-06-05"
  },
  {
    "date_from": "2025-07-15",
    "date_to": "2025-07-20"
  }
]
```

#### Response Format

##### Success Response (200 OK)

**Single Search Object Response:**
```json
{
  "success": true,
  "message": "Booking engine search test completed successfully (no data saved)",
  "data": {
    "total_days_recorded": 4,
    "subhotel_id": 123,
    "processed_ranges": [
      {
        "days_recorded": 4,
        "date_from": "2025-06-01",
        "date_to": "2025-06-05"
      }
    ],
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
      },
      {
        "date": "2025-06-03",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-06-04",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      }
    ]
  }
}
```

**Multiple Search Objects Response:**
```json
{
  "success": true,
  "message": "Booking engine search test completed successfully (no data saved)",
  "data": {
    "total_days_recorded": 9,
    "subhotel_id": 123,
    "processed_ranges": [
      {
        "days_recorded": 4,
        "date_from": "2025-06-01",
        "date_to": "2025-06-05"
      },
      {
        "days_recorded": 5,
        "date_from": "2025-07-15",
        "date_to": "2025-07-20"
      }
    ],
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
      },
      {
        "date": "2025-06-03",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-06-04",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-07-15",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-07-16",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-07-17",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-07-18",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-07-19",
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
- **Bulk Processing**: Use array format for recording multiple searches in a single request to improve performance

### Rate Limiting
- Maximum 100 requests per minute per IP address
- Bulk operations (array format) are recommended for multiple searches to reduce API calls

### Best Practices
1. **Date Validation**: Always validate dates on the client side before sending requests
2. **Error Handling**: Implement comprehensive error handling for all possible scenarios
3. **Logging**: Log successful searches for your own analytics
4. **Retry Logic**: Implement exponential backoff for failed requests
5. **Bulk Processing**: Use array format when recording multiple searches to minimize API calls and improve performance

### Additional Information

#### Support
For technical support, please contact: hello@peaqplus.com

#### API Versioning
Current version: v1

#### Changelog
- v1.1.0: Added support for bulk processing (array of search objects)
- v1.0.0: Initial release

---

## Magyar Dokumentáció

### Áttekintés
A Szállás Foglalási Motor API végpontokat biztosít a keresési tevékenységek rögzítéséhez szállodai foglalási rendszerekben. Ez az API segít nyomon követni a felhasználói keresési viselkedést elemzési és jelentéskészítési célokból.

### URL-ek

**Produkciós Környezet:**
```
https://app.peaqplus.com/api/v1
```

**Fejlesztői Környezet:**
```
https://beta.peaqplus.com/api/v1
```

### Hitelesítés
Minden kérés megfelelő harmadik fél token hitelesítést igényel a header-ben:
```
X-Third-Party-Token: YOUR_THIRD_PARTY_TOKEN
```

A middleware validálja a tokent és automatikusan kinyeri a subhotel_id és harmadik fél információkat a tokenből. A rendszer URL validációt is végez, ha az engedélyezve van a harmadik fél számára.

---

### POST /booking-engine-search

Rögzíti a keresési tevékenységeket a foglalási motor rendszerében elemzési és nyomon követési célokból. Ez a végpont képes kezelni mind egyedi keresési objektumokat, mind több keresési objektum tömbjét tömeges feldolgozáshoz.

#### Végpont
```
POST /api/v1/booking-engine-search
```

#### Kérés Paraméterei

A végpont képes fogadni mind **egyedi keresési objektumot**, mind **keresési objektumok tömbjét**.

##### Egyedi Keresési Objektum

| Paraméter | Típus | Kötelező | Leírás |
|-----------|-------|----------|---------|
| `date_from` | string | Igen | Bejelentkezés dátuma YYYY-MM-DD formátumban |
| `date_to` | string | Igen | Kijelentkezés dátuma YYYY-MM-DD formátumban (date_from után vagy azzal egyenlő kell legyen) |

##### Keresési Objektumok Tömbje

| Paraméter | Típus | Kötelező | Leírás |
|-----------|-------|----------|---------|
| `[].date_from` | string | Igen | Bejelentkezés dátuma YYYY-MM-DD formátumban |
| `[].date_to` | string | Igen | Kijelentkezés dátuma YYYY-MM-DD formátumban (date_from után vagy azzal egyenlő kell legyen) |

#### Kérés Példák

##### Egyedi Keresési Objektum
```json
{
  "date_from": "2025-06-01",
  "date_to": "2025-06-05"
}
```

##### Több Keresési Objektum (Tömb)
```json
[
  {
    "date_from": "2025-06-01",
    "date_to": "2025-06-05"
  },
  {
    "date_from": "2025-07-15",
    "date_to": "2025-07-20"
  },
  {
    "date_from": "2025-08-10",
    "date_to": "2025-08-12"
  }
]
```

#### Válasz Formátum

##### Sikeres Válasz (200 OK)

**Egyedi Keresési Objektum Válasz:**
```json
{
  "success": true,
  "message": "Booking engine searches recorded successfully",
  "data": {
    "total_days_recorded": 4,
    "subhotel_id": 123,
    "processed_ranges": [
      {
        "days_recorded": 4,
        "date_from": "2025-06-01",
        "date_to": "2025-06-05"
      }
    ]
  }
}
```

**Több Keresési Objektum Válasz:**
```json
{
  "success": true,
  "message": "Booking engine searches recorded successfully",
  "data": {
    "total_days_recorded": 11,
    "subhotel_id": 123,
    "processed_ranges": [
      {
        "days_recorded": 4,
        "date_from": "2025-06-01",
        "date_to": "2025-06-05"
      },
      {
        "days_recorded": 5,
        "date_from": "2025-07-15",
        "date_to": "2025-07-20"
      },
      {
        "days_recorded": 2,
        "date_from": "2025-08-10",
        "date_to": "2025-08-12"
      }
    ]
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

**Validációs Hiba - Egyedi Objektum (422 Unprocessable Entity)**
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

**Validációs Hiba - Tömb (422 Unprocessable Entity)**
```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "0.date_from": ["The 0.date from field is required."],
    "1.date_to": ["The 1.date to must be a date after or equal to 1.date from."]
  }
}
```

**Szerver Hiba (500 Internal Server Error)**
```json
{
  "success": false,
  "message": "Error processing booking engine searches",
  "error": "Database connection failed"
}
```

---

### POST /test/booking-engine-search

Teszt végpont, amely utánozza a keresés rögzítési funkcionalitást anélkül, hogy adatokat mentene az adatbázisba. Tesztelési és fejlesztési célokra használatos. Ez a végpont szintén képes kezelni mind egyedi keresési objektumokat, mind több keresési objektum tömbjét.

#### Végpont
```
POST /api/v1/test/booking-engine-search
```

#### Kérés Paraméterei

A végpont képes fogadni mind **egyedi keresési objektumot**, mind **keresési objektumok tömbjét**.

##### Egyedi Keresési Objektum

| Paraméter | Típus | Kötelező | Leírás |
|-----------|-------|----------|---------|
| `date_from` | string | Igen | Bejelentkezés dátuma YYYY-MM-DD formátumban |
| `date_to` | string | Igen | Kijelentkezés dátuma YYYY-MM-DD formátumban (date_from után vagy azzal egyenlő kell legyen) |

##### Keresési Objektumok Tömbje

| Paraméter | Típus | Kötelező | Leírás |
|-----------|-------|----------|---------|
| `[].date_from` | string | Igen | Bejelentkezés dátuma YYYY-MM-DD formátumban |
| `[].date_to` | string | Igen | Kijelentkezés dátuma YYYY-MM-DD formátumban (date_from után vagy azzal egyenlő kell legyen) |

#### Kérés Példák

##### Egyedi Keresési Objektum
```json
{
  "date_from": "2025-06-01",
  "date_to": "2025-06-05"
}
```

##### Több Keresési Objektum (Tömb)
```json
[
  {
    "date_from": "2025-06-01",
    "date_to": "2025-06-05"
  },
  {
    "date_from": "2025-07-15",
    "date_to": "2025-07-20"
  }
]
```

#### Válasz Formátum

##### Sikeres Válasz (200 OK)

**Egyedi Keresési Objektum Válasz:**
```json
{
  "success": true,
  "message": "Booking engine search test completed successfully (no data saved)",
  "data": {
    "total_days_recorded": 4,
    "subhotel_id": 123,
    "processed_ranges": [
      {
        "days_recorded": 4,
        "date_from": "2025-06-01",
        "date_to": "2025-06-05"
      }
    ],
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
      },
      {
        "date": "2025-06-03",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-06-04",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      }
    ]
  }
}
```

**Több Keresési Objektum Válasz:**
```json
{
  "success": true,
  "message": "Booking engine search test completed successfully (no data saved)",
  "data": {
    "total_days_recorded": 9,
    "subhotel_id": 123,
    "processed_ranges": [
      {
        "days_recorded": 4,
        "date_from": "2025-06-01",
        "date_to": "2025-06-05"
      },
      {
        "days_recorded": 5,
        "date_from": "2025-07-15",
        "date_to": "2025-07-20"
      }
    ],
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
      },
      {
        "date": "2025-06-03",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-06-04",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-07-15",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-07-16",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-07-17",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-07-18",
        "subhotel_id": 123,
        "created_at": "2025-05-22 10:30:45"
      },
      {
        "date": "2025-07-19",
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
- **Tömeges Feldolgozás**: Több keresés rögzítéséhez használja a tömb formátumot egyetlen kérésben a teljesítmény javítása érdekében

### Sebesség Korlátozás
- Maximum 100 kérés percenként IP címenként
- Tömeges műveletek (tömb formátum) ajánlottak több kereséshez az API hívások csökkentése érdekében

### Legjobb Gyakorlatok
1. **Dátum Validáció**: Mindig validálja a dátumokat a kliens oldalon a kérések elküldése előtt
2. **Hibakezelés**: Átfogó hibakezelést implementáljon minden lehetséges forgatókönyvhöz
3. **Naplózás**: Naplózza a sikeres kereséseket saját elemzési célokra
4. **Újrapróbálkozási Logika**: Exponenciális visszatartást implementáljon sikertelen kérésekhez
5. **Tömeges Feldolgozás**: Több keresés rögzítésekor használja a tömb formátumot az API hívások minimalizálása és a teljesítmény javítása érdekében

### További Információk

#### Támogatás
Technikai támogatásért forduljon ide: hello@peaqplus.com

#### API Verziókezelés
Jelenlegi verzió: v1

#### Változásnapló
- v1.1.0: Tömeges feldolgozás támogatás hozzáadva (keresési objektumok tömbje)
- v1.0.0: Első kiadás

---

[⬆️ Back to Language Selection / Vissza a Nyelv Választáshoz](#language-selection--nyelv-választás)
