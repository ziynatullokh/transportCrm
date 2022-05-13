INSERT INTO branches(branch_name, branch_address) VALUES ('Toshkent','Toshkent shahri chilonzor tumani 5-uy'),
('Andijon','Andijon shahri andijon tumani 55-uy'),
('Fargona','Fargona shahri fargona tumani 60-uy'),
('Namangan','Namangan shahri namangan tumani 2-uy'),
('Sirdaryo','Sirdaryo shahri sirdaryo tumani 88-uy'),
('Samarqand','Samarqand shahri samarqand tumani 47-uy'),
('Navoiy','Navoiy shahri Navoiy tumani 489-uy'),
('Buxoro','Buxoro shahri Buxoro tumani 989-uy'),
('Xorazm','Xorazm shahri Xorazm tumani 49-uy'),
('Qarshi','Qarshi shahri Qarshi tumani 489-uy'),
('Termiz','Termiz shahri Termiz tumani 48-uy'),
('Chirchiq','Chirchiq shahri Chirchiq tumani 49-uy');

INSERT INTO transport_models (model_name) VALUES ('Nexia'),
('Damas'),
('Nexia 2'),
('Nexia 3'),
('Gentra'),
('Captiva'),
('Tiko'),
('Matiz'),
('Lacetti'),
('Cobalt');

INSERT INTO transport_colors (color_name) VALUES ('Oq'),
('Qora'),
('Qizil'),
('Kulrang'),
('Sariq');


INSERT INTO transports (transport_branch,transport_model,transport_color,transport_img)VALUES 
(1,1,4,'link'),
(2,2,4,'link'),
(3,3,4,'link'),
(4,4,4,'link'),
(5,5,4,'link');


INSERT INTO users (user_name,user_password,user_birth_date,user_gender,user_branch)VALUES
('super','super','2015-05-15',1,1);


UPDATE users_permissions 
SET user_create = true,
user_read = true,
user_delete = true,
user_update = true

WHERE user_id = 1;


SELECT 
	u.*
FROM users u
LEFT JOIN branches b ON u.user_branch = b.branch_id;