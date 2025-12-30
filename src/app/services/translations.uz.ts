import { Translation } from './translation.service';

export const TRANSLATIONS_UZ: Translation = {
  menu: {
    home: 'Bosh sahifa',
    delivery: "Yetkazib berish va to'lov",
    howToOrder: 'Qanday buyurtma berish',
    articles: 'Maqolalar',
    reviews: 'Sharhlar',
    contacts: 'Aloqa',
    callback: "Qayta qo'ng'iroq",
  },
  services: {
    produce: {
      title: 'Ishlab chiqarish va metall ishlov berish',
      description: `
        Kompaniyamiz Namangan shahrida Sergeli sanoat zonasida joylashgan o'z ishlab chiqarish uchastkasiga ega.
        Biz 2008 yildan beri ishlaymiz va har qanday murakkablikdagi metall konstruksiyalarni tayyorlash bo'yicha buyurtmalarni qabul qilamiz.
        Biz Yevropa sifat talablariga javob beradigan zanglamaydigan po'latdan nostandart mahsulotlarga ixtisoslashganmiz.
      `,
      equipment: [
        "Gilyotina (metall kesish, 6 mm gacha zanglamaydigan po'lat)",
        'Varaqa bukish mashinasi (3000 mm gacha uzunlikda bukish)',
        'Quvur bukish mashinalari (dornli va valtsli, 10 dan 50 mm gacha quvurlarni bukish)',
        'Valtslar (varaqa va profilni radiusli bukish)',
        'Tokarlik-frezalik park',
        'Payvandlash postlari (argon-yoy payvandlash TIG, yarim avtomatik MIG)',
        "Slusarlik-yig'ish uchastkasi",
        'Sayqallash va silliqlash uchastkasi',
      ],
      features: [
        'Metallni figurali kesish',
        'Varaqa materialini kesish',
        'Rangli metallarni payvandlash (alyuminiy, mis, latun)',
        "Zanglamaydigan po'latni sayqallash (oyna holatiga qadar)",
        "Satinirlash (yo'naltirilgan silliqlash)",
        "RAL katalogi bo'yicha kukun bo'yash",
        "Metall konstruksiyalarni chiqib o'rnatish",
      ],
    },
    stairs: {
      title: "Zinapoyalar va to'siqlar",
      description: `
        Zanglamaydigan po'latdan zinapoya to'siqlari va balyustradalarni professional tayyorlash.
        Bizning mahsulotlarimiz yuqori mustahkamlik, chidamlilik va banklar, restoranlar, ofislar va xususiy uylar uchun ideal bo'lgan zamonaviy estetikaga ega.
        Biz "Qulay muhit" dasturi uchun maxsus tutqichlarni o'z ichiga olgan eksklyuziv dizayner konstruksiyalarni ham, standart byudjet variantlarini ham taklif qilamiz.
      `,
      features: [
        "Shisha bilan to'siqlar",
        'Kosorlarda zinapoyalar',
        'Spiral zinapoyalar',
        'Nogironlar uchun tutqichlar',
        "Devorga o'rnatiladigan tutqichlar",
      ],
    },
    mailboxes: {
      title: 'Metall pochta qutilari',
      description: `
        Elita biznes-markazlar va turar-joy xollari uchun zanglamaydigan po'latdan seksiyali pochta qutilarini loyihalash va ishlab chiqarish.
        Biz "Belaya Dacha" seriyasi kabi noyob patentlangan ultra yupqa modellarni (chuqurligi 40mm) taklif qilamiz.
        Qutilar vandalizmga chidamli, xizmat ko'rsatish uchun qulay va shisha yoki plastik qo'shimchalar bilan bezatilishi mumkin.
      `,
      features: [
        'Seksiyali bloklar',
        'Vandalizmga chidamli bajarilish',
        'Atigi 40mm chuqurlik',
        "Raqamlarni lazer o'yish",
        'Individual fasad dizayni',
      ],
    },
    loft: {
      title: 'LOFT uslubidagi mebel',
      description: `
        LOFT uslubida mebel va metall konstruksiyalarni tayyorlash. Biz qora metall va zanglamaydigan po'lat bilan ishlaymiz, ularni yog'och va shisha bilan birlashtiramiz.
        Bizning assortimentimizda devor panellari, to'siqlar va individual mebel buyumlari mavjud.
        Pardozlash qo'pol "sanoat" dan oyna sayqalligacha farq qiladi.
      `,
      features: [
        'Javonlar va tokchalar',
        'Ovqatlanish va ish stollari',
        "Zonalash to'siqlari",
        "Metall + Massiv yog'och",
        'Individual prototiplar',
      ],
    },
    kitchen: {
      title: "Zanglamaydigan po'latdan oshxona mebeli",
      description: `
        Zanglamaydigan po'latdan korpusli va o'rnatilgan oshxona mebelini loyihalash va ishlab chiqarish.
        Individual loyihalar bo'yicha oshxona fartuklar, stol ustlari va fasadlarni o'z ichiga oladi.
        Yuqori gigiena standartlari va zamonaviy texnologik estetikani talab qiladigan premium loyihalar uchun ideal.
      `,
    },
    neutral: {
      title: 'Neytral uskunalar',
      description: `
        Umumiy ovqatlanish uchun neytral uskunalarni ishlab chiqarish: stollar, vannalar, javonlar.
        Oziq-ovqat uchun mo'ljallangan AISI 304 zanglamaydigan po'latdan foydalanish tufayli yuqori gigiyena va uzoq umr.
      `,
    },
    retail: {
      title: 'Savdo uskunalari',
      description: `
        Funktsional va estetik jihatdan benuqson savdo uskunalarini ishlab chiqarish: kiyim uchun relslar, javonlar, stendlar.
        Konstruksiyalar zanglamaydigan po'latni yog'och, shisha, tosh yoki plastik bilan birlashtiradi.
        Har bir mahsulot interer va brend uslubiga moslashtirilgan holda individual tayyorlanadi.
      `,
    },
    entrance: {
      title: 'Kirish guruhlari, soyabonlar',
      description: `
        Yerto'lalar va tsokol qavatlariga kirishlarni yog'ingarchlikdan himoya qilish uchun zamonaviy siljuvchi soyabonlar va kozirklar.
        Atmosferaga chidamli zanglamaydigan po'lat va monolit polikarbonatdan konstruksiyalar.
        Har qanday iqlim sharoitida uzoq muddatli ishlash uchun o'z ishlab chiqarishimizning mustahkamlangan roliklar va yo'naltiruvchilar ishlatiladi.
      `,
    },
    fences: {
      title: "Darvozalar, panjaralar, to'siqlar",
      description: `
        Metall va zanglamaydigan po'latdan darvozalar va panjaralarni tayyorlash.
        Xususiy va tijorat hududlari uchun zamonaviy dizaynga ega ishonchli konstruksiyalar.
      `,
    },
    architectural: {
      title: "Kichik me'moriy shakllar",
      description: `
        Shahar va bog'larni obodonlashtirish uchun kichik me'moriy shakllarni ishlab chiqarish: skameykalar, axlat qutilari, velosiped to'xtash joylari.
        Vandalizmga va ob-havo sharoitlariga chidamli uzoq muddatli materiallar.
      `,
    },
    custom: {
      title: "Buyurtmachining chizmalariga ko'ra mahsulotlar",
      description: `
        Sizning eskizlaringiz va chizmalaringiz bo'yicha har qanday nostandart mahsulotlarni tayyorlaymiz.
        Bizning konstruktorlik bo'limingiz g'oyani tayyor texnik yechimga qadar ishlab chiqishga yordam beradi.
      `,
    },
    painting: {
      title: "Kukun bo'yash",
      description: `
        RAL katalogi bo'yicha metall mahsulotlarni har qanday ranglarda professional kukun bo'yash xizmatlari.
        Uzoq muddatli va barqaror qoplamani ta'minlaymiz.
      `,
    },
  },
  pages: {
    delivery: {
      title: "Yetkazib berish va to'lov",
      content: `
        <div class="page-section">
          <h3>Yetkazib berish narxi</h3>
          <ul>
            <li><strong>Namangan shahri bo'yicha:</strong> 50,000 so'm.</li>
            <li><strong>Toshkent shahri bo'yicha:</strong> 150,000 so'm.</li>
            <li><strong>O'zbekiston bo'ylab boshqa shaharlar:</strong> Yetkazib berish transport kompaniyalari orqali tashuvchining tariflari bo'yicha amalga oshiriladi.</li>
          </ul>
        </div>
        <div class="page-section">
          <h3>To'lov shartlari</h3>
          <ul>
            <li><strong>Buyurtma mahsulotlari:</strong> Ishlab chiqarishga kirishishdan oldin 60% oldindan to'lov.</li>
            <li><strong>Materiallar va tayyor mahsulotlar:</strong> 100% oldindan to'lov.</li>
            <li><strong>To'lov usuli:</strong> Naqdsiz hisob-kitob. Boshqa to'lov usullari individual muhokama qilinadi.</li>
          </ul>
        </div>
      `,
    },
    howToOrder: {
      title: 'Qanday buyurtma berish',
      content: `
        <div class="page-section">
          <p>Biz texnik topshiriqni ishlab chiqishdan tortib tayyor mahsulotni o'rnatishgacha to'liq ishlar tsiklini taklif qilamiz.</p>
          <h3>Ish bosqichlari:</h3>
          <ol>
            <li><strong>Ariza:</strong> Siz bizga texnik topshiriqni (eskiz, chizma yoki oddiy tavsif) pochta orqali yoki saytdagi forma orqali yuborasiz.</li>
            <li><strong>Hisob-kitob:</strong> Biz dastlabki narx va tayyorlash muddatlarini hisoblaymiz.</li>
            <li><strong>O'lchash (zarur bo'lsa):</strong> Bizning mutaxassisimiz aniq o'lchashlar uchun ob'ektga chiqadi.</li>
            <li><strong>Shartnoma:</strong> Texnik topshiriqni kelishib olamiz, shartnoma va spetsifikatsiyani imzolaymiz.</li>
            <li><strong>Oldindan to'lov:</strong> Siz avans to'lovini kiritasiz (odatda 60%).</li>
            <li><strong>Loyihalash:</strong> Konstruktorlik bo'limi chizmalarni ishlab chiqadi va Siz bilan kelishadi.</li>
            <li><strong>Ishlab chiqarish:</strong> Namangan shahrida bizning ishlab chiqarishimizda mahsulotni tayyorlash.</li>
            <li><strong>O'rnatish va topshirish:</strong> Mahsulotni yetkazib berish va o'rnatish (zarur bo'lsa), bajarilgan ishlar dalolatnomasini imzolash.</li>
          </ol>
        </div>
      `,
    },
    articles: {
      title: 'Foydali maqolalar',
      content: `
        <div class="articles-list">
          <p>Ushbu bo'limda biz zanglamaydigan po'lat va metall konstruksiyalar haqida foydali ma'lumotlarni e'lon qilamiz.</p>
          <ul>
            <li><a href="#">Zanglamaydigan po'latdan yasalgan mebelga qanday g'amxo'rlik qilish</a></li>
            <li><a href="#">Polikarbonatdan yasalgan siljuvchi soyabonlarning afzalliklari</a></li>
            <li><a href="#">Dekorativ metall konstruksiya kuch konstruksiyasidan nimasi bilan farq qiladi</a></li>
            <li><a href="#">Turar-joy uylarida pochta qutilarini o'rnatishning xususiyatlari</a></li>
          </ul>
          <p><em>(Bo'lim to'ldirilish bosqichida)</em></p>
        </div>
      `,
    },
    reviews: {
      title: 'Sharhlar',
      content: `
        <div class="reviews-page">
          <p>Biz har bir mijozni qadrlaymiz va fikr-mulohazalar uchun minnatdormiz!</p>
          <div class="review-cta">
            <p>Sharh yoki taklifingizni bizga pochta orqali yuborishingiz mumkin: <strong>info@metal-art.uz</strong></p>
          </div>
          <h3>Mijozlarimiz nima deyishadi:</h3>
          <p><em>(Bu yerda tez orada Yandex.Xaritalar va Google Maps dan sharhlar paydo bo'ladi)</em></p>
        </div>
      `,
    },
    contacts: {
      title: 'Bizning manzilimiz',
      content: `
        <div class="contact-details">
          <h3>OOO "Metal Art"</h3>
          <p><strong>Ishlab chiqarish va ofis manzili:</strong></p>
          <p>160100, Namangan sh., Sanoat ko'chasi, 45-uy</p>

          <div class="contact-persons">
            <div class="person">
              <h4>Ishlab chiqarish, Buxgalteriya</h4>
              <p>Azizova Dilnoza</p>
              <p>Tel: <a href="tel:+998901234567">+998 (90) 123-45-67</a></p>
              <p>Email: <a href="mailto:info@metal-art.uz">info@metal-art.uz</a></p>
            </div>
            <div class="person">
              <h4>Bosh konstruktor</h4>
              <p>Karimov Jasur</p>
              <p>Tel: <a href="tel:+998909876543">+998 (90) 987-65-43</a></p>
            </div>
          </div>

          <p><strong>Navigator uchun koordinatalar:</strong> 41.311151, 69.279737</p>
        </div>
      `,
    },
  },
  ui: {
    since: '2008 yildan beri',
    trustIndicators: {
      workingSince: '2008 yildan beri ishlaymiz',
      ownProduction: "O'z ishlab chiqarishimiz",
      qualityGuarantee: 'Sifat kafolati',
      completedProjects: '10,000+ dan ortiq bajarilgan loyihalar',
    },
    callbackForm: {
      subtitle: "So'rov qoldiring va mutaxassisimiz tez orada sizga qo'ng'iroq qiladi",
      name: 'Ism',
      namePlaceholder: 'Sizning ismingiz',
      nameError: 'Iltimos, ismingizni kiriting (kamida 2 ta belgi)',
      phone: 'Telefon',
      phonePlaceholder: '+998 (__) ___-__-__',
      phoneError: "To'g'ri telefon raqamini kiriting",
      message: 'Xabar (ixtiyoriy)',
      messagePlaceholder: 'Sizga qanday yordam bera olamiz?',
      submit: "So'rovni yuborish",
      submitError: "Yuborishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
      successTitle: "So'rov qabul qilindi!",
      successMessage:
        "Rahmat! Tez orada tafsilotlarni muhokama qilish uchun siz bilan bog'lanamiz.",
    },
  },
  home: {
    hero: {
      badge: '2008 yildan beri bozorda',
      title: 'Metalldan kelajak',
      titleHighlight: 'yaratamiz',
      description:
        "Zanglamaydigan po'lat va metall mahsulotlarini professional ishlab chiqarish. Vaqt va minglab mamnun mijozlar tomonidan tasdiqlangan sifat.",
      watchProduction: "Ishlab chiqarishni ko'rish",
      contactUs: "Biz bilan bog'laning",
      qualityTitle: 'Yuqori sifat',
      qualityDescription: 'Faqat eng yaxshi materiallar va zamonaviy uskunalardan foydalanamiz',
    },
    stats: {
      clients: 'Mamnun mijozlar',
      experience: 'Yillik tajriba',
      projects: 'Bajarilgan loyihalar',
      quality: 'Sifat kafolati',
    },
    features: {
      title: 'Nima uchun bizni tanlaydilar',
      subtitle: "Loyihalashdan o'rnatishgacha to'liq xizmatlar tsiklini taklif qilamiz",
      individual: {
        title: 'Individual yondashuv',
        description:
          'Mijozning barcha istaklarini hisobga olgan holda har bir loyiha uchun noyob yechimlarni ishlab chiqamiz',
      },
      fast: {
        title: 'Tez muddatlar',
        description:
          "Zamonaviy uskunalar sifatni yo'qotmasdan buyurtmalarni eng qisqa muddatda bajarishga imkon beradi",
      },
      guarantee: {
        title: 'Sifat kafolati',
        description: "Barcha ish turlari va foydalaniladigan materiallarga to'liq kafolat beramiz",
      },
      pricing: {
        title: 'Halol narxlar',
        description: "Yashirin to'lovlar va qo'shimcha xarajatlarsiz shaffof narxlash",
      },
      fullCycle: {
        title: "To'liq tsikl",
        description: "Loyihalash va ishlab chiqarishdan ob'ektda yetkazib berish va o'rnatishgacha",
      },
      experts: {
        title: 'Tajribali mutaxassislar',
        description: "Metall ishlov berishda ko'p yillik tajribaga ega professionallar jamoasi",
      },
    },
    cta: {
      title: 'Loyihangizni boshlashga tayyormisiz?',
      description: "Bugun biz bilan bog'laning va bepul maslahat va narx hisobini oling",
      getConsultation: 'Maslahat olish',
      viewWorks: "Ishlarimizni ko'rish",
    },
  },
  footer: {
    description:
      "2008 yildan beri zanglamaydigan po'lat va metall mahsulotlarini professional ishlab chiqarish.",
    quickLinks: 'Tezkor havolalar',
    ourServices: 'Bizning xizmatlarimiz',
    contactsTitle: 'Aloqa',
    links: {
      home: 'Bosh sahifa',
      production: 'Ishlab chiqarish',
      delivery: 'Yetkazib berish',
      howToOrder: 'Qanday buyurtma berish',
      articles: 'Maqolalar',
      reviews: 'Sharhlar',
    },
    services: {
      stainlessSteel: "Zanglamaydigan po'latdan mahsulotlar",
      metalStructures: 'Metall konstruksiyalar',
      laserCutting: 'Lazer kesish',
      metalBending: 'Metall bukish',
      welding: 'Payvandlash ishlari',
      powderCoating: "Kukun bo'yash",
    },
    contacts: {
      address: "Namangan, Sanoat ko'chasi, 45-uy",
      workingHours: 'Dush-Jum: 9:00 - 18:00',
    },
    copyright: '© 2025 Metal Art. Barcha huquqlar himoyalangan.',
    legal: {
      privacy: 'Maxfiylik siyosati',
      terms: 'Foydalanish shartlari',
    },
  },
  sidebar: {
    ourServices: 'Bizning xizmatlarimiz',
    whyTrustUs: 'Nima uchun bizga ishonishadi',
  },
  header: {
    address: "Sanoat ko'chasi, 45-uy",
  },
};
