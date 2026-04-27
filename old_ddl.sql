-- ============================================================
-- Grocery Price Tracker - Database Schema (DDL)
-- Database: grocery_tracker
-- ============================================================

CREATE DATABASE IF NOT EXISTS grocery_tracker;
USE grocery_tracker;

-- ============================================================
-- TABLE 1: users
-- Stores registered user accounts.
-- password_hash uses BCrypt (60-char output).
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    user_id      INT          NOT NULL AUTO_INCREMENT,
    username     VARCHAR(50)  NOT NULL,
    email        VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(60) NOT NULL,          -- BCrypt hash
    firstName varchar(255) not null,
    lastName varchar(255) not null,
    unique (username),
    constraint userName_min_length check (char_length(trim(userName)) >= 2),
    constraint firstName_min_length check (char_length(trim(firstName)) >= 2),
    constraint lastName_min_length check (char_length(trim(lastName)) >= 2),
    PRIMARY KEY (user_id)
);

-- ============================================================
-- TABLE 2: stores
-- Represents individual grocery store locations.
-- chain groups locations (ex all Kroger branches).
-- ============================================================
CREATE TABLE IF NOT EXISTS stores (
    store_id    INT          NOT NULL AUTO_INCREMENT,
    store_name  VARCHAR(100) NOT NULL,
    chain       VARCHAR(100) NOT NULL, -- ex# like 'Kroger', 'Publix', 'Walmart'
    city        VARCHAR(100) NOT NULL,
    state       CHAR(2)      NOT NULL,
    zip_code    VARCHAR(10)  NOT NULL,
    PRIMARY KEY (store_id)
);

-- ============================================================
-- TABLE 3: products
-- The product catalog. unit_type examples: oz, lb, gallon, count.
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    product_id   INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(150) NOT NULL,
    category     VARCHAR(100) NOT NULL, -- e.g. 'Dairy', 'Produce', 'Meat'
    brand        VARCHAR(100),  -- nullable for store-brand / generic if generic we will have a default 
    unit_size    DECIMAL(8,2),  -- e.g. 16.0
    unit_type    VARCHAR(20),   -- e.g. 'oz', 'lb', 'gallon', 'count'
    PRIMARY KEY (product_id)
);

-- ============================================================
-- TABLE 4: price_records
-- Core data table — one row per product per store per month.
-- is_sale flags items currently below their regular price.
-- reg_price stores the regular (non-sale) price for comparison.
-- This table will hold 1000+ rows. combination between stores and products 
-- ============================================================
CREATE TABLE IF NOT EXISTS price_records (
    record_id    INT            NOT NULL AUTO_INCREMENT,
    product_id   INT            NOT NULL,
    store_id     INT            NOT NULL,
    price        DECIMAL(10,2)  NOT NULL, -- actual recorded price
    reg_price    DECIMAL(10,2), -- regular/avg shelf price (for sale comparison)
    is_sale      BOOLEAN        NOT NULL DEFAULT FALSE, --will use simple logic to determine if it falls within a sale price <~20%
    price_date   DATE           NOT NULL,   

    PRIMARY KEY (record_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (store_id)   REFERENCES stores(store_id)     ON DELETE CASCADE
);

-- ============================================================
-- TABLE 5: shopping_lists
-- A user can own many lists; each list belongs to one user.
-- is_active allows our user to see what their current shopping list is ~ will try to keep at just one 
-- ============================================================
CREATE TABLE IF NOT EXISTS shopping_lists (
    list_id     INT          NOT NULL AUTO_INCREMENT,
    user_id     INT          NOT NULL,
    list_name   VARCHAR(100) NOT NULL DEFAULT 'My List',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,

    PRIMARY KEY (list_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE 6: list_items  (weak entity)
-- Each item belongs to exactly one list and references one product.
-- quantity defaults to 1; checked tracks whether item was bought.
-- ============================================================
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

-- ============================================================
-- TABLE 7: posts
-- Community forum posts. Each post belongs to one user.
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
    post_id    INT          NOT NULL AUTO_INCREMENT,
    user_id    INT          NOT NULL,
    title      VARCHAR(200) NOT NULL,
    body       TEXT         NOT NULL,
    posted_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================================
-- INDEXES
-- Index 1: price_records(product_id, price_date)
--   Speeds up price history queries, 52-week high/low,
--   and average price-per-month aggregations on the 1000+ row table.
--
-- Index 2: users(email)
--   Speeds up the login lookup — login queries filter by email,
--   which without an index requires a full table scan.
-- ============================================================
CREATE INDEX idx_price_product_date ON price_records (product_id, price_date);
CREATE INDEX idx_user_email         ON users (email);
