CREATE TABLE personajes(
	id_personaje SERIAL,
	imagen VARCHAR,
	nombre VARCHAR,
	edad SMALLINT,
	peso DECIMAL,
	historia TEXT,
	PRIMARY KEY (id_personaje)
);

CREATE TABLE peliculas_series(
	id_pelicula_serie SERIAL,
	imagen VARCHAR,
	titulo VARCHAR,
	fecha_creacion DATE,
	calificacion SMALLINT CHECK (calificacion <6 AND calificacion > 0),
	id_genero INTEGER,
	PRIMARY KEY (id_pelicula_serie)
);

CREATE TABLE generos(
	id_genero SERIAL,
	nombre VARCHAR,
	PRIMARY KEY (id_genero)
);

CREATE TABLE apariciones(
	id_personaje INTEGER,
	id_pelicula_serie INTEGER,
	PRIMARY KEY (id_personaje, id_pelicula_serie)
);

CREATE TABLE users(
	id_user SERIAL,
	mail_user VARCHAR UNIQUE,
	pass_user VARCHAR,
	PRIMARY KEY (id_user)
)

ALTER TABLE peliculas_series ADD CONSTRAINT "fkgeneros" 
    FOREIGN KEY (id_genero)
    REFERENCES generos(id_genero)
;

ALTER TABLE apariciones ADD CONSTRAINT "fkpersonajes" 
    FOREIGN KEY (id_personaje)
    REFERENCES personajes(id_personaje)
;

ALTER TABLE apariciones ADD CONSTRAINT "fkpeliculas" 
    FOREIGN KEY (id_pelicula_serie)
    REFERENCES peliculas_series(id_pelicula_serie)
;

INSERT INTO generos VALUES 
(1, 'infantil'), 
(2, 'accion'), 
(3, 'ciencia ficcion'), 
(4, 'juvenil'), 
(5, 'animado'); 