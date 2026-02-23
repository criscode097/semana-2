'use strict';

// ============================================================
// GESTOR DE PROPIEDADES VACACIONALES
// Dominio: Plataforma de Alquiler Vacacional
//
// Conceptos aplicados (Week-02):
//   ✅ Spread & Rest operators
//   ✅ Default parameters
//   ✅ Array methods: map, filter, reduce, find
//   ✅ Object enhancements (shorthand, computed properties)
//   ✅ Manipulación del DOM
//   ✅ LocalStorage para persistencia
//   ✅ Inmutabilidad y programación funcional
// ============================================================

// ============================================================
// MODELO DE DATOS
// {
//   id:          number   — Date.now()
//   name:        string   — Nombre de la propiedad
//   description: string   — Descripción / notas
//   active:      boolean  — true = disponible, false = ocupada
//   priority:    string   — 'low' | 'medium' | 'high' (categoría de precio)
//   category:    string   — tipo de propiedad
//   price:       number   — precio por noche en USD
//   capacity:    number   — cantidad de huéspedes
//   createdAt:   string   — fecha ISO (solo date)
//   updatedAt:   string|null
// }
// ============================================================

const STORAGE_KEY = 'vacation_rental_v1';

// ============================================================
// HELPERS DE ETIQUETAS
// ============================================================

const CATEGORY_LABELS = {
  apartment: '🏢 Apartamento',
  house:     '🏠 Casa',
  villa:     '🏡 Villa',
  cabin:     '🌲 Cabaña',
  other:     '📌 Otro',
};

const PRIORITY_LABELS = {
  low:    '🟢 Económica',
  medium: '🟡 Estándar',
  high:   '🔴 Premium',
};

// Usando computed properties para el mapeo inverso de íconos de estado
const STATUS_LABELS = {
  active:   '✅ Disponible',
  inactive: '🔴 Ocupada',
};

// ============================================================
// 1. ESTADO GLOBAL — se reemplaza completo, nunca se muta
// ============================================================

let state = {
  items: [],
  filters: { status: 'all', category: 'all', priority: 'all', search: '' },
};

// ============================================================
// 2. PERSISTENCIA
// ============================================================

/**
 * Carga propiedades desde LocalStorage.
 * @returns {Array} Array de propiedades guardadas
 */
function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_err) {
    return [];
  }
}

/**
 * Guarda el array de propiedades en LocalStorage.
 * Usa spread para copiar el array antes de serializar (inmutabilidad).
 * @param {Array} items
 */
function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...items]));
}

/**
 * Construye el estado inicial cargando desde LocalStorage.
 * Usa object shorthand para las propiedades.
 * @returns {Object} Estado inicial
 */
function getInitialState() {
  const items = loadItems();
  const filters = { status: 'all', category: 'all', priority: 'all', search: '' };
  return { items, filters };    // object shorthand
}

// ============================================================
// 3. CRUD — todas las operaciones son inmutables
// ============================================================

/**
 * Crea una nueva propiedad combinando defaults con los datos recibidos.
 * Usa spread operator y default parameters.
 * @param {Object} itemData — datos del formulario
 * @returns {Object} Propiedad lista para agregar al array
 */
function createItem(itemData = {}) {
  const defaults = {
    id:          Date.now(),
    name:        '',
    description: '',
    active:      true,          // disponible por defecto
    priority:    'medium',
    category:    'apartment',
    price:       0,
    capacity:    1,
    createdAt:   new Date().toISOString().slice(0, 10),
    updatedAt:   null,
  };
  // Spread: defaults primero, luego los datos del formulario los sobrescriben
  return { ...defaults, ...itemData };
}

/**
 * Agrega una propiedad al array sin mutar el original.
 * Spread para crear nuevo array.
 * @param {Array} items
 * @param {Object} newItem
 * @returns {Array}
 */
function addItem(items, newItem) {
  return [...items, newItem];
}

