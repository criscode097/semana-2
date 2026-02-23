# 🏖️ Gestor de Propiedades Vacacionales

**Proyecto Week-02 — JavaScript Moderno Bootcamp**
**Dominio asignado:** Plataforma de Alquiler Vacacional

---

## ¿Qué hace esta aplicación?

Es una aplicación web para gestionar una colección de propiedades vacacionales (apartamentos, casas, villas y cabañas). Permite registrar cada propiedad con su tipo, categoría de precio, precio por noche y capacidad de huéspedes; marcarla como disponible u ocupada; y filtrarla o buscarla en tiempo real. Todos los datos se guardan automáticamente en el navegador usando LocalStorage, por lo que la colección persiste aunque se cierre la pestaña.

---

## Cómo usar la página

### 1. Agregar una propiedad

Completa el formulario en la parte superior con:

- **Nombre** — título de la propiedad (ej: `Villa Paraíso – Cartagena`)
- **Descripción** — notas sobre ubicación, comodidades o reglas
- **Tipo de propiedad** — Apartamento, Casa, Villa, Cabaña u Otro
- **Categoría / Nivel** — Económica, Estándar o Premium
- **Precio por noche (USD)** — número entero
- **Capacidad** — cantidad máxima de huéspedes

Pulsa **Crear** y la propiedad aparecerá en la lista.

### 2. Editar una propiedad

Haz clic en el ícono ✏️ de cualquier tarjeta. El formulario se precargará con los datos de esa propiedad y el botón cambiará a **Guardar cambios**. Pulsa **Cancelar** en cualquier momento para descartar la edición.

### 3. Eliminar una propiedad

Haz clic en el ícono 🗑️ de la tarjeta y confirma el diálogo. La propiedad se borra de forma permanente.

### 4. Marcar como disponible u ocupada

Cada tarjeta tiene un checkbox a la izquierda. Al marcarlo o desmarcarlo, la propiedad cambia entre **Disponible** ✅ y **Ocupada** 🔴 al instante. Las propiedades ocupadas aparecen con opacidad reducida y el nombre tachado.

### 5. Filtrar y buscar

La barra de filtros tiene cuatro controles:

| Control | Qué filtra |
|---|---|
| Estado | Todas / Disponibles / Ocupadas |
| Tipo | Todos los tipos o uno específico |
| Categoría | Todas / Premium / Estándar / Económica |
| Buscar | Texto libre en nombre o descripción |

Los filtros se aplican en tiempo real y se pueden combinar entre sí.

### 6. Limpiar propiedades ocupadas

El botón **🗑️ Limpiar Ocupadas** elimina de un solo clic todas las propiedades marcadas como ocupadas, previa confirmación.

### 7. Estadísticas

Al pie de la página se muestran tarjetas con:

- Total de propiedades registradas
- Cuántas están disponibles y cuántas ocupadas
- Precio promedio por noche
- Capacidad total de huéspedes sumada
- Conteo por tipo de propiedad
- Conteo por categoría de precio

---

## Estructura de archivos

```
proyecto/
├── index.html    — Estructura HTML adaptada al dominio vacacional
├── styles.css    — Estilos visuales (paleta azul cielo, mismas clases del template)
├── script.js     — Lógica completa en JavaScript puro ES2023
└── README.md     — Este archivo
```

---

## Modelo de datos

Cada propiedad se representa con el siguiente objeto:

```javascript
{
  id:          1748000000000,   // Date.now() — identificador único
  name:        "Villa Paraíso – Cartagena",
  description: "Villa con piscina privada a 5 min de la playa.",
  active:      true,            // true = disponible | false = ocupada
  priority:    "high",          // 'low' | 'medium' | 'high'
  category:    "villa",         // tipo de propiedad
  price:       350,             // precio por noche en USD
  capacity:    8,               // cantidad de huéspedes
  createdAt:   "2025-05-23",    // fecha de registro
  updatedAt:   null             // fecha de última edición o null
}
```

---

## Capturas de pantalla

> Agregar capturas aquí antes de entregar.

---

*Proyecto Week-02 — JavaScript Moderno Bootcamp*
