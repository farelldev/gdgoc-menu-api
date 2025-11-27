const getDb = require('../db');

function serializeRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    calories: row.calories,
    price: row.price,
    ingredients: JSON.parse(row.ingredients || '[]'),
    description: row.description,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

exports.createMenu = function(payload) {
  const db = getDb();
  const stmt = db.prepare(`INSERT INTO menu (name, category, calories, price, ingredients, description) VALUES (?,?,?,?,?,?)`);
  const info = stmt.run(payload.name, payload.category, payload.calories || null, payload.price, JSON.stringify(payload.ingredients || []), payload.description || '');
  const row = db.prepare('SELECT * FROM menu WHERE id = ?').get(info.lastInsertRowid);
  db.close();
  return serializeRow(row);
};

exports.listMenu = function({ q, category, min_price, max_price, max_cal, page=1, per_page=10, sort }) {
  const db = getDb();
  const filters = [];
  const params = [];

  if (q) {
    filters.push("(name LIKE '%' || ? || '%' OR description LIKE '%' || ? || '%' OR ingredients LIKE '%' || ? || '%')");
    params.push(q, q, q);
  }
  if (category) { filters.push('category = ?'); params.push(category); }
  if (min_price) { filters.push('price >= ?'); params.push(min_price); }
  if (max_price) { filters.push('price <= ?'); params.push(max_price); }
  if (max_cal) { filters.push('calories <= ?'); params.push(max_cal); }

  const where = filters.length ? ('WHERE ' + filters.join(' AND ')) : '';

  // sorting
  let orderBy = '';
  if (sort) {
    const [field, dir] = sort.split(':');
    const allowed = ['price','calories','name','id'];
    if (allowed.includes(field)) orderBy = `ORDER BY ${field} ${dir === 'desc' ? 'DESC' : 'ASC'}`;
  }

  // pagination
  const totalStmt = db.prepare(`SELECT COUNT(1) as total FROM menu ${where}`);
  const total = totalStmt.get(...params).total;

  const offset = (page - 1) * per_page;
  const stmt = db.prepare(`SELECT * FROM menu ${where} ${orderBy} LIMIT ? OFFSET ?`);
  const rows = stmt.all(...params, per_page, offset);
  db.close();

  return {
    data: rows.map(serializeRow),
    pagination: { total, page: Number(page), per_page: Number(per_page), total_pages: Math.ceil(total / per_page) }
  };
};

exports.getById = function(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM menu WHERE id = ?').get(id);
  db.close();
  return serializeRow(row);
};

exports.updateMenu = function(id, payload) {
  const db = getDb();
  const stmt = db.prepare(`UPDATE menu SET name=?, category=?, calories=?, price=?, ingredients=?, description=?, updated_at=datetime('now') WHERE id=?`);
  stmt.run(payload.name, payload.category, payload.calories || null, payload.price, JSON.stringify(payload.ingredients || []), payload.description || '', id);
  const row = db.prepare('SELECT * FROM menu WHERE id = ?').get(id);
  db.close();
  return serializeRow(row);
};

exports.deleteMenu = function(id) {
  const db = getDb();
  const stmt = db.prepare('DELETE FROM menu WHERE id = ?');
  const info = stmt.run(id);
  db.close();
  return info.changes > 0;
};

exports.groupByCategoryCount = function() {
  const db = getDb();
  const rows = db.prepare('SELECT category, COUNT(1) as cnt FROM menu GROUP BY category').all();
  db.close();
  const out = {};
  for (const r of rows) out[r.category] = r.cnt;
  return out;
};

exports.groupByCategoryList = function(per_category=5) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM menu ORDER BY category, id').all();
  db.close();
  const out = {};
  for (const r of rows) {
    if (!out[r.category]) out[r.category] = [];
    if (out[r.category].length < per_category) out[r.category].push(serializeRow(r));
  }
  return out;
};