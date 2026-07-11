from __future__ import annotations

import json
import sqlite3
from collections import OrderedDict
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Flask, g

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_PATH = BASE_DIR / 'database.db'
UPLOADS_DIR = BASE_DIR / 'uploads'
# The website is served from the project root (index.html, styles/, scripts/).
WEBSITE_DIR = BASE_DIR


# --------------------------------------------------------------------------
# Field definition helpers
# --------------------------------------------------------------------------

def empty_value_for_type(field_type: str) -> Any:
  if field_type == 'boolean':
    return False
  if field_type == 'repeater':
    return []
  return ''


def field(
  label: str,
  *,
  field_type: str = 'text',
  default: Any = '',
  group: str = 'Content',
  help_text: str = '',
) -> dict[str, Any]:
  return {
    'label': label,
    'type': field_type,
    'default': default,
    'group': group,
    'help_text': help_text,
  }


def repeater_field(
  label: str,
  *,
  item_label: str,
  item_fields: 'OrderedDict[str, dict[str, Any]]',
  default: list[dict[str, Any]] | None = None,
  group: str = 'Content',
  help_text: str = '',
) -> dict[str, Any]:
  normalized_item_fields: 'OrderedDict[str, dict[str, Any]]' = OrderedDict()
  for key, item_definition in item_fields.items():
    normalized_item_fields[key] = {
      'label': item_definition['label'],
      'type': item_definition['type'],
      'default': deepcopy(item_definition.get('default', empty_value_for_type(item_definition['type']))),
      'help_text': item_definition.get('help_text', ''),
    }

  return {
    'label': label,
    'type': 'repeater',
    'default': deepcopy(default or []),
    'group': group,
    'help_text': help_text,
    'item_label': item_label,
    'item_fields': normalized_item_fields,
    'empty_item': {
      key: empty_value_for_type(item_definition['type'])
      for key, item_definition in normalized_item_fields.items()
    },
  }


def _f(label: str, field_type: str = 'text', default: Any = '') -> dict[str, Any]:
  """Compact item-field helper for repeaters."""
  return {'label': label, 'type': field_type, 'default': default}


# --------------------------------------------------------------------------
# Best Metall section schema — every editable piece of the website
# --------------------------------------------------------------------------

