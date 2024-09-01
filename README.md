# API de Gestión de Productos y Carritos

Esta API está diseñada para gestionar productos y carritos utilizando Express y MongoDB. Proporciona endpoints para crear, leer, actualizar y eliminar productos, así como carritos de compras.

## Productos

### Endpoints Disponibles

- `POST /api/products`: Crea un nuevo producto.
- `GET /api/products`: Obtiene la lista de productos con paginación.
- `GET /api/products/:id`: Obtiene un producto por su ID.
- `PUT /api/products/:id`: Actualiza un producto existente por su ID.
- `DELETE /api/products/:id`: Elimina un producto por su ID.

## Carritos

### Endpoints Disponibles

- `POST /api/carts`: Crea un nuevo carrito.
- `GET /api/carts/:cid`: Obtiene un carrito por su ID.
- `PUT /api/carts/:cid/product/:pid`: Agrega un producto a un carrito por su ID de carrito y ID de producto.
- `PUT /api/carts/:cid`: Actualiza los productos de un carrito por su ID.
- `DELETE /api/carts/:cid/product/:pid`: Elimina un producto de un carrito por su ID de carrito y ID de producto.
- `DELETE /api/carts/:cid`: Elimina todos los productos de un carrito por su ID.