/**
 * Actualiza una propiedad por ID usando map.
 * Spread para copiar el objeto y aplicar cambios.
 * @param {Array} items
 * @param {number} id
 * @param {Object} updates
 * @returns {Array}
 */
function updateItem(items, id, updates) {
  return items.map(item =>
    item.id === id
      ? { ...item, ...updates, updatedAt: new Date().toISOString().slice(0, 10) }
      : item
  );
}

/**
 * Elimina una propiedad por ID usando filter.
 * @param {Array} items
 * @param {number} id
 * @returns {Array}
 */
function deleteItem(items, id) {
  return items.filter(item => item.id !== id);
}

/**
 * Alterna el estado disponible/ocupada de una propiedad.
 * Map + spread para no mutar.
 * @param {Array} items
 * @param {number} id
 * @returns {Array}
 */
function toggleItemActive(items, id) {
  return items.map(item =>
    item.id === id ? { ...item, active: !item.active } : item
  );
}

// ============================================================
// 4. FILTROS Y BÚSQUEDA
// ============================================================

/**
 * Filtra por estado de disponibilidad.
 * Default parameter: status = 'all'
 * @param {Array} items
 * @param {string} status
 * @returns {Array}
 */
function filterByStatus(items, status = 'all') {
  if (status === 'all') return items;
  return items.filter(item => (status === 'active' ? item.active : !item.active));
}

/**
 * Filtra por tipo de propiedad.
 * Default parameter: category = 'all'
 * @param {Array} items
 * @param {string} category
 * @returns {Array}
 */
function filterByCategory(items, category = 'all') {
  if (category === 'all') return items;
  return items.filter(item => item.category === category);
}

/**
 * Filtra por categoría de precio (priority).
 * Default parameter: priority = 'all'
 * @param {Array} items
 * @param {string} priority
 * @returns {Array}
 */
function filterByPriority(items, priority = 'all') {
  if (priority === 'all') return items;
  return items.filter(item => item.priority === priority);
}

/**
 * Busca propiedades por texto en nombre y descripción (case-insensitive).
 * Default parameter: query = ''
 * @param {Array} items
 * @param {string} query
 * @returns {Array}
 */
function searchItems(items, query = '') {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(
    ({ name, description }) =>
      name.toLowerCase().includes(q) ||
      description.toLowerCase().includes(q)
  );
}

/**
 * Aplica todos los filtros encadenados usando reduce.
 * Rest parameter para recibir el objeto de filtros.
 * @param {Array} items
 * @param {Object} filters — { status, category, priority, search }
 * @returns {Array}
 */
function applyFilters(items, { status, category, priority, search } = {}) {
  // Array de funciones de filtro: cada una recibe el acumulado y devuelve el filtrado
  const filterFns = [
    arr => filterByStatus(arr, status),
    arr => filterByCategory(arr, category),
    arr => filterByPriority(arr, priority),
    arr => searchItems(arr, search),
  ];
  return filterFns.reduce((acc, fn) => fn(acc), items);
}

// ============================================================
// 5. ESTADÍSTICAS
// ============================================================

/**
 * Calcula estadísticas generales con reduce.
 * Computed properties para byCategory y byPriority.
 * @param {Array} items
 * @returns {Object} { total, active, inactive, byCategory, byPriority, avgPrice, totalCapacity }
 */
function getStats(items) {
  return items.reduce(
    (acc, item) => {
      const { active, category, priority, price = 0, capacity = 0 } = item;
      return {
        ...acc,
        total:         acc.total + 1,
        active:        acc.active + (active ? 1 : 0),
        inactive:      acc.inactive + (active ? 0 : 1),
        totalPrice:    acc.totalPrice + price,
        totalCapacity: acc.totalCapacity + capacity,
        // Computed property: nombre de categoría dinámico como clave
        byCategory: {
          ...acc.byCategory,
          [category]: (acc.byCategory[category] ?? 0) + 1,
        },
        byPriority: {
          ...acc.byPriority,
          [priority]: (acc.byPriority[priority] ?? 0) + 1,
        },
      };
    },
    { total: 0, active: 0, inactive: 0, totalPrice: 0, totalCapacity: 0, byCategory: {}, byPriority: {} }
  );
}