def build_section_definitions() -> 'OrderedDict[str, dict[str, Any]]':
  nav_links = [
    {'label': 'Kompaniya haqida', 'link': '#about'},
    {'label': 'Xizmatlar', 'link': '#services'},
    {'label': 'Uskunalar', 'link': '#equipment'},
    {'label': 'Jarayon', 'link': '#process'},
    {'label': 'Loyihalar', 'link': '#projects'},
    {'label': "Bog'lanish", 'link': '#contact'},
  ]

  hero_stats = [
    {'number': '150', 'suffix': '+', 'label': 'Mijozlar'},
    {'number': '17', 'suffix': '', 'label': 'Yillik tajriba'},
    {'number': '120', 'suffix': '+', 'label': 'Loyihalar'},
    {'number': '100', 'suffix': '%', 'label': 'Sifat'},
  ]

  marquee_items = [
    {'label': 'LAZER KESISH'},
    {'label': 'CNC ISHLOV'},
    {'label': 'TIG / MIG PAYVANDLASH'},
    {'label': "KUKUNLI BO'YASH"},
    {'label': 'LIST EGISH'},
    {'label': 'LOYIHALASH'},
  ]

  about_features = [
    {'num': '[01]', 'title': '17+ yillik tajriba', 'desc': 'Metall konstruksiyalar bozorida 17 yildan ortiq tajriba'},
    {'num': '[02]', 'title': 'Zamonaviy uskunalar', 'desc': "Lazer kesish, CNC dastgohlar, kukunli bo'yash"},
    {'num': '[03]', 'title': 'Sifat kafolati', 'desc': 'Ishlab chiqarishning barcha bosqichlarida 100% nazorat'},
    {'num': '[04]', 'title': 'Aniq muddat', 'desc': "Ishni kechikishlarsiz, o'z vaqtida bajaramiz"},
  ]

  service_cards = [
    {
      'ref': '[SVC-01]', 'title': 'Zanglamaydigan panjaralar',
      'desc': "Zinapoyalar, balkonlar va terassalar uchun zanglamaydigan po'latdan panjaralar va tutqichlar.",
      'tag1': 'LASER', 'tag2': 'WELDED', 'tag3': 'STAINLESS 304',
    },
    {
      'ref': '[SVC-02]', 'title': 'Zinapoyalar va marshlar',
      'desc': 'Har qanday murakkablikdagi metall zinapoyalar: vintli, marshli, monokosourli.',
      'tag1': 'CNC', 'tag2': 'WELDED', 'tag3': 'POWDER COATED',
    },
    {
      'ref': '[SVC-03]', 'title': 'LOFT mebel',
      'desc': 'Uy va ofis uchun loft uslubidagi stol, stul, javon va boshqa mebellar.',
      'tag1': 'LASER', 'tag2': 'WELDED', 'tag3': 'COATED',
    },
    {
      'ref': '[SVC-04]', 'title': 'Oshxona mebellari',
      'desc': 'Metalldan tayyorlangan oshxona mebellari uchun karkas va butlovchi qismlar.',
      'tag1': 'LASER', 'tag2': 'CNC', 'tag3': 'STAINLESS',
    },
    {
      'ref': '[SVC-05]', 'title': 'Eshik va darvozalar',
      'desc': 'Kukunli qoplamali metall eshiklar, darvozalar, kichik darvozalar va panjaralar.',
      'tag1': 'WELDED', 'tag2': 'POWDER COATED', 'tag3': 'RAL FULL',
    },
    {
      'ref': '[SVC-06]', 'title': 'Metall konstruksiyalar',
      'desc': "Yuk ko'taruvchi konstruksiyalar, angarlar, soyabonlar va bino karkaslari.",
      'tag1': 'LASER', 'tag2': 'WELDED', 'tag3': 'STRUCTURAL',
    },
  ]

  service_tags = [
    {'label': 'Lazer kesish'},
    {'label': 'Listli metallni egish'},
    {'label': 'Payvandlash ishlari'},
    {'label': "Kukunli bo'yash"},
  ]

  equipment_cards = [
    {
      'ref': '[EQ-01] · LASER', 'title': 'Lazer kesgich', 'model': 'CO₂ · 3 kVt · stol 1500×3000 mm',
      'spec1_label': 'Aniqlik', 'spec1_value': '±0.1 mm',
      'spec2_label': 'Qalinligi', 'spec2_value': '20 mm gacha',
      'spec3_label': 'Material', 'spec3_value': "po'lat / zanglamas",
    },
    {
      'ref': '[EQ-02] · CNC', 'title': 'CNC ishlov berish', 'model': "5 o'q · ruxsat ±0.01 mm",
      'spec1_label': 'Ish maydoni', 'spec1_value': '600×400×500 mm',
      'spec2_label': 'Asbob almashinuvi', 'spec2_value': 'avtomatik',
      'spec3_label': 'Material', 'spec3_value': "po'lat / alyuminiy",
    },
    {
      'ref': '[EQ-03] · WELD', 'title': 'TIG / MIG payvandlash', 'model': 'Multi-process · 400 A',
      'spec1_label': 'Qalinligi', 'spec1_value': '12 mm gacha',
      'spec2_label': 'Material', 'spec2_value': "po'lat / zanglamas / alyuminiy",
      'spec3_label': 'Sertifikat', 'spec3_value': '5-razryad payvandchilar',
    },
    {
      'ref': '[EQ-04] · COAT', 'title': "Kukunli bo'yash", 'model': 'Sanoat kamerasi · 200°C',
      'spec1_label': 'Palitra', 'spec1_value': "RAL to'liq spektr",
      'spec2_label': 'Himoya', 'spec2_value': 'zanglashga qarshi',
      'spec3_label': "Detal o'lchami", 'spec3_value': '2 m gacha',
    },
  ]

  process_steps = [
    {'title': 'Loyihalash', 'desc': 'Sizning barcha talab va istaklaringizni hisobga olgan holda batafsil loyiha ishlab chiqamiz.'},
    {'title': 'Muhandislik', 'desc': "Ishchi hujjatlarni tayyorlaymiz va mustahkamlik bo'yicha muhandislik hisob-kitoblarini bajaramiz."},
    {'title': 'Ishlab chiqarish', 'desc': 'Zamonaviy uskunalarda detallarni millimetr aniqligida tayyorlaymiz.'},
    {'title': "Yig'ish", 'desc': "Konstruksiyalarni ishlab chiqarishda yig'amiz va sifat nazoratidan o'tkazamiz."},
    {'title': "O'rnatish", 'desc': "Tayyor konstruksiyalarni sizning ob'ektingizga yetkazib beramiz va o'rnatamiz."},
  ]

  project_items = [
    {
      'ref': '[PRJ-001]', 'caption': 'Zinapoya marshi · 2024', 'category': 'Zinapoyalar',
      'title': 'Xususiy uy uchun vintli zinapoya', 'year': '2024', 'location': 'Namangan',
      'material': "Zanglamas po'lat · shisha", 'image': '',
    },
    {
      'ref': '[PRJ-002]', 'caption': 'Panjara · 2023', 'category': 'Panjaralar',
      'title': 'Savdo markazi uchun panjaralar', 'year': '2023', 'location': "Farg'ona",
      'material': "Zanglamas po'lat", 'image': '',
    },
    {
      'ref': '[PRJ-003]', 'caption': 'LOFT mebel · 2024', 'category': 'Mebel',
      'title': 'LOFT uslubidagi ofis mebeli', 'year': '2024', 'location': 'Toshkent',
      'material': "Po'lat · eman", 'image': '',
    },
    {
      'ref': '[PRJ-004]', 'caption': 'Darvozalar · 2023', 'category': 'Darvozalar',
      'title': 'Avtomatik darvozalar', 'year': '2023', 'location': 'Namangan',
      'material': "Po'lat · kukun", 'image': '',
    },
    {
      'ref': '[PRJ-005]', 'caption': 'Ombor karkasi · 2024', 'category': 'Metall konstruksiyalar',
      'title': '2000 m² ombor uchun yuk karkasi', 'year': '2024', 'location': 'Namangan',
      'material': '2000 m²', 'image': '',
    },
  ]

  metric_items = [
    {'number': '120', 'suffix': '+', 'label': 'Loyihalar'},
    {'number': '17', 'suffix': '', 'label': 'Yillik tajriba'},
    {'number': '24', 'suffix': '/7', 'label': 'Yordam'},
    {'number': '100', 'suffix': '%', 'label': 'Aniqlik'},
  ]

  testimonial_items = [
    {
      'quote': "Vintli zinapoyani buyurtma qildik — natija kutganimizdan ham yaxshi chiqdi. Aniq o'lchamlar, toza payvand, o'rnatish o'z vaqtida bo'ldi.",
      'name': 'Akmal R.', 'role': 'Xususiy uy egasi · Namangan', 'avatar': 'A',
    },
    {
      'quote': "Savdo markazimiz uchun panjaralar yasatdik. Sifat va dizayn a'lo, narx esa adolatli. Endi barcha metall ishlarini shu yerda qilamiz.",
      'name': 'Dilshod T.', 'role': "Qurilish menejeri · Farg'ona", 'avatar': 'D',
    },
    {
      'quote': 'Ofisimiz uchun LOFT mebel buyurtma qildik. Chizmadan tortib o\'rnatishgacha hamma narsa professional darajada bajarildi. Tavsiya qilaman.',
      'name': 'Madina X.', 'role': 'Ofis rahbari · Toshkent', 'avatar': 'M',
    },
  ]

  hours_items = [
    {'day': 'Du – Ju', 'time': '09:00 – 18:00'},
    {'day': 'Sh', 'time': '09:00 – 14:00'},
    {'day': 'Ya', 'time': 'Dam olish kuni'},
  ]

  footer_nav = [
    {'label': 'Kompaniya haqida', 'link': '#about'},
    {'label': 'Xizmatlar', 'link': '#services'},
    {'label': 'Uskunalar', 'link': '#equipment'},
    {'label': 'Loyihalar', 'link': '#projects'},
    {'label': 'Aloqalar', 'link': '#contact'},
  ]

  footer_certs = [
    {'label': '[EST. 2008]'},
    {'label': '[NAMANGAN · UZ]'},
    {'label': '[QC PASSED]'},
    {'label': '[17+ YEARS]'},
  ]

  sections: 'OrderedDict[str, dict[str, Any]]' = OrderedDict({
    'header': {
      'label': 'Header & Navigation',
      'fields': OrderedDict({
        'techbar_est': field('Tech-bar: founded', default='2008 yilda asos solingan', group='Top bar'),
        'techbar_location': field('Tech-bar: location', default="Namangan · O'zbekiston", group='Top bar'),
        'techbar_phone': field('Tech-bar: phone (display)', default='+998 99 809 86 12', group='Top bar'),
        'techbar_phone_link': field('Tech-bar: phone (tel: link)', field_type='url', default='tel:+998998098612', group='Top bar'),
        'techbar_hours': field('Tech-bar: hours', default='Du – Sh · 09:00 – 18:00', group='Top bar'),
        'logo_text': field('Logo text (first part)', default='BEST', group='Logo'),
        'logo_text_accent': field('Logo text (accent part)', default='METALL', group='Logo'),
        'nav_links': repeater_field(
          'Menu items', item_label='Menu item',
          item_fields=OrderedDict({'label': _f('Label'), 'link': _f('Link', 'url')}),
          default=nav_links, group='Menu',
        ),
        'nav_cta_text': field('Header button text', default='Loyihani muhokama qilish', group='Menu'),
        'nav_cta_link': field('Header button link', field_type='url', default='#contact', group='Menu'),
      }),
    },
    'hero': {
      'label': 'Hero',
      'fields': OrderedDict({
        'visible': field('Show section', field_type='boolean', default=True, group='Visibility'),
        'tag1': field('Tech label 1', default='[EST. 2008]', group='Tech labels'),
        'tag2': field('Tech label 2', default='[NAMANGAN · UZ]', group='Tech labels'),
        'tag3': field('Tech label 3', default='[REF-BMT-001]', group='Tech labels'),
        'title_line1': field('Title line 1', default="PO'LAT", group='Content'),
        'title_line2': field('Title line 2', default='ANIQLIK', group='Content'),
        'title_line3': field('Title line 3', default='SIFAT', group='Content'),
        'subtitle': field(
          'Subtitle', field_type='textarea',
          default="Biznes va uy uchun yuqori sifatli metall konstruksiyalar. Lazer kesish, payvandlash, kukunli bo'yash — chizmadan o'rnatishgacha.",
          group='Content',
        ),
        'cta_primary_text': field('Primary button text', default='Loyihani muhokama qilish', group='Buttons'),
        'cta_primary_link': field('Primary button link', field_type='url', default='#contact', group='Buttons'),
        'cta_secondary_text': field('Secondary button text', default='Bizning ishlarimiz', group='Buttons'),
        'cta_secondary_link': field('Secondary button link', field_type='url', default='#projects', group='Buttons'),
        'stats': repeater_field(
          'Stats', item_label='Stat',
          item_fields=OrderedDict({'number': _f('Number'), 'suffix': _f('Suffix'), 'label': _f('Label')}),
          default=hero_stats, group='Stats',
        ),
      }),
    },
    'marquee': {
      'label': 'Capability Marquee',
      'fields': OrderedDict({
        'visible': field('Show section', field_type='boolean', default=True, group='Visibility'),
        'items': repeater_field(
          'Marquee items', item_label='Item',
          item_fields=OrderedDict({'label': _f('Text')}),
          default=marquee_items, group='Items',
        ),
      }),
    },
    'about': {
      'label': 'About',
      'fields': OrderedDict({
        'visible': field('Show section', field_type='boolean', default=True, group='Visibility'),
        'label': field('Eyebrow label', default='Kompaniya haqida', group='Content'),
        'title': field('Title', default='Namangandagi metallga ishlov berish yetakchisi', group='Content'),
        'text': field(
          'Text', field_type='textarea',
          default='"Best Metall" MChJ — O\'zbekistondagi yetakchi metall konstruksiyalar ishlab chiqaruvchi kompaniya. 2008 yildan beri sanoat, qurilish va xususiy mijozlar uchun ishonchli yechimlar yaratib kelmoqdamiz.',
          group='Content',
        ),
        'exp_number': field('Experience badge number', default='17+', group='Content'),
        'exp_text': field('Experience badge text', default='yillik tajriba', group='Content'),
        'blueprint_ref': field('Blueprint reference', default='DRG-001 · STAIRCASE TYPE-A', group='Blueprint'),
        'blueprint_scale': field('Blueprint scale', default='SCALE 1:50', group='Blueprint'),
        'features': repeater_field(
          'Feature cards', item_label='Feature',
          item_fields=OrderedDict({'num': _f('Number'), 'title': _f('Title'), 'desc': _f('Description', 'textarea')}),
          default=about_features, group='Features',
        ),
      }),
    },
    'services': {
      'label': 'Services',
      'fields': OrderedDict({
        'visible': field('Show section', field_type='boolean', default=True, group='Visibility'),
        'label': field('Eyebrow label', default='Xizmatlar', group='Content'),
        'title': field('Title', default='Bizning xizmatlarimiz', group='Content'),
        'link_text': field('Card link text', default='Batafsil →', group='Content'),
        'cards': repeater_field(
          'Service cards', item_label='Service',
          item_fields=OrderedDict({
            'ref': _f('Reference code'),
            'title': _f('Title'),
            'desc': _f('Description', 'textarea'),
            'tag1': _f('Tag 1'),
            'tag2': _f('Tag 2'),
            'tag3': _f('Tag 3'),
          }),
          default=service_cards, group='Cards',
        ),
        'additional_label': field('Additional services heading', default="Qo'shimcha xizmatlar", group='Additional'),
        'additional_tags': repeater_field(
          'Additional service tags', item_label='Tag',
          item_fields=OrderedDict({'label': _f('Label')}),
          default=service_tags, group='Additional',
        ),
      }),
    },
    'equipment': {
      'label': 'Equipment',
      'fields': OrderedDict({
        'visible': field('Show section', field_type='boolean', default=True, group='Visibility'),
        'label': field('Eyebrow label', default='Uskunalar', group='Content'),
        'title': field('Title', default='Ustaxonamiz', group='Content'),
        'cards': repeater_field(
          'Equipment cards', item_label='Equipment',
          item_fields=OrderedDict({
            'ref': _f('Reference / type'),
            'title': _f('Title'),
            'model': _f('Model line'),
            'spec1_label': _f('Spec 1 label'), 'spec1_value': _f('Spec 1 value'),
            'spec2_label': _f('Spec 2 label'), 'spec2_value': _f('Spec 2 value'),
            'spec3_label': _f('Spec 3 label'), 'spec3_value': _f('Spec 3 value'),
          }),
          default=equipment_cards, group='Cards',
        ),
      }),
    },
    'process': {
      'label': 'Process',
      'fields': OrderedDict({
        'visible': field('Show section', field_type='boolean', default=True, group='Visibility'),
        'label': field('Eyebrow label', default='Jarayon', group='Content'),
        'title': field('Title', default='Qanday ishlaymiz', group='Content'),
        'steps': repeater_field(
          'Steps', item_label='Step',
          item_fields=OrderedDict({'title': _f('Title'), 'desc': _f('Description', 'textarea')}),
          default=process_steps, group='Steps',
        ),
      }),
    },
    'projects': {
      'label': 'Projects',
      'fields': OrderedDict({
        'visible': field('Show section', field_type='boolean', default=True, group='Visibility'),
        'label': field('Eyebrow label', default='Portfolio', group='Content'),
        'title': field('Title', default='Amalga oshirilgan loyihalar', group='Content'),
        'items': repeater_field(
          'Projects', item_label='Project',
          item_fields=OrderedDict({
            'ref': _f('Reference code'),
            'caption': _f('Placeholder caption'),
            'category': _f('Category'),
            'title': _f('Title'),
            'year': _f('Year'),
            'location': _f('Location'),
            'material': _f('Material / area'),
            'image': _f('Photo', 'image'),
          }),
          default=project_items, group='Projects',
        ),
      }),
    },
    'testimonials': {
      'label': 'Testimonials',
      'fields': OrderedDict({
        'visible': field('Show section', field_type='boolean', default=True, group='Visibility'),
        'label': field('Eyebrow label', default='Mijozlar fikri', group='Content'),
        'title': field('Title', default='Bizga ishonishadi', group='Content'),
        'items': repeater_field(
          'Testimonials', item_label='Testimonial',
          item_fields=OrderedDict({
            'quote': _f('Quote', 'textarea'),
            'name': _f('Name'),
            'role': _f('Role / location'),
            'avatar': _f('Avatar letter'),
          }),
          default=testimonial_items, group='Items',
        ),
      }),
    },
    'metrics': {
      'label': 'Metrics',
      'fields': OrderedDict({
        'visible': field('Show section', field_type='boolean', default=True, group='Visibility'),
        'items': repeater_field(
          'Metrics', item_label='Metric',
          item_fields=OrderedDict({'number': _f('Number'), 'suffix': _f('Suffix'), 'label': _f('Label')}),
          default=metric_items, group='Items',
        ),
      }),
    },
    'cta': {
      'label': 'CTA Banner',
      'fields': OrderedDict({
        'visible': field('Show section', field_type='boolean', default=True, group='Visibility'),
        'label': field('Eyebrow label', default='Loyiha boshlash', group='Content'),
        'title': field('Title', default='Abadiy narsa yarataylik', group='Content'),
        'subtitle': field(
          'Subtitle', field_type='textarea',
          default='Loyihangiz haqida gapirib bering, biz 24 soat ichida shaxsiy taklif tayyorlaymiz.',
          group='Content',
        ),
        'button_text': field('Button text', default='Loyihani boshlash', group='Content'),
        'button_link': field('Button link', field_type='url', default='#contact', group='Content'),
      }),
    },
    'contact': {
      'label': 'Contact',
      'fields': OrderedDict({
        'visible': field('Show section', field_type='boolean', default=True, group='Visibility'),
        'label': field('Eyebrow label', default='Aloqalar', group='Content'),
        'title': field('Title', default='Birga ishlaymiz', group='Content'),
        'text': field(
          'Intro text', field_type='textarea',
          default="Ariza qoldiring yoki biz bilan to'g'ridan-to'g'ri bog'laning. 24 soat ichida javob beramiz.",
          group='Content',
        ),
        'phone_display': field('Phone (display)', default='+998 99 809 86 12', group='Channels'),
        'phone_link': field('Phone (tel: link)', field_type='url', default='tel:+998998098612', group='Channels'),
        'telegram_display': field('Telegram (display)', default='Telegram · @perilauzz', group='Channels'),
        'telegram_link': field('Telegram (link)', field_type='url', default='https://t.me/perilauzz', group='Channels'),
        'whatsapp_display': field('WhatsApp (display)', default='WhatsApp · +998 99 809 86 12', group='Channels'),
        'whatsapp_link': field('WhatsApp (link)', field_type='url', default='https://wa.me/998998098612', group='Channels'),
        'email': field('Email', default='info@bestmetall.uz', group='Channels'),
        'address': field('Address', default='Namangan sh., Sergeli sanoat zonasi', group='Channels'),
        'route_link': field('Route button link', field_type='url', default='https://www.google.com/maps/dir/?api=1&destination=41.0011,71.6726', group='Channels'),
        'hours_label': field('Working hours heading', default='Ish vaqti', group='Working hours'),
        'hours': repeater_field(
          'Working hours', item_label='Row',
          item_fields=OrderedDict({'day': _f('Day(s)'), 'time': _f('Time')}),
          default=hours_items, group='Working hours',
        ),
        'form_title': field('Form title', default='Ariza qoldirish', group='Form'),
        'form_label': field('Form eyebrow', default='Ariza shakli', group='Form'),
        'form_name_label': field('Name field label', default='Ismingiz', group='Form'),
        'form_phone_label': field('Phone field label', default='Telefon', group='Form'),
        'form_project_label': field('Project-type field label', default='Loyiha turi (ixtiyoriy)', group='Form'),
        'form_message_label': field('Message field label', default='Xabar (ixtiyoriy)', group='Form'),
        'form_submit_text': field('Submit button text', default='Ariza yuborish', group='Form'),
        'form_privacy': field('Privacy note', default="Ma'lumotlaringiz faqat siz bilan bog'lanish uchun ishlatiladi.", group='Form'),
      }),
    },
    'footer': {
      'label': 'Footer',
      'fields': OrderedDict({
        'tagline': field('Tagline', default='2008 yildan beri yuqori sifatli metall konstruksiyalar', group='Content'),
        'nav_links': repeater_field(
          'Footer menu', item_label='Link',
          item_fields=OrderedDict({'label': _f('Label'), 'link': _f('Link', 'url')}),
          default=footer_nav, group='Menu',
        ),
        'phone_display': field('Phone (display)', default='+998 99 809 86 12', group='Contact'),
        'phone_link': field('Phone (tel: link)', field_type='url', default='tel:+998998098612', group='Contact'),
        'email': field('Email', default='info@bestmetall.uz', group='Contact'),
        'address': field('Address', default='Namangan sh., Sergeli sanoat zonasi', group='Contact'),
        'certs': repeater_field(
          'Certification badges', item_label='Badge',
          item_fields=OrderedDict({'label': _f('Label')}),
          default=footer_certs, group='Badges',
        ),
        'copyright': field('Copyright', default='© 2026 "Best Metall" MChJ. Barcha huquqlar himoyalangan.', group='Bottom'),
        'credits': field('Credits', default="Olov va po'lat bilan yaratilgan", group='Bottom'),
      }),
    },
  })

  return sections


