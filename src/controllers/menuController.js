const Menu = require('../models/menuModel');
const fetch = require('node-fetch');
require('dotenv').config();

exports.create = (req, res) => {
  try {
    const data = req.body;
    const item = Menu.createMenu(data);
    res.status(201).json({ message: 'Created', data: item });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.list = (req, res) => {
  try {
    const q = req.query.q || '';
    const category = req.query.category || '';
    const min_price = req.query.min_price || '';
    const max_price = req.query.max_price || '';
    const max_cal = req.query.max_cal || '';
    const page = Number(req.query.page || 1);
    const per_page = Number(req.query.per_page || 10);
    const sort = req.query.sort || '';

    const result = Menu.listMenu({ q, category, min_price, max_price, max_cal, page, per_page, sort });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.get = (req, res) => {
  const id = Number(req.params.id);
  const item = Menu.getById(id);
  if (!item) return res.status(404).json({ message: 'Menu not found' });
  res.json({ data: item });
};

exports.update = (req, res) => {
  const id = Number(req.params.id);
  const itemExists = Menu.getById(id);
  if (!itemExists) return res.status(404).json({ message: 'Menu not found' });
  const updated = Menu.updateMenu(id, req.body);
  res.json({ message: 'Updated', data: updated });
};

exports.delete = (req, res) => {
  const id = Number(req.params.id);
  const ok = Menu.deleteMenu(id);
  if (!ok) return res.status(404).json({ message: 'Menu not found' });
  res.json({ message: 'Deleted' });
};

exports.groupByCategory = (req, res) => {
  const mode = req.query.mode || 'count';
  if (mode === 'list') {
    const per_category = Number(req.query.per_category || 5);
    const data = Menu.groupByCategoryList(per_category);
    res.json({ data });
  } else {
    const data = Menu.groupByCategoryCount();
    res.json({ data });
  }
};

exports.search = (req, res) => {
  const q = req.query.q || '';
  const page = Number(req.query.page || 1);
  const per_page = Number(req.query.per_page || 10);
  const result = Menu.listMenu({ q, page, per_page });
  res.json(result);
};

// Example Gemini usage: simple description generation (mock if no key)
exports.generateDescription = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }

  if (!apiKey) {
    return res.json({
      description: `${name} - a delightful menu item (mock, add GEMINI_API_KEY to enable live).`
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Return ONLY ONE sentence (max 20 words) describing a menu item called "${name}". 
                  Do NOT provide multiple options. 
                  Do NOT use formatting. 
                  Do NOT start with quotation marks.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("AI RAW RESPONSE:", JSON.stringify(data, null, 2));

    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No output from AI";

    res.json({ description: output });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ message: "AI error" });
  }
};
