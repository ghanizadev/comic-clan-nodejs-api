# Authentication

Comic Clan uses OAuth2.0 with JSON Web Tokens (JWT) as authentication method following [RCF 6749](https://tools.ietf.org/html/rfc6749) and [RFC 7523](https://tools.ietf.org/html/rfc7523) standards.

> Note: A `client_id` and a `client_secret` must be provided in basic authorization. It can be configured in [Management Panel](management.md) and defaults to `comicclan:ilovecomicbooks`.

## Login

**URL** : `/oauth/token/`

**Method** : `POST`

**Auth required** : Basic

**Content-Type** : `application/json`

### Data constraints

```json
{
    "username": "[valid email address]",
    "password": "[password in plain text]"
}
```

### Data example

```json
{
    "username": "username@example.com",
    "password": "abcd1234"
}
```

## Success Response

**Code** : `201 CREATED`

### Content example

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaGFuaXphZGV2IiwiaWF0IjoxNTg1ODQxMjMzLCJleHAiOjE2MTczNzcyMzMsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6ImVtYWlsQGV4YW1wbGUuY29tIn0.5EuvsVeS1RX2WDQ61igcahM630OpBMDYnAq5ekYpHmw",
    "token_type": "bearer",
    "exp": 90000,
    "iat": 1585841035335,
}
```

## Error Response

**Condition** : If 'username' and 'password' combination is wrong.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "error": "failed_to_login",
    "error_description": "username and email does not match"
}
```
