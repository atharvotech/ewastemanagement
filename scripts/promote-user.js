import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ewaste';

async function promoteUser(email) {
    try {
        console.log(`🔗 Connecting to MongoDB at ${mongoUri}...`);
        
        await mongoose.connect(mongoUri);
        
        console.log('✅ Connected to MongoDB');

        const user = await User.findOne({ email });
        if (!user) {
            console.error(`❌ User with email "${email}" not found`);
            await mongoose.disconnect();
            process.exit(1);
        }

        user.isAdmin = true;
        await user.save();

        console.log(`✅ User ${email} promoted to admin successfully!`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error promoting user:', err.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

const email = process.argv[2];
if (!email) {
    console.error('❌ Usage: node scripts/promote-user.js <email>');
    console.error('Example: node scripts/promote-user.js user@example.com');
    process.exit(1);
}

promoteUser(email);