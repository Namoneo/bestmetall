# Best Metall - One Page Website

Современный одностраничный сайт для компании Best Metall (MetalYasash) - производство изделий из нержавеющей стали и металла.

## О проекте

Этот проект представляет собой полностью переработанный одностраничный сайт, заменяющий оригинальное Angular-приложение. Сайт создан с использованием чистого HTML, CSS и JavaScript без фреймворков.

### Особенности

- ✅ Полностью отзывчивый дизайн (mobile-first)
- ✅ Современный glassmorphism UI
- ✅ Плавные анимации при скролле
- ✅ Оптимизированная производительность
- ✅ SEO-оптимизированная структура
- ✅ Доступность (ARIA метки, семантический HTML)
- ✅ Нет зависимостей - чистый HTML/CSS/JS

## Структура проекта

```
bestmetall-redesign/
├── index.html              # Главный файл
├── css/
│   ├── variables.css       # CSS переменные (цвета, шрифты)
│   ├── reset.css           # CSS reset
│   ├── base.css            # Базовые стили
│   ├── components.css      # Компоненты (кнопки, карточки)
│   ├── sections.css        # Стили секций
│   ├── animations.css      # Анимации
│   └── responsive.css      # Адаптивные стили
├── js/
│   └── main.js             # Основной JavaScript
├── assets/
│   ├── images/             # Изображения
│   └── fonts/              # Шрифты (если локальные)
└── README.md
```

## Секции сайта

1. **Header** - Навигация с sticky эффектом
2. **Hero** - Главный экран с призывом к действию
3. **Stats** - Статистика компании (с анимированными счетчиками)
4. **About** - О компании
5. **Services** - 12 услуг в виде карточек
6. **Why Us** - 6 преимуществ работы с нами
7. **Production** - Оборудование и виды работ
8. **Process** - Этапы работы (таймлайн)
9. **Delivery** - Условия доставки и оплаты
10. **Contact** - Контакты и форма обратной связи
11. **Footer** - Подвал с навигацией

## Технологии

- **HTML5** - семантическая разметка
- **CSS3** - custom properties, flexbox, grid
- **Vanilla JavaScript** - без библиотек
- **Google Fonts** - Playfair Display, Inter
- **SVG Icons** - inline SVG

## Цветовая палитра

- Primary Dark: `#0A0E27`
- Accent Coral: `#FF6B6B`
- Accent Turquoise: `#4ECDC4`
- Accent Gold: `#FFE66D`

## Запуск

Просто откройте `index.html` в браузере. Для локального сервера:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Затем откройте http://localhost:8000

## Разработка

### CSS Архитектура
- **Variables** - все цвета и размеры в :root
- **Mobile-first** - базовые стили для мобильных
- **BEM naming** - .block__element--modifier

### JavaScript Модули
- `initNavigation()` - навигация и мобильное меню
- `initScrollAnimations()` - анимации при скролле
- `initCounters()` - анимированные счетчики
- `initForms()` - валидация форм
- `initModal()` - модальные окна
- `initSmoothScroll()` - плавная прокрутка

## Браузеры

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

IE11 не поддерживается.

## SEO

- Semantic HTML5
- Meta tags (title, description, keywords)
- Open Graph tags
- Twitter Cards
- Schema.org structured data ready

## Лицензия

© 2025 Best Metall. Все права защищены.

## Контакты

- Адрес: г. Наманган, ул. Промышленная, д. 45
- Телефон: +998 (90) 123-45-67
- Email: info@metal-art.uz
