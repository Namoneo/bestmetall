/**
 * BEST METALL — CMS loader
 * Fetches /api/content and applies it onto the existing markup.
 * - Singular text:   [data-cms="section.key"]
 * - Attributes:      [data-cms-href], [data-cms-src], [data-cms-alt]
 * - Visibility:      [data-cms-visible="section.key"]
 * - Repeaters:       rebuilt from existing DOM templates via selectors below.
 *
 * If the API is unreachable (e.g. opened as a static file), the page keeps the
 * hard-coded fallback markup untouched.
 */
(function () {
  'use strict';

  function getValue(content, path) {
    return path.split('.').reduce(function (acc, part) {
      if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
        return acc[part];
      }
      return undefined;
    }, content);
  }

  function items(value) {
    return Array.isArray(value) ? value : [];
  }

  function setText(el, value) {
    if (el && value != null) {
      el.textContent = String(value);
    }
  }

  // ---- Singular appliers -------------------------------------------------

  function applyText(content) {
    document.querySelectorAll('[data-cms]').forEach(function (el) {
      var value = getValue(content, el.getAttribute('data-cms'));
      if (value !== undefined && value !== null) {
        el.textContent = String(value);
      }
    });
  }

  function applyAttribute(content, attrName, targetAttr) {
    document.querySelectorAll('[' + attrName + ']').forEach(function (el) {
      var value = getValue(content, el.getAttribute(attrName));
      if (typeof value === 'string' && value) {
        el.setAttribute(targetAttr, value);
      }
    });
  }

  function applyVisibility(content) {
    document.querySelectorAll('[data-cms-visible]').forEach(function (el) {
      var value = getValue(content, el.getAttribute('data-cms-visible'));
      var visible = !(value === false || value === 0 || value === '0' || value === 'false');
      el.style.display = visible ? '' : 'none';
    });
  }

  // ---- Repeater helpers --------------------------------------------------

  function rebuild(container, templateNode, list, fill, removeSelector) {
    if (!container || !templateNode) {
      return;
    }
    var template = templateNode.cloneNode(true);
    // Strip variant modifier classes from the clone so every rebuilt item is
    // styled consistently (e.g. the projects grid mixes base + --large cards).
    var selector = removeSelector || templateBaseSelector(templateNode);
    Array.prototype.slice.call(container.querySelectorAll(selector)).forEach(function (child) {
      if (child.parentNode === container) {
        child.remove();
      }
    });
    items(list).forEach(function (item, index) {
      var node = template.cloneNode(true);
      node.removeAttribute('id');
      fill(node, item, index);
      container.appendChild(node);
    });
  }

  function templateBaseSelector(node) {
    var first = (node.className || '').split(/\s+/).filter(Boolean)[0];
    return first ? '.' + first : node.tagName.toLowerCase();
  }

  function firstChildMatching(container, selector) {
    return container ? container.querySelector(selector) : null;
  }

  // ---- Section renderers -------------------------------------------------

  function renderNav(content) {
    var header = content.header || {};
    // Main nav
    var menu = document.getElementById('navMenu');
    if (menu) {
      var link = menu.querySelector('.nav__link');
      rebuild(menu, link, header.nav_links, function (node, item) {
        node.setAttribute('href', item.link || '#');
        node.removeAttribute('data-i18n');
        setText(node, item.label);
      });
    }
    // Footer nav
    var footerNav = document.querySelector('.footer__nav');
    if (footerNav && (content.footer || {}).nav_links) {
      var fLink = footerNav.querySelector('a');
      rebuild(footerNav, fLink, content.footer.nav_links, function (node, item) {
        node.setAttribute('href', item.link || '#');
        node.removeAttribute('data-i18n');
        setText(node, item.label);
      });
    }
  }

  function renderHeroStats(content) {
    var wrap = document.querySelector('.hero__stats');
    if (!wrap) { return; }
    var card = wrap.querySelector('.hero__stat');
    rebuild(wrap, card, (content.hero || {}).stats, function (node, item, index) {
      var ref = node.querySelector('.tech-label');
      if (ref) { ref.textContent = '[' + String(index + 1).padStart(2, '0') + ']'; }
      var number = node.querySelector('.hero__stat-number');
      if (number) {
        number.setAttribute('data-count', item.number || '0');
        if (item.suffix) { number.setAttribute('data-suffix', item.suffix); }
        number.textContent = '0';
      }
      var label = node.querySelector('.hero__stat-label');
      if (label) { label.removeAttribute('data-i18n'); setText(label, item.label); }
    });
  }

  function renderMarquee(content) {
    var marquee = content.marquee || {};
    document.querySelectorAll('.marquee__track').forEach(function (track) {
      var item = track.querySelector('.marquee__item');
      var sep = track.querySelector('.marquee__sep');
      if (!item) { return; }
      var sepHtml = sep ? sep.outerHTML : '';
      track.innerHTML = '';
      items(marquee.items).forEach(function (entry) {
        var span = item.cloneNode(true);
        span.removeAttribute('data-i18n');
        span.textContent = entry.label || '';
        track.appendChild(span);
        if (sepHtml) { track.insertAdjacentHTML('beforeend', sepHtml); }
      });
    });
  }

  function renderAboutFeatures(content) {
    var wrap = document.querySelector('.about__features');
    if (!wrap) { return; }
    var card = wrap.querySelector('.about__feature');
    rebuild(wrap, card, (content.about || {}).features, function (node, item) {
      var num = node.querySelector('.about__feature-num');
      if (num) { setText(num, item.num); }
      var title = node.querySelector('h4');
      if (title) { title.removeAttribute('data-i18n'); setText(title, item.title); }
      var desc = node.querySelector('p');
      if (desc) { desc.removeAttribute('data-i18n'); setText(desc, item.desc); }
    });
  }

  function renderServices(content) {
    var service = content.service || content.services || {};
    var grid = document.querySelector('.services__grid');
    if (grid) {
      var card = grid.querySelector('.service-card');
      rebuild(grid, card, service.cards, function (node, item) {
        var ref = node.querySelector('.service-card__tech .tech-label');
        if (ref) { setText(ref, item.ref); }
        var title = node.querySelector('.service-card__title');
        if (title) { title.removeAttribute('data-i18n'); setText(title, item.title); }
        var desc = node.querySelector('.service-card__desc');
        if (desc) { desc.removeAttribute('data-i18n'); setText(desc, item.desc); }
        var link = node.querySelector('.service-card__link');
        if (link) { link.removeAttribute('data-i18n'); setText(link, service.link_text || link.textContent); }
        var tags = node.querySelectorAll('.spec-tag');
        [item.tag1, item.tag2, item.tag3].forEach(function (tag, i) {
          if (tags[i]) { tags[i].textContent = tag || ''; tags[i].style.display = tag ? '' : 'none'; }
        });
      });
    }
    // Additional tags
    var tagWrap = document.querySelector('.services__tags');
    if (tagWrap) {
      var tag = tagWrap.querySelector('.tag');
      rebuild(tagWrap, tag, service.additional_tags, function (node, item) {
        node.removeAttribute('data-i18n');
        setText(node, item.label);
      });
    }
  }

  function renderEquipment(content) {
    var grid = document.querySelector('.equipment__grid');
    if (!grid) { return; }
    var card = grid.querySelector('.equipment-card');
    rebuild(grid, card, (content.equipment || {}).cards, function (node, item) {
      var ref = node.querySelector('.equipment-card__body .tech-label');
      if (ref) { setText(ref, item.ref); }
      var title = node.querySelector('.equipment-card__title');
      if (title) { title.removeAttribute('data-i18n'); setText(title, item.title); }
      var model = node.querySelector('.equipment-card__model');
      if (model) { model.removeAttribute('data-i18n'); setText(model, item.model); }
      var specs = node.querySelectorAll('.equipment-card__specs li');
      [
        [item.spec1_label, item.spec1_value],
        [item.spec2_label, item.spec2_value],
        [item.spec3_label, item.spec3_value],
      ].forEach(function (pair, i) {
        if (!specs[i]) { return; }
        var label = specs[i].querySelector('span');
        var value = specs[i].querySelector('strong');
        if (label) { label.removeAttribute('data-i18n'); setText(label, pair[0]); }
        if (value) { value.removeAttribute('data-i18n'); setText(value, pair[1]); }
      });
    });
  }

  function renderProcess(content) {
    var timeline = document.querySelector('.process__timeline');
    if (!timeline) { return; }
    var step = timeline.querySelector('.process__step');
    rebuild(timeline, step, (content.process || {}).steps, function (node, item, index) {
      var marker = node.querySelector('.process__step-marker');
      if (marker) { marker.textContent = String(index + 1).padStart(2, '0'); }
      var stage = node.querySelector('.tech-label');
      if (stage) { stage.textContent = '[STAGE-' + String(index + 1).padStart(2, '0') + ']'; }
      var title = node.querySelector('.process__step-title');
      if (title) { title.removeAttribute('data-i18n'); setText(title, item.title); }
      var desc = node.querySelector('.process__step-desc');
      if (desc) { desc.removeAttribute('data-i18n'); setText(desc, item.desc); }
      node.setAttribute('data-step', index + 1);
    });
  }

  function renderProjects(content) {
    var grid = document.querySelector('.projects__grid');
    if (!grid) { return; }
    var card = grid.querySelector('.project-card');
    rebuild(grid, card, (content.projects || {}).items, function (node, item, index) {
      // First and last cards span wide in the original layout; mirror that.
      var list = (content.projects || {}).items || [];
      node.classList.toggle('project-card--large', index === 0 || index === list.length - 1);
      var ref = node.querySelector('.photo-slot .tech-label');
      if (ref) { setText(ref, item.ref); }
      var caption = node.querySelector('.photo-slot__caption');
      if (caption) { setText(caption, item.caption); }
      var slot = node.querySelector('.photo-slot');
      if (slot && item.image) {
        slot.setAttribute('data-photo', item.image);
        slot.setAttribute('data-alt', item.title || '');
      }
      var category = node.querySelector('.project-card__category');
      if (category) { category.removeAttribute('data-i18n'); setText(category, item.category); }
      var title = node.querySelector('.project-card__title');
      if (title) { title.removeAttribute('data-i18n'); setText(title, item.title); }
      var dds = node.querySelectorAll('.project-card__specs dd');
      var dts = node.querySelectorAll('.project-card__specs dt');
      [item.year, item.location, item.material].forEach(function (val, i) {
        if (dds[i]) { dds[i].removeAttribute('data-i18n'); setText(dds[i], val); }
        if (dts[i]) { dts[i].removeAttribute('data-i18n'); }
      });
    });
  }

  function renderTestimonials(content) {
    var grid = document.querySelector('.testimonials__grid');
    if (!grid) { return; }
    var card = grid.querySelector('.testimonial');
    rebuild(grid, card, (content.testimonials || {}).items, function (node, item) {
      var quote = node.querySelector('.testimonial__quote');
      if (quote) { setText(quote, item.quote); }
      var name = node.querySelector('.testimonial__meta strong');
      if (name) { setText(name, item.name); }
      var role = node.querySelector('.testimonial__role');
      if (role) { setText(role, item.role); }
      var avatar = node.querySelector('.testimonial__avatar');
      if (avatar) { setText(avatar, item.avatar); }
    });
  }

  function renderMetrics(content) {
    var grid = document.querySelector('.metrics__grid');
    if (!grid) { return; }
    var card = grid.querySelector('.metric-card');
    rebuild(grid, card, (content.metrics || {}).items, function (node, item, index) {
      var ref = node.querySelector('.metric-card__tech .tech-label');
      if (ref) { ref.textContent = '[M-' + String(index + 1).padStart(2, '0') + ']'; }
      var number = node.querySelector('.metric-card__number');
      if (number) { number.setAttribute('data-count', item.number || '0'); number.textContent = '0'; }
      var suffix = node.querySelector('.metric-card__suffix');
      if (suffix) { suffix.textContent = item.suffix || ''; suffix.style.display = item.suffix ? '' : 'none'; }
      var label = node.querySelector('.metric-card__label');
      if (label) { label.removeAttribute('data-i18n'); setText(label, item.label); }
    });
  }

  function renderHours(content) {
    var wrap = document.querySelector('.contact__hours ul');
    if (!wrap) { return; }
    var row = wrap.querySelector('li');
    rebuild(wrap, row, (content.contact || {}).hours, function (node, item) {
      var day = node.querySelector('span');
      var time = node.querySelector('strong');
      if (day) { day.removeAttribute('data-i18n'); setText(day, item.day); }
      if (time) { time.removeAttribute('data-i18n'); setText(time, item.time); }
    });
  }

  function renderFooterCerts(content) {
    var wrap = document.querySelector('.footer__certs');
    if (!wrap) { return; }
    var badge = wrap.querySelector('.tech-label');
    rebuild(wrap, badge, (content.footer || {}).certs, function (node, item) {
      setText(node, item.label);
    });
  }

  // ---- Orchestration -----------------------------------------------------

  function applyContent(content) {
    applyText(content);
    applyAttribute(content, 'data-cms-href', 'href');
    applyAttribute(content, 'data-cms-src', 'src');
    applyAttribute(content, 'data-cms-alt', 'alt');
    applyVisibility(content);

    renderNav(content);
    renderHeroStats(content);
    renderMarquee(content);
    renderAboutFeatures(content);
    renderServices(content);
    renderEquipment(content);
    renderProcess(content);
    renderProjects(content);
    renderTestimonials(content);
    renderMetrics(content);
    renderHours(content);
    renderFooterCerts(content);

    // Re-run counter + gallery setup now that repeater nodes exist.
    document.dispatchEvent(new CustomEvent('cms:content-applied', { detail: content }));
  }

  function load() {
    fetch('/api/content', { headers: { Accept: 'application/json' } })
      .then(function (response) {
        if (!response.ok) { throw new Error('CMS content unavailable'); }
        return response.json();
      })
      .then(applyContent)
      .catch(function (error) {
        // Static fallback: leave the hard-coded markup in place.
        if (window.console) { console.info('CMS loader: using static fallback —', error.message); }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