SECTION_DEFINITIONS = build_section_definitions()


# --------------------------------------------------------------------------
# Database lifecycle
# --------------------------------------------------------------------------

def init_app(app: Flask) -> None:
  DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
  UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
  with sqlite3.connect(DATABASE_PATH) as connection:
    connection.row_factory = sqlite3.Row
    create_tables(connection)
    seed_default_content(connection)
  app.teardown_appcontext(close_db)


def get_db() -> sqlite3.Connection:
  if 'db' not in g:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    g.db = connection
  return g.db


def close_db(_: Exception | None = None) -> None:
  connection = g.pop('db', None)
  if connection is not None:
    connection.close()


def create_tables(connection: sqlite3.Connection) -> None:
  connection.execute(
    '''
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
    ''',
  )
  connection.execute(
    '''
    CREATE TABLE IF NOT EXISTS content_blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_name TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT,
      type TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(section_name, key)
    )
    ''',
  )
  connection.execute(
    '''
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      project_type TEXT,
      message TEXT,
      source_page TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
    ''',
  )
  connection.commit()


def seed_default_content(connection: sqlite3.Connection) -> None:
  timestamp = utcnow()
  for section_name, definition in SECTION_DEFINITIONS.items():
    for key, field_definition in definition['fields'].items():
      connection.execute(
        '''
        INSERT OR IGNORE INTO content_blocks (section_name, key, value, type, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ''',
        (
          section_name,
          key,
          serialize_value(field_definition['type'], deepcopy(field_definition['default'])),
          field_definition['type'],
          timestamp,
        ),
      )
  connection.commit()


