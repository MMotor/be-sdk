En carpeta /services viene la autenticación con geotab, obteniendo las credenciales de un archivo .env
Tambien se puede ver dos metodos call y multicall, para hacer uso de ellos en el archivo index.js

En index.js se puede ver una función con el metodo para DeviceStatusInfo, hace uso del objeto del servicio de geotab que automatiza el login de las credenciales

Es importante instalar las librerias:
    1. dotenv
    2. fs-extra
    3. mg-api-js

ejecutar con: node src/index.js
escuchando en el puerto: 3000