# Current Data Source Notes

هذه ملاحظات مختصرة عن مصدر الحقيقة الحالي في المشروع، حتى يكون السلوك واضحًا بدون إدخال refactor كبير قد يسبب مشاكل جانبية.

## 1. Weekly Plan Items

- العناصر المضافة داخل `week` مثل:
  - `study task`
  - `assignment`
  - `exam`
- مصدر الحقيقة الحالي لها هو جدول `weekly_plans` داخل أعمدة JSON التالية:
  - `study_tasks`
  - `assignments`
  - `exams`

### ماذا يعني هذا؟

- أي إضافة أو تعديل أو تغيير حالة لهذه العناصر يجب أن ينعكس على بيانات `weekly_plans`.
- الجداول القديمة:
  - `study_tasks`
  - `assignments`
- موجودة تاريخيًا من تصميم أقدم، لكنها ليست المسار الفعلي المعتمد حاليًا لهذه الشاشة.

## 2. Unified Tasks vs Weekly Items

- جدول `tasks` ما زال له دور فعلي في صفحة `/tasks` والمهام العامة.
- لكنه ليس المصدر الأساسي الحالي لعناصر `weekly plan` داخل تفاصيل الكورس.
- لذلك لا يوجد حاليًا sync ثنائي كامل بين:
  - عناصر `week`
  - وجدول `tasks`

### القرار الآمن حاليًا

- عدم فرض حفظ مزدوج لنفس العنصر في مكانين.
- الإبقاء على `weekly_plans` كمصدر حقيقة لعناصر الأسبوع.

## 3. Learning Plan Resources

- الموارد المرتبطة بـ `LearningPlan` مصدر الحقيقة الحالي لها هو جدول `resources` عبر `resourceable_type/resourceable_id`.
- عمود `learning_plans.resources` يعتبر legacy / غير مستخدم كمصدر فعلي في الـ API الحالي.

### القرار الآمن حاليًا

- الاعتماد على جدول `resources` فقط.
- عدم محاولة عمل sync مزدوج مع عمود `learning_plans.resources`.

## 4. Safe Scope Applied

- تم الحفاظ على مصدر الحقيقة الحالي بدل إدخال refactor خطير.
- تم إصلاح مشاكل التمرير في:
  - `Learning Plan` dialog
  - `Customize Focus Level` panel
- تم تجنب أي تعديل يفتح باب مشاكل مزامنة بين جداول متعددة لنفس البيانات.