# --------------------------------------------------------------------------
# Content read / write
# --------------------------------------------------------------------------

def list_sections() -> list[dict[str, str]]:
  return [
    {'name': section_name, 'label': definition['label']}
    for section_name, definition in SECTION_DEFINITIONS.items()
  ]


def get_section_definition(section_name: str) -> dict[str, Any] | None:
  return SECTION_DEFINITIONS.get(section_name)


def get_all_content(connection: sqlite3.Connection | None = None) -> dict[str, dict[str, Any]]:
  db = connection or get_db()
  rows = db.execute(
    'SELECT section_name, key, value, type FROM content_blocks ORDER BY section_name, id',
  ).fetchall()

  content: dict[str, dict[str, Any]] = {}
  for row in rows:
    definition = SECTION_DEFINITIONS.get(row['section_name'])
    if definition is None or row['key'] not in definition['fields']:
      continue
    field_definition = definition['fields'][row['key']]
    raw_value = deserialize_value(row['type'], row['value'])
    content.setdefault(row['section_name'], {})[row['key']] = normalize_field_value(field_definition, raw_value)

  for section_name, definition in SECTION_DEFINITIONS.items():
    section_content = content.setdefault(section_name, {})
    for key, field_definition in definition['fields'].items():
      section_content.setdefault(key, deepcopy(field_definition['default']))
      section_content[key] = normalize_field_value(field_definition, section_content[key])

  return content


