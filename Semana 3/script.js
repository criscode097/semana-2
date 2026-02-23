'use strict';

// ============================================================
// VACAENT — SISTEMA DE GESTIÓN DE ALQUILER VACACIONAL
// Proyecto Week-03 — JavaScript Moderno Bootcamp
//
// Arquitectura de clases:
//
//   Property (clase base abstracta)
//   ├── Apartment
//   ├── House
//   ├── Villa
//   └── Cabin
//
//   Person (clase base)
//   ├── Guest   (huésped)
//   └── Host    (anfitrión)
//
//   VacaRent   (sistema principal, static block)
//   Booking    (transacción: reserva)
// ============================================================


// ============================================================
// CLASE BASE: Property
// Representa cualquier propiedad vacacional de forma abstracta.
// Usa campos privados para encapsular todos sus datos.
// ============================================================
class Property {
  #id;
  #name;
  #location;
  #active;
  #pricePerNight;
  #capacity;
  #dateCreated;

  /**
   * @param {string} name          - Nombre de la propiedad
   * @param {string} location      - Ciudad o dirección
   * @param {number} pricePerNight - Precio por noche en USD
   * @param {number} capacity      - Capacidad máxima de huéspedes
   */
  constructor(name, location, pricePerNight, capacity) {
    // Validaciones básicas en el constructor
    if (!name || name.trim() === '') throw new Error('El nombre no puede estar vacío');
    if (!location || location.trim() === '') throw new Error('La ubicación no puede estar vacía');

    this.#id            = crypto.randomUUID();
    this.#name          = name.trim();
    this.#location      = location.trim();
    this.#pricePerNight = Number(pricePerNight) || 0;
    this.#capacity      = Number(capacity) || 1;
    this.#active        = true;
    this.#dateCreated   = new Date().toISOString().slice(0, 10);
  }

