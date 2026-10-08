import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { products as seedProducts, collections as seedCollections } from "@/data/catalog";

const DB_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, "ecommerce.db");

// Singleton connection across server requests
let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma("journal_mode = WAL");
    dbInstance.pragma("foreign_keys = ON");
    initDb(dbInstance);
  }
  return dbInstance;
}

function initDb(db: Database.Database) {
  db.exec(`
    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      nav TEXT NOT NULL,
      eyebrow TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT DEFAULT '',
      description TEXT NOT NULL,
      meta_title TEXT NOT NULL,
      accent TEXT DEFAULT 'gold',
      image TEXT DEFAULT '',
      groups_json TEXT DEFAULT '[]',
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Products table
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      subtitle TEXT DEFAULT '',
      category_id TEXT NOT NULL,
      group_name TEXT NOT NULL,
      origin TEXT DEFAULT '',
      short TEXT NOT NULL,
      description TEXT NOT NULL,
      highlights_json TEXT DEFAULT '[]',
      storage TEXT DEFAULT '',
      image TEXT NOT NULL,
      images_json TEXT DEFAULT '[]',
      alt TEXT NOT NULL,
      badge TEXT DEFAULT '',
      sku TEXT DEFAULT '',
      is_bestseller INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      is_out_of_stock INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      stock_qty INTEGER DEFAULT 50,
      max_order_qty INTEGER DEFAULT 10,
      low_stock_threshold INTEGER DEFAULT 5,
      prices_json TEXT NOT NULL,
      sale_prices_json TEXT DEFAULT '{}',
      includes_json TEXT DEFAULT '[]',
      festival TEXT DEFAULT '',
      tags_json TEXT DEFAULT '[]',
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE
    );

    -- Homepage sections table
    CREATE TABLE IF NOT EXISTS homepage_sections (
      id TEXT PRIMARY KEY,
      section_key TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT DEFAULT '',
      label TEXT DEFAULT '',
      eyebrow TEXT DEFAULT '',
      image TEXT DEFAULT '',
      source_type TEXT NOT NULL, -- 'category', 'best-sellers', 'featured', 'custom-products', 'custom-banner'
      source_category_id TEXT DEFAULT '',
      custom_product_ids_json TEXT DEFAULT '[]',
      limit_count INTEGER DEFAULT 8,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Orders table
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT DEFAULT '',
      address_line1 TEXT NOT NULL,
      address_line2 TEXT DEFAULT '',
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      delivery_notes TEXT DEFAULT '',
      subtotal REAL NOT NULL,
      discount_amount REAL DEFAULT 0,
      coupon_code TEXT DEFAULT '',
      shipping_charge REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      payment_method TEXT NOT NULL, -- 'online' | 'cod'
      payment_status TEXT NOT NULL, -- 'pending' | 'paid' | 'failed' | 'refunded'
      payment_gateway_ref TEXT DEFAULT '',
      payment_gateway_order_id TEXT DEFAULT '',
      order_status TEXT NOT NULL, -- 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
      items_json TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Customers table
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT DEFAULT '',
      address_line1 TEXT DEFAULT '',
      address_line2 TEXT DEFAULT '',
      city TEXT DEFAULT '',
      state TEXT DEFAULT '',
      pincode TEXT DEFAULT '',
      total_orders INTEGER DEFAULT 0,
      total_spent REAL DEFAULT 0,
      last_order_at TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Coupons table
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      discount_type TEXT NOT NULL, -- 'percent' | 'fixed'
      discount_value REAL NOT NULL,
      min_order_amount REAL DEFAULT 0,
      max_discount_amount REAL DEFAULT 0,
      usage_limit INTEGER DEFAULT 0, -- 0 for unlimited
      times_used INTEGER DEFAULT 0,
      valid_from TEXT DEFAULT '',
      valid_until TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Shipping settings & store config table
    CREATE TABLE IF NOT EXISTS store_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Admin users table
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed default data if empty
  seedInitialData(db);
}

function seedInitialData(db: Database.Database) {
  const catCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
  if (catCount.count === 0) {
    const insertCat = db.prepare(`
      INSERT INTO categories (id, slug, nav, eyebrow, title, subtitle, description, meta_title, accent, groups_json, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    let order = 1;
    for (const [key, c] of Object.entries(seedCollections)) {
      if (key === "best-sellers") continue;
      insertCat.run(
        c.id,
        c.id,
        c.nav,
        c.eyebrow,
        c.title,
        "",
        c.description,
        c.metaTitle,
        c.accent,
        JSON.stringify(c.groups),
        order++
      );
    }
  }

  const prodCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (prodCount.count === 0) {
    const insertProd = db.prepare(`
      INSERT INTO products (
        id, slug, name, subtitle, category_id, group_name, origin, short, description,
        highlights_json, storage, image, images_json, alt, badge, sku, is_bestseller,
        is_featured, is_new, is_out_of_stock, is_active, stock_qty, max_order_qty,
        low_stock_threshold, prices_json, sale_prices_json, includes_json, festival,
        tags_json, display_order
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?
      )
    `);

    let pOrder = 1;
    for (const p of seedProducts) {
      insertProd.run(
        p.slug,
        p.slug,
        p.name,
        "",
        p.category,
        p.group,
        p.origin,
        p.short,
        p.description,
        JSON.stringify(p.highlights || []),
        p.storage,
        p.image,
        JSON.stringify([p.image]),
        p.alt,
        p.bestseller ? "Bestseller" : "",
        `SKU-${p.slug.toUpperCase().slice(0, 8)}`,
        p.bestseller ? 1 : 0,
        p.featured || 0,
        0,
        0,
        1,
        60, // default healthy stock
        10, // max quantity allowed
        5,
        JSON.stringify(p.prices),
        JSON.stringify({}),
        JSON.stringify(p.includes || []),
        p.festival || "",
        JSON.stringify([]),
        pOrder++
      );
    }
  }

  // Seed default homepage sections if empty
  const secCount = db.prepare("SELECT COUNT(*) as count FROM homepage_sections").get() as { count: number };
  if (secCount.count === 0) {
    const insertSec = db.prepare(`
      INSERT INTO homepage_sections (
        id, section_key, title, subtitle, label, eyebrow, image, source_type,
        source_category_id, custom_product_ids_json, limit_count, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    insertSec.run(
      "sec-dry-fruits",
      "dry-fruits-section",
      "Hand-Selected Dry Fruits",
      "Whole California almonds, plump cashews, vibrant pistachios, and desert dates.",
      "Explore Dry Fruits",
      "Signature Nut & Fruit Harvest",
      "/images/california-almonds.jpg",
      "category",
      "dry-fruits",
      JSON.stringify([]),
      8,
      1
    );

    insertSec.run(
      "sec-chocolates",
      "chocolates-section",
      "Artisanal Chocolates & Confections",
      "Velvety dark chocolate slabs, roasted nut barks, and handcrafted pralines.",
      "Explore Chocolates",
      "Quiet Indulgence",
      "/images/dark-chocolate.jpg",
      "category",
      "chocolates",
      JSON.stringify([]),
      8,
      2
    );

    insertSec.run(
      "sec-coffee-tea",
      "coffee-tea-section",
      "Artisan Single-Origin Coffee & Pure Teas",
      "Fragrant plantation Arabica, spiced Kashmiri Kahwa, and golden Assam leaf.",
      "Explore Coffee & Tea",
      "Morning & Evening Sips",
      "/images/arabica-coffee.jpg",
      "category",
      "coffee-tea",
      JSON.stringify([]),
      8,
      3
    );

    insertSec.run(
      "sec-best-sellers",
      "best-sellers-section",
      "Customer Favourites & Best Sellers",
      "The dry fruit selections, hampers and treats that our guests reorder most often.",
      "Explore Best Sellers",
      "Loved Again & Again",
      "/images/hero-composition.jpg",
      "best-sellers",
      "",
      JSON.stringify([]),
      8,
      4
    );

    insertSec.run(
      "sec-bundles",
      "bundles-section",
      "Curated Celebration Boxes & Gift Hampers",
      "Luxurious bespoke gift presentations tailored for weddings, festivals, and milestones.",
      "Explore Celebration Boxes",
      "Occasions That Matter",
      "/images/gift-celebration.jpg",
      "category",
      "bundles",
      JSON.stringify([]),
      8,
      5
    );
  }

  // Seed store settings
  const settingsCount = db.prepare("SELECT COUNT(*) as count FROM store_settings").get() as { count: number };
  if (settingsCount.count === 0) {
    const insertSetting = db.prepare("INSERT INTO store_settings (key, value) VALUES (?, ?)");
    insertSetting.run("shipping_fee", "99");
    insertSetting.run("free_shipping_threshold", "1499");
    insertSetting.run("shipping_notes", "Standard fast doorstep delivery across India in 2–4 business days.");
    insertSetting.run("currency_symbol", "₹");
    insertSetting.run("tax_percent", "0");
    insertSetting.run("payment_gateway_mode", "simulated_gateway"); // 'simulated_gateway' | 'razorpay' | 'cashfree' | 'stripe'
    insertSetting.run("payment_gateway_key", "");
    insertSetting.run("payment_gateway_secret", "");
    insertSetting.run("enable_cod", "true");
    insertSetting.run("announcement_bar_enabled", "true");
    insertSetting.run("announcement_bar_text", "Complimentary express shipping on all orders above ₹1,499 · Fresh harvest guaranteed");
  }

  // Seed default coupons
  const couponCount = db.prepare("SELECT COUNT(*) as count FROM coupons").get() as { count: number };
  if (couponCount.count === 0) {
    const insertCoupon = db.prepare(`
      INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_amount, max_discount_amount, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);
    insertCoupon.run("c1", "WELCOME10", "10% off on your first order", "percent", 10, 500, 300);
    insertCoupon.run("c2", "FESTIVE200", "Flat ₹200 off on festive orders above ₹1,999", "fixed", 200, 1999, 200);
  }

  // Seed default admin user (admin / admin123)
  const adminCount = db.prepare("SELECT COUNT(*) as count FROM admin_users").get() as { count: number };
  if (adminCount.count === 0) {
    const insertAdmin = db.prepare(`
      INSERT INTO admin_users (id, username, password_hash, name, role)
      VALUES (?, ?, ?, ?, 'admin')
    `);
    // Standard SHA256 or secure hash
    insertAdmin.run("admin-1", "admin", "admin123", "Store Administrator");
  }
}