/**
 * Agrupa propiedades por tipo usando reduce.
 * @param {Array} items
 * @returns {Object}
 */
function getItemsByCategory(items) {
  return items.reduce((acc, { category }) => ({
    ...acc,
    [category]: (acc[category] ?? 0) + 1,
  }), {});
}

// ============================================================
// 6. RENDERIZADO
// ============================================================

/**
 * Renderiza una sola propiedad como string HTML usando template literals.
 * @param {Object} item
 * @returns {string}
 */
function renderItem(item) {
  const { id, name, description, active, priority, category, price, capacity, createdAt, updatedAt } = item;

  const statusLabel  = active ? STATUS_LABELS.active : STATUS_LABELS.inactive;
  const categoryLbl  = CATEGORY_LABELS[category] ?? category;
  const priorityLbl  = PRIORITY_LABELS[priority] ?? priority;
  const priceText    = price    ? `💵 $${price}/noche` : '';
  const capacityText = capacity ? `👥 ${capacity} huéspedes` : '';
  const dateText     = updatedAt
    ? `Editado: ${updatedAt}`
    : `Creado: ${createdAt}`;

  return `
    <div class="item-card ${active ? '' : 'inactive'} priority-${priority}" data-id="${id}">
      <input
        type="checkbox"
        class="item-checkbox"
        ${active ? 'checked' : ''}
        data-action="toggle"
        data-id="${id}"
        title="${active ? 'Marcar como ocupada' : 'Marcar como disponible'}"
      >
      <div class="item-content">
        <h3>${name}</h3>
        ${description ? `<p>${description}</p>` : ''}
        <div class="item-meta">
          <span class="item-badge badge-category">${categoryLbl}</span>
          <span class="item-badge badge-priority priority-${priority}">${priorityLbl}</span>
          <span class="item-badge badge-category" style="background: ${active ? 'var(--color-success)' : 'var(--color-danger)'}">
            ${statusLabel}
          </span>
        </div>
        <div class="item-extra">
          ${priceText    ? `<span>${priceText}</span>`    : ''}
          ${capacityText ? `<span>${capacityText}</span>` : ''}
          <span class="item-date">📅 ${dateText}</span>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-edit"   data-action="edit"   data-id="${id}" title="Editar">✏️</button>
        <button class="btn-delete" data-action="delete" data-id="${id}" title="Eliminar">🗑️</button>
      </div>
    </div>
  `;
}

/**
 * Renderiza la lista completa de propiedades usando map.
 * Muestra o esconde el empty-state según corresponda.
 * @param {Array} items — ya filtrados
 */
function renderItems(items) {
  const listEl  = document.getElementById('item-list');
  const emptyEl = document.getElementById('empty-state');

  if (items.length === 0) {
    listEl.innerHTML = '';
    emptyEl.classList.add('show');
  } else {
    emptyEl.classList.remove('show');
    listEl.innerHTML = items.map(renderItem).join('');
  }
}

/**
 * Renderiza las estadísticas en el header y en el panel detallado.
 * @param {Object} stats
 */
