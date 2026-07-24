CREATE DATABASE IF NOT EXISTS bookstore;

USE bookstore;

DROP TABLE IF EXISTS books;

CREATE TABLE books (

    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    author VARCHAR(255) NOT NULL,

    category VARCHAR(100) NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

INSERT INTO books
(title,author,category,price,description)

VALUES

(
'Clean Code',
'Robert C. Martin',
'Programming',
650,
'Best practices for writing clean and maintainable code.'
),

(
'Docker Deep Dive',
'Nigel Poulton',
'DevOps',
899,
'Comprehensive guide to Docker containers.'
),

(
'Kubernetes in Action',
'Marko Luksa',
'DevOps',
1200,
'Hands-on guide for learning Kubernetes.'
),

(
'Linux Pocket Guide',
'Daniel Barrett',
'Linux',
550,
'Essential Linux commands and administration.'
),

(
'Terraform Up & Running',
'Yevgeniy Brikman',
'Cloud',
999,
'Infrastructure as Code using Terraform.'
);
