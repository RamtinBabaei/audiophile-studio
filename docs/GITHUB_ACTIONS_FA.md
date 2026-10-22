# انتشار Audiophile با GitHub Actions

این نسخه به بک‌اند Worker و دیتابیس D1 نیاز دارد. کد در GitHub نگهداری می‌شود و GitHub Actions نسخه کامل را روی Cloudflare Workers منتشر می‌کند. GitHub Pages این بک‌اند را اجرا نمی‌کند.

## ۱. باز کردن نسخه یکپارچه

این ZIP شامل کل پروژه و فایل‌های انتشار است. پوشه `audiophile-studio` را در VS Code باز کنید؛ فایل `package.json` باید در ریشه همین پوشه باشد. راهنمای `START_HERE_FA.md` روش استخراج روی پروژه فعلی و روش نصب در پوشه تازه را توضیح می‌دهد. هنگام استخراج روی پروژه فعلی، پوشه‌های `node_modules`، `.sites-runtime` و `.wrangler` باقی می‌مانند و وابستگی‌ها تغییر نکرده‌اند.

بررسی در PowerShell:

```powershell
Test-Path .github/workflows/ci.yml
Test-Path scripts/prepare-github-deploy.mjs
Test-Path scripts/check-github-deploy.mjs
```

هر سه خروجی باید `True` باشند. مسیر YAML یک فایل است؛ آن را به عنوان فرمان در ترمینال اجرا نکنید.

## ۲. ساخت مخزن GitHub

به https://github.com/new بروید، مالک را `RamtinBabaei` و نام را `audiophile-studio` قرار دهید. برای نمایش در پورتفولیو `Public` را انتخاب کنید. گزینه‌های ساخت README، license و gitignore را فعال نکنید؛ پروژه این فایل‌ها را دارد. روی `Create repository` بزنید.

در ترمینال جدید VS Code و پوشه پروژه:

```powershell
git --version
git init
git add .
git status --short
git commit -m "Publish Audiophile with automated checks and deployment"
git branch -M main
git remote add origin https://github.com/RamtinBabaei/audiophile-studio.git
git push -u origin main
```

هنگام ورود مرورگر، حساب GitHub خودتان را انتخاب کنید. اگر Git نام و ایمیل خواست، با `git config user.name` و `git config user.email` اطلاعات خودتان را در همین مخزن تنظیم کنید و فرمان commit را دوباره بزنید. اگر `remote origin already exists` دیدید، ابتدا `git remote -v` را بررسی کنید؛ اگر همین پروژه است، با `git remote set-url origin https://github.com/RamtinBabaei/audiophile-studio.git` آدرس آن را اصلاح کنید. از force push استفاده نکنید.

فایل‌های `.env`، `.sites-runtime`، `.wrangler`، `node_modules` و `dist` نباید در فهرست فایل‌های آماده commit باشند. `.gitignore` پروژه آن‌ها را کنار می‌گذارد.

در تب `Actions`، گردش کار `Audiophile CI and deploy` را باز کنید. پیش از فعال کردن انتشار، فقط بررسی‌ها اجرا می‌شوند و مراحل deploy به صورت skipped نمایش داده می‌شوند.

## ۳. آماده کردن Cloudflare و دیتابیس

وارد https://dash.cloudflare.com شوید. در ترمینال پروژه:

```powershell
pnpm exec wrangler login
pnpm exec wrangler whoami
pnpm exec wrangler d1 create audiophile-production
```

ورود مرورگر را تأیید کنید. Account ID مربوط به حساب مقصد را از خروجی `whoami` بردارید. دستور آخر یک دیتابیس خالی آنلاین می‌سازد و `database_id` آن را چاپ می‌کند. اگر پرسید فایل تنظیمات را خودکار تغییر دهد، `No` را انتخاب کنید؛ گردش کار تنظیمات تولید را خودش آماده می‌کند. اگر دیتابیس با همین نام از قبل وجود دارد، ID همان را از داشبورد D1 بردارید؛ دیتابیس جدید یا تکراری نسازید.

در داشبورد `Workers & Pages` مطمئن شوید زیر دامنه `workers.dev` حسابتان فعال است. URL نهایی را بعداً Wrangler نمایش می‌دهد. نام Worker این پروژه `audiophile-studio` است.

## ۴. ساخت API Token

در Cloudflare به `My Profile → API Tokens → Create Token → Create Custom Token` بروید. نامی مثل `Audiophile GitHub Deploy` انتخاب کنید و این مجوزها را اضافه کنید:

| Permission                | Access |
| ------------------------- | ------ |
| Account → Workers Scripts | Edit   |
| Account → D1              | Edit   |

در `Account Resources`، `Include → Specific account` و همان حساب مقصد را انتخاب کنید. Token را بسازید و در مرحله بعد داخل GitHub Secret قرار دهید. Token را داخل کد، commit، README یا چت نفرستید.

