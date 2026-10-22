# Audiophile Studio — نسخه کامل و یکپارچه

کل کد برنامه، تصاویر، فونت، API، migrationهای دیتابیس، تست‌ها، فایل‌های GitHub Actions و هر دو اسکریپت انتشار در این بسته قرار دارند.

## اگر پروژه قبلی روی کامپیوترت اجرا می‌شود

این روش وابستگی‌ها و دیتابیس لوکال فعلی را نگه می‌دارد:

۱. اگر ترمینال روی `Paste ZIP file path:` منتظر است، با `Ctrl+C` از آن خارج شو.

۲. ZIP کامل جدید را در File Explorer راست‌کلیک کن و `Extract All` را بزن. مقصد استخراج را **پوشه والد پروژه فعلی** قرار بده:

```text
C:\software-engineer\Projects- front\Training\11- audiophile_studio\Audiophile_Studio_Complete
```

داخل ZIP یک پوشه به نام `audiophile-studio` وجود دارد؛ مقصد بالا باعث می‌شود فایل‌ها داخل همان پروژه موجود قرار بگیرند. اگر نام فایل‌ها تکراری بود، `Replace the files in the destination` را انتخاب کن. پوشه والد انتخاب‌شده باید خودش پوشه `audiophile-studio` را داشته باشد.

۳. در VS Code همان پوشه قبلی `audiophile-studio` را باز کن. در ترمینال این سه دستور را اجرا کن:

```powershell
Test-Path .github/workflows/ci.yml
Test-Path scripts/prepare-github-deploy.mjs
Test-Path scripts/check-github-deploy.mjs
```

هر سه خروجی باید `True` باشند. در این نسخه وابستگی‌ها و lockfile تغییر نکرده‌اند؛ اگر نسخه فعلی درست اجرا می‌شود، نصب دوباره لازم نیست.

۴. برای دیدن برنامه:

```powershell
pnpm dev
```

آدرس چاپ‌شده در ترمینال را باز کن؛ معمولاً http://localhost:5173 است. ترمینال سرور باید باز بماند. برای انتشار در GitHub یک ترمینال جدا باز کن و راهنمای `docs/GITHUB_ACTIONS_FA.md` را از مرحله ساخت مخزن دنبال کن.

## اگر پروژه را در پوشه تازه باز می‌کنی

پوشه `audiophile-studio` استخراج‌شده را در VS Code باز کن. Node.js نسخه 22.13 یا بالاتر و pnpm نسخه 11.25.0 لازم است. در ترمینال:

```powershell
pnpm install --frozen-lockfile --prod=false
```

پس از تمام شدن موفق نصب:

```powershell
pnpm db:migrate:local
pnpm dev
```

بسته شامل سورس کامل است؛ `node_modules` و دیتابیس شخصی همراه ZIP ارسال نمی‌شوند. نصب تازه به دسترسی npm نیاز دارد. در صورت مشکل شبکه، اولین خطای نصب را بررسی کن؛ برنامه بعد از نصب کامل اجرا می‌شود.

## تأیید اجرای درست

این آدرس را باز کن:

http://localhost:5173/api/health

خروجی مورد انتظار:

```json
{ "status": "ok", "database": "connected", "mode": "demo" }
```

برای تست خرید، از اطلاعات ساختگی استفاده کن. پرداخت نقدی را انتخاب کن و ثبت سفارش را بررسی کن. پرداخت واقعی یا ارسال ایمیل در این پروژه انجام نمی‌شود.

## انتشار آنلاین

راهنمای کامل در `docs/GITHUB_ACTIONS_FA.md` است. کد در مخزن شخصی GitHub قرار می‌گیرد و GitHub Actions پس از موفقیت بررسی‌ها، سایت و API را روی Cloudflare Workers منتشر می‌کند. Account ID، API Token و database ID باید متعلق به حساب Cloudflare مقصد باشند.

تا پیش از تنظیم حساب و فعال کردن `DEPLOY_ENABLED=true`، workflow فقط بررسی‌ها را اجرا می‌کند. لینک آنلاین پس از انتشار موفق در Summary همان workflow نمایش داده می‌شود.
