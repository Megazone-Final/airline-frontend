# SkyWing Airlines — API Specification

> 백엔드 MSA 3개 서비스에 대한 REST API 명세

---

## Base URL

```
프론트엔드 → API Gateway (Ingress) → 각 서비스
Base: /api
```

---

## 1. User Service (`/api/users`)

회원가입, 로그인, 프로필 관리

### 1.1 회원가입

```
POST /api/users/register
```

**Request Body**
```json
{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "password123",
  "phone": "010-1234-5678"
}
```

**Response `201 Created`**
```json
{
  "id": 1,
  "name": "홍길동",
  "email": "hong@example.com",
  "phone": "010-1234-5678",
  "createdAt": "2026-03-09T11:30:00Z"
}
```

**Errors**
| Code | Message |
|------|---------|
| 400  | 유효하지 않은 입력 |
| 409  | 이미 등록된 이메일 |

---

### 1.2 로그인

```
POST /api/users/login
```

**Request Body**
```json
{
  "email": "hong@example.com",
  "password": "password123"
}
```

**Response `200 OK`**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "name": "홍길동",
    "email": "hong@example.com"
  }
}
```

**Errors**
| Code | Message |
|------|---------|
| 401  | 이메일 또는 비밀번호 불일치 |

---

### 1.3 내 프로필 조회

```
GET /api/users/profile
Authorization: Bearer {token}
```

**Response `200 OK`**
```json
{
  "id": 1,
  "name": "홍길동",
  "email": "hong@example.com",
  "phone": "010-1234-5678",
  "createdAt": "2026-03-09T11:30:00Z"
}
```

---

## 2. Flight Service (`/api/flights`, `/api/reservations`)

항공편 검색, 상세 조회, 예약 관리

### 2.1 항공편 검색

```
GET /api/flights?departure={code}&arrival={code}&date={YYYY-MM-DD}&passengers={n}
```

**Query Parameters**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| departure | string | N | 출발 공항 코드 (e.g. ICN) |
| arrival | string | N | 도착 공항 코드 (e.g. NRT) |
| date | string | N | 출발일 (YYYY-MM-DD) |
| passengers | int | N | 승객 수 (기본: 1) |

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "airline": "SkyWing Air",
    "flightNo": "SW101",
    "departure": "ICN",
    "arrival": "NRT",
    "departureTime": "08:30",
    "arrivalTime": "11:00",
    "duration": "2h 30m",
    "price": 189000,
    "seats": 42
  }
]
```

---

### 2.2 항공편 상세 조회

```
GET /api/flights/{id}
```

**Response `200 OK`**
```json
{
  "id": 1,
  "airline": "SkyWing Air",
  "flightNo": "SW101",
  "departure": "ICN",
  "departureAirport": "인천국제공항",
  "arrival": "NRT",
  "arrivalAirport": "나리타국제공항",
  "departureTime": "08:30",
  "arrivalTime": "11:00",
  "duration": "2h 30m",
  "price": 189000,
  "seats": 42,
  "aircraft": "Boeing 737-800"
}
```

---

### 2.3 예약 목록 조회

```
GET /api/reservations
Authorization: Bearer {token}
```

**Response `200 OK`**
```json
[
  {
    "id": "SW-R001",
    "flightNo": "SW101",
    "departure": "ICN",
    "arrival": "NRT",
    "date": "2026-04-15",
    "departureTime": "08:30",
    "status": "confirmed",
    "passengerCount": 1,
    "totalPrice": 234000,
    "createdAt": "2026-03-09T11:30:00Z"
  }
]
```

---

### 2.4 예약 상세 조회

```
GET /api/reservations/{id}
Authorization: Bearer {token}
```

**Response `200 OK`**
```json
{
  "id": "SW-R001",
  "flightNo": "SW101",
  "departure": "ICN",
  "arrival": "NRT",
  "date": "2026-04-15",
  "departureTime": "08:30",
  "arrivalTime": "11:00",
  "status": "confirmed",
  "passengers": [
    {
      "lastName": "HONG",
      "firstName": "GILDONG",
      "birth": "1990-01-01",
      "gender": "M",
      "passport": "M12345678",
      "nationality": "KR"
    }
  ],
  "totalPrice": 234000,
  "createdAt": "2026-03-09T11:30:00Z"
}
```

---

## 3. Payment Service (`/api/payments`)

결제 처리 및 내역 관리. 결제 완료 시 Flight Service에 예약 자동 생성 (서비스 간 통신).

### 3.1 결제 요청

```
POST /api/payments
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "flightId": 1,
  "date": "2026-04-15",
  "passengers": [
    {
      "lastName": "HONG",
      "firstName": "GILDONG",
      "birth": "1990-01-01",
      "gender": "M",
      "passport": "M12345678",
      "nationality": "KR"
    }
  ],
  "totalAmount": 234000
}
```

**Response `201 Created`**
```json
{
  "id": "PAY-001",
  "reservationId": "SW-R001",
  "amount": 234000,
  "status": "completed",
  "method": "CARD",
  "createdAt": "2026-03-09T11:30:00Z"
}
```

> **Note**: 결제 성공 시 Payment Service → Flight Service로 예약 생성 요청 (내부 서비스 간 통신)

**Errors**
| Code | Message |
|------|---------|
| 400  | 유효하지 않은 결제 요청 |
| 402  | 결제 실패 |
| 404  | 항공편을 찾을 수 없음 |

---

### 3.2 결제 상세 조회

```
GET /api/payments/{id}
Authorization: Bearer {token}
```

**Response `200 OK`**
```json
{
  "id": "PAY-001",
  "reservationId": "SW-R001",
  "amount": 234000,
  "status": "completed",
  "method": "CARD",
  "createdAt": "2026-03-09T11:30:00Z"
}
```

---

### 3.3 결제 내역 목록

```
GET /api/payments
Authorization: Bearer {token}
```

**Response `200 OK`**
```json
[
  {
    "id": "PAY-001",
    "reservationId": "SW-R001",
    "amount": 234000,
    "method": "VISA ****1234",
    "status": "completed",
    "createdAt": "2026-03-09T11:30:00Z"
  }
]
```

---

## 공통 사항

### 인증 헤더
```
Authorization: Bearer {JWT_TOKEN}
```
로그인/회원가입을 제외한 모든 API는 JWT 토큰 필요.

### 공통 에러 응답 형식
```json
{
  "status": 400,
  "message": "에러 메시지",
  "timestamp": "2026-03-09T11:30:00Z"
}
```

### 서비스 간 통신
| From | To | 목적 |
|------|----|------|
| Payment Service | Flight Service | 결제 완료 시 예약 생성 |
| API Gateway | User Service | JWT 토큰 검증 |
