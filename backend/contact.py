from __future__ import annotations

import json
from urllib import error as urllib_error
from urllib import request as urllib_request

from flask import Blueprint, current_app, jsonify, request

from .database import save_contact_message

contact_bp = Blueprint('contact', __name__)


@contact_bp.post('/api/contact')
def submit_contact():
  payload = extract_payload()

  name = str(payload.get('name', '')).strip()
  phone = str(payload.get('phone', '')).strip()
  message = str(payload.get('message', '')).strip()
  project_type = str(payload.get('projectType', payload.get('project_type', ''))).strip()
  source_page = str(payload.get('page', payload.get('source_page', ''))).strip()
  honeypot = str(payload.get('company', '')).strip()

  # Honeypot: silently accept bot submissions without storing/notifying.
  if honeypot:
    return jsonify({'ok': True}), 200

  if len(name) < 2 or len(phone.replace(' ', '').replace('-', '')) < 7:
    return jsonify({'error': 'Invalid contact submission.'}), 400

  submission_id = save_contact_message(
    {
      'name': name,
      'phone': phone,
      'project_type': project_type,
      'message': message,
      'source_page': source_page or '/',
    },
  )

  notification_sent = send_to_telegram(
    {
      'name': name,
      'phone': phone,
      'project_type': project_type,
      'message': message,
      'source_page': source_page or '/',
    },
  )

  return jsonify({'ok': True, 'id': submission_id, 'notificationSent': notification_sent}), 201


def extract_payload() -> dict[str, object]:
  if request.is_json:
    return request.get_json(silent=True) or {}
  return request.form.to_dict()


def escape_html(value: object) -> str:
  return (
    str(value)
    .replace('&', '&amp;')
    .replace('<', '&lt;')
    .replace('>', '&gt;')
  )


def send_to_telegram(payload: dict[str, object]) -> bool:
  token = str(current_app.config.get('TELEGRAM_BOT_TOKEN', '')).strip()
  chat_id = str(current_app.config.get('TELEGRAM_CHAT_ID', '')).strip()
  if not token or not chat_id:
    return False

  lines = [
    '\U0001F527 <b>Yangi ariza — Best Metall</b>',
    '',
    f"\U0001F464 <b>Ism:</b> {escape_html(payload.get('name', ''))}",
    f"\U0001F4DE <b>Telefon:</b> {escape_html(payload.get('phone', ''))}",
  ]

  project_type = str(payload.get('project_type', '')).strip()
  if project_type:
    lines.append(f'\U0001F3D7 <b>Loyiha:</b> {escape_html(project_type)}')

  message = str(payload.get('message', '')).strip()
  if message:
    lines.append(f'\U0001F4AC <b>Xabar:</b> {escape_html(message)}')

  source_page = str(payload.get('source_page', '')).strip()
  if source_page:
    lines.append('')
    lines.append(f'\U0001F517 {escape_html(source_page)}')

  request_payload = json.dumps(
    {
      'chat_id': chat_id,
      'text': '\n'.join(lines),
      'parse_mode': 'HTML',
      'disable_web_page_preview': True,
    },
  ).encode('utf-8')

  timeout = float(current_app.config.get('TELEGRAM_TIMEOUT_SECONDS', 8))
  url = f'https://api.telegram.org/bot{token}/sendMessage'

  try:
    telegram_request = urllib_request.Request(
      url,
      data=request_payload,
      headers={'Content-Type': 'application/json'},
      method='POST',
    )
    with urllib_request.urlopen(telegram_request, timeout=timeout) as response:
      return 200 <= getattr(response, 'status', 200) < 300
  except urllib_error.URLError:
    current_app.logger.exception('Failed to send contact notification to Telegram.')
    return False
