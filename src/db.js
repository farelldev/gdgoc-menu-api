// db.js - initialize DB and optionally seed
  const Database = require('better-sqlite3');
  const fs = require('fs');
  const path = require('path');
  require('dotenv').config();
  
  const DB_FILE = process.env.DATABASE_FILE || path.join(__dirname, '..', 'database.sqlite');
  
  function initDb() {
    const db = new Database(DB_FILE);
  
    const create = `
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      calories INTEGER,
      price REAL NOT NULL,
      ingredients TEXT,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );`;
  
    db.exec(create);
  
    // seed minimal data if table empty
    const row = db.prepare('SELECT COUNT(1) as c FROM menu').get();
    if (row.c === 0) {
      const insert = db.prepare(`INSERT INTO menu (name, category, calories, price, ingredients, description) VALUES (?,?,?,?,?,?)`);
      insert.run('Es Kopi Susu', 'drinks', 180, 25000, JSON.stringify(['coffee','milk','ice','sugar']), 'Classic iced coffee with milk');
      insert.run('Nasi Goreng', 'foods', 450, 30000, JSON.stringify(['rice','egg','chili']), 'Fried rice');
    }
  
    db.close();
    console.log('Database initialized at', DB_FILE);
  }
  
  if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.includes('--init')) initDb();
  }
  
  module.exports = function getDb() {
    const db = new Database(DB_FILE, { verbose: console.log });
    return db;
  };
