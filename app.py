from __future__ import annotations

import os

from flask import Flask, abort, make_response, redirect, render_template, request, send_from_directory

from backend.auth import auth_bp, ensure_admin_user
from backend.contact import contact_bp
from backend.content import content_bp
from backend.database import SECTION_DEFINITIONS, UPLOADS_DIR, WEBSITE_DIR, init_app, list_sections
from backend.upload import upload_bp


def create_app() -> Flask:
  app = Flask(__name__, template_folder='admin', static_folder=None)
  app.config.update(
    SECRET_KEY=os.getenv('SECRET_KEY', 'change-me'),
    JWT_SECRET=os.getenv('JWT_SECRET', os.getenv('SECRET_KEY', 'change-me')),
    JWT_ALGORITHM='HS256',
    JWT_EXPIRES_HOURS=int(os.getenv('JWT_EXPIRES_HOURS', '12')),
    ADMIN_EMAIL=os.getenv('ADMIN_EMAIL', 'admin@bestmetall.uz'),
    ADMIN_PASSWORD=os.getenv('ADMIN_PASSWORD', 'ChangeMe123!'),
    ALLOWED_ORIGINS=split_env_list(os.getenv('CMS_ALLOWED_ORIGINS', '')),
    MAX_CONTENT_LENGTH=int(os.getenv('MAX_CONTENT_LENGTH', str(5 * 1024 * 1024))),
    TELEGRAM_BOT_TOKEN=os.getenv('TELEGRAM_BOT_TOKEN', ''),
    TELEGRAM_CHAT_ID=os.getenv('TELEGRAM_CHAT_ID', ''),
    TELEGRAM_TIMEOUT_SECONDS=float(os.getenv('TELEGRAM_TIMEOUT_SECONDS', '8')),
  )

  init_app(app)
  ensure_admin_user(app.config['ADMIN_EMAIL'], app.config['ADMIN_PASSWORD'])

  app.register_blueprint(auth_bp)
  app.register_blueprint(contact_bp)
  app.register_blueprint(content_bp)
  app.register_blueprint(upload_bp)

  register_admin_routes(app)
  register_static_routes(app)
  register_cors(app)

  return app


def register_admin_routes(app: Flask) -> None:
  @app.route('/admin')
  def admin_root():
    return redirect('/admin/dashboard')

  @app.route('/admin/login')
  def admin_login():
    return render_template('login.html')

  @app.route('/admin/dashboard')
  def admin_dashboard():
    return render_template('dashboard.html', sections=list_sections())

  @app.route('/admin/editor')
  def admin_editor():
    section_name = request.args.get('section', '').strip()
    definition = SECTION_DEFINITIONS.get(section_name)
    if definition is None:
      return redirect('/admin/dashboard')

    return render_template(
      'editor.html',
      section_name=section_name,
      section_label=definition['label'],
      section_definition=definition,
      field_groups=group_fields(definition['fields']),
      sections=list_sections(),
    )


def register_static_routes(app: Flask) -> None:
  @app.route('/uploads/<path:filename>')
  def uploaded_files(filename: str):
    return send_from_directory(UPLOADS_DIR, filename)

  @app.route('/')
  def website_index():
    return send_from_directory(WEBSITE_DIR, 'index.html')

  @app.route('/<path:filename>')
  def website_files(filename: str):
    file_path = (WEBSITE_DIR / filename).resolve()
    if not str(file_path).startswith(str(WEBSITE_DIR.resolve())):
      abort(404)
    if not file_path.exists() or file_path.is_dir():
      abort(404)
    return send_from_directory(WEBSITE_DIR, filename)


def register_cors(app: Flask) -> None:
  @app.after_request
  def apply_cors_headers(response):
    origin = request.headers.get('Origin', '')
    if origin and origin in app.config['ALLOWED_ORIGINS']:
      response.headers['Access-Control-Allow-Origin'] = origin
      response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
      response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
      response.headers['Vary'] = 'Origin'

    return response

  @app.route('/api/<path:_path>', methods=['OPTIONS'])
  def api_options(_path: str):
    return make_response('', 204)


def split_env_list(raw: str) -> list[str]:
  return [item.strip() for item in raw.split(',') if item.strip()]


def group_fields(fields: dict[str, dict[str, str]]):
  grouped: dict[str, list[dict[str, str]]] = {}
  for key, field_definition in fields.items():
    group = field_definition['group']
    grouped.setdefault(group, []).append(
      {
        'key': key,
        **field_definition,
      },
    )

  return [{'label': label, 'fields': items} for label, items in grouped.items()]


app = create_app()
application = app


if __name__ == '__main__':
  app.run(debug=os.getenv('FLASK_DEBUG', '0') == '1', port=int(os.getenv('PORT', '5000')))
