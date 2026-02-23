# 🏖️ VacaRent — Sistema de Gestión de Alquiler Vacacional

**Proyecto Week-03 — JavaScript Moderno Bootcamp**
**Dominio asignado:** Plataforma de Alquiler Vacacional

---

## ¿Qué hace esta aplicación?

VacaRent es un sistema web para gestionar propiedades de alquiler vacacional. Permite registrar propiedades de distintos tipos (apartamentos, casas, villas y cabañas), administrar huéspedes y anfitriones, consultar el historial de reservas y visualizar estadísticas de la plataforma. Todo corre en el navegador con JavaScript puro y sin frameworks.

---

## Cómo usar la página

La aplicación tiene cuatro pestañas:

### 🏘️ Propiedades

Muestra todas las propiedades registradas en tarjetas. Desde aquí puedes:

- **Buscar** por nombre o ciudad con el campo de texto.
- **Filtrar** por tipo de propiedad (Apartamento, Casa, Villa, Cabaña) o por disponibilidad.
- **Agregar** una propiedad con el botón **+ Agregar propiedad**. Al seleccionar el tipo en el modal, aparecen automáticamente los campos específicos de ese tipo (piso y ascensor para apartamentos, habitaciones y jardín para casas, etc.) además del precio por noche y la capacidad.
- **Marcar como ocupada o disponible** con el botón de cada tarjeta. El badge de la tarjeta cambia de color en tiempo real.
- **Eliminar** una propiedad con confirmación.

### 👥 Usuarios

Muestra los usuarios registrados. Puedes buscar por nombre o filtrar por rol. Al agregar un usuario se elige entre **Huésped** (con campo de país de origen) o **Anfitrión** (con calificación inicial). Cada tarjeta muestra las estadísticas del usuario: reservas hechas para huéspedes, propiedades publicadas y calificación para anfitriones.

### 🔄 Reservas

Muestra el historial de todas las reservas registradas. Cada tarjeta indica la propiedad, el huésped, las fechas de entrada y salida, la cantidad de noches calculada automáticamente y el precio total.

### 📊 Estadísticas

Muestra un resumen de la plataforma: total de propiedades, cuántas están disponibles y cuántas ocupadas, cantidad de usuarios y precio promedio por noche. Incluye también un desglose por tipo de propiedad.

---

## Estructura de archivos

```
proyecto/
├── index.html   — Interfaz HTML con pestañas y modales
├── styles.css   — Estilos oscuros (base del template del curso)
├── script.js    — Lógica completa con POO ES2023
└── README.md    — Este archivo
```

---

## Diagrama de clases

```
Property (clase base abstracta)
├── Apartment  → agrega: floor, hasElevator
├── House      → agrega: bedrooms, hasGarden
├── Villa      → agrega: hasPool, squareMeters
└── Cabin      → agrega: hasFireplace, petFriendly

Person (clase base)
├── Guest  → agrega: country, totalBookings
└── Host   → agrega: totalProperties, rating

VacaRent   (sistema principal — static block)
Booking    (transacción de reserva)
```

---

## Modelo de datos

### Propiedad (Property y subclases)

```javascript
// Campos comunes a todas las propiedades (campos privados #)
id:            string   // crypto.randomUUID()
name:          string   // Nombre de la propiedad
location:      string   // Ciudad o dirección
active:        boolean  // true = disponible, false = ocupada
pricePerNight: number   // Precio en USD
capacity:      number   // Huéspedes máximos
dateCreated:   string   // Fecha de registro (YYYY-MM-DD)

// Campos adicionales por tipo:
// Apartment  → floor (number), hasElevator (boolean)
// House      → bedrooms (number), hasGarden (boolean)
// Villa      → hasPool (boolean), squareMeters (number)
// Cabin      → hasFireplace (boolean), petFriendly (boolean)
```

### Usuario (Person y subclases)

```javascript
id:               string   // crypto.randomUUID()
name:             string
email:            string   // validado con regex en el setter
registrationDate: string

// Guest → country (string), totalBookings (number)
// Host  → totalProperties (number), rating (number 1–5)
```

### Reserva (Booking)

```javascript
id:           string
propertyName: string
guestName:    string
checkIn:      string   // YYYY-MM-DD
checkOut:     string   // YYYY-MM-DD
totalPrice:   number   // noches × pricePerNight, calculado en el constructor
createdAt:    string
```

---

## Capturas de pantalla

> Agregar capturas aquí antes de entregar.

---

*Proyecto Week-03 — JavaScript Moderno Bootcamp*
