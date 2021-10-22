# Endpoints y ejemplos de uso

### BackUp de modelos de peticiones en Postman
Podrás acceder a estos request ya terminados desde la copia de Postman que está disponible en este directorio.
___

### Los endpoints disponibles son:

```sh
# No requieren autenticación
/auth/login
/auth/register

# Requieren un token de validacion
/characters
/movies

```
----

## Login y Logup
Registrate con un correo electrónico y una clave.
El registro o el login devolverán un token necesario para las peticiones.
```sh
#crea una cuenta nueva
[POST] #verbo HTTP
/auth/register #ruta
    Header: #no requiere
    body: {
        "mail_user": string, #respetar formato de mail
        "pass_user": string
    }

#ingresa con una cuenta existente
[POST] #verbo HTTP
/auth/login #ruta
    Header: #no requiere
    body: {
        "mail_user": string,
        "pass_user": string
    }
```

***
### Cuestiones generales
Te recomendamos una de estas dos opciones:
- cargar primero las peliculas y asociar los personajes con estás peliculas creadas.
- cargar primero los personajes y luego asociar las peliculas con estos datos ya cargados. Este documento usa este método.


Consideramos los siguientes géneros disponibles:
- infantil 
- accion
- ciencia ficcion
- juvenil
- animado

Estos datos se cargan cuando se genera la base de datos.

---

## Characters (Personajes)
Métodos disponibles para interactuar con personajes
```sh
#listar todos los personajes
[GET] #verbo HTTP
/characters #ruta
    Header: token
    body: #no requiere

#trae todos los detalles del personaje con el id seleccionado
[GET] #verbo HTTP
/characters/:id #ruta
    Header: token
    body: #no requiere


#carga un personaje nuevo
[POST] #verbo HTTP
/characters/ #ruta
    Header: token
    body: {
        "nombre":string,
        "imagen": string,
        "peso": decimal,
        "edad":integer,
        "historia": text,
        "movies": [] #arreglo vacio (no existen peliculas)
    }

#actualiza los datos del personaje con el id seleccionado
[PUT] #verbo HTTP
/characters/:id #ruta
    Header: token
    body: {
        "nombre":string,
        "imagen": string,
        "peso": decimal,
        "edad":integer,
        "historia": text,
        "movies": [] #arreglo vacio (no existen peliculas)
    }

#borra el personaje con el id seleccionado
[DELETE] #verbo HTTP
/characters/:id #ruta
    Header: token
    body #no requiere

```

---

## Movies (Peliculas y Series)

```sh
#listar todas las peliculas
[GET] #verbo HTTP
/movies #ruta
    Header: token
    body: #no requiere

#trae los detalles de la pelicula con el id seleccionado
[GET] #verbo HTTP
/movies/:id #ruta
    Header: token
    body: #no requiere

#crea una nueva pelicula o serie
[POST] #verbo HTTP
/movies/ #ruta
    Header: token
    body: {
        "titulo": string,
        "imagen": string,
        "fecha_creacion": string('aaaa-mm-dd'),
        "calificacion": integer[1,5], # toma por defecto 3 si no es ingresado
        "genero": integer, #toma por defecto 1 si no es ingresado
        "listado_personajes": [3,6] #consideramos que ya existen cargados los personajes con el id 3 y 6
    }   


#actualiza los datos de la pelicula con el id seleccionado
[PUT] #verbo HTTP
/movies/:id #ruta
    Header: token
    body: {
        "titulo": string,
        "imagen": string,
        "fecha_creacion": string('aaa-mm-dd'),
        "calificacion": integer[1,5], # toma por defecto 3 si no es ingresado
        "genero": integer, #toma por defecto 1 si no es ingresado
        "listado_personajes": [3,6] #consideramos que ya existen cargados los personajes con el id 3 y 6
        # si se envia un array vacio borra el listado de personajes
    }

#borra la pelicula con el id seleccionado
[DELETE] #verbo HTTP
/movies/:id #ruta
    Header: token
    body #no requiere
```

***

### Búsquedas y filtros

Buscar un personaje por nombre 
```sh
[GET] #verbo HTTP
/characters?name=ejemplo #ruta
    Header: token
    body #no requiere

# devuelve un arreglo de personajes cuyo nombre contenga "ejemplo"
```
Filtrar personajes
```sh

# filtrar por edad
[GET] #verbo HTTP
/characters?edad=int #ruta
    Header: token
    body #no requiere


# filtrar por aparicion en una serie o pelicula
[GET] #verbo HTTP
/characters?movies=int #ruta
    Header: token
    body #no requiere
```


Buscar una pelicula o serie por titulo 
```sh
[GET] #verbo HTTP
/movies?title=ejemplo #ruta
    Header: token
    body #no requiere

# devuelve un arreglo de peliculas cuyo titulo contenga "ejemplo"
```
Filtrar peliculas o series
```sh

# filtrar por genero
[GET] #verbo HTTP
/movies?genre=int #ruta
    Header: token
    body #no requiere


# filtrar por fecha de creacion ASC o DESC
[GET] #verbo HTTP
/movies?order=ASC|DESC #ruta
    Header: token
    body #no requiere
#indistinto el uso de mayusculas o minisculas en el parametro

```