/**
 * BEST METALL - TRANSLATIONS
 * Bilingual Support (Russian / Uzbek - Latin script)
 */

const translations = {
  ru: {
    // Navigation
    nav: {
      about: 'О компании',
      services: 'Услуги',
      equipment: 'Оборудование',
      process: 'Процесс',
      projects: 'Проекты',
      contact: 'Контакты'
    },

    // Top tech bar
    techbar: {
      est: 'Основано 2008',
      location: 'Наманган · Узбекистан',
      phone: '+998 90 123 45 67',
      hours: 'Пн – Сб · 09:00 – 18:00'
    },

    // Hero Section
    hero: {
      label: 'Металлоконструкции с 2008 года',
      title: {
        line1: 'СТАЛЬ',
        line2: 'ТОЧНОСТЬ',
        line3: 'КАЧЕСТВО'
      },
      subtitle: 'Премиальные металлоконструкции для бизнеса и дома. Лазерная резка, сварка, порошковая покраска — от чертежа до монтажа.',
      cta: {
        primary: 'Обсудить проект',
        secondary: 'Наши работы'
      },
      stats: {
        clients: 'Клиентов',
        years: 'Лет опыта',
        projects: 'Проектов',
        quality: 'Качество'
      }
    },

    // About Section
    about: {
      label: 'О компании',
      title: 'Лидер металлообработки в Намангане',
      text: 'ООО "Best Metall" — ведущая компания по производству металлоконструкций в Узбекистане. С 2008 года мы создаём надёжные решения для промышленности, строительства и частных клиентов.',
      expText: 'лет опыта',
      blueprintRef: 'DRG-001 · STAIRCASE TYPE-A',
      blueprintScale: 'SCALE 1:50',
      features: {
        experience: {
          title: '17+ лет опыта',
          desc: 'Более 17 лет на рынке металлоконструкций'
        },
        equipment: {
          title: 'Современное оборудование',
          desc: 'Лазерная резка, ЧПУ станки, порошковая покраска'
        },
        quality: {
          title: 'Гарантия качества',
          desc: '100% контроль на всех этапах производства'
        },
        deadline: {
          title: 'Точные сроки',
          desc: 'Выполняем работу вовремя без задержек'
        }
      }
    },

    // Services Section
    services: {
      label: 'Услуги',
      title: 'Наши услуги',
      items: {
        railings: {
          title: 'Нержавеющие ограждения',
          desc: 'Перила, поручни и ограждения из нержавеющей стали для лестниц, балконов и террас.'
        },
        stairs: {
          title: 'Лестницы и марши',
          desc: 'Металлические лестницы любой сложности: винтовые, маршевые, на монокосоуре.'
        },
        loft: {
          title: 'Мебель ЛОФТ',
          desc: 'Столы, стулья, полки и другая мебель в стиле лофт для дома и офиса.'
        },
        kitchen: {
          title: 'Кухонная мебель',
          desc: 'Каркасы и комплектующие для кухонной мебели из металла.'
        },
        doors: {
          title: 'Двери и ворота',
          desc: 'Металлические двери, ворота, калитки и заборы с порошковым покрытием.'
        },
        structures: {
          title: 'Металлоконструкции',
          desc: 'Несущие конструкции, ангары, навесы и каркасы зданий.'
        }
      },
      additional: {
        label: 'Дополнительные услуги',
        laser: 'Резка лазером',
        bending: 'Гибка листового металла',
        welding: 'Сварочные работы',
        coating: 'Порошковая покраска'
      },
      link: 'Подробнее →'
    },

    // Equipment Section
    equipment: {
      label: 'Оборудование',
      title: 'Наш цех',
      subtitle: 'Производственные мощности и парк станков, на котором мы работаем каждый день.',
      items: {
        laser: {
          title: 'Лазерный резак',
          model: 'CO₂ · 3 кВт · стол 1500×3000 мм',
          specs: {
            precisionLabel: 'Точность',
            precisionValue: '±0.1 мм',
            thicknessLabel: 'Толщина',
            thicknessValue: 'до 20 мм',
            materialLabel: 'Материал',
            materialValue: 'сталь / нерж'
          }
        },
        cnc: {
          title: 'ЧПУ обработка',
          model: '5 осей · допуск ±0.01 мм',
          specs: {
            areaLabel: 'Рабочее поле',
            areaValue: '600×400×500 мм',
            toolLabel: 'Смена инструмента',
            toolValue: 'автоматическая',
            materialLabel: 'Материал',
            materialValue: 'сталь / алюминий'
          }
        },
        welder: {
          title: 'Сварка TIG / MIG',
          model: 'Multi-process · 400 А',
          specs: {
            thicknessLabel: 'Толщина',
            thicknessValue: 'до 12 мм',
            materialLabel: 'Материал',
            materialValue: 'сталь / нерж / алюминий',
            certLabel: 'Сертификация',
            certValue: 'сварщики 5 разряда'
          }
        },
        coating: {
          title: 'Порошковая покраска',
          model: 'Промышленная камера · 200°C',
          specs: {
            paletteLabel: 'Палитра',
            paletteValue: 'RAL полный спектр',
            antiLabel: 'Защита',
            antiValue: 'антикоррозийная',
            sizeLabel: 'Размер детали',
            sizeValue: 'до 2 м'
          }
        }
      }
    },

    // Process Section
    process: {
      label: 'Процесс',
      title: 'Как мы работаем',
      steps: {
        design: {
          title: 'Проектирование',
          desc: 'Разрабатываем детальный проект с учётом всех ваших требований и пожеланий.'
        },
        engineering: {
          title: 'Инженеринг',
          desc: 'Создаём рабочую документацию и проводим инженерные расчёты прочности.'
        },
        fabrication: {
          title: 'Производство',
          desc: 'Изготавливаем детали на современном оборудовании с точностью до миллиметра.'
        },
        assembly: {
          title: 'Сборка',
          desc: 'Собираем конструкции на производстве, проводим контроль качества.'
        },
        installation: {
          title: 'Монтаж',
          desc: 'Доставляем и устанавливаем готовые конструкции на вашем объекте.'
        }
      }
    },

    // Projects Section
    projects: {
      label: 'Портфолио',
      title: 'Реализованные проекты',
      specs: {
        year: 'Год',
        location: 'Локация',
        material: 'Материал',
        area: 'Площадь',
        client: 'Заказчик'
      },
      items: {
        stairs: {
          category: 'Лестницы',
          title: 'Винтовая лестница для частного дома',
          year: '2024',
          location: 'Наманган',
          material: 'Нерж. сталь · стекло'
        },
        railings: {
          category: 'Ограждения',
          title: 'Перила для торгового центра',
          year: '2023',
          location: 'Фергана',
          material: 'Нерж. сталь'
        },
        loft: {
          category: 'Мебель',
          title: 'Офисная мебель ЛОФТ',
          year: '2024',
          location: 'Ташкент',
          material: 'Сталь · дуб'
        },
        gates: {
          category: 'Ворота',
          title: 'Автоматические ворота',
          year: '2023',
          location: 'Наманган',
          material: 'Сталь · порошок'
        },
        structure: {
          category: 'Металлоконструкции',
          title: 'Несущий каркас склада 2000 м²',
          year: '2024',
          location: 'Наманган',
          area: '2000 м²'
        }
      }
    },

    // Marquee
    marquee: {
      laser: 'ЛАЗЕРНАЯ РЕЗКА',
      cnc: 'CNC ОБРАБОТКА',
      weld: 'TIG / MIG СВАРКА',
      coating: 'ПОРОШКОВАЯ ПОКРАСКА',
      bending: 'ГИБКА ЛИСТОВ',
      design: 'ПРОЕКТИРОВАНИЕ'
    },

    // Metrics Section
    metrics: {
      label: 'Цифры',
      title: 'В цифрах',
      clients: 'Довольных клиентов',
      years: 'Лет на рынке',
      projects: 'Выполненных проектов',
      support: 'Поддержка',
      precision: 'Точность'
    },

    // CTA Section
    cta: {
      label: 'Запуск проекта',
      title: 'Создадим что-то вечное',
      subtitle: 'Расскажите о вашем проекте, и мы подготовим индивидуальное предложение в течение 24 часов.',
      primary: 'Начать проект',
      secondary: 'Позвонить'
    },

    // Contact Section
    contact: {
      label: 'Контакты',
      title: 'Давайте работать вместе',
      text: 'Оставьте заявку или свяжитесь с нами напрямую. Мы ответим в течение 24 часов.',
      formLabel: 'Форма заявки',
      formTitle: 'Оставить заявку',
      form: {
        name: 'Ваше имя',
        phone: 'Телефон',
        message: 'Сообщение',
        submit: 'Отправить заявку'
      },
      hours: {
        label: 'Режим работы',
        weekdays: 'Пн – Пт',
        weekdaysTime: '09:00 – 18:00',
        saturday: 'Сб',
        saturdayTime: '09:00 – 14:00',
        sunday: 'Вс',
        sundayValue: 'Выходной'
      },
      location: {
        label: 'Локация',
        value: 'Наманган, Узбекистан',
        address: 'г. Наманган, промзона Сергели',
        coords: '41.0011° N · 71.6726° E · Наманган'
      },
      response: 'Ответ в течение 24 часов'
    },

    // Footer
    footer: {
      tagline: 'Премиальные металлоконструкции с 2008 года',
      address: 'г. Наманган, промзона Сергели',
      copyright: '© 2026 ООО "Best Metall". Все права защищены.',
      rights: 'Все права защищены.',
      credits: 'Сделано с огнём и сталью'
    }
  },

  uz: {
    // Navigation
    nav: {
      about: 'Kompaniya haqida',
      services: 'Xizmatlar',
      equipment: 'Uskunalar',
      process: 'Jarayon',
      projects: 'Loyihalar',
      contact: 'Bog\'lanish'
    },

    // Top tech bar
    techbar: {
      est: '2008 yilda asos solingan',
      location: 'Namangan · O\'zbekiston',
      phone: '+998 90 123 45 67',
      hours: 'Du – Sh · 09:00 – 18:00'
    },

    // Hero Section
    hero: {
      label: '2008 yildan beri metall konstruksiyalar',
      title: {
        line1: 'PO\'LAT',
        line2: 'ANIQLIK',
        line3: 'SIFAT'
      },
      subtitle: 'Biznes va uy uchun yuqori sifatli metall konstruksiyalar. Lazer kesish, payvandlash, kukunli bo\'yash — chizmadan o\'rnatishgacha.',
      cta: {
        primary: 'Loyihani muhokama qilish',
        secondary: 'Bizning ishlarimiz'
      },
      stats: {
        clients: 'Mijozlar',
        years: 'Yillik tajriba',
        projects: 'Loyihalar',
        quality: 'Sifat'
      }
    },

    // About Section
    about: {
      label: 'Kompaniya haqida',
      title: 'Namangandagi metallga ishlov berish yetakchisi',
      text: '"Best Metall" MChJ — O\'zbekistondagi yetakchi metall konstruksiyalar ishlab chiqaruvchi kompaniya. 2008 yildan beri sanoat, qurilish va xususiy mijozlar uchun ishonchli yechimlar yaratib kelmoqdamiz.',
      expText: 'yillik tajriba',
      blueprintRef: 'DRG-001 · STAIRCASE TYPE-A',
      blueprintScale: 'SCALE 1:50',
      features: {
        experience: {
          title: '17+ yillik tajriba',
          desc: 'Metall konstruksiyalar bozorida 17 yildan ortiq tajriba'
        },
        equipment: {
          title: 'Zamonaviy uskunalar',
          desc: 'Lazer kesish, CNC dastgohlar, kukunli bo\'yash'
        },
        quality: {
          title: 'Sifat kafolati',
          desc: 'Ishlab chiqarishning barcha bosqichlarida 100% nazorat'
        },
        deadline: {
          title: 'Aniq muddat',
          desc: 'Ishni kechikishlarsiz, o\'z vaqtida bajaramiz'
        }
      }
    },

    // Services Section
    services: {
      label: 'Xizmatlar',
      title: 'Bizning xizmatlarimiz',
      items: {
        railings: {
          title: 'Zanglamaydigan panjaralar',
          desc: 'Zinapoyalar, balkonlar va terassalar uchun zanglamaydigan po\'latdan panjaralar va tutqichlar.'
        },
        stairs: {
          title: 'Zinapoyalar va marshlar',
          desc: 'Har qanday murakkablikdagi metall zinapoyalar: vintli, marshli, monokosourli.'
        },
        loft: {
          title: 'LOFT mebel',
          desc: 'Uy va ofis uchun loft uslubidagi stol, stul, javon va boshqa mebellar.'
        },
        kitchen: {
          title: 'Oshxona mebellari',
          desc: 'Metalldan tayyorlangan oshxona mebellari uchun karkas va butlovchi qismlar.'
        },
        doors: {
          title: 'Eshik va darvozalar',
          desc: 'Kukunli qoplamali metall eshiklar, darvozalar, kichik darvozalar va panjaralar.'
        },
        structures: {
          title: 'Metall konstruksiyalar',
          desc: 'Yuk ko\'taruvchi konstruksiyalar, angarlar, soyabonlar va bino karkaslari.'
        }
      },
      additional: {
        label: 'Qo\'shimcha xizmatlar',
        laser: 'Lazer kesish',
        bending: 'Listli metallni egish',
        welding: 'Payvandlash ishlari',
        coating: 'Kukunli bo\'yash'
      },
      link: 'Batafsil →'
    },

    // Equipment Section
    equipment: {
      label: 'Uskunalar',
      title: 'Ustaxonamiz',
      subtitle: 'Har kuni ishlaydigan ishlab chiqarish quvvati va dastgohlar parki.',
      items: {
        laser: {
          title: 'Lazer kesgich',
          model: 'CO₂ · 3 kVt · stol 1500×3000 mm',
          specs: {
            precisionLabel: 'Aniqlik',
            precisionValue: '±0.1 mm',
            thicknessLabel: 'Qalinligi',
            thicknessValue: '20 mm gacha',
            materialLabel: 'Material',
            materialValue: 'po\'lat / zanglamas'
          }
        },
        cnc: {
          title: 'CNC ishlov berish',
          model: '5 o\'q · ruxsat ±0.01 mm',
          specs: {
            areaLabel: 'Ish maydoni',
            areaValue: '600×400×500 mm',
            toolLabel: 'Asbob almashinuvi',
            toolValue: 'avtomatik',
            materialLabel: 'Material',
            materialValue: 'po\'lat / alyuminiy'
          }
        },
        welder: {
          title: 'TIG / MIG payvandlash',
          model: 'Multi-process · 400 A',
          specs: {
            thicknessLabel: 'Qalinligi',
            thicknessValue: '12 mm gacha',
            materialLabel: 'Material',
            materialValue: 'po\'lat / zanglamas / alyuminiy',
            certLabel: 'Sertifikat',
            certValue: '5-razryad payvandchilar'
          }
        },
        coating: {
          title: 'Kukunli bo\'yash',
          model: 'Sanoat kamerasi · 200°C',
          specs: {
            paletteLabel: 'Palitra',
            paletteValue: 'RAL to\'liq spektr',
            antiLabel: 'Himoya',
            antiValue: 'zanglashga qarshi',
            sizeLabel: 'Detal o\'lchami',
            sizeValue: '2 m gacha'
          }
        }
      }
    },

    // Process Section
    process: {
      label: 'Jarayon',
      title: 'Qanday ishlaymiz',
      steps: {
        design: {
          title: 'Loyihalash',
          desc: 'Sizning barcha talab va istaklaringizni hisobga olgan holda batafsil loyiha ishlab chiqamiz.'
        },
        engineering: {
          title: 'Muhandislik',
          desc: 'Ishchi hujjatlarni tayyorlaymiz va mustahkamlik bo\'yicha muhandislik hisob-kitoblarini bajaramiz.'
        },
        fabrication: {
          title: 'Ishlab chiqarish',
          desc: 'Zamonaviy uskunalarda detallarni millimetr aniqligida tayyorlaymiz.'
        },
        assembly: {
          title: 'Yig\'ish',
          desc: 'Konstruksiyalarni ishlab chiqarishda yig\'amiz va sifat nazoratidan o\'tkazamiz.'
        },
        installation: {
          title: 'O\'rnatish',
          desc: 'Tayyor konstruksiyalarni sizning ob\'ektingizga yetkazib beramiz va o\'rnatamiz.'
        }
      }
    },

    // Projects Section
    projects: {
      label: 'Portfolio',
      title: 'Amalga oshirilgan loyihalar',
      specs: {
        year: 'Yil',
        location: 'Manzil',
        material: 'Material',
        area: 'Maydoni',
        client: 'Buyurtmachi'
      },
      items: {
        stairs: {
          category: 'Zinapoyalar',
          title: 'Xususiy uy uchun vintli zinapoya',
          year: '2024',
          location: 'Namangan',
          material: 'Zanglamas po\'lat · shisha'
        },
        railings: {
          category: 'Panjaralar',
          title: 'Savdo markazi uchun panjaralar',
          year: '2023',
          location: 'Farg\'ona',
          material: 'Zanglamas po\'lat'
        },
        loft: {
          category: 'Mebel',
          title: 'LOFT uslubidagi ofis mebeli',
          year: '2024',
          location: 'Toshkent',
          material: 'Po\'lat · eman'
        },
        gates: {
          category: 'Darvozalar',
          title: 'Avtomatik darvozalar',
          year: '2023',
          location: 'Namangan',
          material: 'Po\'lat · kukun'
        },
        structure: {
          category: 'Metall konstruksiyalar',
          title: '2000 m² ombor uchun yuk karkasi',
          year: '2024',
          location: 'Namangan',
          area: '2000 m²'
        }
      }
    },

    // Marquee
    marquee: {
      laser: 'LAZER KESISH',
      cnc: 'CNC ISHLOV',
      weld: 'TIG / MIG PAYVANDLASH',
      coating: 'KUKUNLI BO\'YASH',
      bending: 'LIST EGISH',
      design: 'LOYIHALASH'
    },

    // Metrics Section
    metrics: {
      label: 'Raqamlar',
      title: 'Raqamlarda',
      clients: 'Mamnun mijozlar',
      years: 'Bozorda yillar',
      projects: 'Bajarilgan loyihalar',
      support: 'Yordam',
      precision: 'Aniqlik'
    },

    // CTA Section
    cta: {
      label: 'Loyiha boshlash',
      title: 'Abadiy narsa yarataylik',
      subtitle: 'Loyihangiz haqida gapirib bering, biz 24 soat ichida shaxsiy taklif tayyorlaymiz.',
      primary: 'Loyihani boshlash',
      secondary: 'Qo\'ng\'iroq qilish'
    },

    // Contact Section
    contact: {
      label: 'Aloqalar',
      title: 'Birga ishlaymiz',
      text: 'Ariza qoldiring yoki biz bilan to\'g\'ridan-to\'g\'ri bog\'laning. 24 soat ichida javob beramiz.',
      formLabel: 'Ariza shakli',
      formTitle: 'Ariza qoldirish',
      form: {
        name: 'Ismingiz',
        phone: 'Telefon',
        message: 'Xabar',
        submit: 'Ariza yuborish'
      },
      hours: {
        label: 'Ish vaqti',
        weekdays: 'Du – Ju',
        weekdaysTime: '09:00 – 18:00',
        saturday: 'Sh',
        saturdayTime: '09:00 – 14:00',
        sunday: 'Ya',
        sundayValue: 'Dam olish kuni'
      },
      location: {
        label: 'Manzil',
        value: 'Namangan, O\'zbekiston',
        address: 'Namangan sh., Sergeli sanoat zonasi',
        coords: '41.0011° N · 71.6726° E · Namangan'
      },
      response: '24 soat ichida javob'
    },

    // Footer
    footer: {
      tagline: '2008 yildan beri yuqori sifatli metall konstruksiyalar',
      address: 'Namangan sh., Sergeli sanoat zonasi',
      copyright: '© 2026 "Best Metall" MChJ. Barcha huquqlar himoyalangan.',
      rights: 'Barcha huquqlar himoyalangan.',
      credits: 'Olov va po\'lat bilan yaratilgan'
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = translations;
}
