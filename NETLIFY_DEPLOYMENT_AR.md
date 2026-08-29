# دليل النشر على منصة Netlify (Netlify Deployment Guide)

تم تجهيز المشروع بالكامل ليكون متوافقاً 100% مع منصة **Netlify** سواء لنشر الواجهة الأمامية كـ Single Page Application (SPA) أو التعامل مع الـ API والـ Backend.

---

## 🛠️ ما تم إعداده وتحسينه في المشروع

1. **ملف `netlify.toml` الرئيسي**:
   - تحديد مجلد النشر `publish = "dist"`.
   - تحديد أمر البناء `command = "npm run build"`.
   - ضبط قواعد **SPA Fallback** لمنع ظهور خطأ 404 عند تحديث الصفحة في المسارات الفرعية (`/portfolio`, `/blog`, `/admin`, إلخ).
   - ترويسات الأمان والكاش الذكي لملفات الـ Assets وموقعك.

2. **ملف التوجيه `public/_redirects` و `_redirects`**:
   - لضمان نسخ التوجيه تلقائياً إلى مجلد `dist` عند كل عملية بناء:
     ```text
     /*    /index.html   200
     ```

3. **دعم متغير البيئة `VITE_API_URL` في `src/lib/api.ts`**:
   - أصبح بالإمكان توجيه طلبات الواجهة إلى أي رابط API خارجي (مثل Cloud Run, VPS, Render) عبر تعيين `VITE_API_URL`، وفي حال تركه فارغاً يستمر في استخدام المسار النسبي `/api`.

4. **تفعيل CORS في السيرفر `server.ts`**:
   - تم تثبيت وتفعيل حزمة `cors` للسماح بتبادل الطلبات مع نطاق Netlify (`https://*.netlify.app`) والنطاقات المخصصة بكل أمان.

5. **دالة خادمة لـ Netlify Functions (`netlify/functions/api.ts`)**:
   - تم إنشاء معالج Serverless اختياري باستخدام `serverless-http` في حال رغبت بتشغيل الـ API مباشرة داخل Netlify Functions.

---

## 🚀 خطوات النشر على Netlify (خطوة بخطوة)

### الخطوة 1: رفع المشروع على GitHub / GitLab
تأكد من عمل Commit و Push لجميع الملفات إلى مستودعك.

### الخطوة 2: استيراد المشروع في Netlify
1. ادخل إلى حسابك في [Netlify](https://app.netlify.com).
2. اضغط على **"Add new site"** ثم **"Import an existing project"**.
3. اختر مزود الكود الخاص بك (مثل GitHub) وحدد مستودع المشروع.

### الخطوة 3: إعدادات البناء (Build Settings)
سيقوم Netlify بقراءة ملف `netlify.toml` تلقائياً، ولكن تأكد من القيم التالية:
- **Base directory**: اتركه فارغاً (أو `/`).
- **Build command**: `npm run build` (أو `npm run build:client`).
- **Publish directory**: `dist`.

---

## ⚙️ خيارات تشغيل الـ Backend والـ API

لديك خياران ممتازان لتشغيل الـ Backend مع Netlify:

### الخيار (أ) - الموصى به: تشغيل الـ Backend على استضافة سحابية (Cloud Run أو VPS أو Render)
1. في لوحة تحكم Netlify، اذهب إلى:
   **Site configuration** -> **Environment variables**.
2. أضف المتغير:
   - **Key**: `VITE_API_URL`
   - **Value**: رابط السيرفر الخاص بك (مثال: `https://my-backend-app.run.app`).
3. أو بدلاً من ذلك، يمكنك استخدام خاصية الـ Proxy في Netlify عبر إلغاء التعليق في `_redirects`:
   ```text
   /api/*  https://my-backend-app.run.app/api/:splat  200!
   /*      /index.html                               200
   ```
   *(هذا الخيار يخفي رابط الـ Backend الحقيقي ويمنع مشاكل الـ CORS تماماً).*

### الخيار (ب): استخدام Netlify Functions (Serverless)
إذا أردت تشغيل مسارات الـ API مباشرة على Netlify Functions:
1. في `netlify.toml`، أضف قاعدة التوجيه:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/api/:splat"
     status = 200
     force = true
   ```
2. في إعدادات البيئة بـ Netlify (Environment Variables)، أضف بيانات الاتصال بقاعدة البيانات:
   - `SQL_HOST`
   - `SQL_USER`
   - `SQL_PASSWORD`
   - `SQL_DB_NAME`

---

## 🔒 تنبيه هام جداً لـ Firebase Authentication (تسجيل دخول الادمين)
لكي يعمل تسجيل الدخول بحساب Google على النطاق الجديد في Netlify بدون خطأ `auth/unauthorized-domain`:
1. افتح [Firebase Console](https://console.firebase.google.com).
2. اختر مشروعك (`friendly-carving-hfs6l`).
3. اذهب إلى: **Authentication** -> تبويب **Settings** -> قسم **Authorized domains**.
4. اضغط **Add domain** وأضف نطاق موقعك على Netlify (مثال: `your-site-name.netlify.app`) وكذلك أي نطاق مخصص (Custom Domain).

---

## ✅ التحقق السريع قبل النشر
- تم فحص الأكواد واجتياز اختبارات البناء بنجاح (`npm run build`).
- تم التأكد من وجود `dist/_redirects` داخل حزمة النشر.
- ملفات الـ TypeScript والـ Linter تمر بنجاح بنسبة 100% بدون أي أخطاء.
