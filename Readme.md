# Sistema de Gestión para Farmacia Nova Salud



Sistema web moderno para gestión de inventario y ventas, desarrollado con React (frontend), Node.js (backend) y MySQL (base de datos).

## Características Principales

- 🧪 Gestión completa de productos (CRUD)
- 🧾 Sistema POS integrado con carrito de compras
- 📊 Dashboard de ventas e inventario
- 🔔 Alertas de stock bajo
- 📦 Control de lotes y fechas de expiración
- 📈 Reportes y estadísticas en tiempo real
- 🔐 Autenticación de usuarios y roles

## Requisitos Previos

- Node.js v16+
- MySQL 8+
- npm v9+
- Git (opcional)

## Instalación Local

### 1. Clonar repositorio
```bash
git clone https://github.com/tu-usuario/nova-salud.git
cd nova-salud

nova-salud/
├── backend/           # API Node.js
│   ├── config/        # Configuración DB
│   ├── controllers/   # Lógica de negocio
│   ├── models/        # Modelos de datos
│   └── routes/        # Endpoints API
│
├── frontend/          # Aplicación React
│   ├── public/        # Assets estáticos
│   └── src/           # Componentes principales
│
└── README.md          # Documentación
