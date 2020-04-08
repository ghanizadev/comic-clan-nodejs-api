# Authentication

---

Comic Clan uses OAuth2.0 with JSON Web Tokens (JWT) as authentication method following [RCF 6749](https://tools.ietf.org/html/rfc6749) and [RFC 7523](https://tools.ietf.org/html/rfc7523) standards.

> Note: A `client_id` and a `client_secret` must be provided in basic authorization. It can be configured in [Management Panel](management.md) and if no credentials were set, a new credential is randomly generated every boot, which it will be visible in logs, e.g `CLIENT ID=24051793-7404-44b2-840c-7dda995065fe, CLIENT SECRET=1f9a6a54-7c77-435c-9f37-08dda099fd0b`.

> **Attention** : Authorization server is apart from the resource server (main server). By default, it is running on port `3333`.

## Login

**URL** : `/oauth/token/`

**Method** : `POST`

**Auth required** : Basic

**Content-Type** : `application/x-www-form-urlencoded`

### Data constraints

- `grant_type`: *password* or *refresh_token*.
- `username`: your email, e.g. *example@mail.com*. It Only works with *password* grant type.
- `password`: your password, e.g. *p4ssw0rd*. It Only works with *password* grant type.
- `refresh_token`: your refresh token generated when you requested a new access token. It only works with *refresh_token* grant type.
- `scope`: requested authorizations, which can be: *feed*, *posts*, *profile*, *comment* or simply * for all. it Works in bot grant types and it is optional.

### Data example

For an access token providing email and password:

`grant_type`: *password*
`username`: *example@mail.com*
`password`: *p4ssw0rd*
`scope`: *

Or to request a token from a refresh token:

`grant_type`: *refresh_token*
`refresh_token`: *eyJhbGciOiJSUzI1...NEJ9Je9Q*
`scope`: *

## Success Response

**Code** : `201 CREATED`

### Content example

```json
{
    "access_token": "eyJ0eXA...kYpHmw",
    "refresh_token": "eyJ0eXA...Grshdr5",
    "token_type": "bearer",
    "expires_in": 90000,
    "scope": "feed;profile;post;comment;",
}
```

## Error Response

**Condition** : If 'username' and 'password' combination is wrong or the account associated to this email is unavailable (deleted or inactive).

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "error": "unauthorized_client",
    "error_description": "user does not exists, it had been deleted or username and password does not match",
    "status": 401
}
```