function renderStats(stats) {
  // Stats del header
  document.getElementById('stat-total').textContent   = stats.total;
  document.getElementById('stat-active').textContent  = stats.active;
  document.getElementById('stat-inactive').textContent = stats.inactive;

  // Precio promedio
  const avgPrice = stats.total > 0
    ? Math.round(stats.totalPrice / stats.total)
    : 0;

  // Tarjetas de categoría
  const categoryCards = Object.entries(stats.byCategory)
    .map(([cat, count]) => `
      <div class="stat-card">
        <h4>${CATEGORY_LABELS[cat] ?? cat}</h4>
        <p>${count}</p>
      </div>
    `).join('');

  // Tarjetas de nivel
  const priorityCards = Object.entries(stats.byPriority)
    .map(([priority, count]) => `
      <div class="stat-card">
        <h4>${PRIORITY_LABELS[priority] ?? priority}</h4>
        <p>${count}</p>
      </div>
    `).join('');

  document.getElementById('stats-details').innerHTML = `
    <div class="stat-card">
      <h4>Total propiedades</h4>
      <p>${stats.total}</p>
    </div>
    <div class="stat-card">
      <h4>Disponibles</h4>
      <p>${stats.active}</p>
    </div>
    <div class="stat-card">
      <h4>Ocupadas</h4>
      <p>${stats.inactive}</p>
    </div>
    <div class="stat-card">
      <h4>Precio promedio</h4>
      <p>$${avgPrice}</p>
    </div>
    <div class="stat-card">
      <h4>Capacidad total</h4>
      <p>${stats.totalCapacity}</p>
    </div>
    ${categoryCards}
    ${priorityCards}
  `;
}

// ============================================================
// 7. RENDER PRINCIPAL — lee el estado y actualiza todo el DOM
// ============================================================

function render() {
  const filtered = applyFilters(state.items, state.filters);
  const stats    = getStats(state.items);
  renderItems(filtered);
  renderStats(stats);
}

// ============================================================
// 8. FORMULARIO — leer, limpiar y precargar
// ============================================================

/**
 * Lee todos los campos del formulario y devuelve un objeto plano.
 * Object shorthand para las propiedades.
 * @returns {Object}
 */
function getFormData() {
  const name        = document.getElementById('item-name').value.trim();
  const description = document.getElementById('item-description').value.trim();
  const category    = document.getElementById('item-category').value;
  const priority    = document.getElementById('item-priority').value;
  const price       = Number(document.getElementById('item-price').value)    || 0;
  const capacity    = Number(document.getElementById('item-capacity').value) || 1;
  // Object shorthand
  return { name, description, category, priority, price, capacity };
}

/** Limpia el formulario y resetea la UI al modo "crear". */
function clearForm() {
  document.getElementById('item-id').value          = '';
  document.getElementById('item-name').value        = '';
  document.getElementById('item-description').value = '';
  document.getElementById('item-category').value    = 'apartment';
  document.getElementById('item-priority').value    = 'medium';
  document.getElementById('item-price').value       = '';
  document.getElementById('item-capacity').value    = '';
  document.getElementById('form-title').textContent = '➕ Nueva Propiedad';
  document.getElementById('submit-btn').textContent = 'Crear';
  document.getElementById('cancel-btn').style.display = 'none';
}

/**
 * Carga los datos de una propiedad en el formulario para edición.
 * Spread para no mutar el item original.
 * @param {Object} item
 */
function loadItemIntoForm(item) {
  const { id, name, description, category, priority, price, capacity } = item;
  document.getElementById('item-id').value          = id;
  document.getElementById('item-name').value        = name;
  document.getElementById('item-description').value = description;
  document.getElementById('item-category').value    = category;
  document.getElementById('item-priority').value    = priority;
  document.getElementById('item-price').value       = price    || '';
  document.getElementById('item-capacity').value    = capacity || '';
  document.getElementById('form-title').textContent = '✏️ Editar Propiedad';
  document.getElementById('submit-btn').textContent = 'Guardar cambios';
  document.getElementById('cancel-btn').style.display = 'inline-block';
  // Scroll suave al formulario
  document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('item-name').focus();
}

// ============================================================
// 9. MANEJADORES DE EVENTOS
// ============================================================

// Formulario: crear o actualizar
document.getElementById('item-form').addEventListener('submit', e => {
  e.preventDefault();
  const editId  = document.getElementById('item-id').value;
  const data    = getFormData();

  if (!data.name) return;

  if (editId) {
    // Actualizar — spread en updateItem mantiene inmutabilidad
    state = { ...state, items: updateItem(state.items, Number(editId), data) };
  } else {
    // Crear — spread en createItem combina defaults + datos
    const newItem = createItem(data);
    state = { ...state, items: addItem(state.items, newItem) };
  }

  saveItems(state.items);
  clearForm();
  render();
});

