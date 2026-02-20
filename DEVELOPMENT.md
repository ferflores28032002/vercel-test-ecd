# Guía de Desarrollo - PowerSphere Operations

## Configuración Inicial

### Requisitos
- Node.js 18+
- pnpm (package manager)

### Instalación
```bash
# Instalar dependencias
pnpm install

# Ejecutar dev server
pnpm dev

# Build para producción
pnpm build

# Ejecutar build de producción localmente
pnpm start
```

## Estructura de Imports

### Imports Correctos
```tsx
// ✅ Usar alias de path
import { Sidebar } from '@/shared/components/Sidebar/Sidebar';
import { SeparacionECDContainer } from '@/features/separacion-ecd';
import { type SubcuentaData } from '@/types/process';

// ✅ Relativo cuando es necesario
import { Header } from '../components/Header/Header';
```

### Imports Incorrectos
```tsx
// ❌ Evitar paths relativos complejos
import { Sidebar } from '../../../../shared/components/Sidebar/Sidebar';

// ❌ Evitar imports innecesarios
import * from '@/features/separacion-ecd';
```

## Workflow de Desarrollo

### 1. Agregar un Nuevo Componente

```bash
# Crear estructura
mkdir src/features/mi-feature/components/MiComponente

# Crear archivo
touch src/features/mi-feature/components/MiComponente/MiComponente.tsx
```

```tsx
// MiComponente.tsx
'use client';

import React from 'react';

interface MiComponenteProps {
  title: string;
}

export function MiComponente({ title }: MiComponenteProps) {
  return <div className="p-4">{title}</div>;
}
```

### 2. Agregar un Hook Personalizado

```tsx
// hooks/useMiHook.ts
import { useState, useCallback } from 'react';

export function useMiHook(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  const updateValue = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return { value, updateValue };
}
```

### 3. Crear una Feature Completa

```bash
mkdir -p src/features/nueva-feature/{components,containers,hooks,models,utils}
```

```tsx
// models/index.ts
export interface NuevaFeatureData {
  id: string;
  title: string;
}

// components/NuevaComponent.tsx
export function NuevaComponent({ data }: { data: NuevaFeatureData }) {
  return <div>{data.title}</div>;
}

// containers/NuevaFeatureContainer.tsx
'use client';

import { NuevaComponent } from '../components/NuevaComponent';

export function NuevaFeatureContainer() {
  return <NuevaComponent data={{ id: '1', title: 'Test' }} />;
}

// index.ts
export { NuevaFeatureContainer } from './containers/NuevaFeatureContainer';
```

## Convenciones de Código

### Nombres de Archivos
```
✅ MiComponente.tsx      (PascalCase para componentes)
✅ useMiHook.ts          (camelCase para hooks)
✅ helpers.ts            (lowercase para utilidades)
✅ types.ts              (lowercase para tipos)
❌ my-component.tsx      (kebab-case)
❌ myComponent.ts        (archivo component con lowercase)
```

### Estructura de Componentes
```tsx
// 1. Imports
import React from 'react';

// 2. Tipos/Interfaces
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// 3. Componente
export function Component({ prop1, prop2 }: ComponentProps) {
  // Logic

  return (
    // JSX
  );
}

// 4. Export nombrado (ya está en la definición)
```

### Estilos Tailwind
```tsx
// ✅ Usar variables CSS personalizadas
className="bg-[#C1232B] text-white"

// ✅ Grouping lógico
className="flex items-center gap-4 px-6 py-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"

// ❌ Evitar clases inline complejas
className="some-very-long-class-string"
```

## Testing

### Setup
```bash
pnpm add -D @testing-library/react @testing-library/jest-dom vitest
```

### Ejemplo de Test
```tsx
// __tests__/Component.test.tsx
import { render, screen } from '@testing-library/react';
import { Component } from '../Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component prop1="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

## Debugging

### Console Logging
```tsx
// ✅ Uso apropiado
console.log('Datos recibidos:', data);
console.error('Error en función:', error);

// ❌ Evitar
console.log('test');
console.log(data); // sin contexto
```

### React DevTools
- Usar React DevTools extension para inspeccionar componentes
- Verificar props y estado
- Usar el profiler para performance

## Performance

### Code Splitting
```tsx
// Lazy loading de componentes pesados
const HeavyComponent = lazy(() => import('./HeavyComponent'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Memoización
```tsx
// ✅ Usar para componentes que reciben objetos complejos
export const Component = memo(({ data }: Props) => {
  return <div>{data.title}</div>;
});

// ✅ Usar useCallback para callbacks
const handleClick = useCallback(() => {
  // handler
}, []);
```

## Deployment

### Vercel
```bash
# Pushear a GitHub automáticamente deployará
git push origin main
```

### Variables de Entorno
```bash
# .env.local (desarrollo)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Variables en Vercel dashboard para producción
```

## Troubleshooting

### Error: Module not found
```
Solución: Verificar paths en tsconfig.json y nombres de archivos
```

### Error: Hydration mismatch
```
Solución: Marcar componentes con 'use client' si usan state/hooks
```

### Lenta la compilación
```
Solución: Usar dynamic imports, verificar archivos sin usar
```

## Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [TypeScript](https://www.typescriptlang.org/docs)

## Git Workflow

```bash
# Feature branch
git checkout -b feature/nueva-feature

# Commits
git add .
git commit -m "feat: agregar nueva funcionalidad"

# Push y crear PR
git push origin feature/nueva-feature
```

### Commit Messages
```
✅ feat: agregar nueva funcionalidad
✅ fix: corregir bug en componente
✅ refactor: mejorar código existente
✅ docs: actualizar documentación
❌ update, change, fix (muy vago)
```

## Checklist Pre-Commit

- [ ] Código compila sin errores
- [ ] Types están correctos
- [ ] Tests pasan
- [ ] Componentes están en el lugar correcto
- [ ] Imports usan path aliases
- [ ] Documentación actualizada
