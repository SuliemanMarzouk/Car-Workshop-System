<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'يجب قبول :attribute.',
    'active_url' => ':attribute لا يمثل رابطًا صحيحًا.',
    'after' => 'يجب على :attribute أن يكون تاريخًا لاحقًا للتاريخ :date.',
    'after_or_equal' => ':attribute يجب أن يكون تاريخاً لاحقاً أو مطابقاً للتاريخ :date.',
    'alpha' => 'يجب أن لا يحتوي :attribute سوى على حروف.',
    'alpha_dash' => 'يجب أن لا يحتوي :attribute سوى على حروف، أرقام ومطّات.',
    'alpha_num' => 'يجب أن لا يحتوي :attribute سوى على حروف وأرقام.',
    'array' => 'يجب أن يكون :attribute ًمصفوفة.',
    'before' => 'يجب على :attribute أن يكون تاريخًا سابقًا للتاريخ :date.',
    'before_or_equal' => ':attribute يجب أن يكون تاريخا سابقا أو مطابقا للتاريخ :date.',
    'between' => [
        'numeric' => 'يجب أن تكون قيمة :attribute بين :min و :max.',
        'file' => 'يجب أن يكون حجم الملف :attribute بين :min و :max كيلوبايت.',
        'string' => 'يجب أن يكون عدد حروف النّص :attribute بين :min و :max.',
        'array' => 'يجب أن يحتوي :attribute على عدد من العناصر بين :min و :max.',
    ],
    'boolean' => 'يجب أن تكون قيمة :attribute إما true أو false .',
    'confirmed' => 'حقل التأكيد غير مطابق للحقل :attribute.',
    'date' => ':attribute ليس تاريخًا صحيحًا.',
    'date_equals' => 'لا يساوي :attribute التاريخ :date.',
    'date_format' => 'لا يتوافق :attribute مع الشكل :format.',
    'different' => 'يجب أن يكون الحقلان :attribute و :other مختلفين.',
    'digits' => 'يجب أن يحتوي :attribute على :digits رقمًا/أرقام.',
    'digits_between' => 'يجب أن يحتوي :attribute على عدد من الأرقام بين :min و :max.',
    'dimensions' => 'الـ :attribute يحتوي على أبعاد صورة غير صالحة.',
    'distinct' => 'للحقل :attribute قيمة مكررة.',
    'email' => 'يجب أن يكون :attribute عنوان بريد إلكتروني صحيح البُنية.',
    'ends_with' => 'الـ :attribute يجب ان ينتهي بأحد القيم التالية :values.',
    'exists' => 'القيمة المحددة :attribute غير موجودة.',
    'file' => 'الـ :attribute يجب أن يكون ملفا.',
    'filled' => ':attribute إجباري.',
    'gt' => [
        'numeric' => 'يجب أن تكون قيمة :attribute أكبر من :value.',
        'file' => 'يجب أن يكون حجم الملف :attribute أكبر من :value كيلوبايت.',
        'string' => 'يجب أن يكون طول النّص :attribute أكثر من :value حروفٍ/حرفًا.',
        'array' => 'يجب أن يحتوي :attribute على أكثر من :value عناصر/عنصر.',
    ],
    'gte' => [
        'numeric' => 'يجب أن تكون قيمة :attribute مساوية أو أكبر من :value.',
        'file' => 'يجب أن يكون حجم الملف :attribute على الأقل :value كيلوبايت.',
        'string' => 'يجب أن يكون طول النّص :attribute على الأقل :value حروفٍ/حرفًا.',
        'array' => 'يجب أن يحتوي :attribute على الأقل على :value عُنصرًا/عناصر.',
    ],
    'image' => 'يجب أن يكون :attribute صورةً.',
    'in' => ':attribute لاغٍ.',
    'in_array' => ':attribute غير موجود في :other.',
    'integer' => 'يجب أن يكون :attribute عددًا صحيحًا.',
    'ip' => 'يجب أن يكون :attribute عنوان IP صحيحًا.',
    'ipv4' => 'يجب أن يكون :attribute عنوان IPv4 صحيحًا.',
    'ipv6' => 'يجب أن يكون :attribute عنوان IPv6 صحيحًا.',
    'json' => 'يجب أن يكون :attribute نصآ من نوع JSON.',
    'lt' => [
        'numeric' => 'يجب أن تكون قيمة :attribute أصغر من :value.',
        'file' => 'يجب أن يكون حجم الملف :attribute أصغر من :value كيلوبايت.',
        'string' => 'يجب أن يكون طول النّص :attribute أقل من :value حروفٍ/حرفًا.',
        'array' => 'يجب أن يحتوي :attribute على أقل من :value عناصر/عنصر.',
    ],
    'lte' => [
        'numeric' => 'يجب أن تكون قيمة :attribute مساوية أو أصغر من :value.',
        'file' => 'يجب أن لا يتجاوز حجم الملف :attribute :value كيلوبايت.',
        'string' => 'يجب أن لا يتجاوز طول النّص :attribute :value حروفٍ/حرفًا.',
        'array' => 'يجب أن لا يحتوي :attribute على أكثر من :value عناصر/عنصر.',
    ],
    'max' => [
        'numeric' => 'يجب أن لا تكون قيمة :attribute أكبر من :max.',
        'file' => 'يجب أن لا يتجاوز حجم الملف :attribute :max كيلوبايت.',
        'string' => 'يجب أن لا يتجاوز طول النّص :attribute :max حروفٍ/حرفًا.',
        'array' => 'يجب أن لا يحتوي :attribute على أكثر من :max عناصر/عنصر.',
    ],
    'mimes' => 'يجب أن يكون ملفًا من نوع: :values.',
    'mimetypes' => 'يجب أن يكون ملفًا من نوع: :values.',
    'min' => [
        'numeric' => 'يجب أن تكون قيمة :attribute مساوية أو أكبر من :min.',
        'file' => 'يجب أن يكون حجم الملف :attribute على الأقل :min كيلوبايت.',
        'string' => 'يجب أن يكون طول النّص :attribute على الأقل :min حروفٍ/حرفًا.',
        'array' => 'يجب أن يحتوي :attribute على الأقل على :min عُنصرًا/عناصر.',
    ],
    'multiple_of' => 'الـ :attribute يجب أن يكون من مضاعفات :value',
    'not_in' => ':attribute لاغٍ.',
    'not_regex' => 'صيغة :attribute غير صحيحة.',
    'numeric' => 'يجب أن يكون :attribute رقمًا.',
    'password' => 'كلمة المرور غير صحيحة.',
    'present' => 'يجب تقديم :attribute.',
    'regex' => 'صيغة :attribute .غير صحيحة.',
    'required' => ':attribute مطلوب.',
    'required_if' => ':attribute مطلوب في حال ما إذا كان :other يساوي :value.',
    'required_unless' => ':attribute مطلوب في حال ما لم يكن :other يساوي :values.',
    'required_with' => ':attribute مطلوب إذا توفّر :values.',
    'required_with_all' => ':attribute مطلوب إذا توفّر :values.',
    'required_without' => ':attribute مطلوب إذا لم يتوفّر :values.',
    'required_without_all' => ':attribute مطلوب إذا لم يتوفّر أي من :values.',
    'same' => 'يجب أن يتطابق :attribute مع :other.',
    'size' => [
        'numeric' => 'يجب أن تكون قيمة :attribute مساوية لـ :size.',
        'file' => 'يجب أن يكون حجم الملف :attribute :size كيلوبايت.',
        'string' => 'يجب أن يكون طول النّص :attribute :size حروفٍ/حرفًا.',
        'array' => 'يجب أن يحتوي :attribute على :size عنصرٍ/عناصر بالضبط.',
    ],
    'starts_with' => 'الـ :attribute يجب ان يبدأ بأحد القيم التالية :values.',
    'string' => 'يجب أن يكون :attribute نصآ.',
    'timezone' => 'يجب أن يكون :attribute نطاقًا زمنيًا صحيحًا.',
    'unique' => 'قيمة :attribute مُستخدمة من قبل.',
    'uploaded' => 'فشل في تحميل الـ :attribute.',
    'url' => 'صيغة الرابط :attribute غير صحيحة.',
    'uuid' => 'الـ :attribute يجب ان يكون UUID صالح.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'name' => 'الاسم',
        'username' => 'اسم المُستخدم',
        'email' => 'البريد الإلكتروني',
        'first_name' => 'الاسم الأول',
        'last_name' => 'اسم العائلة',
        'password' => 'كلمة المرور',
        'password_confirmation' => 'تأكيد كلمة المرور',
        'city' => 'المدينة',
        'country' => 'الدولة',
        'address' => 'العنوان',
        'phone' => 'الهاتف',
        'mobile' => 'الجوال',
        'age' => 'العمر',
        'sex' => 'الجنس',
        'gender' => 'النوع',
        'day' => 'اليوم',
        'month' => 'الشهر',
        'year' => 'السنة',
        'hour' => 'ساعة',
        'minute' => 'دقيقة',
        'second' => 'ثانية',
        'title' => 'العنوان',
        'content' => 'المُحتوى',
        'description' => 'الوصف',
        'excerpt' => 'المُلخص',
        'date' => 'التاريخ',
        'time' => 'الوقت',
        'available' => 'مُتاح',
        'size' => 'الحجم',
    ],

];
