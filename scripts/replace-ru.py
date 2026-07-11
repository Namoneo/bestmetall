import re

with open('/Users/namoneo/develop/bestmetall/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define replacements: Russian fallback text -> Uzbek fallback text
# These are the text values between tags that serve as fallback before JS runs
replacements = {
    # Meta
    'Best Metall - премиальные металлоконструкции в Намангане с 2008 года. Лазерная резка, сварка, порошковая покраска.': 'Best Metall - Namanganda 2008 yildan beri yuqori sifatli metall konstruksiyalar. Lazer kesish, payvandlash, kukunli bo\'yash.',
    'металлоконструкции, лазерная резка, сварка, Наманган, нержавеющая сталь': 'metall konstruksiyalar, lazer kesish, payvandlash, Namangan, zanglamas po\'lat',
    'Премиальные металлоконструкции для вашего бизнеса и дома': 'Biznes va uy uchun yuqori sifatli metall konstruksiyalar',
    
    # Services section
    'Услуги': 'Xizmatlar',
    'Наши услуги': 'Bizning xizmatlarimiz',
    'Нержавеющие ограждения': 'Zanglamaydigan panjaralar',
    'Перила, поручни и ограждения из нержавеющей стали для лестниц, балконов и террас.': 'Zinapoyalar, balkonlar va terassalar uchun zanglamaydigan po\'latdan panjaralar va tutqichlar.',
    'Подробнее →': 'Batafsil →',
    'Лестницы и марши': 'Zinapoyalar va marshlar',
    'Металлические лестницы любой сложности: винтовые, маршевые, на монокосоуре.': 'Har qanday murakkablikdagi metall zinapoyalar: vintli, marshli, monokosourli.',
    'Мебель ЛОФТ': 'LOFT mebel',
    'Столы, стулья, полки и другая мебель в стиле лофт для дома и офиса.': 'Uy va ofis uchun loft uslubidagi stol, stul, javon va boshqa mebellar.',
    'Кухонная мебель': 'Oshxona mebellari',
    'Каркасы и комплектующие для кухонной мебели из металла.': 'Metalldan tayyorlangan oshxona mebellari uchun karkas va butlovchi qismlar.',
    'Двери и ворота': 'Eshik va darvozalar',
    'Металлические двери, ворота, калитки и заборы с порошковым покрытием.': 'Kukunli qoplamali metall eshiklar, darvozalar, kichik darvozalar va panjaralar.',
    'Металлоконструкции': 'Metall konstruksiyalar',
    'Несущие конструкции, ангары, навесы и каркасы зданий.': 'Yuk ko\'taruvchi konstruksiyalar, angarlar, soyabonlar va bino karkaslari.',
    'Дополнительные услуги': 'Qo\'shimcha xizmatlar',
    'Резка лазером': 'Lazer kesish',
    'Гибка листового металла': 'Listli metallni egish',
    'Сварочные работы': 'Payvandlash ishlari',
    'Порошковая покраска': 'Kukunli bo\'yash',
    
    # Equipment section
    'Оборудование': 'Uskunalar',
    'Наш цех': 'Ustaxonamiz',
    'Лазерный резак': 'Lazer kesgich',
    'CO₂ · 3 кВт · стол 1500×3000 мм': 'CO₂ · 3 kVt · stol 1500×3000 mm',
    'Точность': 'Aniqlik',
    '±0.1 мм': '±0.1 mm',
    'Толщина': 'Qalinligi',
    'до 20 мм': '20 mm gacha',
    'Материал': 'Material',
    'сталь / нерж': 'po\'lat / zanglamas',
    'ЧПУ обработка': 'CNC ishlov berish',
    '5 осей · допуск ±0.01 мм': '5 o\'q · ruxsat ±0.01 mm',
    'Рабочее поле': 'Ish maydoni',
    '600×400×500 мм': '600×400×500 mm',
    'Смена инструмента': 'Asbob almashinuvi',
    'автоматическая': 'avtomatik',
    'сталь / алюминий': 'po\'lat / alyuminiy',
    'Сварка TIG / MIG': 'TIG / MIG payvandlash',
    'Multi-process · 400 А': 'Multi-process · 400 A',
    'до 12 мм': '12 mm gacha',
    'сталь / нерж / алюминий': 'po\'lat / zanglamas / alyuminiy',
    'Сертификация': 'Sertifikat',
    'сварщики 5 разряда': '5-razryad payvandchilar',
    'Порошковая покраска': 'Kukunli bo\'yash',
    'Промышленная камера · 200°C': 'Sanoat kamerasi · 200°C',
    'Палитра': 'Palitra',
    'RAL полный спектр': 'RAL to\'liq spektr',
    'Защита': 'Himoya',
    'антикоррозийная': 'zanglashga qarshi',
    'Размер детали': 'Detal o\'lchami',
    'до 2 м': '2 m gacha',
    
    # Process section
    'Процесс': 'Jarayon',
    'Как мы работаем': 'Qanday ishlaymiz',
    'Проектирование': 'Loyihalash',
    'Разрабатываем детальный проект с учётом всех ваших требований и пожеланий.': 'Sizning barcha talab va istaklaringizni hisobga olgan holda batafsil loyiha ishlab chiqamiz.',
    'Инжиниринг': 'Muhandislik',
    'Создаём рабочую документацию и проводим инженерные расчёты прочности.': 'Ishchi hujjatlarni tayyorlaymiz va mustahkamlik bo\'yicha muhandislik hisob-kitoblarini bajaramiz.',
    'Производство': 'Ishlab chiqarish',
    'Изготавливаем детали на современном оборудовании с точностью до миллиметра.': 'Zamonaviy uskunalarda detallarni millimetr aniqligida tayyorlaymiz.',
    'Сборка': 'Yig\'ish',
    'Собираем конструкции на производстве, проводим контроль качества.': 'Konstruksiyalarni ishlab chiqarishda yig\'amiz va sifat nazoratidan o\'tkazamiz.',
    'Монтаж': 'O\'rnatish',
    'Доставляем и устанавливаем готовые конструкции на вашем объекте.': 'Tayyor konstruksiyalarni sizning ob\'ektingizga yetkazib beramiz va o\'rnatamiz.',
    
    # Projects section
    'Портфолио': 'Portfolio',
    'Реализованные проекты': 'Amalga oshirilgan loyihalar',
    'Год': 'Yil',
    'Локация': 'Manzil',
    'Площадь': 'Maydoni',
    'Заказчик': 'Buyurtmachi',
    'Лестницы': 'Zinapoyalar',
    'Винтовая лестница для частного дома': 'Xususiy uy uchun vintli zinapoya',
    'Наманган': 'Namangan',
    'Нерж. сталь · стекло': 'Zanglamas po\'lat · shisha',
    'Ограждения': 'Panjaralar',
    'Перила для торгового центра': 'Savdo markazi uchun panjaralar',
    'Фергана': 'Farg\'ona',
    'Нерж. сталь': 'Zanglamas po\'lat',
    'Мебель': 'Mebel',
    'Офисная мебель ЛОФТ': 'LOFT uslubidagi ofis mebeli',
    'Ташкент': 'Toshkent',
    'Сталь · дуб': 'Po\'lat · eman',
    'Ворота': 'Darvozalar',
    'Автоматические ворота': 'Avtomatik darvozalar',
    'Сталь · порошок': 'Po\'lat · kukun',
    'Несущий каркас склада 2000 м²': '2000 m² ombor uchun yuk karkasi',
    '2000 м²': '2000 m²',
    
    # Metrics
    'Цифры': 'Raqamlar',
    'В цифрах': 'Raqamlarda',
    'Довольных клиентов': 'Mamnun mijozlar',
    'Лет на рынке': 'Bozorda yillar',
    'Выполненных проектов': 'Bajarilgan loyihalar',
    'Поддержка': 'Yordam',
    'Точность': 'Aniqlik',
    
    # CTA
    'Запуск проекта': 'Loyiha boshlash',
    'Создадим что-то вечное': 'Abadiy narsa yarataylik',
    'Расскажите о вашем проекте, и мы подготовим индивидуальное предложение в течение 24 часов.': 'Loyihangiz haqida gapirib bering, biz 24 soat ichida shaxsiy taklif tayyorlaymiz.',
    'Начать проект': 'Loyihani boshlash',
    'Позвонить': 'Qo\'ng\'iroq qilish',
    
    # Contact
    'Контакты': 'Aloqalar',
    'Давайте работать вместе': 'Birga ishlaymiz',
    'Оставьте заявку или свяжитесь с нами напрямую. Мы ответим в течение 24 часов.': 'Ariza qoldiring yoki biz bilan to\'g\'ridan-to\'g\'ri bog\'laning. 24 soat ichida javob beramiz.',
    'Форма заявки': 'Ariza shakli',
    'Оставить заявку': 'Ariza qoldirish',
    'Ваше имя': 'Ismingiz',
    'Телефон': 'Telefon',
    'Сообщение': 'Xabar',
    'Отправить заявку': 'Ariza yuborish',
    'Режим работы': 'Ish vaqti',
    'Пн – Пт': 'Du – Ju',
    'Сб': 'Sh',
    'Вс': 'Ya',
    'Выходной': 'Dam olish kuni',
    'Локация': 'Manzil',
    'г. Наманган, промзона Сергели': 'Namangan sh., Sergeli sanoat zonasi',
    '41.0011° N · 71.6726° E · Наманган': '41.0011° N · 71.6726° E · Namangan',
    'Ответ в течение 24 часов': '24 soat ichida javob',
    
    # Footer
    'Премиальные металлоконструкции с 2008 года': '2008 yildan beri yuqori sifatli metall konstruksiyalar',
    '© 2026 ООО "Best Metall". Все права защищены.': '© 2026 "Best Metall" MChJ. Barcha huquqlar himoyalangan.',
    'Все права защищены.': 'Barcha huquqlar himoyalangan.',
    'Сделано с огнём и сталью': 'Olov va po\'lat bilan yaratilgan',
}

# Count replacements
count = 0
for old, new in replacements.items():
    if old in content:
        content = content.replace(old, new)
        count += 1
        print(f'Replaced: "{old[:50]}..."')

with open('/Users/namoneo/develop/bestmetall/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nTotal replacements: {count}')

# Check for remaining Russian text
remaining = []
for old in replacements.keys():
    if old in content:
        remaining.append(old)

if remaining:
    print(f'\nRemaining Russian text ({len(remaining)}):')
    for r in remaining:
        print(f'  - {r[:60]}')
else:
    print('\nNo remaining Russian fallback text found!')