def get_section_content(section_name: str, connection: sqlite3.Connection | None = None) -> dict[str, Any]:
  definition = get_section_definition(section_name)
  if definition is None:
    raise KeyError(section_name)

  section_content = get_all_content(connection).get(section_name, {})
  return {
    key: normalize_field_value(field_definition, deepcopy(section_content.get(key, field_definition['default'])))
    for key, field_definition in definition['fields'].items()
  }


def update_section_content(
  section_name: str,
  payload: dict[str, Any],
  connection: sqlite3.Connection | None = None,
) -> dict[str, Any]:
  definition = get_section_definition(section_name)
  if definition is None:
    raise KeyError(section_name)

  fields = definition['fields']
  unknown_keys = sorted(set(payload) - set(fields))
  if unknown_keys:
    raise ValueError(f'Unknown fields: {", ".join(unknown_keys)}')

  db = connection or get_db()
  timestamp = utcnow()

  for key, raw_value in payload.items():
    field_definition = fields[key]
    serialized = serialize_value(field_definition['type'], raw_value)
    db.execute(
      'UPDATE content_blocks SET value = ?, updated_at = ? WHERE section_name = ? AND key = ?',
      (serialized, timestamp, section_name, key),
    )

  db.commit()
  return get_section_content(section_name, db)


