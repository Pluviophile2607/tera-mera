import { User } from './server/models/User.js';
import { connectToDatabase } from './server/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });

async function migrate() {
    try {
        console.log('Connecting to database...');
        await connectToDatabase();
        
        const allUsers = await User.find({ isVerified: { $ne: true } }).sort({ createdAt: 1 });
        const verifiedCount = await User.countDocuments({ isVerified: true });
        const spotsAvailable = Math.max(0, 200 - verifiedCount);
        
        console.log(`Found ${allUsers.length} unverified users. ${spotsAvailable} spots available.`);
        
        if (spotsAvailable > 0 && allUsers.length > 0) {
            const usersToBackfill = allUsers.slice(0, spotsAvailable);
            for (const user of usersToBackfill) {
                user.isVerified = true;
                await user.save();
                console.log(`Verified: ${user.email}`);
            }
            console.log(`Successfully verified ${usersToBackfill.length} existing users.`);
        } else {
            console.log('No users needed verification backfill.');
        }
        
    } catch (error) {
        console.error('Migration failed:', error.message);
    } finally {
        process.exit(0);
    }
}

migrate();
