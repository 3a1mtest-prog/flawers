# بتلة · Petal

متجر زهور ولوحات — موقع إلكتروني وتطبيق موبايل، الاثنين بيقرأوا من نفس ملف المنتجات.

A flower and painting shop — a website and a mobile app, both reading from the
same catalogue file.

---

## شو في هون / What's in here

| المجلد | الوصف |
| --- | --- |
| `shared/` | المنتجات، معلومات المحل، وحساب الأسعار ورسالة الطلب. **هون بتعدّل المحتوى.** |
| `web/` | الموقع — Next.js 16، عربي/إنجليزي، صفحات ثابتة سريعة. |
| `mobile/` | التطبيق — Expo (React Native) لأندرويد و iOS. |

الطلبات كلها بتروح عبر **واتساب**: الزبون بيعبّي السلة ومعلوماته، وبضغطة وحدة
بيفتحله واتساب ورسالة الطلب جاهزة مكتوبة. ما في بوابة دفع ولا سيرفر ولا قاعدة
بيانات — يعني ما في رسوم شهرية ولا صيانة.

Orders are sent over **WhatsApp**: the customer fills the cart and their details,
and one tap opens WhatsApp with the whole order written out. There is no payment
gateway, server, or database, so there is nothing to pay for monthly or maintain.

---

## ⚠️ قبل ما تنشر / Before you go live

المحتوى الحالي **مبدئي** ولازم تبدّله:

1. **`shared/site.json`** — اسم المحل، رقم الواتساب (`contact.whatsapp` بصيغة
   دولية بدون `+` أو مسافات، مثلاً `962791234567`)، الهاتف، البريد، إنستغرام،
   العنوان، أوقات الدوام، ورسوم التوصيل.
2. **`shared/products.json`** — المنتجات الحقيقية بأسعارها.
3. **الصور** — كل منتج فيه `"image": ""`. لما تكون فاضية بينعرض تدرّج لوني
   بدل الصورة. حط رابط الصورة هون لما تجهز الصور.

The content that ships here is **placeholder** — the shop name, the WhatsApp
number, the prices, and the product list all need replacing before launch.

### شكل المنتج / Product shape

```jsonc
{
  "id": "blush-peony-bouquet",        // بدون مسافات، بينستخدم برابط الصفحة
  "category": "flowers",              // "flowers" أو "paintings"
  "name":    { "ar": "…", "en": "…" },
  "summary": { "ar": "…", "en": "…" }, // سطر أو سطرين بتطلع بالكرت
  "details": { "ar": "…", "en": "…" }, // الوصف الطويل بصفحة المنتج
  "price": 45,                         // السعر الأساسي
  "image": "",                         // رابط صورة، أو "" للتدرّج اللوني
  "palette": ["#f6d8dd", "#c9788d"],   // لونين للتدرّج
  "badge": { "ar": "الأكثر طلباً", "en": "Bestseller" },  // أو null
  "featured": true,                    // بتطلع بالصفحة الرئيسية
  "inStock": true,
  "options": {                         // أو null إذا ما في خيارات
    "label": { "ar": "الحجم", "en": "Size" },
    "choices": [
      { "id": "s", "name": { "ar": "صغيرة", "en": "Small" }, "priceDelta": -12 },
      { "id": "m", "name": { "ar": "وسط",   "en": "Medium" }, "priceDelta": 0 }
    ]
  }
}
```

`priceDelta` بينضاف على `price`. الخيار اللي `priceDelta` تبعه `0` بينتخب
تلقائياً، فخلّي الخيار العادي دايماً صفر.

---

## تشغيل الموقع / Running the website

```bash
cd web
npm install
npm run dev          # http://localhost:3000
npm run build        # نسخة الإنتاج
npm run lint
```

- عربي على `/ar` وإنجليزي على `/en`؛ `/` بتحوّل حسب لغة المتصفح.
- كل الصفحات بتتولد ثابتة وقت البناء، فبتقدر تنشرها على Vercel أو أي استضافة
  مجانية.

## تشغيل التطبيق / Running the app

```bash
cd mobile
npm install
npx expo start       # امسح الـ QR بتطبيق Expo Go
```

للبناء النهائي للمتاجر (بيحتاج حساب Expo):

```bash
npx eas build --platform android
npx eas build --platform ios
```

قبل النشر بدّل `ios.bundleIdentifier` و `android.package` في `mobile/app.json`
لاسم النطاق تبعك، وبدّل الأيقونات في `mobile/assets/`.

---

## ملاحظات تقنية / Technical notes

- `shared/` مربوطة بالتطبيق كحزمة محلية (`@petal/shared`) عن طريق symlink،
  ومربوطة بالموقع عن طريق مسار `@shared/*` في `tsconfig.json`. تعديل واحد
  بينعكس على الاثنين.
- الموقع RTL كامل عن طريق `dir="rtl"` وخصائص CSS المنطقية (`ms-*`, `text-start`).
- التطبيق بيقلب الاتجاه من خلال `useLang().rtl` بدل `I18nManager`، لأن
  `I18nManager` بيحتاج إعادة تشغيل التطبيق عند تغيير اللغة.
- السلة محفوظة محلياً: `localStorage` بالموقع، `AsyncStorage` بالتطبيق.

### إشياء معروفة / Known gaps

- سهم الرجوع بالتطبيق بيضل يشير لليسار بالوضع العربي (سلوك افتراضي من
  React Navigation بدون `I18nManager.forceRTL`).
- تصدير التطبيق للويب (`expo export --platform web`) بيطلع تحذير hydration
  لأن اللغة بتتقرأ من التخزين بعد أول رسمة. ما بيأثر على أندرويد و iOS.
- ما في لوحة تحكم للمنتجات — التعديل بيصير على `shared/products.json` مباشرة.