# --------------------------------------------------------------------------
# Value (de)serialization & normalization
# --------------------------------------------------------------------------

def serialize_value(field_type: str, value: Any) -> str:
  if field_type == 'boolean':
    return '1' if is_truthy(value) else '0'
  if field_type == 'repeater':
    return json.dumps(value if isinstance(value, list) else [], ensure_ascii=False)
  if value is None:
    return ''
  return str(value).strip()


def deserialize_value(field_type: str, value: str | None) -> Any:
  if field_type == 'boolean':
    return is_truthy(value)
  if field_type == 'repeater':
    if not value:
      return []
    try:
      loaded = json.loads(value)
    except json.JSONDecodeError:
      return []
    return loaded if isinstance(loaded, list) else []
  return value or ''


def normalize_field_value(field_definition: dict[str, Any], value: Any) -> Any:
  field_type = field_definition['type']

  if field_type == 'repeater':
    item_fields = field_definition.get('item_fields', {})
    normalized_items: list[dict[str, Any]] = []
    for item in (value if isinstance(value, list) else []):
      if not isinstance(item, dict):
        continue
      normalized_item: dict[str, Any] = {}
      for item_key, item_definition in item_fields.items():
        item_value = item.get(item_key, item_definition.get('default'))
        normalized_item[item_key] = normalize_field_value(item_definition, item_value)
      normalized_items.append(normalized_item)
    return normalized_items

  if field_type == 'boolean':
    return is_truthy(value)

  if value is None:
    return ''
  return str(value)


def is_truthy(value: Any) -> bool:
  if isinstance(value, bool):
    return value
  return str(value).strip().lower() in {'1', 'true', 'yes', 'on'}


def utcnow() -> str:
  return datetime.now(timezone.utc).isoformat()


# --------------------------------------------------------------------------
# Contact messages
# --------------------------------------------------------------------------

def save_contact_message(payload: dict[str, Any], connection: sqlite3.Connection | None = None) -> int:
  db = connection or get_db()
  cursor = db.execute(
    '''
    INSERT INTO contact_messages (name, phone, project_type, message, source_page, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ''',
    (
      str(payload.get('name', '')).strip(),
      str(payload.get('phone', '')).strip() or None,
      str(payload.get('project_type', '')).strip() or None,
      str(payload.get('message', '')).strip() or None,
      str(payload.get('source_page', '')).strip(),
      utcnow(),
    ),
  )
  db.commit()
  return int(cursor.lastrowid)
