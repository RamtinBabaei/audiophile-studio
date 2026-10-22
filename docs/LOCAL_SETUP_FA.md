# اجرای پروژه در VS Code

این پروژه به دیتابیس MongoDB، دانلود باینری MongoDB یا کلید API نیاز ندارد. دیتابیس محلی همراه ابزار توسعه اجرا می‌شود.

۱. فایل ZIP را Extract کن. پوشه `audiophile-studio` را در VS Code باز کن. باید فایل `package.json` را در همان پوشه ببینی.

۲. Node.js نسخه 22.13 یا جدیدتر را نصب کن. در ترمینال VS Code نسخه را بررسی کن:

```powershell
node --version
npm --version
```

۳. از منوی Terminal گزینه New Terminal را بزن و دستورات زیر را به‌ترتیب اجرا کن. بعد از تمام‌شدن هر دستور، دستور بعدی را اجرا کن:

```powershell
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm db:migrate:local
pnpm dev
```

۴. این آدرس را در مرورگر باز کن:

http://localhost:5173

ترمینال را باز نگه دار. اگر پورت اشغال باشد، آدرس واقعی در ترمینال چاپ می‌شود. برای توقف سرور `Ctrl+C` بزن.

۵. برای بررسی اتصال دیتابیس، این آدرس را باز کن:

http://localhost:5173/api/health

خروجی درست:

```json
{ "status": "ok", "database": "connected", "mode": "demo" }
```

۶. روی See product کلیک کن؛ تعداد را انتخاب کن و Add to cart بزن. با آیکون سبد خرید آن را باز کن. صفحه را Refresh کن و مطمئن شو سبد باقی مانده است.

۷. Checkout را بزن. یک بار فرم خالی را ارسال کن تا خطاهای اعتبارسنجی را ببینی. سپس اطلاعات ساختگی وارد کن. برای تست e-Money از شماره `123456789` و PIN برابر `1234` استفاده کن یا Cash on delivery را انتخاب کن. این پروژه پول واقعی دریافت نمی‌کند و ایمیل نمی‌فرستد. نمایش پنجره تأیید یعنی سفارش نمایشی در دیتابیس ذخیره شده است.

۸. برای بررسی کدها:

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

برای دیدن نسخه build‌شده:

```powershell
pnpm start
```

آدرس نسخه build‌شده معمولاً `http://127.0.0.1:8787` است؛ آدرس چاپ‌شده در ترمینال را ملاک قرار بده.

اگر PowerShell اجرای فایل `pnpm.ps1` را مسدود کرد، به‌جای تغییر سیاست امنیتی ویندوز، در ترمینال از `pnpm.cmd` استفاده کن یا ترمینال Command Prompt را انتخاب کن.

اگر `status: unavailable` دیدی، `pnpm db:migrate:local` را دوباره اجرا کن و سپس سرور را دوباره راه‌اندازی کن. این دستور فقط migrationهای اجرا‌نشده را اعمال می‌کند. فایل‌های دیتابیس داخل `.wrangler/state` می‌مانند؛ آن‌ها را روی GitHub قرار نده.

برای انتشار خودکار از حساب شخصی GitHub، راهنمای `docs/GITHUB_ACTIONS_FA.md` را ببین. GitHub Actions پروژه کامل را روی Cloudflare Workers منتشر می‌کند.