  // — Getters —
  get id()            { return this.#id; }
  get name()          { return this.#name; }
  get location()      { return this.#location; }
  get isActive()      { return this.#active; }
  get pricePerNight() { return this.#pricePerNight; }
  get capacity()      { return this.#capacity; }
  get dateCreated()   { return this.#dateCreated; }

  // — Setters con validación —

  set location(value) {
    if (!value || value.trim() === '') throw new Error('La ubicación no puede estar vacía');
    this.#location = value.trim();
  }

  set pricePerNight(value) {
    if (value < 0) throw new Error('El precio no puede ser negativo');
    this.#pricePerNight = Number(value);
  }

  // — Métodos de estado —

  /** Marca la propiedad como disponible */
  activate() {
    if (this.#active) return { success: false, message: 'La propiedad ya está disponible' };
    this.#active = true;
    return { success: true, message: `"${this.#name}" marcada como disponible` };
  }

  /** Marca la propiedad como no disponible */
  deactivate() {
    if (!this.#active) return { success: false, message: 'La propiedad ya está no disponible' };
    this.#active = false;
    return { success: true, message: `"${this.#name}" marcada como no disponible` };
  }

  /** Retorna el nombre del constructor (tipo de propiedad) */
  getType() {
    return this.constructor.name;
  }

  /**
   * Método abstracto — debe implementarse en cada subclase.
   * Retorna un objeto con la información completa de la propiedad.
   */
  getInfo() {
    throw new Error('getInfo() debe ser implementado en la clase hija');
  }
}


// ============================================================
// CLASES DERIVADAS: tipos de propiedad
// ============================================================

/**
 * Apartamento — unidad dentro de un edificio.
 * Propiedades adicionales: piso y si tiene ascensor.
 */
class Apartment extends Property {
  #floor;
  #hasElevator;

  /**
   * @param {string}  name          - Nombre
   * @param {string}  location      - Ciudad
   * @param {number}  pricePerNight - Precio/noche
   * @param {number}  capacity      - Huéspedes
   * @param {number}  floor         - Número de piso
   * @param {boolean} hasElevator   - Tiene ascensor
   */
  constructor(name, location, pricePerNight, capacity, floor, hasElevator) {
    super(name, location, pricePerNight, capacity);
    this.#floor       = Number(floor) || 1;
    this.#hasElevator = Boolean(hasElevator);
  }

  get floor()       { return this.#floor; }
  get hasElevator() { return this.#hasElevator; }

  getInfo() {
    return {
      id:            this.id,
      type:          this.getType(),
      name:          this.name,
      location:      this.location,
      pricePerNight: this.pricePerNight,
      capacity:      this.capacity,
      active:        this.isActive,
      floor:         this.#floor,
      hasElevator:   this.#hasElevator,
      dateCreated:   this.dateCreated,
    };
  }
}

/**
 * Casa — vivienda independiente.
 * Propiedades adicionales: número de habitaciones y si tiene jardín.
 */
class House extends Property {
  #bedrooms;
  #hasGarden;

  /**
   * @param {string}  name          - Nombre
   * @param {string}  location      - Ciudad
   * @param {number}  pricePerNight - Precio/noche
   * @param {number}  capacity      - Huéspedes
   * @param {number}  bedrooms      - Habitaciones
   * @param {boolean} hasGarden     - Tiene jardín
   */
  constructor(name, location, pricePerNight, capacity, bedrooms, hasGarden) {
    super(name, location, pricePerNight, capacity);
    this.#bedrooms  = Number(bedrooms) || 1;
    this.#hasGarden = Boolean(hasGarden);
  }

  get bedrooms()  { return this.#bedrooms; }
  get hasGarden() { return this.#hasGarden; }

  getInfo() {
    return {
      id:            this.id,
      type:          this.getType(),
      name:          this.name,
      location:      this.location,
      pricePerNight: this.pricePerNight,
      capacity:      this.capacity,
      active:        this.isActive,
      bedrooms:      this.#bedrooms,
      hasGarden:     this.#hasGarden,
      dateCreated:   this.dateCreated,
    };
  }
}

/**
 * Villa — propiedad de lujo con piscina privada.
 * Propiedades adicionales: si tiene piscina y metros cuadrados.
 */
class Villa extends Property {
  #hasPool;
  #squareMeters;

  /**
   * @param {string}  name          - Nombre
   * @param {string}  location      - Ciudad
   * @param {number}  pricePerNight - Precio/noche
   * @param {number}  capacity      - Huéspedes
   * @param {boolean} hasPool       - Tiene piscina
   * @param {number}  squareMeters  - Metros cuadrados
   */
  constructor(name, location, pricePerNight, capacity, hasPool, squareMeters) {
    super(name, location, pricePerNight, capacity);
    this.#hasPool      = Boolean(hasPool);
    this.#squareMeters = Number(squareMeters) || 0;
  }

  get hasPool()      { return this.#hasPool; }
  get squareMeters() { return this.#squareMeters; }

  getInfo() {
    return {
      id:            this.id,
      type:          this.getType(),
      name:          this.name,
      location:      this.location,
      pricePerNight: this.pricePerNight,
      capacity:      this.capacity,
      active:        this.isActive,
      hasPool:       this.#hasPool,
      squareMeters:  this.#squareMeters,
      dateCreated:   this.dateCreated,
    };
  }
}

/**
 * Cabaña — alojamiento rural o de montaña.
 * Propiedades adicionales: si tiene chimenea y si es pet-friendly.
 */
class Cabin extends Property {
  #hasFireplace;
  #petFriendly;

  /**
   * @param {string}  name          - Nombre
   * @param {string}  location      - Ciudad
   * @param {number}  pricePerNight - Precio/noche
   * @param {number}  capacity      - Huéspedes
   * @param {boolean} hasFireplace  - Tiene chimenea
   * @param {boolean} petFriendly   - Acepta mascotas
   */
  constructor(name, location, pricePerNight, capacity, hasFireplace, petFriendly) {
    super(name, location, pricePerNight, capacity);
    this.#hasFireplace = Boolean(hasFireplace);
    this.#petFriendly  = Boolean(petFriendly);
  }

  get hasFireplace() { return this.#hasFireplace; }
  get petFriendly()  { return this.#petFriendly; }

  getInfo() {
    return {
      id:            this.id,
      type:          this.getType(),
      name:          this.name,
      location:      this.location,
      pricePerNight: this.pricePerNight,
      capacity:      this.capacity,
      active:        this.isActive,
      hasFireplace:  this.#hasFireplace,
      petFriendly:   this.#petFriendly,
      dateCreated:   this.dateCreated,
    };
  }
}


// ============================================================
// CLASE BASE: Person
// Representa a cualquier usuario del sistema.
// ============================================================
class Person {
  #id;
  #name;
  #email;
  #registrationDate;

  /**
   * @param {string} name  - Nombre completo
   * @param {string} email - Correo electrónico
   */
  constructor(name, email) {
    if (!name || name.trim() === '') throw new Error('El nombre no puede estar vacío');
    this.#id               = crypto.randomUUID();
    this.#name             = name.trim();
    this.#registrationDate = new Date().toISOString().slice(0, 10);
    // Usa el setter para validar formato
    this.email = email;
  }

  get id()               { return this.#id; }
  get name()             { return this.#name; }
  get email()            { return this.#email; }
  get registrationDate() { return this.#registrationDate; }

  // — Setter con validación de formato de email —
  set email(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) throw new Error(`Email inválido: ${value}`);
    this.#email = value;
  }

  /** Retorna el rol (nombre del constructor) */
  getRole() {
    return this.constructor.name;
  }

  getInfo() {
    return {
      id:               this.#id,
      name:             this.#name,
      email:            this.#email,
      role:             this.getRole(),
      registrationDate: this.#registrationDate,
    };
  }
}


// ============================================================
// CLASES DE ROL: Guest y Host
// ============================================================

/**
 * Guest — huésped que puede hacer reservas.
 * Propiedades adicionales: país de origen y número de reservas.
 */
class Guest extends Person {
  #country;
  #totalBookings;

  /**
   * @param {string} name    - Nombre
   * @param {string} email   - Email
   * @param {string} country - País de origen
   */
  constructor(name, email, country) {
    super(name, email);
    this.#country       = country ?? 'No especificado';
    this.#totalBookings = 0;
  }

  get country()       { return this.#country; }
  get totalBookings() { return this.#totalBookings; }

  /** Incrementa el contador de reservas del huésped */
  registerBooking() {
    this.#totalBookings++;
  }

  getInfo() {
    return {
      ...super.getInfo(),
      country:       this.#country,
      totalBookings: this.#totalBookings,
    };
  }
}

/**
 * Host — anfitrión que publica propiedades.
 * Propiedades adicionales: número de propiedades publicadas y calificación promedio.
 */
class Host extends Person {
  #totalProperties;
  #rating;

  /**
   * @param {string} name   - Nombre
   * @param {string} email  - Email
   * @param {number} rating - Calificación inicial (1–5)
   */
  constructor(name, email, rating = 5) {
    super(name, email);
    this.#totalProperties = 0;
    this.#rating          = Math.min(5, Math.max(1, Number(rating)));
  }

  get totalProperties() { return this.#totalProperties; }
  get rating()          { return this.#rating; }

  /** Registra una nueva propiedad publicada por este anfitrión */
  addProperty() {
    this.#totalProperties++;
  }

  getInfo() {
    return {
      ...super.getInfo(),
      totalProperties: this.#totalProperties,
      rating:          this.#rating,
    };
  }
}


// ============================================================
// CLASE: Booking (reserva / transacción)
// ============================================================
class Booking {
  #id;
  #propertyId;
  #propertyName;
  #guestName;
  #checkIn;
  #checkOut;
  #totalPrice;
  #createdAt;

  /**
   * @param {Property} property - Propiedad reservada
   * @param {Guest}    guest    - Huésped que reserva
   * @param {string}   checkIn  - Fecha de entrada (YYYY-MM-DD)
   * @param {string}   checkOut - Fecha de salida (YYYY-MM-DD)
   */
  constructor(property, guest, checkIn, checkOut) {
    const nights = Booking.calculateNights(checkIn, checkOut);
    if (nights <= 0) throw new Error('Las fechas de entrada y salida no son válidas');

    this.#id           = crypto.randomUUID();
    this.#propertyId   = property.id;
    this.#propertyName = property.name;
    this.#guestName    = guest.name;
    this.#checkIn      = checkIn;
    this.#checkOut     = checkOut;
    this.#totalPrice   = nights * property.pricePerNight;
    this.#createdAt    = new Date().toISOString().slice(0, 10);
  }

  get id()           { return this.#id; }
  get propertyName() { return this.#propertyName; }
  get guestName()    { return this.#guestName; }
  get checkIn()      { return this.#checkIn; }
  get checkOut()     { return this.#checkOut; }
  get totalPrice()   { return this.#totalPrice; }
  get createdAt()    { return this.#createdAt; }

  /** Calcula la cantidad de noches entre dos fechas */
  static calculateNights(checkIn, checkOut) {
    const ms = new Date(checkOut) - new Date(checkIn);
    return Math.round(ms / (1000 * 60 * 60 * 24));
  }

  getInfo() {
    return {
      id:           this.#id,
      propertyId:   this.#propertyId,
      propertyName: this.#propertyName,
      guestName:    this.#guestName,
      checkIn:      this.#checkIn,
      checkOut:     this.#checkOut,
      nights:       Booking.calculateNights(this.#checkIn, this.#checkOut),
      totalPrice:   this.#totalPrice,
      createdAt:    this.#createdAt,
    };
  }
}


// ============================================================
// CLASE PRINCIPAL: VacaRent
// Gestiona propiedades, usuarios y reservas.
// Usa static block para configuración inicial.
// ============================================================
class VacaRent {
  #properties  = [];
  #users       = [];
  #bookings    = [];

  // Static block: se ejecuta una vez cuando la clase se carga
  static {
    this.VERSION     = '1.0.0';
    this.MAX_ITEMS   = 500;
    this.SYSTEM_NAME = 'VacaRent';
    console.log(`✅ ${this.SYSTEM_NAME} v${this.VERSION} cargado`);
  }

  // — Métodos estáticos de utilidad —

  /** Valida que un ID tenga formato UUID */
  static isValidId(id) {
    return typeof id === 'string' && id.length > 0;
  }

  /** Genera un ID único */
  static generateId() {
    return crypto.randomUUID();
  }

  // ============================================================
  // CRUD — Propiedades
  // ============================================================

  addItem(property) {
    if (!(property instanceof Property)) {
      return { success: false, message: 'Debe ser una instancia de Property' };
    }
    if (this.#properties.length >= VacaRent.MAX_ITEMS) {
      return { success: false, message: 'Límite de propiedades alcanzado' };
    }
    this.#properties.push(property);
    return { success: true, message: `"${property.name}" agregada correctamente`, item: property };
  }

  removeItem(id) {
    const index = this.#properties.findIndex(p => p.id === id);
    if (index === -1) return { success: false, message: 'Propiedad no encontrada' };
    const removed = this.#properties.splice(index, 1)[0];
    return { success: true, message: `"${removed.name}" eliminada`, item: removed };
  }

  findItem(id) {
    return this.#properties.find(p => p.id === id) ?? null;
  }

  getAllItems() {
    return [...this.#properties];
  }

  // ============================================================
  // Búsqueda y filtrado
  // ============================================================

  searchByName(query) {
    const term = query.toLowerCase();
    return this.#properties.filter(
      p => p.name.toLowerCase().includes(term) || p.location.toLowerCase().includes(term)
    );
  }

  filterByType(type) {
    return this.#properties.filter(p => p.getType() === type);
  }

  filterByStatus(active) {
    return this.#properties.filter(p => p.isActive === active);
  }

  // ============================================================
  // Estadísticas
  // ============================================================

  getStats() {
    const total    = this.#properties.length;
    const active   = this.#properties.filter(p => p.isActive).length;
    const inactive = total - active;

    // Agrupa por tipo usando reduce
    const byType = this.#properties.reduce((acc, p) => {
      const type = p.getType();
      acc[type]  = (acc[type] ?? 0) + 1;
      return acc;
    }, {});

    // Precio promedio por noche
    const avgPrice = total > 0
      ? Math.round(this.#properties.reduce((sum, p) => sum + p.pricePerNight, 0) / total)
      : 0;

    return { total, active, inactive, byType, users: this.#users.length, avgPrice };
  }

  // ============================================================
  // CRUD — Usuarios
  // ============================================================

  addUser(user) {
    if (!(user instanceof Person)) {
      return { success: false, message: 'Debe ser una instancia de Person' };
    }
    // Verifica que el email no esté duplicado
    if (this.#users.find(u => u.email === user.email)) {
      return { success: false, message: 'Ya existe un usuario con ese email' };
    }
    this.#users.push(user);
    return { success: true, message: `Usuario "${user.name}" registrado`, user };
  }

  findUserByEmail(email) {
    return this.#users.find(u => u.email === email) ?? null;
  }

  getAllUsers() {
    return [...this.#users];
  }

  // ============================================================
  // Reservas
  // ============================================================

  addBooking(booking) {
    this.#bookings.push(booking);
  }

  getAllBookings() {
    return [...this.#bookings];
  }
}


// ============================================================
// INSTANCIA PRINCIPAL Y DATOS DE EJEMPLO
// ============================================================

const system = new VacaRent();

// Propiedades de ejemplo
const prop1 = new Villa('Villa Paraíso', 'Cartagena, Colombia', 350, 8, true, 450);
const prop2 = new Apartment('Apto Moderno El Poblado', 'Medellín, Colombia', 95, 3, 7, true);
const prop3 = new Cabin('Cabaña del Bosque', 'Santa Fe de Antioquia', 60, 5, true, true);
const prop4 = new House('Casa Colonial', 'Barichara, Colombia', 130, 6, 4, true);

system.addItem(prop1);
system.addItem(prop2);
system.addItem(prop3);
system.addItem(prop4);

// Marcar una como no disponible de ejemplo
prop3.deactivate();

// Usuarios de ejemplo
const guest1 = new Guest('Ana García', 'ana@ejemplo.com', 'Colombia');
const guest2 = new Guest('Carlos Ruiz', 'carlos@ejemplo.com', 'México');
const host1  = new Host('María López', 'maria@ejemplo.com', 5);

system.addUser(guest1);
system.addUser(guest2);
system.addUser(host1);

// Reserva de ejemplo
const booking1 = new Booking(prop1, guest1, '2025-07-10', '2025-07-15');
guest1.registerBooking();
prop1.deactivate();   // Ocupa la villa durante la reserva
system.addBooking(booking1);


// ============================================================
// HELPERS DE ETIQUETAS
// ============================================================

const TYPE_LABELS = {
  Apartment: '🏢 Apartamento',
  House:     '🏠 Casa',
  Villa:     '🏡 Villa',
  Cabin:     '🌲 Cabaña',
};

const TYPE_CSS = {
  Apartment: 'apartment',
  House:     'house',
  Villa:     'villa',
  Cabin:     'cabin',
};

const ROLE_LABELS = {
  Guest: '🧳 Huésped',
  Host:  '🔑 Anfitrión',
};

/** Construye los detalles extra de una propiedad según su tipo */
function buildExtraDetails(info) {
  switch (info.type) {
    case 'Apartment':
      return `<p>Piso: ${info.floor} ${info.hasElevator ? '· Ascensor ✅' : '· Sin ascensor'}</p>`;
    case 'House':
      return `<p>Habitaciones: ${info.bedrooms} ${info.hasGarden ? '· Jardín ✅' : ''}</p>`;
    case 'Villa':
      return `<p>${info.squareMeters} m² ${info.hasPool ? '· Piscina privada ✅' : ''}</p>`;
    case 'Cabin':
      return `<p>${info.hasFireplace ? 'Chimenea ✅' : ''} ${info.petFriendly ? '· Pet-friendly ✅' : ''}</p>`;
    default:
      return '';
  }
}

/** Construye los campos dinámicos del formulario según el tipo seleccionado */
function buildDynamicFields(type) {
  switch (type) {
    case 'Apartment':
      return `
        <div class="form-group">
          <label for="dyn-floor">Piso</label>
          <input type="number" id="dyn-floor" min="1" placeholder="Ej: 3" />
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="dyn-elevator" /> Tiene ascensor
          </label>
        </div>`;
    case 'House':
      return `
        <div class="form-group">
          <label for="dyn-bedrooms">Habitaciones</label>
          <input type="number" id="dyn-bedrooms" min="1" placeholder="Ej: 3" />
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="dyn-garden" /> Tiene jardín
          </label>
        </div>`;
    case 'Villa':
      return `
        <div class="form-group">
          <label for="dyn-sqm">Metros cuadrados</label>
          <input type="number" id="dyn-sqm" min="1" placeholder="Ej: 300" />
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="dyn-pool" /> Tiene piscina
          </label>
        </div>`;
    case 'Cabin':
      return `
        <div class="form-group">
          <label>
            <input type="checkbox" id="dyn-fireplace" /> Tiene chimenea
          </label>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="dyn-pets" /> Pet-friendly
          </label>
        </div>`;
    default:
      return '';
  }
}

/** Campos dinámicos del formulario de usuario según el rol */
function buildUserDynamicFields(role) {
  switch (role) {
    case 'Guest':
      return `
        <div class="form-group">
          <label for="dyn-country">País de origen</label>
          <input type="text" id="dyn-country" placeholder="Ej: Colombia" />
        </div>`;
    case 'Host':
      return `
        <div class="form-group">
          <label for="dyn-rating">Calificación inicial (1–5)</label>
          <input type="number" id="dyn-rating" min="1" max="5" value="5" />
        </div>`;
    default:
      return '';
  }
}


// ============================================================
// RENDERIZADO
// ============================================================

/** Renderiza una tarjeta de propiedad como string HTML */
const renderItem = property => {
  const info        = property.getInfo();
  const typeLabel   = TYPE_LABELS[info.type] ?? info.type;
  const typeCss     = TYPE_CSS[info.type]   ?? 'apartment';
  const statusLabel = info.active ? 'Disponible' : 'No disponible';
  const statusCss   = info.active ? 'available'  : 'unavailable';
  const extra       = buildExtraDetails(info);

  return `
    <div class="item-card" data-id="${info.id}">
      <div class="item-card-header">
        <span class="item-type ${typeCss}">${typeLabel}</span>
        <span class="availability-badge ${statusCss}">${statusLabel}</span>
      </div>
      <p class="item-title">${info.name}</p>
      <p class="item-author">📍 ${info.location}</p>
      <div class="item-details">
        <p>💵 $${info.pricePerNight}/noche · 👥 hasta ${info.capacity} huéspedes</p>
        ${extra}
        <p style="font-size:0.8rem;margin-top:6px;color:var(--text-muted)">Registrada: ${info.dateCreated}</p>
      </div>
      <div class="item-actions">
        <button class="btn btn-small ${info.active ? 'btn-warning' : 'btn-success'} btn-toggle" data-id="${info.id}">
          ${info.active ? 'Marcar ocupada' : 'Marcar disponible'}
        </button>
        <button class="btn btn-small btn-danger btn-delete" data-id="${info.id}">Eliminar</button>
      </div>
    </div>
  `;
};

/** Renderiza la lista completa de propiedades */
const renderItems = (items = []) => {
  const listEl  = document.getElementById('item-list');
  const emptyEl = document.getElementById('empty-state');

  if (items.length === 0) {
    listEl.innerHTML       = '';
    emptyEl.style.display  = 'block';
  } else {
    emptyEl.style.display  = 'none';
    listEl.innerHTML       = items.map(renderItem).join('');
  }
};

/** Renderiza una tarjeta de usuario */
const renderUser = user => {
  const info      = user.getInfo();
  const roleLabel = ROLE_LABELS[info.role] ?? info.role;
  const initials  = info.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Detalles extra según el rol
  let extraHtml = '';
  if (user instanceof Guest) {
    extraHtml = `
      <div class="member-stats">
        <div class="member-stat">
          <div class="member-stat-value">${user.totalBookings}</div>
          <div class="member-stat-label">Reservas</div>
        </div>
        <div class="member-stat">
          <div class="member-stat-value">${user.country}</div>
          <div class="member-stat-label">País</div>
        </div>
      </div>`;
  } else if (user instanceof Host) {
    extraHtml = `
      <div class="member-stats">
        <div class="member-stat">
          <div class="member-stat-value">${user.totalProperties}</div>
          <div class="member-stat-label">Propiedades</div>
        </div>
        <div class="member-stat">
          <div class="member-stat-value">⭐ ${user.rating}</div>
          <div class="member-stat-label">Calificación</div>
        </div>
      </div>`;
  }

  return `
    <div class="member-card">
      <div class="member-avatar">${initials}</div>
      <div class="member-name">${info.name}</div>
      <div class="member-email">${info.email}</div>
      ${extraHtml}
      <span class="membership-badge ${info.role.toLowerCase()}">${roleLabel}</span>
    </div>
  `;
};

/** Renderiza la pestaña de usuarios */
const renderUsers = (users = []) => {
  const listEl = document.getElementById('user-list');
  listEl.innerHTML = users.length === 0
    ? '<p style="color:var(--text-muted);padding:20px">No hay usuarios registrados</p>'
    : users.map(renderUser).join('');
};

/** Renderiza una tarjeta de reserva */
const renderBooking = booking => {
  const info = booking.getInfo();
  return `
    <div class="loan-card">
      <div class="loan-header">
        <span class="loan-item-title">🏘️ ${info.propertyName}</span>
        <span class="loan-status active">Confirmada</span>
      </div>
      <div class="loan-info">
        <p>👤 Huésped: ${info.guestName}</p>
        <p>📅 Check-in: ${info.checkIn} → Check-out: ${info.checkOut} (${info.nights} noches)</p>
        <p>💵 Total: $${info.totalPrice}</p>
        <p style="font-size:0.8rem;color:var(--text-muted)">Reservada el: ${info.createdAt}</p>
      </div>
    </div>
  `;
};

/** Renderiza el historial de reservas */
const renderBookings = () => {
  const listEl   = document.getElementById('transaction-list');
  const bookings = system.getAllBookings();
  listEl.innerHTML = bookings.length === 0
    ? '<p style="color:var(--text-muted);padding:20px">No hay reservas registradas</p>'
    : `<div class="loans-list">${bookings.map(renderBooking).join('')}</div>`;
};

/** Renderiza las estadísticas */
const renderStats = stats => {
  document.getElementById('stat-total').textContent   = stats.total;
  document.getElementById('stat-active').textContent  = stats.active;
  document.getElementById('stat-inactive').textContent = stats.inactive;
  document.getElementById('stat-users').textContent   = stats.users;

  // Desglose por tipo
  const typeRows = Object.entries(stats.byType)
    .map(([type, count]) => `
      <div class="breakdown-item">
        <span class="breakdown-type">${TYPE_LABELS[type] ?? type}</span>
        <span class="breakdown-count">${count}</span>
      </div>
    `).join('');

  document.getElementById('stats-details').innerHTML = `
    <div class="stats-breakdown">
      <h3>Propiedades por tipo</h3>
      <div class="breakdown-grid">${typeRows}</div>
    </div>
    <div class="stats-breakdown" style="margin-top:20px">
      <h3>Precio promedio por noche</h3>
      <div class="breakdown-grid">
        <div class="breakdown-item">
          <span class="breakdown-type">Todas las propiedades</span>
          <span class="breakdown-count">$${stats.avgPrice}</span>
        </div>
      </div>
    </div>
  `;
};

/** Renderiza todo el estado de la app */
const renderAll = () => {
  renderItems(system.getAllItems());
  renderUsers(system.getAllUsers());
  renderBookings();
  renderStats(system.getStats());
};


// ============================================================
// FILTROS Y BÚSQUEDA
// ============================================================

const handleFilterChange = () => {
  let result = system.getAllItems();

  const search = document.getElementById('search-input').value.trim();
  const type   = document.getElementById('filter-type').value;
  const status = document.getElementById('filter-status').value;

  if (search)            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()));
  if (type !== 'all')    result = result.filter(p => p.getType() === type);
  if (status !== 'all')  result = result.filter(p => status === 'active' ? p.isActive : !p.isActive);

  renderItems(result);
};

const handleUserFilterChange = () => {
  let result = system.getAllUsers();

  const search = document.getElementById('search-users').value.trim();
  const role   = document.getElementById('filter-role').value;

  if (search)           result = result.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
  if (role !== 'all')   result = result.filter(u => u.getRole() === role);

  renderUsers(result);
};


// ============================================================
// MODAL: PROPIEDAD
// ============================================================

const itemModal  = document.getElementById('item-modal');
const itemForm   = document.getElementById('item-form');
const addItemBtn = document.getElementById('add-item-btn');

// Abre el modal
addItemBtn.addEventListener('click', () => {
  itemForm.reset();
  document.getElementById('dynamic-fields').innerHTML = '';
  itemModal.style.display = 'flex';
  itemModal.classList.add('active');
});

// Cierra el modal
const closeItemModal = () => {
  itemModal.style.display = 'none';
  itemModal.classList.remove('active');
  itemForm.reset();
  document.getElementById('dynamic-fields').innerHTML = '';
};
document.getElementById('close-modal').addEventListener('click', closeItemModal);
document.getElementById('cancel-btn').addEventListener('click', closeItemModal);

// Campos dinámicos al cambiar el tipo
document.getElementById('item-type').addEventListener('change', e => {
  document.getElementById('dynamic-fields').innerHTML = buildDynamicFields(e.target.value);
});

// Submit del formulario de propiedad
itemForm.addEventListener('submit', e => {
  e.preventDefault();

  const type     = document.getElementById('item-type').value;
  const name     = document.getElementById('item-name').value.trim();
  const location = document.getElementById('item-location').value.trim();

  // Campos comunes — precio y capacidad están en los dynamic fields o con valores por defecto
  const price    = Number(document.getElementById('dyn-price')?.value)    || 100;
  const capacity = Number(document.getElementById('dyn-capacity')?.value) || 2;

  let property;

  try {
    switch (type) {
      case 'Apartment': {
        const floor    = Number(document.getElementById('dyn-floor')?.value) || 1;
        const elevator = document.getElementById('dyn-elevator')?.checked ?? false;
        property = new Apartment(name, location, price, capacity, floor, elevator);
        break;
      }
      case 'House': {
        const bedrooms = Number(document.getElementById('dyn-bedrooms')?.value) || 2;
        const garden   = document.getElementById('dyn-garden')?.checked ?? false;
        property = new House(name, location, price, capacity, bedrooms, garden);
        break;
      }
      case 'Villa': {
        const sqm  = Number(document.getElementById('dyn-sqm')?.value) || 0;
        const pool = document.getElementById('dyn-pool')?.checked ?? false;
        property = new Villa(name, location, price, capacity, pool, sqm);
        break;
      }
      case 'Cabin': {
        const fireplace = document.getElementById('dyn-fireplace')?.checked ?? false;
        const pets      = document.getElementById('dyn-pets')?.checked ?? false;
        property = new Cabin(name, location, price, capacity, fireplace, pets);
        break;
      }
      default:
        showToast('Selecciona un tipo de propiedad', 'error');
        return;
    }

    const result = system.addItem(property);
    if (result.success) {
      showToast(result.message, 'success');
      closeItemModal();
      renderAll();
    } else {
      showToast(result.message, 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// Delegación de eventos en la lista (toggle disponibilidad / eliminar)
document.getElementById('item-list').addEventListener('click', e => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('btn-toggle')) {
    const property = system.findItem(id);
    if (!property) return;
    const result = property.isActive ? property.deactivate() : property.activate();
    showToast(result.message, result.success ? 'success' : 'warning');
    handleFilterChange();
    renderStats(system.getStats());
  }

  if (e.target.classList.contains('btn-delete')) {
    const property = system.findItem(id);
    if (!property) return;
    if (confirm(`¿Eliminar "${property.name}"?`)) {
      const result = system.removeItem(id);
      showToast(result.message, 'success');
      handleFilterChange();
      renderStats(system.getStats());
    }
  }
});


// ============================================================
// MODAL: USUARIO
// ============================================================

const userModal  = document.getElementById('user-modal');
const userForm   = document.getElementById('user-form');
const addUserBtn = document.getElementById('add-user-btn');

addUserBtn.addEventListener('click', () => {
  userForm.reset();
  document.getElementById('user-dynamic-fields').innerHTML = '';
  userModal.style.display = 'flex';
  userModal.classList.add('active');
});

const closeUserModal = () => {
  userModal.style.display = 'none';
  userModal.classList.remove('active');
  userForm.reset();
  document.getElementById('user-dynamic-fields').innerHTML = '';
};
document.getElementById('close-user-modal').addEventListener('click', closeUserModal);
document.getElementById('cancel-user-btn').addEventListener('click', closeUserModal);

document.getElementById('user-role').addEventListener('change', e => {
  document.getElementById('user-dynamic-fields').innerHTML = buildUserDynamicFields(e.target.value);
});

userForm.addEventListener('submit', e => {
  e.preventDefault();

  const role  = document.getElementById('user-role').value;
  const name  = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim();

  try {
    let user;
    if (role === 'Guest') {
      const country = document.getElementById('dyn-country')?.value.trim() || 'No especificado';
      user = new Guest(name, email, country);
    } else if (role === 'Host') {
      const rating = Number(document.getElementById('dyn-rating')?.value) || 5;
      user = new Host(name, email, rating);
    } else {
      showToast('Selecciona un rol', 'error');
      return;
    }

    const result = system.addUser(user);
    if (result.success) {
      showToast(result.message, 'success');
      closeUserModal();
      renderAll();
    } else {
      showToast(result.message, 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
});


// ============================================================
// FORMULARIO DE PROPIEDAD — campos precio y capacidad comunes
// Se inyectan en dynamic-fields junto con los campos del tipo
// ============================================================
document.getElementById('item-type').addEventListener('change', e => {
  const type = e.target.value;
  const commonFields = `
    <div class="form-group">
      <label for="dyn-price">Precio por noche (USD)</label>
      <input type="number" id="dyn-price" min="0" placeholder="Ej: 150" />
    </div>
    <div class="form-group">
      <label for="dyn-capacity">Capacidad (huéspedes)</label>
      <input type="number" id="dyn-capacity" min="1" placeholder="Ej: 4" />
    </div>
  `;
  document.getElementById('dynamic-fields').innerHTML = commonFields + buildDynamicFields(type);
});


// ============================================================
// TABS
// ============================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});


// ============================================================
// FILTROS
// ============================================================
document.getElementById('search-input').addEventListener('input', handleFilterChange);
document.getElementById('filter-type').addEventListener('change', handleFilterChange);
document.getElementById('filter-status').addEventListener('change', handleFilterChange);
document.getElementById('search-users').addEventListener('input', handleUserFilterChange);
document.getElementById('filter-role').addEventListener('change', handleUserFilterChange);


// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}


// ============================================================
// INICIALIZACIÓN
// ============================================================
const init = () => {
  renderAll();
  console.log(`✅ ${VacaRent.SYSTEM_NAME} inicializado con ${system.getAllItems().length} propiedades`);
};

document.addEventListener('DOMContentLoaded', init);
