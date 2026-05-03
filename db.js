const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'app.db');

let dbInstance;
let isReady = false;

async function init() {
    const SQL = await initSqlJs();
    if (fs.existsSync(DB_FILE)) {
        const fileBuffer = fs.readFileSync(DB_FILE);
        dbInstance = new SQL.Database(fileBuffer);
    } else {
        dbInstance = new SQL.Database();
        // Create initial tables immediately
        dbInstance.run(`
          CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, password_hash TEXT);
          CREATE TABLE IF NOT EXISTS ledger (id TEXT PRIMARY KEY, user_id TEXT, amount_sat INTEGER);
        `);
        const data = dbInstance.export();
        fs.writeFileSync(DB_FILE, Buffer.from(data));
    }
    isReady = true;
    console.log("✅ Database initialized successfully.");
}

init();

const db = {
    exec: (sql) => {
        if (!isReady) return console.log("⏳ DB not ready yet...");
        dbInstance.run(sql);
        const data = dbInstance.export();
        fs.writeFileSync(DB_FILE, Buffer.from(data));
    },
    prepare: (sql) => {
        return {
            run: (...params) => {
                if (!isReady) return;
                dbInstance.run(sql, params);
                const data = dbInstance.export();
                fs.writeFileSync(DB_FILE, Buffer.from(data));
            },
            get: (...params) => {
                if (!isReady) return null;
                const stmt = dbInstance.prepare(sql);
                const result = stmt.getAsObject(params);
                stmt.free();
                return result;
            },
            all: (...params) => {
                if (!isReady) return [];
                const stmt = dbInstance.prepare(sql);
                const results = [];
                while(stmt.step()) results.push(stmt.getAsObject(params));
                stmt.free();
                return results;
            }
        };
    }
};

module.exports = db;
