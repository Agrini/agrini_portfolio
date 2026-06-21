async function getContent() {
  const res = await fetch('data/content.json');
  if (!res.ok) throw new Error('Could not load data/content.json — are you viewing this through a local server (not by double-clicking the file)?');
  return res.json();
}

function setLink(el, url) {
  if (!el) return;
  if (url) {
    el.href = url;
  } else {
    el.setAttribute('aria-disabled', 'true');
    el.style.opacity = '0.4';
    el.style.pointerEvents = 'none';
  }
}

function renderLanding(landing) {
  document.getElementById('eyebrow-role').textContent = landing.current_role || '';
  document.getElementById('name-first').textContent = landing.name_first;
  document.getElementById('name-last').textContent = landing.name_last;
  document.getElementById('tagline').textContent = landing.tagline;
  document.getElementById('annotation').textContent = landing.annotation || '';
  document.getElementById('intro').textContent = landing.intro;

  const photo = document.getElementById('profile-photo');
  photo.src = landing.photo;
  photo.alt = landing.photo_alt || '';

  setLink(document.getElementById('link-linkedin'), landing.links.linkedin);
  setLink(document.getElementById('link-behance'), landing.links.behance);
  setLink(document.getElementById('link-cv'), landing.links.cv);
  setLink(document.getElementById('nav-linkedin'), landing.links.linkedin);
  setLink(document.getElementById('nav-behance'), landing.links.behance);
}

function renderFolderPreview(items, titleKey, listId) {
  const list = document.getElementById(listId);
  list.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item[titleKey];
    list.appendChild(li);
  });
}

function projectCard(item) {
  const card = document.createElement('article');
  card.className = 'card';

  if (item.image) {
    const figure = document.createElement('div');
    figure.className = 'card__image';
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title;
    img.loading = 'lazy';
    figure.appendChild(img);
    card.appendChild(figure);
  }

  const body = document.createElement('div');
  body.className = 'card__body';

  const title = document.createElement('h3');
  title.className = 'card__title';
  title.textContent = item.title;
  body.appendChild(title);

  if (item.subtitle) {
    const sub = document.createElement('p');
    sub.className = 'card__subtitle';
    sub.textContent = item.subtitle;
    body.appendChild(sub);
  }

  const desc = document.createElement('p');
  desc.className = 'card__desc';
  desc.textContent = item.description;
  body.appendChild(desc);

  if (item.tags && item.tags.length) {
    const tagRow = document.createElement('div');
    tagRow.className = 'card__tags';
    item.tags.forEach(tag => {
      const t = document.createElement('span');
      t.className = 'card__tag';
      t.textContent = tag;
      tagRow.appendChild(t);
    });
    body.appendChild(tagRow);
  }

  if (item.link) {
    const link = document.createElement('a');
    link.className = 'card__link';
    link.href = item.link;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = (item.link_label || 'View project') + ' ↗';
    body.appendChild(link);
  } else {
    const soon = document.createElement('span');
    soon.className = 'card__soon';
    soon.textContent = 'Case study — coming soon';
    body.appendChild(soon);
  }

  card.appendChild(body);
  return card;
}

function questCard(item) {
  const card = document.createElement('article');
  card.className = 'card card--quest' + (item.placeholder ? ' card--placeholder' : '');

  const body = document.createElement('div');
  body.className = 'card__body';

  const title = document.createElement('h3');
  title.className = 'card__title';
  title.textContent = item.title;
  body.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'card__desc';
  desc.textContent = item.description;
  body.appendChild(desc);

  if (item.link) {
    const link = document.createElement('a');
    link.className = 'card__link';
    link.href = item.link;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = (item.link_label || 'View project') + ' ↗';
    body.appendChild(link);
  } else if (item.placeholder) {
    const soon = document.createElement('span');
    soon.className = 'card__soon';
    soon.textContent = 'Coming soon';
    body.appendChild(soon);
  }

  card.appendChild(body);
  return card;
}

function renderProjects(data) {
  document.getElementById('projects-eyebrow').textContent = data.eyebrow;
  document.getElementById('projects-intro').textContent = data.intro;
  const wrap = document.getElementById('projects-cards');
  wrap.innerHTML = '';
  data.items.forEach(item => wrap.appendChild(projectCard(item)));
}

function renderQuests(data) {
  document.getElementById('quests-eyebrow').textContent = data.eyebrow;
  document.getElementById('quests-intro').textContent = data.intro;
  const wrap = document.getElementById('quests-cards');
  wrap.innerHTML = '';
  data.items.forEach(item => wrap.appendChild(questCard(item)));
}

function renderFolderTags(content) {
  document.getElementById('projects-caption').textContent = content.projects.intro;
  document.getElementById('quests-caption').textContent = content.side_quests.intro;
}

(async function init() {
  try {
    const content = await getContent();
    renderLanding(content.landing);
    renderFolderPreview(content.projects.items, 'title', 'projects-list');
    renderFolderPreview(content.side_quests.items, 'title', 'quests-list');
    renderFolderTags(content);
    renderProjects(content.projects);
    renderQuests(content.side_quests);
  } catch (err) {
    console.error(err);
    document.body.insertAdjacentHTML('afterbegin',
      '<div style="background:#E2643A;color:#fff;padding:14px 20px;font-family:monospace;font-size:13px;">' +
      'Could not load site content: ' + err.message +
      '</div>');
  }
})();

