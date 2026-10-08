import { getDb } from "./db";
import { type Weight, type CategoryId, type Accent } from "@/data/catalog";

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category_id: string;
  group_name: string;
  origin: string;
  short: string;
  description: string;
  highlights: string[];
  storage: string;
  image: string;
  images: string[];
  alt: string;
  badge: string;
  sku: string;
  is_bestseller: boolean;
  is_featured: number;
  is_new: boolean;
  is_out_of_stock: boolean;
  is_active: boolean;
  stock_qty: number;
  max_order_qty: number;
  low_stock_threshold: number;
  prices: Partial<Record<Weight, number>>;
  sale_prices: Partial<Record<Weight, number>>;
  includes: string[];
  festival: string;
  tags: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type DbCategory = {
  id: string;
  slug: string;
  nav: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  meta_title: string;
  accent: Accent;
  image: string;
  groups: string[];
  display_order: number;
  is_active: boolean;
  product_count?: number;
};

export type DbHomepageSection = {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  label: string;
  eyebrow: string;
  image: string;
  source_type: "category" | "best-sellers" | "featured" | "custom-products";
  source_category_id: string;
  custom_product_ids: string[];
  limit_count: number;
  display_order: number;
  is_active: boolean;
};

export type DbOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  delivery_notes: string;
  subtotal: number;
  discount_amount: number;
  coupon_code: string;
  shipping_charge: number;
  total_amount: number;
  payment_method: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_gateway_ref: string;
  payment_gateway_order_id: string;
  order_status: "pending" | "confirmed" | "processing" | "packed" | "shipped" | "delivered" | "cancelled" | "refunded";
  items: Array<{
    id: string;
    slug: string;
    name: string;
    image: string;
    weight: string;
    price: number;
    qty: number;
  }>;
  created_at: string;
  updated_at: string;
};

export type DbCoupon = {
  id: string;
  code: string;
  description: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number;
  usage_limit: number;
  times_used: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
};

export type DbCustomer = {
  id: string;
  phone: string;
  name: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  total_orders: number;
  total_spent: number;
  last_order_at: string;
  created_at: string;
};

export type StoreSettings = {
  shipping_fee: number;
  free_shipping_threshold: number;
  shipping_notes: string;
  currency_symbol: string;
  tax_percent: number;
  payment_gateway_mode: "simulated_gateway" | "razorpay" | "cashfree";
  payment_gateway_key: string;
  payment_gateway_secret: string;
  enable_cod: boolean;
  announcement_bar_enabled: boolean;
  announcement_bar_text: string;
};

// -------------------------------------------------------------
// PRODUCT REPOSITORY
// -------------------------------------------------------------

