# PowerSphere Operations - Procesos MEM

Sistema profesional de gestión de procesos MEM con separación de estado de cuenta diario (Separación ECD).

## Estructura del Proyecto

```
src/
├── types/                 # Tipos e interfaces globales
├── shared/               # Componentes y utilidades compartidas
│   ├── components/       # Componentes reutilizables
│   └── utils/            # Funciones puras compartidas
└── features/             # Features específicas (feature-based architecture)
    └── separacion-ecd/   # Feature: Separación ECD
        ├── components/   # Componentes de UI
        ├── containers/   # Contenedores con lógica
        ├── models/       # Tipos y datos mock
        ├── utils/        # Funciones utilitarias
        └── hooks/        # Custom hooks (si es necesario)

app/
├── layout.tsx            # Layout raíz con Sidebar
├── page.tsx              # Página principal
└── globals.css           # Estilos globales
```

## Características

- ✨ **UI Profesional**: Diseño moderno y limpio en modo light
- 📊 **Tabla Interactiva**: Filas colapsables con detalles de procesamiento
- 🎯 **Estados Visuales**: Badges notables para Pendiente, En Progreso, Error, Enviado
- 💄 **Tooltips Hermosos**: Información contextual al pasar el mouse
- 🎨 **Color Scheme Profesional**: Rojo #C1232B con grises y blancos neutros
- 📱 **Responsive**: Diseño mobile-first
- ⚙️ **Arquitectura Escalable**: Feature-based para fácil expansión

## Tecnologías

- **Next.js 16** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilos utility-first
- **Lucide Icons** - Iconografía moderna
- **React 19** - UI library

## Cómo empezar

1. Instala las dependencias:
```bash
pnpm install
```

2. Ejecuta el servidor de desarrollo:
```bash
pnpm dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Componentes Principales

### Sidebar
- Navegación jerárquica del sistema
- Menús colapsables
- Indicador de estado activo

### ProcessTable
- Tabla de subcuentas con filas colapsables
- Vista detallada de procesos por columna
- Selección múltiple

### StatusBadge
- Estados: Pendiente, En Progreso, Error, Enviado
- Tooltips informativos
- Iconografía clara

### FilterSection
- Rango de fechas
- Búsqueda de subcuentas
- Botón de actualización

### ActionsBar
- Ejecutar acciones en seleccionadas
- Eliminar acciones en seleccionadas
- Dropdowns contextuales

## Próximos pasos

- [ ] Integración con API backend
- [ ] Autenticación de usuarios
- [ ] Modo oscuro (opcional)
- [ ] Exportación de datos (CSV, Excel)
- [ ] Gráficos de progreso avanzados
- [ ] Sistema de filtros avanzados
