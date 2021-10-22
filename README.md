# API Mundo Disney

API para conocer los personajes y peliculas o series que componen el mundo Disney.

___

## Descripción
Podrás consumir esta API para crear, listar, actualizar o eliminar los personajes de Disney, como así también las series y peliculas donde aparecen.

## Empezando

Para ver los endpoints disponibles y los métodos para acceder a las operaciones descriptas anteriormente ingresa a [samples](https://github.com/moncholamas/alkemy_challenge_node/tree/master/samples).

___

## Dependencias
Antes de inicar el clonado del repositorio verifica tener:

- Postgres 13 o superior
- NodeJS 14 o superior
- Sender configurado en SendGrid (requiere una cuenta gratuita)
- Api Key de SendGrid (requiere una cuenta gratuita)

***


## Iniciando clonado del repositorio
```sh
#Clonar el repositorio 
git clone https://github.com/moncholamas/alkemy_challenge_node.git

```

### Instalar las dependencias
```sh
npm install
```

### Generar base de datos
```sh
psql -U username -d myDataBase -a -f /DB/disney.sql

```

### Actualizar variables de entorno
En la raiz del documento agregar un archivo .env donde recuperamos las variables de entorno con los datos locales, las variables son:

```sh
DB_USER=            #nombre del usuario de la DB
DB_PASS=            #clave para la db
DB_SERVER=          #nombre del servidor (localhost)
DB=                 #nombre de la base de datos
SENDGRID_API_KEY=   #api key de sendgrid para enviar notificaciones por correo
```

___




Correr en modo desarrollo

```sh
npm run dev
```

Lanzar a Producción

```sh
#Construye un directorio /dist
npm run build 

#Ejecuta el código generado en /dist
npm run start
```



***

### Autor
Por sugerencias, correcciones o comentarios: 
[Manuel Lamas](https://github.com/moncholamas/)