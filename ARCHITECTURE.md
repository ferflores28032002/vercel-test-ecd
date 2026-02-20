# Arquitectura del Proyecto - PowerSphere Operations

## Filosofía

Este proyecto sigue una **feature-based architecture** con clara separación de responsabilidades, garantizando escalabilidad, mantenibilidad y fácil expansión.

## Estructura de Directorios

```
app/
├── layout.tsx          # Layout raíz con Sidebar y Header
├── page.tsx            # Página principal
└── globals.css         # Estilos globales y variables CSS

src/
├── types/              # Tipos globales compartidos por toda la aplicación
├── shared/             # Código compartido entre features
│   ├── components/     # Componentes reutilizables
│   ├── utils/          # Funciones puras compartidas
│   └── index.ts        # Exports
│
└── features/           # Features específicas, cada una independiente
    └── separacion-ecd/
        ├── components/ # Componentes UI específicos del feature
        │   ├── Header/
        │   ├── FilterSection/
        │   ├── ProcessTable/
        │   ├── ProcessTableRow/
        │   └── ActionsBar/
        │
        ├── containers/ # Contenedores con lógica
        │   └── SeparacionECDContainer.tsx
        │
        ├── hooks/      # Hooks personalizados
        │   └── useSeparacionECD.ts
        │
        ├── models/     # Tipos, interfaces y datos mock
        │   └── mockData.ts
        │
        ├── utils/      # Funciones utilitarias específicas
        │   └── helpers.ts
        │
        └── index.ts    # Exports
```

## Principios de Diseño

### 1. **Separación de Responsabilidades**

- **Pages**: Solo layout y composición (Next.js)
- **Containers**: Lógica de negocio y manejo de estado
- **Components**: UI pura, sin lógica de negocio
- **Models**: Tipos, interfaces, datos y servicios
- **Utils**: Funciones puras y reutilizables

### 2. **Feature-Based Organization**

Cada feature es independiente y auto-contenida:
- Componentes específicos del feature en su carpeta
- Lógica compartida en `shared/`
- Tipos globales en `src/types/`

### 3. **Reutilización**

- Componentes genéricos en `shared/components/`
- Hooks reutilizables en cada feature
- Utilidades puras en `shared/utils/`

### 4. **Type Safety**

- TypeScript estricto
- Interfaces explícitas
- Props validadas

## Patrones Comunes

### Componente UI Puro

```tsx
// components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Container con Lógica

```tsx
// containers/MyContainer.tsx
'use client';

import { useMyHook } from '../hooks/useMyHook';

export function MyContainer() {
  const { data, loading, error } = useMyHook();
  
  return <div>{/* Render usando data */}</div>;
}
```

### Hook Personalizado

```tsx
// hooks/useMyHook.ts
export function useMyHook() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Lógica
  }, []);
  
  return { data };
}
```

## Archivos de Configuración

- **tsconfig.json**: Rutas alias (`@/types/*`, `@/features/*`, etc.)
- **tailwind.config.ts**: Sistema de diseño (colores, fuentes, etc.)
- **globals.css**: Variables CSS y estilos globales

## Colores (Light Mode)

```css
--primary-red: #C1232B;           /* Rojo profesional */
--slate-50: #F8FAFC;              /* Fondo muy claro */
--slate-100: #F1F5F9;             /* Fondo */
--slate-200: #E2E8F0;             /* Bordes */
--slate-600: #475569;             /* Texto secundario */
--slate-900: #0F172A;             /* Texto principal */
```

## Cómo Agregar una Nueva Feature

1. **Crear estructura**:
```bash
mkdir src/features/mi-feature/{components,containers,hooks,models,utils}
```

2. **Crear tipos** en `models/`:
```tsx
// models/types.ts
export interface MyData {
  id: string;
  name: string;
}
```

3. **Crear componentes** en `components/`:
```tsx
// components/MyComponent.tsx
interface MyComponentProps {
  data: MyData;
}

export function MyComponent({ data }: MyComponentProps) {
  return <div>{data.name}</div>;
}
```

4. **Crear contenedor** en `containers/`:
```tsx
// containers/MyFeatureContainer.tsx
'use client';

import { useMyHook } from '../hooks/useMyHook';
import { MyComponent } from '../components/MyComponent';

export function MyFeatureContainer() {
  const { data } = useMyHook();
  return <MyComponent data={data} />;
}
```

5. **Exportar** en `index.ts`:
```ts
// index.ts
export { MyFeatureContainer } from './containers/MyFeatureContainer';
```

6. **Usar en página**:
```tsx
// app/mi-feature/page.tsx
import { MyFeatureContainer } from '@/features/mi-feature';

export default function Page() {
  return <MyFeatureContainer />;
}
```

## Mejores Prácticas

### ✅ DO

- Separar UI de lógica
- Usar TypeScript estrictamente
- Componentes pequeños y reutilizables
- Propiedades explícitas en interfaces
- Funciones puras en utils
- Comentarios en funciones complejas

### ❌ DON'T

- Lógica en componentes
- Props implícitas o `any`
- Componentes gigantes
- Estado global innecesario
- Imports circulares
- Archivos con >300 líneas

## Performance

- Server Components para contenido estático
- Client Components solo donde sea necesario
- Lazy loading de componentes pesados
- Memoización estratégica
- Suspense para async operations

## Testing (Preparado)

La estructura facilita testing:
- Components: Testing aislado de UI
- Utils: Testing de lógica pura
- Hooks: Testing con `@testing-library/react`
- Containers: Testing de integración

## Escalabilidad

Esta arquitectura soporta:
- ✅ Múltiples features sin conflictos
- ✅ Código compartido reutilizable
- ✅ Fácil refactorización
- ✅ Onboarding de nuevos desarrolladores
- ✅ Migración de dependencias
- ✅ Testing completo
