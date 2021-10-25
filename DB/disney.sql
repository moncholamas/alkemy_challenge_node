CREATE TABLE personajes(
	id_personaje SERIAL,
	imagen VARCHAR NOT NULL,
	nombre VARCHAR UNIQUE NOT NULL,
	edad SMALLINT,
	peso SMALLINT,
	historia TEXT,
	PRIMARY KEY (id_personaje)
);

CREATE TABLE peliculas_series(
	id_pelicula_serie SERIAL,
	imagen VARCHAR NOT NULL,
	titulo VARCHAR UNIQUE NOT NULL,
	fecha_creacion DATE NOT NULL,
	calificacion SMALLINT CHECK (calificacion <6 AND calificacion > 0),
	id_genero INTEGER,
	PRIMARY KEY (id_pelicula_serie)
);

CREATE TABLE generos(
	id_genero SERIAL,
	nombre VARCHAR NOT NULL,
	PRIMARY KEY (id_genero)
);

CREATE TABLE apariciones(
	id_personaje INTEGER,
	id_pelicula_serie INTEGER,
	PRIMARY KEY (id_personaje, id_pelicula_serie)
);

CREATE TABLE users(
	id_user SERIAL,
	mail_user VARCHAR UNIQUE NOT NULL,
	pass_user VARCHAR NOT NULL,
	PRIMARY KEY (id_user)
);

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


-------------------------- TRIGGERS
CREATE OR REPLACE FUNCTION eliminar_apariciones() RETURNS TRIGGER
AS $$
DECLARE
BEGIN
IF (TG_TABLE_NAME = 'peliculas_series') THEN
	DELETE FROM apariciones WHERE id_pelicula_serie = OLD.id_pelicula_serie;
END IF;
IF (TG_TABLE_NAME = 'personajes') THEN
	DELETE FROM apariciones WHERE id_personaje = OLD.id_personaje;
END IF;
RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER borrar_apariciones
BEFORE DELETE ON peliculas_series
FOR EACH ROW EXECUTE PROCEDURE eliminar_apariciones();

CREATE TRIGGER borrar_apariciones
BEFORE DELETE ON personajes
FOR EACH ROW EXECUTE PROCEDURE eliminar_apariciones();


------------------------DATOS INICIALES

INSERT INTO generos VALUES 
(1, 'infantil'), 
(2, 'accion'), 
(3, 'ciencia ficcion'), 
(4, 'juvenil'), 
(5, 'animado'); 