import mongoose from 'mongoose';
import User from './models/User.js';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test';

async function run() {
    try {
        console.log('Connecting to', mongoUri);
        await mongoose.connect(mongoUri);
        console.log('Connected. DB name:', mongoose.connection.name);

        const db = mongoose.connection.db;
        const idx = await db.collection('users').listIndexes().toArray();
        console.log('Current users indexes:', idx.map(i => ({ name: i.name, key: i.key, unique: i.unique })));

        const data = {
            fullName: 'Script Test',
            email: `script${Date.now()}@example.com`,
            password: 'hashed_placeholder',
            orders: []
        };

        try {
            const u = await User.create(data);
            console.log('Created user id:', u._id);
        } catch (err) {
            console.error('Create error:', err.message);
            console.error('Error code:', err.code);
            console.error('KeyPattern:', err.keyPattern);
            console.error('KeyValue:', err.keyValue);
            const idx2 = await db.collection('users').listIndexes().toArray();
            console.log('Indexes after failure:', idx2.map(i => ({ name: i.name, key: i.key, unique: i.unique })));
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (e) {
        console.error('Fatal error:', e.message);
        process.exit(1);
    }
}

run();
