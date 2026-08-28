# Unified Auth + Mailer setup

## 1. Install packages

```bash
npm install @nestjs-modules/mailer nodemailer
```

## 2. Add mail environment variables

```env
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your-smtp-username
MAIL_PASSWORD=your-smtp-password
MAIL_FROM=Property Management System <no-reply@example.com>
```

For port 465, use `MAIL_SECURE=true`.

## 3. AppModule changes

Remove these old imports/providers/controllers:

```ts
import { staffAuthService } from './staff/StaffAuth/staffAuth.service';
import { staffAuthController } from './staff/StaffAuth/staffAuth.controller';
import { StaffAuthModule } from './staff/StaffAuth/staffAuth.module';
```

Remove `StaffAuthModule` from `imports`, and remove `staffAuthController` and `staffAuthService` from `controllers/providers`.

Keep:

```ts
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
```

Your existing TypeORM configuration can remain as-is, including the PostgreSQL password `admin` and `synchronize: true`, since those were explicitly requested.

## 4. AdminModule changes

Remove its local `JwtModule.register(...)` and the `JwtStrategy` provider/import. The local configuration currently uses a different secret and a 1-day expiry; the new AuthModule owns the single JWT configuration for the app.

Add `AuthModule` and `MailModule` to the module imports if you prefer explicit module dependencies, although both are global in this setup.

## 5. AdminController changes

Change:

```ts
import { JwtAuthGuard } from './auth/auth.guard';
```

to:

```ts
import { AuthGuard } from '../auth/auth.guard';
```

Then replace every:

```ts
@UseGuards(JwtAuthGuard)
```

with:

```ts
@UseGuards(AuthGuard)
```

Remove the public admin signup route:

```ts
@Post('register')
register(...) { ... }
```

Authentication is now only:

```text
POST /auth/login
```

## 6. StaffController changes

Remove the old login route:

```ts
@Post('login')
login(@Body() dto: LoginStaffDto) {
  return this.staffService.loginStaff(dto);
}
```

Change the old guard import:

```ts
import { AuthGuard } from './StaffAuth/guard/auth.guard';
```

to:

```ts
import { AuthGuard } from '../auth/auth.guard';
```

All existing `@UseGuards(AuthGuard)` routes can then stay as they are.

## 7. AdminService mail notifications

Inject:

```ts
import { MailService } from '../mail/mail.service';
```

and add to the constructor:

```ts
private readonly mailService: MailService,
```

Then, after each successful admin-created account is saved, send the notification.

### Landlord

Immediately after:

```ts
await this.landlordRepository.save(landlord);
```

add:

```ts
await this.mailService.sendAccountCreatedMail(
  landlord.email,
  landlord.name,
  'landlord',
);
```

### Tenant

Immediately after:

```ts
await this.tenantRepository.save(tenant);
```

add:

```ts
await this.mailService.sendAccountCreatedMail(
  tenant.email,
  tenant.name,
  'tenant',
);
```

### Staff

Immediately after:

```ts
await this.staffRepository.save(staff);
```

add:

```ts
await this.mailService.sendAccountCreatedMail(
  staff.email,
  staff.name,
  'staff',
);
```

The mail service catches mail failures so an SMTP outage does not make an already-successful database insert look like a failed account creation.

## 8. Login request

The single frontend login request is:

```http
POST /auth/login
Content-Type: application/json
```

Example staff login:

```json
{
  "accountType": "staff",
  "email": "staff@example.com",
  "password": "your-password"
}
```

The dropdown values should be exactly:

```text
admin
staff
landlord
tenant
```

## 9. Account status rules

- admin: can log in
- staff: must be ACTIVE
- landlord: must be active
- tenant: must be APPROVED

The status checks happen during login.

## 10. JWT

The new JWT payload is:

```ts
{
  sub: userId,
  email: userEmail,
  accountType: 'admin' | 'staff' | 'landlord' | 'tenant'
}
```

It does NOT contain the password.

Expiration remains `100d`.

## 11. Protected routes

The new `AuthGuard` reads:

```text
Authorization: Bearer <token>
```

and puts the verified JWT payload on:

```ts
req.user
```

So a protected controller can later access:

```ts
req.user.sub
req.user.email
req.user.accountType
```

This implementation handles authentication. It does not add a database `role` column or a role-based authorization system.
