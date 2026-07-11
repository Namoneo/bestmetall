from __future__ import annotations

from typing import Any

from flask import Blueprint, jsonify, request

from .auth import require_auth
from .database import (
  get_all_content,
  get_section_content,
  get_section_definition,
  list_sections,
  update_section_content,
)

content_bp = Blueprint('content', __name__)


@content_bp.get('/api/content')
def content_index():
  return jsonify(get_all_content())


@content_bp.get('/api/content/<section_name>')
@require_auth
def content_section(section_name: str):
  if get_section_definition(section_name) is None:
    return jsonify({'error': 'Section not found.'}), 404

  return jsonify(
    {
      'section': section_name,
      'data': get_section_content(section_name),
    },
  )


@content_bp.put('/api/content/<section_name>')
@require_auth
def content_update(section_name: str):
  definition = get_section_definition(section_name)
  if definition is None:
    return jsonify({'error': 'Section not found.'}), 404

  payload = request.get_json(silent=True)
  if not isinstance(payload, dict):
    return jsonify({'error': 'Expected a JSON object.'}), 400

  try:
    cleaned = validate_payload(definition['fields'], payload)
    updated = update_section_content(section_name, cleaned)
  except ValueError as error:
    return jsonify({'error': str(error)}), 400

  return jsonify(
    {
      'section': section_name,
      'data': updated,
    },
  )


@content_bp.get('/api/sections')
@require_auth
def sections_index():
  return jsonify({'sections': list_sections()})


def validate_payload(fields: dict[str, dict[str, Any]], payload: dict[str, Any]) -> dict[str, Any]:
  cleaned: dict[str, Any] = {}

  for key, value in payload.items():
    if key not in fields:
      raise ValueError(f'Unknown field: {key}')

    cleaned[key] = validate_field_value(fields[key], value, key)

  return cleaned


def validate_field_value(field_definition: dict[str, Any], value: Any, path: str) -> Any:
  field_type = field_definition['type']

  if field_type == 'boolean':
    if isinstance(value, bool):
      return value

    if isinstance(value, str) and value.strip().lower() in {'true', 'false', '1', '0', 'yes', 'no', 'on', 'off'}:
      return value.strip().lower() in {'true', '1', 'yes', 'on'}

    raise ValueError(f'Field "{path}" must be a boolean.')

  if field_type == 'repeater':
    if value is None:
      return []

    if not isinstance(value, list):
      raise ValueError(f'Field "{path}" must be a list.')

    cleaned_items: list[dict[str, Any]] = []
    item_fields = field_definition['item_fields']
    for index, item in enumerate(value):
      if not isinstance(item, dict):
        raise ValueError(f'Field "{path}[{index}]" must be an object.')

      unknown_keys = sorted(set(item) - set(item_fields))
      if unknown_keys:
        raise ValueError(f'Unknown fields in "{path}[{index}]": {", ".join(unknown_keys)}')

      cleaned_item: dict[str, Any] = {}
      for item_key, item_definition in item_fields.items():
        cleaned_item[item_key] = validate_field_value(
          item_definition,
          item.get(item_key),
          f'{path}[{index}].{item_key}',
        )

      if repeater_item_has_content(cleaned_item):
        cleaned_items.append(cleaned_item)

    return cleaned_items

  if value is None:
    return ''

  if isinstance(value, (int, float)):
    return str(value).strip()

  if not isinstance(value, str):
    raise ValueError(f'Field "{path}" must be a string.')

  return value.strip()


def repeater_item_has_content(item: dict[str, Any]) -> bool:
  for value in item.values():
    if isinstance(value, bool) and value:
      return True
    if isinstance(value, str) and value.strip():
      return True
    if value not in (None, '', [], {}):
      return True
  return False