// Cancelar edición
document.getElementById('cancel-btn').addEventListener('click', () => {
  clearForm();
});

// Delegación de eventos en la lista: toggle, edit, delete
document.getElementById('item-list').addEventListener('click', e => {
  const target = e.target.closest('[data-action]');
  if (!target) return;

  const { action, id } = target.dataset;
  const numericId = Number(id);

  if (action === 'toggle') {
    state = { ...state, items: toggleItemActive(state.items, numericId) };
    saveItems(state.items);
    render();
  }

  if (action === 'edit') {
    // find para localizar la propiedad por ID
    const item = state.items.find(i => i.id === numericId);
    if (item) loadItemIntoForm(item);
  }

  if (action === 'delete') {
    const item = state.items.find(i => i.id === numericId);
    if (!item) return;
    if (confirm(`¿Eliminar la propiedad "${item.name}"?`)) {
      state = { ...state, items: deleteItem(state.items, numericId) };
      saveItems(state.items);
      render();
    }
  }
});

// Limpiar propiedades ocupadas
document.getElementById('clear-inactive').addEventListener('click', () => {
  const ocupadas = state.items.filter(i => !i.active).length;
  if (ocupadas === 0) {
    alert('No hay propiedades ocupadas para limpiar.');
    return;
  }
  if (confirm(`¿Eliminar las ${ocupadas} propiedad(es) marcada(s) como ocupada(s)?`)) {
    state = { ...state, items: state.items.filter(i => i.active) };
    saveItems(state.items);
    render();
  }
});

// Filtro por estado
document.getElementById('filter-status').addEventListener('change', e => {
  state = { ...state, filters: { ...state.filters, status: e.target.value } };
  render();
});

// Filtro por tipo de propiedad
document.getElementById('filter-category').addEventListener('change', e => {
  state = { ...state, filters: { ...state.filters, category: e.target.value } };
  render();
});

// Filtro por categoría de precio
document.getElementById('filter-priority').addEventListener('change', e => {
  state = { ...state, filters: { ...state.filters, priority: e.target.value } };
  render();
});

// Búsqueda en tiempo real
document.getElementById('search-input').addEventListener('input', e => {
  state = { ...state, filters: { ...state.filters, search: e.target.value } };
  render();
});

// ============================================================
// 10. INICIALIZACIÓN
// ============================================================

function init() {
  // getInitialState carga desde LocalStorage usando spread/shorthand
  state = getInitialState();

  // Si la colección está vacía, carga datos de ejemplo
  if (state.items.length === 0) {
    const sampleData = [
      {
        name: 'Villa Paraíso – Cartagena',
        description: 'Villa con piscina privada a 5 min de la playa. Hasta 8 personas.',
        category: 'villa', priority: 'high', price: 350, capacity: 8, active: true,
      },
      {
        name: 'Apartamento Moderno – Medellín',
        description: 'Apto en El Poblado con vista panorámica. WiFi, cocina equipada.',
        category: 'apartment', priority: 'medium', price: 95, capacity: 3, active: true,
      },
      {
        name: 'Cabaña del Bosque – Santa Fe de Antioquia',
        description: 'Cabaña rústica rodeada de naturaleza. Perfecta para desconectarse.',
        category: 'cabin', priority: 'low', price: 60, capacity: 5, active: false,
      },
      {
        name: 'Casa Colonial – Barichara',
        description: 'Casa restaurada en el pueblo más lindo de Colombia.',
        category: 'house', priority: 'medium', price: 130, capacity: 6, active: true,
      },
    ];

    // map + spread + createItem para generar los items de ejemplo
    const sampleItems = sampleData.map((data, idx) => ({
      ...createItem(data),
      id: Date.now() + idx,
    }));

    state = { ...state, items: sampleItems };
    saveItems(state.items);
  }

  render();
}

init();
