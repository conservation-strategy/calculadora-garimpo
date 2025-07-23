# Calculadora Garimpo API Documentation

## Overview

The Calculadora Garimpo API provides environmental impact calculations for illegal gold mining activities in the Amazon region. This API calculates the economic cost of environmental damage caused by mining operations across multiple South American countries.

## Base URL

```
https://miningcalculator.conservation-strategy.org/api/calculate
```

## Authentication

All API requests require authentication using an API key provided in the request header:

```
x-api-key: your_api_key_here
```

## Rate Limiting

- **Rate Limit**: 100 requests per minute per API key (may vary by partner)
- **Rate Limit Headers**: Response includes rate limit information:
  - `X-RateLimit-Limit`: Maximum requests allowed per minute
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when rate limit resets

## Request Format

### HTTP Method
`POST`

### Content Type
`application/json`

### Request Body

```json
{
  "locations": [
    {
      "city": "string",
      "country": "string",
      "affectedArea": number
    }
  ]
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locations` | array | Yes | Array of location objects to calculate impacts for |
| `locations[].city` | string | Yes | Name of the city/municipality where mining occurs |
| `locations[].country` | string | Yes | Country code (see supported countries below) |
| `locations[].affectedArea` | number | Yes | Affected area in hectares (must be > 0) |

## Supported Countries

| Country | Code | Description |
|---------|------|-------------|
| Brazil | `BR` | Brazil |
| Peru | `PE` | Peru |
| Ecuador | `EC` | Ecuador |
| Colombia | `CO` | Colombia |
| Guyana | `GU` | Guyana |
| Suriname | `SU` | Suriname |
| Bolivia | `BO` | Bolivia |

## Supported Cities by Country

### Brazil (BR)
Cities are based on Brazilian municipalities. Examples include:
- Alta Floresta D'Oeste
- Itaituba
- Novo Progresso
- Rio Branco
- (Full list available upon request)

### Peru (PE)
Provinces in Amazon departments:
- Chachapoyas
- Bagua
- Bongará
- Luya
- (Full list available upon request)


### Colombia (CO)
Departments:
- Caquetá, Putumayo, Amazonas, Guainía, Guaviare, Vaupés

### Ecuador (EC)
Cantons:
- Gualaquiza
- Sucumbíos
- Tena
- Zamora
- (Full list available upon request)


### Bolivia (BO)
Municipalities:
- Independencia
- Palca
- Trinidad
- Warnes
- (Full list available upon request)


### Guyana (GU) & Suriname (SU)
Administrative regions/districts available upon request.

## Response Format

### Success Response (200 OK)

```json
{
  "totalImpact": 123456.78
}
```

| Field | Type | Description |
|-------|------|-------------|
| `totalImpact` | number | Total environmental impact cost in USD |

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Invalid country",
  "details": "Location at index 0 has invalid country code. Valid codes are: BR, PE, EC, CO, GU, SU, BO"
}
```

#### 401 Unauthorized
```json
{
  "error": "Invalid or missing API key"
}
```

#### 413 Request Too Large
```json
{
  "error": "Request too large",
  "details": "Request body exceeds 50KB limit"
}
```

#### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "details": "Maximum 100 requests per minute allowed"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "An unexpected error occurred while processing the calculation"
}
```

## Example Usage

### Single Location Request

```bash
curl -X POST https://miningcalculator.conservation-strategy.org/api/calculate \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key_here" \
  -d '{
    "locations": [
      {
        "city": "Alta Floresta D'\''Oeste",
        "country": "BR",
        "affectedArea": 2.5
      }
    ]
  }'
```

### Multiple Locations Request

```bash
curl -X POST https://miningcalculator.conservation-strategy.org/api/calculate \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key_here" \
  -d '{
    "locations": [
      {
        "city": "Alta Floresta D'\''Oeste",
        "country": "BR",
        "affectedArea": 2.5
      },
      {
        "city": "Caquetá",
        "country": "CO",
        "affectedArea": 1.8
      }
    ]
  }'
```

### JavaScript Example

```javascript
const response = await fetch('https://miningcalculator.conservation-strategy.org/api/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your_api_key_here'
  },
  body: JSON.stringify({
    locations: [
      {
        city: "Alta Floresta D'Oeste",
        country: "BR",
        affectedArea: 2.5
      }
    ]
  })
});

const data = await response.json();
console.log('Total Impact:', data.totalImpact);
```

## Notes

- All monetary values are returned in USD
- Calculations include inflation adjustments to current values
- The API uses conservative environmental impact models
- Response times may vary based on the number of locations and complexity of calculations