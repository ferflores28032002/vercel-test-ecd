# Guía de Estilos - PowerSphere Operations

## Paleta de Colores (Light Mode)

### Colores Primarios
- **Rojo Profesional**: `#C1232B` - Para acciones principales, botones, enlaces
- **Rojo Hover**: `#A11D26` - Estado hover de elementos rojo
- **Rojo Claro**: `#F5E6E6` - Fondo con énfasis rojo suave

### Escala de Grises
- **Blanco**: `#FFFFFF` - Fondo principal
- **Slate 50**: `#F8FAFC` - Fondo muy claro, secciones
- **Slate 100**: `#F1F5F9` - Fondo alterno
- **Slate 200**: `#E2E8F0` - Bordes
- **Slate 300**: `#CBD5E1` - Bordes secundarios
- **Slate 400**: `#94A3B8` - Placeholder text
- **Slate 500**: `#64748B` - Texto deshabilitado
- **Slate 600**: `#475569` - Texto secundario
- **Slate 700**: `#334155` - Texto terciario
- **Slate 900**: `#0F172A` - Texto principal

### Estados Semánticos
- **Éxito**: `#16A34A` - Para acciones exitosas
- **Advertencia**: `#EA8C00` - Para advertencias
- **Error**: `#DC2626` - Para errores
- **Info**: `#0EA5E9` - Para información

## Tipografía

### Fuentes
- **Sans Serif**: Geist (headings y body)
- **Mono**: Geist Mono (código y valores técnicos)

### Tamaños y Pesos
```
h1: 30px (3xl), font-bold (700)
h2: 24px (2xl), font-semibold (600)
h3: 20px (xl), font-semibold (600)
h4: 16px (lg), font-medium (500)

Body: 14px, font-normal (400)
Small: 12px, font-normal (400)
Caption: 12px, font-normal (400)
```

### Line Height
- Body text: 1.5 (leading-relaxed)
- Headings: 1.2 (tight)

## Espaciado

Seguir escala de Tailwind:
```
2px   (0.5)
4px   (1)
8px   (2)
12px  (3)
16px  (4)
24px  (6)
32px  (8)
48px  (12)
64px  (16)
```

## Componentes

### Botones

#### Primario (Rojo)
```tsx
className="bg-[#C1232B] text-white hover:bg-[#A11D26] px-6 py-2.5 rounded-md font-medium transition-colors"
```

#### Secundario (Gris)
```tsx
className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2.5 rounded-md font-medium transition-colors"
```

#### Deshabilitado
```tsx
className="bg-slate-300 text-slate-500 cursor-not-allowed"
```

### Badges de Estado

#### Éxito
```tsx
className="bg-green-50 border border-green-200 text-green-700 px-2.5 py-1.5 rounded-md"
```

#### Advertencia
```tsx
className="bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1.5 rounded-md"
```

#### Error
```tsx
className="bg-red-50 border border-red-200 text-red-700 px-2.5 py-1.5 rounded-md"
```

#### Info
```tsx
className="bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1.5 rounded-md"
```

### Inputs

```tsx
className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C1232B]/20 bg-white"
```

### Cards

```tsx
className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm"
```

### Bordes y Sombras

- **Border**: `border-slate-200`
- **Border Hover**: `border-slate-300`
- **Shadow Light**: `shadow-sm`
- **Radius**: `rounded-md` (8px), `rounded-lg` (12px)

## Iconografía

- Usar **Lucide Icons** para consistencia
- Tamaños estándar: `16px`, `20px`, `24px`
- Color: Heredar del texto padre

## Casos de Uso por Color

### Rojo (#C1232B)
- ✅ Botones primarios
- ✅ Enlaces principales
- ✅ Indicadores críticos
- ✅ Acciones importantes
- ❌ Texto de contenido
- ❌ Fondos

### Verde (#16A34A)
- ✅ Estados completados
- ✅ Validaciones exitosas
- ✅ Checkmarks
- ❌ Textos largos

### Gris (Slate)
- ✅ Estructura y layout
- ✅ Bordes y divisores
- ✅ Texto secundario
- ✅ Fondos de secciones
- ❌ Énfasis importante

## Espaciado de Layouts

### Padding
- **Container principal**: `p-6`
- **Card interior**: `p-6`
- **Sección**: `px-6 py-4`

### Gap
- **Entre elementos**: `gap-4`
- **Entre secciones**: `gap-6`
- **Denso**: `gap-2`

## Responsive Design

Breakpoints de Tailwind:
```
sm: 640px  (tablets)
md: 768px  (pequeños laptops)
lg: 1024px (laptops normales)
xl: 1280px (pantallas grandes)
```

## Ejemplos de Composición

### Header Profesional
```tsx
<div className="space-y-2">
  <h1 className="text-3xl font-bold text-slate-900">Título</h1>
  <p className="text-sm text-slate-600">Subtítulo o descripción</p>
</div>
```

### Sección con Tarjeta
```tsx
<div className="space-y-6">
  <div>
    <h2 className="text-lg font-semibold text-slate-900 mb-3">
      Título Sección
    </h2>
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      {/* Contenido */}
    </div>
  </div>
</div>
```

### Grid Responsive
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map(item => (...))}
</div>
```

## Animaciones

- **Transiciones**: `transition-colors`, `transition-all`
- **Duración**: `duration-300` (default)
- **Easing**: Built-in Tailwind (ease-in-out por defecto)

## Accesibilidad

- ✅ Usar semantic HTML
- ✅ Alt text en imágenes
- ✅ ARIA labels donde sea necesario
- ✅ Contrast ratio ≥ 4.5:1
- ✅ Focus states visible
- ✅ Labels explícitos en inputs

## Checklist de UI

- [ ] Usa colores de la paleta
- [ ] Respeta espaciado
- [ ] Tipografía consistente
- [ ] Bordes y sombras apropiadas
- [ ] Responsive en mobile
- [ ] Estados hover/focus visibles
- [ ] Accesibilidad completa
- [ ] Sin colores duplicados
