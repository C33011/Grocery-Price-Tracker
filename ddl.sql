CREATE DATABASE IF NOT EXISTS grocery_tracker;
USE grocery_tracker;

CREATE TABLE IF NOT EXISTS users (
    user_id      INT          NOT NULL AUTO_INCREMENT,
    username     VARCHAR(50)  NOT NULL UNIQUE,
    email        VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(60) NOT NULL,
    firstName    VARCHAR(255) NOT NULL,
    lastName     VARCHAR(255) NOT NULL,
    CONSTRAINT userName_min_length CHECK (CHAR_LENGTH(TRIM(username)) >= 2),
    CONSTRAINT firstName_min_length CHECK (CHAR_LENGTH(TRIM(firstName)) >= 2),
    CONSTRAINT lastName_min_length CHECK (CHAR_LENGTH(TRIM(lastName)) >= 2),
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS stores (
    store_id    INT          NOT NULL AUTO_INCREMENT,
    store_name  VARCHAR(100) NOT NULL,
    chain       VARCHAR(100) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    state       CHAR(2)      NOT NULL,
    zip_code    VARCHAR(10)  NOT NULL,
    PRIMARY KEY (store_id)
);

CREATE TABLE IF NOT EXISTS products (
    product_id   INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(150) NOT NULL,
    category     VARCHAR(100) NOT NULL,
    brand        VARCHAR(100),
    unit_size    DECIMAL(8,2),
    unit_type    VARCHAR(20),
    PRIMARY KEY (product_id)
);

CREATE TABLE IF NOT EXISTS price_records (
    record_id    INT            NOT NULL AUTO_INCREMENT,
    product_id   INT            NOT NULL,
    store_id     INT            NOT NULL,
    price        DECIMAL(10,2)  NOT NULL,
    reg_price    DECIMAL(10,2),
    is_sale      BOOLEAN        NOT NULL DEFAULT FALSE,
    price_date   DATE           NOT NULL,
    PRIMARY KEY (record_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (store_id)   REFERENCES stores(store_id)     ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shopping_lists (
    list_id     INT          NOT NULL AUTO_INCREMENT,
    user_id     INT          NOT NULL,
    list_name   VARCHAR(100) NOT NULL DEFAULT 'My List',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    PRIMARY KEY (list_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS list_items (
    item_id     INT     NOT NULL AUTO_INCREMENT,
    list_id     INT     NOT NULL,
    product_id  INT     NOT NULL,
    quantity    INT     NOT NULL DEFAULT 1,
    checked     BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (item_id),
    FOREIGN KEY (list_id)    REFERENCES shopping_lists(list_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts (
    post_id    INT          NOT NULL AUTO_INCREMENT,
    user_id    INT          NOT NULL,
    title      VARCHAR(200) NOT NULL,
    body       TEXT         NOT NULL,
    posted_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_price_product_date ON price_records (product_id, price_date);
CREATE INDEX IF NOT EXISTS idx_user_email ON users (email);