function rowToProduct(row: any): DbProduct {
  let prices = {};
  let sale_prices = {};
  let highlights = [];
  let images = [];
  let includes = [];
  let tags = [];

  try { prices = JSON.parse(row.prices_json || "{}"); } catch {}
  try { sale_prices = JSON.parse(row.sale_prices_json || "{}"); } catch {}
  try { highlights = JSON.parse(row.highlights_json || "[]"); } catch {}
  try { images = JSON.parse(row.images_json || "[]"); } catch {}
  try { includes = JSON.parse(row.includes_json || "[]"); } catch {}
  try { tags = JSON.parse(row.tags_json || "[]"); } catch {}

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle || "",
    category_id: row.category_id,
    group_name: row.group_name,
    origin: row.origin || "",
    short: row.short,
    description: row.description,
    highlights,
    storage: row.storage || "",
    image: row.image,
    images: images.length ? images : [row.image],
    alt: row.alt,
    badge: row.badge || "",
    sku: row.sku || "",
    is_bestseller: Boolean(row.is_bestseller),
    is_featured: Number(row.is_featured) || 0,
    is_new: Boolean(row.is_new),
    is_out_of_stock: Boolean(row.is_out_of_stock || row.stock_qty <= 0),
    is_active: Boolean(row.is_active),
    stock_qty: Number(row.stock_qty) || 0,
    max_order_qty: Number(row.max_order_qty) || 10,
    low_stock_threshold: Number(row.low_stock_threshold) || 5,
    prices,
    sale_prices,
    includes,
    festival: row.festival || "",
    tags,
    display_order: Number(row.display_order) || 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function getAllProducts(options?: {
  categoryId?: string;
  activeOnly?: boolean;
  search?: string;
  sortBy?: "featured" | "price-asc" | "price-desc" | "name" | "stock" | "newest";
  limit?: number;
  offset?: number;
}): { products: DbProduct[]; total: number } {
  const db = getDb();
  let whereClauses: string[] = [];
  let params: any[] = [];

  if (options?.activeOnly !== false) {
    whereClauses.push("is_active = 1");
  }

  if (options?.categoryId && options.categoryId !== "all") {
    if (options.categoryId === "best-sellers") {
      whereClauses.push("is_bestseller = 1");
    } else {
      whereClauses.push("category_id = ?");
      params.push(options.categoryId);
    }
  }

  if (options?.search) {
    const term = `%${options.search.trim().toLowerCase()}%`;
    whereClauses.push("(LOWER(name) LIKE ? OR LOWER(short) LIKE ? OR LOWER(group_name) LIKE ? OR LOWER(sku) LIKE ?)");
    params.push(term, term, term, term);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const totalRow = db.prepare(`SELECT count(*) as count FROM products ${whereSql}`).get(...params) as { count: number };
  const total = totalRow.count;

  let orderSql = "ORDER BY display_order ASC, is_featured DESC, id DESC";
  if (options?.sortBy === "price-asc") {
    orderSql = "ORDER BY prices_json ASC"; // will refine in app or basic sort
  } else if (options?.sortBy === "price-desc") {
    orderSql = "ORDER BY prices_json DESC";
  } else if (options?.sortBy === "name") {
    orderSql = "ORDER BY name ASC";
  } else if (options?.sortBy === "stock") {
    orderSql = "ORDER BY stock_qty ASC";
  } else if (options?.sortBy === "newest") {
    orderSql = "ORDER BY created_at DESC";
  }

  let limitSql = "";
  if (options?.limit) {
    limitSql = `LIMIT ${options.limit}`;
    if (options.offset) {
      limitSql += ` OFFSET ${options.offset}`;
    }
  }

  const rows = db.prepare(`SELECT * FROM products ${whereSql} ${orderSql} ${limitSql}`).all(...params);
  let products = rows.map(rowToProduct);

  if (options?.sortBy === "price-asc" || options?.sortBy === "price-desc") {
    products.sort((a, b) => {
      const pA = Math.min(...Object.values(a.prices).map(Number).filter(Boolean));
      const pB = Math.min(...Object.values(b.prices).map(Number).filter(Boolean));
      return options.sortBy === "price-asc" ? pA - pB : pB - pA;
    });
  }

  return { products, total };
}

export function getProductBySlug(slug: string): DbProduct | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug);
  return row ? rowToProduct(row) : null;
}

export function getProductById(id: string): DbProduct | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  return row ? rowToProduct(row) : null;
}