## ۵. تنظیم Secrets و Variables در GitHub

مخزن → `Settings → Secrets and variables → Actions`.

در تب `Secrets` با `New repository secret` این دو مورد را ایجاد کنید:

| Name                    | Value                        |
| ----------------------- | ---------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Token ساخته‌شده در مرحله قبل |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID حساب مقصد         |

در تب `Variables` با `New repository variable` این دو مورد را ایجاد کنید:

| Name                        | Value                                      |
| --------------------------- | ------------------------------------------ |
| `CLOUDFLARE_D1_DATABASE_ID` | UUID واقعی دیتابیس `audiophile-production` |
| `DEPLOY_ENABLED`            | `true`                                     |

مقدار متغیر دوم باید دقیقاً `true` با حروف کوچک باشد. شناسه جایگزینِ تمام‌صفر داخل پروژه برای لوکال است؛ آن را برای دیتابیس آنلاین وارد نکنید. فایل‌های تنظیمات لوکال نیازی به تغییر ندارند.

## ۶. اولین انتشار

در GitHub به `Actions → Audiophile CI and deploy → Run workflow` بروید، شاخه `main` را انتخاب و اجرا کنید. این اجرا نصب، بررسی TypeScript، lint، format، تست‌ها، build، تست‌های مرورگر، migration آنلاین، deploy و بررسی اتصال دیتابیس آنلاین را به ترتیب انجام می‌دهد. روی اجرای workflow کلیک کنید تا جزئیات مراحل را ببینید.

پس از موفقیت، در صفحه `Summary` همان اجرا، لینک `Open the live website` را باز کنید. URL واقعی شبیه `https://audiophile-studio.<your-subdomain>.workers.dev` خواهد بود؛ این مثال را عیناً در مرورگر وارد نکنید. لینک مستقیم در مرحله `Deploy public website` هم چاپ می‌شود.

بعد از اولین انتشار، در Variables متغیر `SITE_URL` را برابر URL واقعی سایت با `https://` قرار دهید و workflow را دوباره اجرا کنید تا metadata اشتراک‌گذاری هم به همان دامنه اشاره کند.

## ۷. بررسی و نمایش در پورتفولیو

صفحه `/api/health` روی همان دامنه باید این خروجی را بدهد:

```json
{ "status": "ok", "database": "connected", "mode": "demo" }
```

یک محصول به سبد اضافه کنید، صفحه را تازه کنید و ماندن سبد را بررسی کنید. با اطلاعات ساختگی و پرداخت نقدی یک سفارش تست ثبت کنید. این پروژه پرداخت واقعی ندارد.

در صفحه اصلی مخزن، چرخ‌دنده کنار `About` را بزنید و URL واقعی سایت را در `Website` قرار دهید. لینک را در README هم اضافه کنید. تنظیم `Settings → Pages` برای این روش لازم نیست.

## ۸. به‌روزرسانی‌های بعدی

```powershell
git add .
git commit -m "Update storefront"
git push
```

با push به `main`، پس از موفقیت بررسی‌ها سایت خودکار به‌روزرسانی می‌شود. Pull requestها فقط بررسی می‌شوند و به اطلاعات انتشار دسترسی ندارند. تغییر مخرب schema را پیش از push جداگانه بررسی کنید؛ workflow قبل از deploy، migration آنلاین را اعمال می‌کند و migration را خودکار برنمی‌گرداند.

## عیب‌یابی

| علامت                              | اقدام                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| مرحله deploy خاکستری / skipped است | `DEPLOY_ENABLED=true`، شاخه `main` و اجرای push یا دستی را بررسی کنید.       |
| خطای مجوز Cloudflare               | Token، حساب مقصد و مجوزهای Workers Scripts و D1 را بررسی کنید.               |
| خطای DB ID                         | مقدار واقعی `database_id` دیتابیس مقصد را در Variable وارد کنید.             |
| build یا تست شکست خورد             | اولین مرحله قرمز را باز و متن خطا را بردارید. تا رفع آن deploy اجرا نمی‌شود. |
| deploy موفق ولی health ناموفق است  | لینک در Summary را باز کنید؛ `DB` binding و migration مقصد را بررسی کنید.    |
| نسخه آنلاین قدیمی است              | آخرین commit روی main و آخرین اجرای موفق workflow را مقایسه کنید.            |

## اعتبارسنجی بسته

نتایج بررسی‌های اجراشده در زمان آماده‌سازی در `docs/GITHUB_ACTIONS_VALIDATION.md` ثبت شده‌اند. اجرای GitHub Actions و انتشار روی حساب شخصی شما فقط پس از تنظیم حساب، Secrets و Variables قابل تأیید است.
