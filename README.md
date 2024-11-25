<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
   
```bash
yarn install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la base de datos
```
docker compose up --build -d
```

5. Clonarel archivo __.env.template__ y renombrarlo a __.env__

6. Llenar las variables de entorno definidas en el __.env__

7. Ejecutar la aplicacion en dev 

```
yarn start:dev
```

## Stack utilizado
* MongoDb
* Nest


# Production Build
1. Crear el archivo ```.env.prod```
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

# Notas
Heroku redeploy sin cambios:
```
git commit --allow-empty -m "Trigger Heroku deploy"
git push heroku <master | main>
```
