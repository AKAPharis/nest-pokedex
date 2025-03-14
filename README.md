<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Ejecutar en desarrollo

1. Clonar el repositorio
2. ejecutar
```
npm i
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4. Levantar la base de datos
```
docker-compose up -d
```
5. Clonar archivo ```.env.template``` y renombrar la copia a ```.env```

6. Llenar las variables de entorno definidas en el ```.env```

7. Ejecutar la aplicación en dev:
```
npm run start:dev
yarn start:dev
```


8. Recostruir la base de datos con la semilla
```
http://localhost:3000/api/v2/seed
```

## Stack usado
* MongoDB
* Nest
* Docker

# Production Build
1. Crear el archivo ```.env.prod```
2. Llenar las variables de entorno de prod
3. crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build

```

# Notas
Heroku redeploy sin cambios:
```
git commit --allow-empty -m "Trigger Heroku deploy"
git push heroku <master|main>
```