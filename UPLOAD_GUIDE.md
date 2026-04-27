# 📦 دليل رفع موقع مقرأة غِنديات على الاستضافة

## ✅ قائمة الملفات للرفع

```
مقرأة-غِنديات/
├── index.html              ← الصفحة الرئيسية
├── programs.html           ← صفحة البرامج (30+ برنامج)
├── sheikhs.html            ← صفحة المعلمات والتلاوات
├── recitations.html        ← صفحة القراءات العشر
├── certificates.html       ← صفحة الشهادات والإجازات
├── contact.html            ← صفحة التواصل
├── quran.html              ← صفحة القرآن
├── .htaccess               ← إعدادات الخادم
├── css/
│   └── style.css           ← ملف الأنماط الرئيسي
├── js/
│   └── main.js             ← ملف JavaScript الرئيسي
└── images/
    └── logo.png            ← شعار المقرأة (ارفعي شعارك هنا)
```

---

## 🚀 خطوات الرفع (cPanel)

### 1. الدخول إلى لوحة cPanel
- انتقلي إلى: `yourdomain.com/cpanel`
- أدخلي بيانات الدخول

### 2. رفع الملفات عبر File Manager
1. افتحي **File Manager**
2. انتقلي إلى مجلد `public_html`
3. احذفي أي ملفات موجودة (index.html الافتراضية)
4. اضغطي **Upload** وارفعي جميع الملفات مع الحفاظ على بنية المجلدات
5. تأكدي من رفع ملف `.htaccess` (قد يكون مخفياً – فعّلي "Show Hidden Files")

### 3. رفع الملفات عبر FTP (بديل)
```
المضيف:    ftp.yourdomain.com
المستخدم:  ftp-username
كلمة السر: ftp-password
المنفذ:    21
المجلد:    /public_html/
```

برامج FTP الموصى بها:
- [FileZilla](https://filezilla-project.org/) (مجاني)
- [WinSCP](https://winscp.net/) (Windows)
- [Cyberduck](https://cyberduck.io/) (Mac)

---

## ⚙️ إعداد API المدمج

الموقع يعتمد على نظام **RESTful Table API** المدمج. للتأكد من عمله:

1. تأكدي من أن الاستضافة تدعم **PHP 7.4+** أو **Node.js**
2. مجلد `tables/` سيُنشأ تلقائياً عند الاستخدام
3. لا حاجة لإعداد قاعدة بيانات منفصلة

---

## 🌐 إعداد النطاق وSSL

### تفعيل SSL (HTTPS) – مجاني عبر Let's Encrypt
1. في cPanel ← **SSL/TLS** ← **Let's Encrypt SSL**
2. اضغطي **Issue** لنطاقك الرئيسي وnon-www
3. انتظري 5 دقائق

### إعادة التوجيه HTTP → HTTPS
يتم تلقائياً عبر ملف `.htaccess` المرفق

---

## 📱 اختبار الموقع بعد الرفع

بعد الرفع، تأكدي من:
- [ ] الصفحة الرئيسية تفتح: `https://yourdomain.com`
- [ ] البرامج: `https://yourdomain.com/programs.html`
- [ ] المعلمات والتلاوات: `https://yourdomain.com/sheikhs.html`
- [ ] القراءات: `https://yourdomain.com/recitations.html`
- [ ] التواصل: `https://yourdomain.com/contact.html`
- [ ] نموذج التواصل يُرسل بنجاح

---

## 🖼️ تخصيص الشعار والصور

1. **الشعار:** ارفعي شعارك باسم `logo.png` في مجلد `images/`
   - المقاس الموصى به: 200×200 بكسل، خلفية شفافة (PNG)

2. **صور البانرات:** يمكن إضافتها مباشرة عبر رابط URL في الكود

---

## 📞 الدعم الفني

للمساعدة التقنية راجعي:
- ملف `README.md` للتوثيق الكامل

---

## ⚡ نصائح الأداء

1. **ضغط الصور:** استخدمي [Squoosh.app](https://squoosh.app) لضغط الصور قبل الرفع
2. **تنسيق WebP:** للمتصفحات الحديثة (أسرع بـ30% من JPG)
3. **مجلد images/:** أنشئيه في public_html قبل رفع الصور

---

*تم إنشاء هذا الدليل تلقائياً – مقرأة غِنديات © 2025*
