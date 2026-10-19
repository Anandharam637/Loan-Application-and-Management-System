import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  INITIAL_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_LOAN_SCHEMES,
  INITIAL_APPLICATIONS,
  INITIAL_ACTIVE_LOANS,
  INITIAL_TRANSACTIONS
} from '../src/data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Database {
  constructor() {
    this.data = {
      users: [],
      customers: [],
      schemes: [],
      applications: [],
      activeLoans: [],
      transactions: []
    };
    this.load();
  }

  load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('✅ Loaded database from server/data/database.json');
        return;
      } catch (err) {
        console.error('Error reading database file, resetting to initial seed data:', err);
      }
    }
    this.reset();
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  reset() {
    this.data = {
      users: JSON.parse(JSON.stringify(INITIAL_USERS)),
      customers: JSON.parse(JSON.stringify(INITIAL_CUSTOMERS)),
      schemes: JSON.parse(JSON.stringify(INITIAL_LOAN_SCHEMES)),
      applications: JSON.parse(JSON.stringify(INITIAL_APPLICATIONS)),
      activeLoans: JSON.parse(JSON.stringify(INITIAL_ACTIVE_LOANS)),
      transactions: JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS))
    };
    this.save();
    console.log('🔄 Database initialized with fresh seed records');
  }

  // Generic Helpers
  get(collection) {
    return this.data[collection] || [];
  }

  set(collection, items) {
    this.data[collection] = items;
    this.save();
  }

  findById(collection, id) {
    return (this.data[collection] || []).find(item => item.id === id);
  }

  insert(collection, item) {
    if (!this.data[collection]) this.data[collection] = [];
    this.data[collection].unshift(item);
    this.save();
    return item;
  }

  update(collection, id, updates) {
    if (!this.data[collection]) return null;
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index === -1) return null;
    this.data[collection][index] = { ...this.data[collection][index], ...updates };
    this.save();
    return this.data[collection][index];
  }

  delete(collection, id) {
    if (!this.data[collection]) return false;
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index === -1) return false;
    this.data[collection].splice(index, 1);
    this.save();
    return true;
  }
}

export const db = new Database();
