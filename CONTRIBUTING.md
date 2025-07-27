# 🤝 Guía de Contribución - Essence Luxe

¡Gracias por tu interés en contribuir a Essence Luxe! Esta guía te ayudará a empezar.

## 🚀 Cómo Contribuir

### 1. Fork y Clone
```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/tu-usuario/essence-luxe-perfumes.git
cd essence-luxe-perfumes
```

### 2. Configurar el entorno
```bash
# Instalar dependencias
pnpm install

# Copiar archivo de configuración
cp .env.example .env

# Configurar variables de entorno con tus credenciales de Airtable
```

### 3. Crear una rama para tu feature
```bash
git checkout -b feature/mi-nueva-funcionalidad
# o
git checkout -b fix/corregir-bug
```

### 4. Hacer cambios
- Escribe código limpio y bien documentado
- Sigue las convenciones de código existentes
- Agrega tests si es necesario
- Actualiza la documentación

### 5. Commit y Push
```bash
git add .
git commit -m "feat: agregar nueva funcionalidad de filtros"
git push origin feature/mi-nueva-funcionalidad
```

### 6. Crear Pull Request
- Ve a GitHub y crea un Pull Request
- Describe claramente los cambios realizados
- Incluye capturas de pantalla si es relevante

## 📝 Convenciones de Código

### Commits
Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan funcionalidad)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

### TypeScript
- Usar tipos explícitos siempre que sea posible
- Evitar `any` - usar tipos específicos
- Documentar interfaces complejas

### React
- Usar componentes funcionales con hooks
- Extraer lógica compleja a custom hooks
- Mantener componentes pequeños y enfocados

### CSS/TailwindCSS
- Usar clases de TailwindCSS cuando sea posible
- Para estilos complejos, usar CSS modules
- Mantener diseño responsivo

## 🎯 Áreas de Contribución

### 🐛 Reportar Bugs
- Usar el template de issues para bugs
- Incluir pasos para reproducir
- Agregar capturas de pantalla
- Especificar versión del navegador

### ✨ Nuevas Funcionalidades
- Discutir la funcionalidad en un issue primero
- Asegurar que esté alineada con la visión del proyecto
- Considerar el impacto en la experiencia del usuario

### 📚 Documentación
- Mejorar README y documentación
- Agregar comentarios en código complejo
- Crear tutoriales o guías

### 🎨 Diseño y UX
- Mejorar la interfaz de usuario
- Optimizar para móviles
- Mejorar accesibilidad

## 🧪 Testing

### Ejecutar tests
```bash
# Tests unitarios
pnpm test

# Tests de integración
pnpm test:integration

# Coverage
pnpm test:coverage
```

### Escribir tests
- Agregar tests para nuevas funcionalidades
- Mantener coverage alto
- Usar Jest y React Testing Library

## 📦 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── hooks/         # Custom hooks
├── context/       # Contextos React
├── types/         # Tipos TypeScript
├── utils/         # Utilidades
└── __tests__/     # Tests
```

## 🔧 Scripts Útiles

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Preview build
pnpm preview

# Linting
pnpm lint

# Format código
pnpm format

# Type checking
pnpm type-check
```

## 📋 Checklist antes de PR

- [ ] El código compila sin errores
- [ ] Los tests pasan
- [ ] El código está formateado correctamente
- [ ] La documentación está actualizada
- [ ] Se probó en diferentes navegadores
- [ ] Se probó en móviles
- [ ] No hay console.log() olvidados
- [ ] Las variables de entorno están documentadas

## 💬 Obtener Ayuda

¿Tienes preguntas? ¡No dudes en preguntar!

- 📧 Email: dev@essenceluxe.com
- 💬 Discussions: [GitHub Discussions](https://github.com/tu-usuario/essence-luxe-perfumes/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/essence-luxe-perfumes/issues)

## 🙏 Reconocimiento

Todos los contribuidores serán reconocidos en:
- README del proyecto
- Release notes
- Hall of Fame en la documentación

¡Gracias por hacer que Essence Luxe sea mejor! ✨
