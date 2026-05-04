-- ============================================================
-- GrocerIQ -- Application Queries (queries.sql)
-- These are the main SQL queries the application uses,
-- grouped by the page/feature they belong to.
-- ============================================================


-- ------------------------------------------------------------
-- UI 2: Home Dashboard  (/api/dashboard)
-- ------------------------------------------------------------

-- Q1: Featured Products
--  grabs the first 10 products to show on the dashboard.
SELECT *
FROM products
ORDER BY product_id
LIMIT 10;


-- Q2: Price Alerts
-- Finds products where the most recent price at a store is below
-- that store's 12-month rolling average for the same product.
-- Results are ranked by how far below average the price is.
SELECT
    p.product_id,
    p.product_name,
    p.brand,
    p.category,
    s.store_name,
    s.chain,
    current_price.price                                                                  AS current_price,
    ROUND(avg_price.avg_price, 2)                                                        AS avg_price,
    ROUND(((avg_price.avg_price - current_price.price) / avg_price.avg_price) * 100, 1) AS pct_below_avg
FROM products p
JOIN (
    -- get the most recent price record per product per store
    SELECT pr1.product_id, pr1.store_id, pr1.price
    FROM price_records pr1
    INNER JOIN (
        SELECT product_id, store_id, MAX(price_date) AS max_date
        FROM price_records
        GROUP BY product_id, store_id
    ) latest
        ON  pr1.product_id = latest.product_id
        AND pr1.store_id   = latest.store_id
        AND pr1.price_date = latest.max_date
) current_price ON p.product_id = current_price.product_id
JOIN stores s ON current_price.store_id = s.store_id
JOIN (
    -- 12-month rolling average per product per store
    SELECT product_id, store_id, AVG(price) AS avg_price
    FROM price_records
    WHERE price_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY product_id, store_id
) avg_price
    ON  p.product_id           = avg_price.product_id
    AND current_price.store_id = avg_price.store_id
WHERE current_price.price < avg_price.avg_price
ORDER BY pct_below_avg DESC
LIMIT 10;


-- ------------------------------------------------------------
-- UI 3: Grocery List Manager  (/api/lists, /api/lists/{id})
-- ------------------------------------------------------------

-- Q3: Get all lists for a user
SELECT *
FROM shopping_lists
WHERE user_id = ?
ORDER BY created_at DESC;


-- Q4: Create a new list
INSERT INTO shopping_lists (user_id, list_name)
VALUES (?, ?);


-- Q5: Archive a list (set is_active = 0)
UPDATE shopping_lists
SET is_active = 0
WHERE list_id = ? AND user_id = ?;


-- Q6: Get all items in a list with their product names
SELECT
    li.item_id,
    li.list_id,
    li.product_id,
    p.product_name,
    li.quantity,
    li.checked
FROM list_items li
JOIN products p ON li.product_id = p.product_id
WHERE li.list_id = ?;


-- Q7: Add an item to a list
INSERT INTO list_items (list_id, product_id, quantity)
VALUES (?, ?, ?);


-- Q8: Remove an item from a list
-- The JOIN to shopping_lists makes sure the item actually belongs
-- to a list owned by the user making the request.
DELETE li
FROM list_items li
JOIN shopping_lists sl ON li.list_id = sl.list_id
WHERE li.item_id = ? AND sl.list_id = ? AND sl.user_id = ?;


-- Q9: Check or uncheck an item
UPDATE list_items li
JOIN shopping_lists sl ON li.list_id = sl.list_id
SET li.checked = ?
WHERE li.item_id = ? AND sl.list_id = ? AND sl.user_id = ?;


-- ------------------------------------------------------------
-- UI 4: Product Search & Filter  (/api/products)
-- ------------------------------------------------------------

-- Q10: Search products by name and/or category (no chain filter)
SELECT *
FROM products
WHERE product_name LIKE ? AND category LIKE ?
ORDER BY product_name;


-- Q11: Search products with a store chain filter
-- We have to join price_records and stores here so we only return
-- products that actually have a price recorded at the given chain.
SELECT DISTINCT p.*
FROM products p
JOIN price_records pr ON p.product_id = pr.product_id
JOIN stores s         ON pr.store_id  = s.store_id
WHERE p.product_name LIKE ? AND p.category LIKE ? AND s.chain LIKE ?
ORDER BY p.product_name;


-- Q12: Get a user's active lists for the "Add to List" dropdown
SELECT list_id, list_name
FROM shopping_lists
WHERE user_id = ? AND is_active = 1;


-- Q13: Add one or more products to a list from the search page
-- ON DUPLICATE KEY handles the case where the product is already
-- in the list -- it just increments quantity instead of inserting a duplicate.
INSERT INTO list_items (list_id, product_id, quantity)
VALUES (?, ?, 1)
ON DUPLICATE KEY UPDATE quantity = quantity + 1;


-- ------------------------------------------------------------
-- UI 5: Product Detail  (/api/products/{id})
-- ------------------------------------------------------------

-- Q14: Current price at each store for a product
-- The subquery finds the latest price_date per store so we only
-- show the most recent entry, not every historical record.
SELECT
    pr.record_id,
    pr.product_id,
    pr.store_id,
    s.store_name,
    s.chain,
    pr.price,
    pr.reg_price,
    pr.is_sale,
    pr.price_date
FROM price_records pr
JOIN stores s ON pr.store_id = s.store_id
WHERE pr.product_id = ?
  AND pr.price_date = (
      SELECT MAX(pr2.price_date)
      FROM price_records pr2
      WHERE pr2.product_id = pr.product_id
        AND pr2.store_id   = pr.store_id
  )
ORDER BY pr.price ASC;


-- Q15: 52-week high and low
SELECT
    MIN(price) AS week_low,
    MAX(price) AS week_high
FROM price_records
WHERE product_id = ?
  AND price_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR);


-- Q16: Monthly average price history (last 24 months)
-- Averages across all stores per month. This feeds both the
-- bar chart and the linear regression prediction.
SELECT
    DATE_FORMAT(price_date, '%Y-%m') AS month,
    AVG(price)                       AS avg_price
FROM price_records
WHERE product_id = ?
  AND price_date >= DATE_SUB(CURDATE(), INTERVAL 24 MONTH)
GROUP BY month
ORDER BY month ASC;


-- ------------------------------------------------------------
-- UI 6: Community Forum  (/api/forum)
-- ------------------------------------------------------------

-- Q17: Get all posts newest first
SELECT
    p.post_id,
    p.user_id,
    u.username,
    p.title,
    p.body,
    p.posted_at
FROM posts p
JOIN users u ON p.user_id = u.user_id
ORDER BY p.posted_at DESC;


-- Q18: Create a new post
INSERT INTO posts (user_id, title, body)
VALUES (?, ?, ?);


-- ------------------------------------------------------------
-- Authentication  (/api/auth)
-- ------------------------------------------------------------

-- Q19: Login -- look up user by username 
SELECT *
FROM users
WHERE username = ?;


-- Q20: Register a new user
INSERT INTO users (username, email, password_hash, firstName, lastName)
VALUES (?, ?, ?, ?, ?);