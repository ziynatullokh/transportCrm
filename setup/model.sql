-- connect database postgres
\c postgres;

-- delete database cars
DROP DATABASE IF EXISTS cars;

-- create database cars
CREATE DATABASE cars;

-- connect database cars
\c cars;

-- create table branches
CREATE TABLE branches(
	branch_id INT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	branch_name VARCHAR(64) NOT NULL,
	branch_address VARCHAR(256) NOT NULL,
	branch_created_time_at TIMESTAMP default current_timestamp
);


-- create table transport_models
CREATE TABLE transport_models(
	model_id INT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	model_name VARCHAR(16) NOT NULL,
	model_created_time_at TIMESTAMP default current_timestamp
);

-- create table transport_colors
CREATE TABLE transport_colors(
	color_id INT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	color_name VARCHAR(20) NOT NULL,
	color_created_time_at TIMESTAMP default current_timestamp
);





--create table users
CREATE TABLE users(
	user_id INT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	user_name VARCHAR(64) NOT NULL,
	user_password VARCHAR(256) NOT NULL,
	user_birth_date DATE NOT NULL,
	user_gender SMALLINT,
	user_branch INT NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
	user_created_time_at TIMESTAMP default current_timestamp
);

-- create table transports
CREATE TABLE transports(
	transport_id INT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	staff_id INT NOT NULL REFERENCES users(user_id),
	transport_branch INT NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
	transport_model INT NOT NULL REFERENCES transport_models(model_id),
	transport_color INT NOT NULL REFERENCES transport_colors(color_id),
	transport_img TEXT NOT NULL,
	transport_created_time_at TIMESTAMP default current_timestamp
);

-- create table permissions
CREATE TABLE users_permissions(
	user_id INT NOT NULL  REFERENCES users(user_id) ON DELETE CASCADE,
	user_modul VARCHAR(64) NOT NULL,
	user_create BOOLEAN NOT NULL default false,
	user_read BOOLEAN NOT NULL default false,
	user_delete BOOLEAN NOT NULL default false,
	user_update BOOLEAN NOT NULL default false,
	permission_crated_time_at TIMESTAMP default current_timestamp
);