export function saveProduct(product: Partial<DbProduct> & { name: string; category_id: string }): DbProduct {
  const db = getDb();
  const id = product.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const slug = (product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) || id;

  const existing = db.prepare("SELECT id FROM products WHERE id = ? OR slug = ?").get(id, slug);

  if (existing) {
    db.prepare(`
      UPDATE products SET
        slug = ?, name = ?, subtitle = ?, category_id = ?, group_name = ?, origin = ?,
        short = ?, description = ?, highlights_json = ?, storage = ?, image = ?,
        images_json = ?, alt = ?, badge = ?, sku = ?, is_bestseller = ?, is_featured = ?,
        is_new = ?, is_out_of_stock = ?, is_active = ?, stock_qty = ?, max_order_qty = ?,
        low_stock_threshold = ?, prices_json = ?, sale_prices_json = ?, includes_json = ?,
        festival = ?, tags_json = ?, display_order = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      slug,
      product.name,
      product.subtitle || "",
      product.category_id,
      product.group_name || "General",
      product.origin || "",
      product.short || "",
      product.description || "",
      JSON.stringify(product.highlights || []),
      product.storage || "",
      product.image || "/images/california-almonds.jpg",
      JSON.stringify(product.images || [product.image]),
      product.alt || product.name,
      product.badge || "",
      product.sku || "",
      product.is_bestseller ? 1 : 0,
      product.is_featured || 0,
      product.is_new ? 1 : 0,
      product.is_out_of_stock ? 1 : 0,
      product.is_active === false ? 0 : 1,
      Number(product.stock_qty) || 0,
      Number(product.max_order_qty) || 10,
      Number(product.low_stock_threshold) || 5,
      JSON.stringify(product.prices || {}),
      JSON.stringify(product.sale_prices || {}),
      JSON.stringify(product.includes || []),
      product.festival || "",
      JSON.stringify(product.tags || []),
      Number(product.display_order) || 0,
      id
    );
  } else {
    db.prepare(`
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
    `).run(
      id,
      slug,
      product.name,
      product.subtitle || "",
      product.category_id,
      product.group_name || "General",
      product.origin || "",
      product.short || "",
      product.description || "",
      JSON.stringify(product.highlights || []),
      product.storage || "",
      product.image || "/images/california-almonds.jpg",
      JSON.stringify(product.images || [product.image]),
      product.alt || product.name,
      product.badge || "",
      product.sku || "",
      product.is_bestseller ? 1 : 0,
      product.is_featured || 0,
      product.is_new ? 1 : 0,
      product.is_out_of_stock ? 1 : 0,
      product.is_active === false ? 0 : 1,
      Number(product.stock_qty) || 0,
      Number(product.max_order_qty) || 10,
      Number(product.low_stock_threshold) || 5,
      JSON.stringify(product.prices || {}),
      JSON.stringify(product.sale_prices || {}),
      JSON.stringify(product.includes || []),
      product.festival || "",
      JSON.stringify(product.tags || []),
      Number(product.display_order) || 0
    );
  }

  return getProductById(id)!;
}

export function deleteProduct(id: string): boolean {
  const db = getDb();
  const res = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return res.changes > 0;
}

// -------------------------------------------------------------
// CATEGORY REPOSITORY
// -------------------------------------------------------------

function rowToCategory(row: any): DbCategory {
  let groups = [];
  try { groups = JSON.parse(row.groups_json || "[]"); } catch {}
  return {
    id: row.id,
    slug: row.slug,
    nav: row.nav,
    eyebrow: row.eyebrow,
    title: row.title,
    subtitle: row.subtitle || "",
    description: row.description,
    meta_title: row.meta_title,
    accent: row.accent || "gold",
    image: row.image || "",
    groups,
    display_order: Number(row.display_order) || 0,
    is_active: Boolean(row.is_active),
    product_count: row.product_count,
  };
}

export function getAllCategories(includeInactive = false): DbCategory[] {
  const db = getDb();
  const whereSql = includeInactive ? "" : "WHERE c.is_active = 1";
  const rows = db.prepare(`
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
    ${whereSql}
    GROUP BY c.id
    ORDER BY c.display_order ASC
  `).all();
  return rows.map(rowToCategory);
}

export function getCategoryBySlug(slug: string): DbCategory | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM categories WHERE slug = ? OR id = ?").get(slug, slug);
  return row ? rowToCategory(row) : null;
}

export function saveCategory(category: Partial<DbCategory> & { nav: string; title: string }): DbCategory {
  const db = getDb();
  const id = category.id || (category.slug || category.nav.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  const slug = category.slug || id;

  const existing = db.prepare("SELECT id FROM categories WHERE id = ?").get(id);

  if (existing) {
    db.prepare(`
      UPDATE categories SET
        slug = ?, nav = ?, eyebrow = ?, title = ?, subtitle = ?, description = ?,
        meta_title = ?, accent = ?, image = ?, groups_json = ?, display_order = ?,
        is_active = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      slug,
      category.nav,
      category.eyebrow || category.nav,
      category.title,
      category.subtitle || "",
      category.description || "",
      category.meta_title || category.title,
      category.accent || "gold",
      category.image || "",
      JSON.stringify(category.groups || []),
      Number(category.display_order) || 0,
      category.is_active === false ? 0 : 1,
      id
    );
  } else {
    db.prepare(`
      INSERT INTO categories (
        id, slug, nav, eyebrow, title, subtitle, description, meta_title,
        accent, image, groups_json, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      slug,
      category.nav,
      category.eyebrow || category.nav,
      category.title,
      category.subtitle || "",
      category.description || "",
      category.meta_title || category.title,
      category.accent || "gold",
      category.image || "",
      JSON.stringify(category.groups || []),
      Number(category.display_order) || 0,
      category.is_active === false ? 0 : 1
    );
  }

  return getCategoryBySlug(slug)!;
}

export function deleteCategory(id: string): boolean {
  const db = getDb();
  const res = db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  return res.changes > 0;
}

// -------------------------------------------------------------
// HOMEPAGE SECTIONS REPOSITORY
// -------------------------------------------------------------

function rowToSection(row: any): DbHomepageSection {
  let custom_product_ids = [];
  try { custom_product_ids = JSON.parse(row.custom_product_ids_json || "[]"); } catch {}
  return {
    id: row.id,
    section_key: row.section_key,
    title: row.title,
    subtitle: row.subtitle || "",
    label: row.label || "",
    eyebrow: row.eyebrow || "",
    image: row.image || "",
    source_type: row.source_type,
    source_category_id: row.source_category_id || "",
    custom_product_ids,
    limit_count: Number(row.limit_count) || 8,
    display_order: Number(row.display_order) || 0,
    is_active: Boolean(row.is_active),
  };
}

export function getAllHomepageSections(includeInactive = false): DbHomepageSection[] {
  const db = getDb();
  const whereSql = includeInactive ? "" : "WHERE is_active = 1";
  const rows = db.prepare(`SELECT * FROM homepage_sections ${whereSql} ORDER BY display_order ASC`).all();
  return rows.map(rowToSection);
}

export function saveHomepageSection(section: Partial<DbHomepageSection> & { title: string }): DbHomepageSection {
  const db = getDb();
  const id = section.id || `sec_${Date.now()}`;
  const section_key = section.section_key || id;

  const existing = db.prepare("SELECT id FROM homepage_sections WHERE id = ?").get(id);

  if (existing) {
    db.prepare(`
      UPDATE homepage_sections SET
        section_key = ?, title = ?, subtitle = ?, label = ?, eyebrow = ?,
        image = ?, source_type = ?, source_category_id = ?, custom_product_ids_json = ?,
        limit_count = ?, display_order = ?, is_active = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      section_key,
      section.title,
      section.subtitle || "",
      section.label || "",
      section.eyebrow || "",
      section.image || "",
      section.source_type || "category",
      section.source_category_id || "",
      JSON.stringify(section.custom_product_ids || []),
      Number(section.limit_count) || 8,
      Number(section.display_order) || 0,
      section.is_active === false ? 0 : 1,
      id
    );
  } else {
    db.prepare(`
      INSERT INTO homepage_sections (
        id, section_key, title, subtitle, label, eyebrow, image, source_type,
        source_category_id, custom_product_ids_json, limit_count, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      section_key,
      section.title,
      section.subtitle || "",
      section.label || "",
      section.eyebrow || "",
      section.image || "",
      section.source_type || "category",
      section.source_category_id || "",
      JSON.stringify(section.custom_product_ids || []),
      Number(section.limit_count) || 8,
      Number(section.display_order) || 0,
      section.is_active === false ? 0 : 1
    );
  }

  const row = db.prepare("SELECT * FROM homepage_sections WHERE id = ?").get(id);
  return rowToSection(row);
}

export function deleteHomepageSection(id: string): boolean {
  const db = getDb();
  const res = db.prepare("DELETE FROM homepage_sections WHERE id = ?").run(id);
  return res.changes > 0;
}

// -------------------------------------------------------------
// ORDERS & INVENTORY TRANSACTIONS
// -------------------------------------------------------------

function rowToOrder(row: any): DbOrder {
  let items = [];
  try { items = JSON.parse(row.items_json || "[]"); } catch {}
  return {
    ...row,
    items,
  };
}

export function createOrder(orderInput: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  delivery_notes?: string;
  coupon_code?: string;
  payment_method: "online" | "cod";
  items: Array<{
    id: string;
    slug: string;
    name: string;
    image: string;
    weight: string;
    price: number;
    qty: number;
  }>;
}): { order: DbOrder; error?: string } {
  const db = getDb();

  // Validate stock and calculate prices inside atomic transaction
  const tx = db.transaction(() => {
    // 1. Verify item availability and stock
    let subtotal = 0;
    for (const item of orderInput.items) {
      const prodRow = db.prepare("SELECT * FROM products WHERE slug = ? OR id = ?").get(item.slug, item.id) as any;
      if (!prodRow) {
        throw new Error(`Product "${item.name}" is no longer available.`);
      }
      if (!prodRow.is_active) {
        throw new Error(`Product "${prodRow.name}" is currently unavailable.`);
      }
      if (prodRow.is_out_of_stock || prodRow.stock_qty < item.qty) {
        throw new Error(`Insufficient stock for "${prodRow.name}". Only ${prodRow.stock_qty} left.`);
      }
      if (item.qty > prodRow.max_order_qty) {
        throw new Error(`Maximum purchase quantity for "${prodRow.name}" is ${prodRow.max_order_qty}.`);
      }

      subtotal += item.price * item.qty;
    }

    // 2. Calculate discount if coupon applied
    let discount_amount = 0;
    if (orderInput.coupon_code) {
      const coupon = db.prepare("SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1").get(orderInput.coupon_code) as any;
      if (coupon) {
        if (!coupon.min_order_amount || subtotal >= coupon.min_order_amount) {
          if (coupon.discount_type === "percent") {
            discount_amount = (subtotal * coupon.discount_value) / 100;
            if (coupon.max_discount_amount && discount_amount > coupon.max_discount_amount) {
              discount_amount = coupon.max_discount_amount;
            }
          } else {
            discount_amount = coupon.discount_value;
          }
          // Increment usage
          db.prepare("UPDATE coupons SET times_used = times_used + 1 WHERE id = ?").run(coupon.id);
        }
      }
    }

    // 3. Shipping charge calculation
    const settings = getStoreSettings();
    let shipping_charge = settings.shipping_fee;
    if (subtotal >= settings.free_shipping_threshold) {
      shipping_charge = 0;
    }

    const total_amount = Math.max(0, subtotal - discount_amount + shipping_charge);

    // 4. Generate Order Number
    const order_number = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const order_id = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // 5. Deduct inventory atomically
    for (const item of orderInput.items) {
      db.prepare(`
        UPDATE products
        SET stock_qty = MAX(0, stock_qty - ?),
            is_out_of_stock = CASE WHEN stock_qty - ? <= 0 THEN 1 ELSE is_out_of_stock END,
            updated_at = datetime('now')
        WHERE slug = ? OR id = ?
      `).run(item.qty, item.qty, item.slug, item.id);
    }

    // 6. Record or update Customer record
    const existingCust = db.prepare("SELECT * FROM customers WHERE phone = ?").get(orderInput.customer_phone) as any;
    if (existingCust) {
      db.prepare(`
        UPDATE customers SET
          name = ?, email = COALESCE(NULLIF(?, ''), email),
          address_line1 = ?, address_line2 = ?, city = ?, state = ?, pincode = ?,
          total_orders = total_orders + 1, total_spent = total_spent + ?,
          last_order_at = datetime('now'), updated_at = datetime('now')
        WHERE phone = ?
      `).run(
        orderInput.customer_name,
        orderInput.customer_email || "",
        orderInput.address_line1,
        orderInput.address_line2 || "",
        orderInput.city,
        orderInput.state,
        orderInput.pincode,
        total_amount,
        orderInput.customer_phone
      );
    } else {
      db.prepare(`
        INSERT INTO customers (
          id, phone, name, email, address_line1, address_line2, city, state, pincode,
          total_orders, total_spent, last_order_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, datetime('now'))
      `).run(
        `cust_${Date.now()}`,
        orderInput.customer_phone,
        orderInput.customer_name,
        orderInput.customer_email || "",
        orderInput.address_line1,
        orderInput.address_line2 || "",
        orderInput.city,
        orderInput.state,
        orderInput.pincode,
        total_amount
      );
    }

    // 7. Insert Order record
    db.prepare(`
      INSERT INTO orders (
        id, order_number, customer_name, customer_phone, customer_email,
        address_line1, address_line2, city, state, pincode, delivery_notes,
        subtotal, discount_amount, coupon_code, shipping_charge, total_amount,
        payment_method, payment_status, payment_gateway_ref, payment_gateway_order_id,
        order_status, items_json
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?
      )
    `).run(
      order_id,
      order_number,
      orderInput.customer_name,
      orderInput.customer_phone,
      orderInput.customer_email || "",
      orderInput.address_line1,
      orderInput.address_line2 || "",
      orderInput.city,
      orderInput.state,
      orderInput.pincode,
      orderInput.delivery_notes || "",
      subtotal,
      discount_amount,
      orderInput.coupon_code || "",
      shipping_charge,
      total_amount,
      orderInput.payment_method,
      orderInput.payment_method === "cod" ? "pending" : "pending",
      "",
      `gw_ord_${Date.now()}`,
      "confirmed",
      JSON.stringify(orderInput.items)
    );

    const saved = db.prepare("SELECT * FROM orders WHERE id = ?").get(order_id);
    return rowToOrder(saved);
  });

  try {
    const order = tx();
    return { order };
  } catch (err: any) {
    return { order: null as any, error: err.message };
  }
}

export function updateOrderStatus(orderId: string, status: DbOrder["order_status"]): DbOrder | null {
  const db = getDb();
  const current = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId) as any;
  if (!current) return null;

  // If cancelling or refunding, restore inventory
  if ((status === "cancelled" || status === "refunded") && current.order_status !== "cancelled" && current.order_status !== "refunded") {
    try {
      const items = JSON.parse(current.items_json || "[]");
      for (const item of items) {
        db.prepare(`
          UPDATE products
          SET stock_qty = stock_qty + ?,
              is_out_of_stock = CASE WHEN stock_qty + ? > 0 THEN 0 ELSE is_out_of_stock END,
              updated_at = datetime('now')
          WHERE slug = ? OR id = ?
        `).run(item.qty, item.qty, item.slug, item.id);
      }
    } catch {}
  }

  db.prepare("UPDATE orders SET order_status = ?, updated_at = datetime('now') WHERE id = ?").run(status, orderId);
  const updated = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  return rowToOrder(updated);
}

export function updatePaymentStatus(orderId: string, status: DbOrder["payment_status"], ref = ""): DbOrder | null {
  const db = getDb();
  db.prepare(`
    UPDATE orders
    SET payment_status = ?, payment_gateway_ref = COALESCE(NULLIF(?, ''), payment_gateway_ref), updated_at = datetime('now')
    WHERE id = ?
  `).run(status, ref, orderId);
  const updated = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  return rowToOrder(updated);
}

export function getAllOrders(options?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): { orders: DbOrder[]; total: number } {
  const db = getDb();
  let whereClauses: string[] = [];
  let params: any[] = [];

  if (options?.status && options.status !== "all") {
    whereClauses.push("order_status = ?");
    params.push(options.status);
  }

  if (options?.search) {
    const term = `%${options.search.trim().toLowerCase()}%`;
    whereClauses.push("(order_number LIKE ? OR LOWER(customer_name) LIKE ? OR customer_phone LIKE ?)");
    params.push(term, term, term);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const totalRow = db.prepare(`SELECT count(*) as count FROM orders ${whereSql}`).get(...params) as { count: number };
  const total = totalRow.count;

  let limitSql = "LIMIT 50";
  if (options?.limit) {
    limitSql = `LIMIT ${options.limit}`;
    if (options.offset) limitSql += ` OFFSET ${options.offset}`;
  }

  const rows = db.prepare(`SELECT * FROM orders ${whereSql} ORDER BY created_at DESC ${limitSql}`).all(...params);
  return { orders: rows.map(rowToOrder), total };
}

export function getOrderById(id: string): DbOrder | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM orders WHERE id = ? OR order_number = ?").get(id, id);
  return row ? rowToOrder(row) : null;
}

// -------------------------------------------------------------
// STORE SETTINGS REPOSITORY
// -------------------------------------------------------------

export function getStoreSettings(): StoreSettings {
  const db = getDb();
  const rows = db.prepare("SELECT key, value FROM store_settings").all() as Array<{ key: string; value: string }>;
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;

  return {
    shipping_fee: Number(map.shipping_fee) || 99,
    free_shipping_threshold: Number(map.free_shipping_threshold) || 1499,
    shipping_notes: map.shipping_notes || "Doorstep delivery across India in 2–4 business days.",
    currency_symbol: map.currency_symbol || "₹",
    tax_percent: Number(map.tax_percent) || 0,
    payment_gateway_mode: (map.payment_gateway_mode as any) || "simulated_gateway",
    payment_gateway_key: map.payment_gateway_key || "",
    payment_gateway_secret: map.payment_gateway_secret || "",
    enable_cod: map.enable_cod !== "false",
    announcement_bar_enabled: map.announcement_bar_enabled !== "false",
    announcement_bar_text: map.announcement_bar_text || "Complimentary express delivery on orders above ₹1,499",
  };
}

export function saveStoreSettings(settings: Partial<StoreSettings>) {
  const db = getDb();
  const stmt = db.prepare("INSERT INTO store_settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')");

  for (const [key, value] of Object.entries(settings)) {
    stmt.run(key, String(value));
  }
  return getStoreSettings();
}

// -------------------------------------------------------------
// COUPONS REPOSITORY
// -------------------------------------------------------------

export function getAllCoupons(): DbCoupon[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM coupons ORDER BY created_at DESC").all();
  return rows.map((r: any) => ({
    ...r,
    is_active: Boolean(r.is_active),
  }));
}

export function saveCoupon(coupon: Partial<DbCoupon> & { code: string; discount_value: number }): DbCoupon {
  const db = getDb();
  const id = coupon.id || `cpn_${Date.now()}`;
  const code = coupon.code.toUpperCase().trim();

  const existing = db.prepare("SELECT id FROM coupons WHERE id = ?").get(id);

  if (existing) {
    db.prepare(`
      UPDATE coupons SET
        code = ?, description = ?, discount_type = ?, discount_value = ?,
        min_order_amount = ?, max_discount_amount = ?, usage_limit = ?,
        is_active = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      code,
      coupon.description || "",
      coupon.discount_type || "percent",
      coupon.discount_value,
      coupon.min_order_amount || 0,
      coupon.max_discount_amount || 0,
      coupon.usage_limit || 0,
      coupon.is_active === false ? 0 : 1,
      id
    );
  } else {
    db.prepare(`
      INSERT INTO coupons (
        id, code, description, discount_type, discount_value,
        min_order_amount, max_discount_amount, usage_limit, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      code,
      coupon.description || "",
      coupon.discount_type || "percent",
      coupon.discount_value,
      coupon.min_order_amount || 0,
      coupon.max_discount_amount || 0,
      coupon.usage_limit || 0,
      coupon.is_active === false ? 0 : 1
    );
  }

  const row = db.prepare("SELECT * FROM coupons WHERE id = ?").get(id) as any;
  return { ...row, is_active: Boolean(row.is_active) };
}

export function deleteCoupon(id: string): boolean {
  const db = getDb();
  return db.prepare("DELETE FROM coupons WHERE id = ?").run(id).changes > 0;
}

export function validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: DbCoupon } {
  const db = getDb();
  const row = db.prepare("SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1").get(code) as any;
  if (!row) {
    return { valid: false, discount: 0, message: "Invalid or expired coupon code." };
  }

  const coupon: DbCoupon = { ...row, is_active: Boolean(row.is_active) };

  if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order of ₹${coupon.min_order_amount} required for this coupon.`,
    };
  }

  if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
    return { valid: false, discount: 0, message: "This coupon has reached its maximum usage limit." };
  }

  let discount = 0;
  if (coupon.discount_type === "percent") {
    discount = (subtotal * coupon.discount_value) / 100;
    if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
      discount = coupon.max_discount_amount;
    }
  } else {
    discount = coupon.discount_value;
  }

  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    discount,
    message: `Coupon applied! You saved ₹${discount}`,
    coupon,
  };
}

