from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

from .auth import require_auth
from .database import UPLOADS_DIR

upload_bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}


@upload_bp.post('/api/upload')
@require_auth
def upload_file():
  if 'file' not in request.files:
    return jsonify({'error': 'Missing file upload.'}), 400

  file = request.files['file']
  if not file or not file.filename:
    return jsonify({'error': 'Missing file upload.'}), 400

  filename = secure_filename(file.filename)
  extension = Path(filename).suffix.lower().lstrip('.')
  if extension not in ALLOWED_EXTENSIONS:
    return jsonify({'error': 'Unsupported file type.'}), 400

  unique_name = f'{uuid4().hex}.{extension}'
  destination = UPLOADS_DIR / unique_name
  file.save(destination)

  return jsonify(
    {
      'url': f"/uploads/{unique_name}",
      'filename': unique_name,
    },
  )
