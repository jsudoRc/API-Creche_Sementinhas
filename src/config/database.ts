import sqlite3 from 'sqlite3';
import path from 'path';

const sqlite = sqlite3.verbose();
const dbPath = path.join(process.cwd(), 'src', 'database', 'database.db');

export const db = new sqlite.Database(dbPath, (err) => {
	if (err) {
		console.error('Erro ao conectar ao banco de dados:', err);
	}
});