// -------------------------------------------------------------
// CUSTOMERS REPOSITORY
// -------------------------------------------------------------

export function getAllCustomers(search?: string): DbCustomer[] {
  const db = getDb();
  let sql = "SELECT * FROM customers";
  let params: any[] = [];
  if (search) {
    sql += " WHERE LOWER(name) LIKE ? OR phone LIKE ? OR LOWER(email) LIKE ?";
    const term = `%${search.toLowerCase()}%`;
    params.push(term, term, term);
  }
  sql += " ORDER BY total_spent DESC, total_orders DESC LIMIT 100";
  return db.prepare(sql).all(...params) as DbCustomer[];
}

// -------------------------------------------------------------
// DASHBOARD ANALYTICS REPOSITORY
// -------------------------------------------------------------

export function getDashboardMetrics() {
  const db = getDb();

  const totalSalesRow = db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid' OR (payment_method = 'cod' AND order_status != 'cancelled')").get() as any;
  const totalSales = Number(totalSalesRow?.total) || 0;

  const todaySalesRow = db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE (payment_status = 'paid' OR payment_method = 'cod') AND date(created_at) = date('now')").get() as any;
  const todaySales = Number(todaySalesRow?.total) || 0;

  const orderCounts = db.prepare(`
    SELECT
      count(*) as total_orders,
      sum(case when order_status = 'pending' then 1 else 0 end) as pending_orders,
      sum(case when order_status = 'delivered' then 1 else 0 end) as completed_orders
    FROM orders
  `).get() as any;

  const totalProducts = (db.prepare("SELECT count(*) as count FROM products WHERE is_active = 1").get() as any).count;
  const outOfStockProducts = (db.prepare("SELECT count(*) as count FROM products WHERE is_out_of_stock = 1 OR stock_qty <= 0").get() as any).count;
  const lowStockProducts = (db.prepare("SELECT count(*) as count FROM products WHERE stock_qty > 0 AND stock_qty <= low_stock_threshold").get() as any).count;
  const totalCustomers = (db.prepare("SELECT count(*) as count FROM customers").get() as any).count;

  const recentOrders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 6").all().map(rowToOrder);
  const bestSellers = db.prepare("SELECT * FROM products WHERE is_bestseller = 1 AND is_active = 1 ORDER BY display_order ASC LIMIT 5").all().map(rowToProduct);
  const lowStockItems = db.prepare("SELECT * FROM products WHERE stock_qty <= low_stock_threshold ORDER BY stock_qty ASC LIMIT 6").all().map(rowToProduct);

  return {
    totalSales,
    todaySales,
    totalOrders: orderCounts.total_orders || 0,
    pendingOrders: orderCounts.pending_orders || 0,
    completedOrders: orderCounts.completed_orders || 0,
    totalProducts,
    outOfStockProducts,
    lowStockProducts,
    totalCustomers,
    recentOrders,
    bestSellers,
    lowStockItems,
  };
}
