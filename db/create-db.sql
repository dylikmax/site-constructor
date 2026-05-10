DROP DATABASE IF EXISTS site_constructor;
CREATE DATABASE IF NOT EXISTS site_constructor 
    DEFAULT CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE site_constructor;

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name CHAR(50) NOT NULL,
  url CHAR(50) UNIQUE NOT NULL,
  tree JSON NOT NULL,
  active BOOLEAN NOT NULL
)