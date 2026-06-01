from __future__ import annotations

from datetime import datetime, timedelta, timezone
from functools import wraps
from typing import Any, Callable, TypeVar

import bcrypt
import jwt
from flask import Blueprint, current_app, g, jsonify, request

from .database import DATABASE_PATH, utcnow

auth_bp = Blueprint('auth', __name__)

View = TypeVar('View', bound=Callable[..., Any])


def ensure_admin_user(email: str, password: str) -> None:
  import sqlite3

  DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

  with sqlite3.connect(DATABASE_PATH) as connection:
    connection.row_factory = sqlite3.Row
    row = connection.execute('SELECT id FROM users ORDER BY id ASC LIMIT 1').fetchone()
    if row is not None:
      return

    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    connection.execute(
      '''
      INSERT INTO users (email, password_hash, created_at)
      VALUES (?, ?, ?)
      ''',
      (email, password_hash, utcnow()),
    )
    connection.commit()


@auth_bp.post('/api/login')
def login():
  payload = request.get_json(silent=True) or {}
  email = str(payload.get('email', '')).strip().lower()
  password = str(payload.get('password', ''))

  if not email or not password:
    return jsonify({'error': 'Email and password are required.'}), 400

  user = get_admin_user()
  if user is None:
    return jsonify({'error': 'Admin user is not configured.'}), 500

  if email != user['email'].lower():
    return jsonify({'error': 'Invalid email or password.'}), 401

  if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
    return jsonify({'error': 'Invalid email or password.'}), 401

  return jsonify(
    {
      'token': issue_token(user['id'], user['email']),
      'user': {
        'email': user['email'],
      },
    },
  )


def require_auth(view: View) -> View:
  @wraps(view)
  def wrapped(*args: Any, **kwargs: Any):
    header = request.headers.get('Authorization', '')
    if not header.startswith('Bearer '):
      return jsonify({'error': 'Missing bearer token.'}), 401

    token = header.split(' ', 1)[1].strip()
    if not token:
      return jsonify({'error': 'Missing bearer token.'}), 401

    try:
      payload = jwt.decode(
        token,
        current_app.config['JWT_SECRET'],
        algorithms=[current_app.config['JWT_ALGORITHM']],
      )
    except jwt.ExpiredSignatureError:
      return jsonify({'error': 'Token has expired.'}), 401
    except jwt.InvalidTokenError:
      return jsonify({'error': 'Invalid token.'}), 401

    g.current_admin = {
      'id': payload.get('sub'),
      'email': payload.get('email'),
    }
    return view(*args, **kwargs)

  return wrapped  # type: ignore[return-value]


def issue_token(user_id: int, email: str) -> str:
  now = datetime.now(timezone.utc)
  payload = {
    'sub': str(user_id),
    'email': email,
    'iat': int(now.timestamp()),
    'exp': int((now + timedelta(hours=current_app.config['JWT_EXPIRES_HOURS'])).timestamp()),
  }
  return jwt.encode(
    payload,
    current_app.config['JWT_SECRET'],
    algorithm=current_app.config['JWT_ALGORITHM'],
  )


def get_admin_user():
  from .database import get_db

  return get_db().execute('SELECT id, email, password_hash FROM users ORDER BY id ASC LIMIT 1').fetchone()
