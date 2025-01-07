# ProyectoE08 - Letras Phohibidas

<p align="center">
    <img src="LetrasProhibidas/frontend/public/favicon.ico" alt="ProyectoE08 Logo">
</p>

[![Run Frontend Tests](https://github.com/SyTW2425/ProyectoE08/actions/workflows/Run-Test-Frontend.yml/badge.svg)](https://github.com/SyTW2425/ProyectoE08/actions/workflows/Run-Test-Frontend.yml)
[![Run Tests Backend](https://github.com/SyTW2425/ProyectoE08/actions/workflows/Run-Test-Backend.yml/badge.svg?branch=dev)](https://github.com/SyTW2425/ProyectoE08/actions/workflows/Run-Test-Backend.yml)
[![Coverage Status](https://coveralls.io/repos/github/SyTW2425/ProyectoE08/badge.svg?branch=dev)](https://coveralls.io/github/SyTW2425/ProyectoE08?branch=dev)

## Descripción

ProyectoE08 es una aplicación web desarrollada con React en el frontend y Node.js en el backend. El objetivo del proyecto es proporcionar una plataforma para la gestión de tareas.

## Tecnologías

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express, MongoDB
- **Testing**: Mocha, chai, supertest, Jest

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/SyTW2425/ProyectoE08.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd ProyectoE08
   ```

### Frontend

3. Instala las dependencias del frontend:

   ```bash
   cd frontend
   npm install
   ```

4. Inicia la aplicación frontend:
   ```bash
   npm start
   ```

### Backend

5. Instala las dependencias del backend:

   ```bash
   cd backend
   npm install
   ```

6. Inicia la aplicación backend:
   ```bash
   npm start
   ```

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm start`

Inicia la aplicación en modo desarrollo.\
Abre [http://localhost:3000](http://localhost:3000) para verlo en tu navegador.

### `npm test`

Lanza el corredor de pruebas en modo interactivo(frontend).\
Consulta la sección sobre [ejecutar pruebas](https://facebook.github.io/create-react-app/docs/running-tests) para más información.

Lo mismo para el backend, en ese caso genera también un reporte.

### `npm run build`

Construye la aplicación para producción en la carpeta `build`.\
Agrupa correctamente React en modo de producción y optimiza la compilación para el mejor rendimiento.
