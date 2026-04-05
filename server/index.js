import cors from 'cors';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import dotenv from 'dotenv';
import express from 'express';
import { connectToDatabase } from './db.js';
import { User } from './models/User.js';
import { Report } from './models/Report.js';
import { Activity } from './models/Activity.js';
import { Listing } from './models/Listing.js';
import { ClaimRequest } from './models/ClaimRequest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = Number(process.env.PORT) || 5000;
const scrypt = promisify(crypto.scrypt);

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// --- Seeding Logic ---
async function seedAdminData() {
  try {
    const reportCount = await Report.countDocuments();
    if (reportCount === 0) {
      await Report.create([
        {
          title: "Misleading Post: 'Free Tera Token Generator'",
          reporter: "Alex Rivera",
          karma: 450,
          violation: "Spam",
          priority: "High",
          image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=100"
        },
        {
          title: "Inappropriate Comment on Community Guidelines",
          reporter: "Sarah Chen",
          karma: 1200,
          violation: "Inappropriate",
          priority: "Medium",
          image: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=100"
        }
      ]);
      console.log('Seeded initial reports.');
    }

    const activityCount = await Activity.countDocuments();
    if (activityCount === 0) {
      await Activity.create([
        { type: "action", message: "Flag cleared for user @cryptonight", user: "Admin", time: "2m ago" },
        { type: "update", message: "New moderation policy deployed", user: "System", time: "15m ago" },
        { type: "alert", message: "Spike in 'Spam' reports in Area-04", user: "Guard", time: "1h ago" }
      ]);
      console.log('Seeded initial activities.');
    }
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const hashedPassword = await hashPassword('password123');
      await User.create([
        { fullName: "John Doe", email: "john@example.com", passwordHash: hashedPassword, area: "Area-01", isVerified: true },
        { fullName: "Jane Smith", email: "jane@example.com", passwordHash: hashedPassword, area: "Area-04", isVerified: true },
        { fullName: "Shadow Trader", email: "shadow@trader.io", passwordHash: hashedPassword, area: "Outer Rim", isBanned: true, isVerified: true }
      ]);
      console.log('Seeded initial users.');
    }

    const adminEmail = 'zedinfo@zed.org';
    const existingAdmin = await User.findOne({ email: adminEmail });
    const adminPasswordHash = await hashPassword('Zed@org');

    if (!existingAdmin) {
      await User.create({
        fullName: 'Zed Admin',
        email: adminEmail,
        passwordHash: adminPasswordHash,
        area: 'Admin Hub',
        isVerified: true,
        isAdmin: true,
      });
      console.log('Seeded admin user.');
    } else {
      existingAdmin.passwordHash = adminPasswordHash;
      existingAdmin.isVerified = true;
      existingAdmin.isAdmin = true;
      if (!existingAdmin.area) {
        existingAdmin.area = 'Admin Hub';
      }
      await existingAdmin.save();
      console.log('Updated admin user credentials.');
    }

    // --- Verification Migration for Existing Users ---
    // If there is any user who should be verified but isn't, we backfill it.
    const allUsers = await User.find({ isVerified: { $ne: true } }).sort({ createdAt: 1 });
    const verifiedCount = await User.countDocuments({ isVerified: true });
    const spotsAvailable = Math.max(0, 200 - verifiedCount);

    if (spotsAvailable > 0 && allUsers.length > 0) {
      const usersToBackfill = allUsers.slice(0, spotsAvailable);
      for (const user of usersToBackfill) {
        user.isVerified = true;
        await user.save();
      }
      console.log(`Backfilled verification status for ${usersToBackfill.length} users.`);
    }

  } catch (error) {
    console.error('Seeding failed:', error.message);
  }
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, hashedValue) {
  const [salt, key] = hashedValue.split(':');
  const derivedKey = await scrypt(password, salt, 64);
  return key === derivedKey.toString('hex');
}

app.get('/api/health', async (_request, response) => {
  try {
    await connectToDatabase();
    response.json({ ok: true });
  } catch (error) {
    response.status(500).json({
      ok: false,
      message: error.message,
    });
  }
});

// --- Admin Endpoints ---

app.get('/api/admin/stats', async (_req, res) => {
  try {
    await connectToDatabase();
    const userCount = await User.countDocuments();
    const flagCount = await Report.countDocuments({ status: 'active' });
    const listingCount = await Listing.countDocuments();
    
    res.json({
      users: userCount,
      activeFlags: flagCount,
      totalCards: listingCount,
      trustScore: 98.4, 
      systemHealth: "Optimal"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/flags', async (_req, res) => {
  try {
    await connectToDatabase();
    const flags = await Report.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(flags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/flags/:id/resolve', async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'clear' or 'take_down'
  
  try {
    await connectToDatabase();
    const status = action === 'take_down' ? 'taken_down' : 'resolved';
    const report = await Report.findByIdAndUpdate(id, { status }, { new: true });
    
    await Activity.create({
      type: 'action',
      message: `Flag ${status.replace('_', ' ')}: ${report.title}`,
      user: "Admin",
      time: "Just now"
    });

    res.json({ message: `Flag ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/activities', async (_req, res) => {
  try {
    await connectToDatabase();
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(10);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/activities/recent', async (_req, res) => {
  try {
    await connectToDatabase();
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(10);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Community Listing Endpoints ---

app.post('/api/listings', async (req, res) => {
  const { userId, title, category, condition, type, price, location, radius, images } = req.body;

  if (!userId || !title || !category || !condition || !type || !location) {
    return res.status(400).json({ message: 'Missing required fields for listing.' });
  }

  try {
    await connectToDatabase();
    const listing = await Listing.create({
      userId,
      title,
      category,
      condition,
      type,
      price: type === 'Sell' ? price : 0,
      location,
      radius: radius || 5,
      images: images || [],
    });

    // Log this action for community activity feed
    await Activity.create({
      type: 'update',
      message: type === 'Request' ? `New request broadcast: ${title}` : `New item shared: ${title}`,
      user: userId,
      time: "Just now"
    });

    res.status(201).json({ message: 'Item shared successfully!', listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/listings', async (_req, res) => {
  try {
    await connectToDatabase();
    const listings = await Listing.find({ status: 'available' }).populate('userId', 'fullName email').sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Admin Listing Moderation ---

app.get('/api/admin/listings/pending', async (_req, res) => {
  try {
    await connectToDatabase();
    const pending = await Listing.find({ status: 'pending' }).populate('userId', 'fullName email').sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/listings', async (_req, res) => {
  try {
    await connectToDatabase();
    const allListings = await Listing.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
    res.json(allListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/listings/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    const listing = await Listing.findByIdAndUpdate(id, { status: 'available' }, { new: true });
    
    await Activity.create({
      type: 'action',
      message: `Item Approved: ${listing.title}`,
      user: "Admin",
      time: "Just now"
    });

    res.json({ message: "Listing approved and live!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/listings/:id/reject', async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    const listing = await Listing.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    
    await Activity.create({
      type: 'alert',
      message: `Item Rejected: ${listing.title}`,
      user: "Admin",
      time: "Just now"
    });

    res.json({ message: "Listing rejected." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/users/:id/impact', async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    const listingsCount = await Listing.countDocuments({ userId: id });
    
    // Simple impact calculation for now
    res.json({
      carbonSaved: (listingsCount * 1.5).toFixed(1),
      neighborsHelped: listingsCount * 2,
      wasteDiverted: listingsCount * 3,
      karmaScore: listingsCount * 150 // Mock Karma calculation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/users/:id/listings', async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    const listings = await Listing.find({ userId: id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/stats/neighborhood/:area', async (req, res) => {
  const { area } = req.params;
  try {
    await connectToDatabase();
    const activeListings = await Listing.countDocuments({ location: area, status: 'available' });
    const userCount = await User.countDocuments({ area: area });
    
    res.json({
      activeNeighbors: userCount,
      activeItems: activeListings,
      communityTrust: 98 // Mocked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/users/:id/ban', async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    const user = await User.findByIdAndUpdate(id, { isBanned: true }, { new: true });
    
    await Activity.create({
      type: 'alert',
      message: `User Banned: ${user.email}`,
      user: "Admin",
      time: "Just now"
    });

    res.json({ message: `User ${user.email} banned.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/users/:id/unban', async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    const user = await User.findByIdAndUpdate(id, { isBanned: false }, { new: true });
    
    await Activity.create({
      type: 'update',
      message: `User Unbanned: ${user.email}`,
      user: "Admin",
      time: "Just now"
    });

    res.json({ message: `User ${user.email} unbanned.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/users', async (_req, res) => {
  try {
    await connectToDatabase();
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/analytics', async (_req, res) => {
  try {
    await connectToDatabase();
    const listings = await Listing.find();
    const userCount = await User.countDocuments();
    
    const categoryCounts = listings.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    const typeCounts = listings.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {});

    const activeListings = listings.filter(l => l.status === 'available').length;
    const claimedListings = listings.filter(l => l.status === 'claimed').length;

    res.json({
      totalUsers: userCount,
      totalListings: listings.length,
      categoryDistribution: categoryCounts,
      typeDistribution: typeCounts,
      fulfillmentRate: listings.length > 0 ? (claimedListings / (activeListings + claimedListings) * 100).toFixed(1) : 0,
      activeItems: activeListings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Admin Fulfillment (Matchmaking) ---

app.get('/api/admin/matchmaking', async (_req, res) => {
  try {
    await connectToDatabase();
    // Get all available items (Gifts/Lends/Sales)
    const items = await Listing.find({ 
      status: 'available', 
      type: { $ne: 'Request' } 
    }).sort({ createdAt: -1 });

    // Get all active requests (Mera Mode)
    const requests = await Listing.find({ 
      status: 'available', 
      type: 'Request' 
    }).sort({ createdAt: -1 });

    res.json({ items, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/match', async (req, res) => {
  const { itemId, requestId } = req.body;
  try {
    await connectToDatabase();
    
    const item = await Listing.findById(itemId);
    const request = await Listing.findById(requestId);

    if (!item || !request) {
      return res.status(404).json({ message: "Item or Request not found." });
    }

    // Mark both as claimed
    item.status = 'claimed';
    request.status = 'claimed';

    await Promise.all([item.save(), request.save()]);

    // Log the loop closure
    await Activity.create({
      type: 'action',
      message: `Admin matched Share: ${item.title} with Request: ${request.title}`,
      user: "Admin",
      time: "Just now"
    });

    res.json({ message: "Loop closed successfully! Match confirmed." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- User-led Claiming ---

app.post('/api/listings/:id/claim', async (req, res) => {
  const { id } = req.params;
  const { userId, message = "" } = req.body;
  
  try {
    await connectToDatabase();
    const listing = await Listing.findById(id);
    
    if (!listing) return res.status(404).json({ message: "Listing not found." });
    if (listing.status !== 'available') return res.status(400).json({ message: "Item no longer available." });

    // Create a NEW Claim Request instead of marking the listing as claimed
    const claimRequest = await ClaimRequest.create({
      listingId: id,
      userId,
      message,
      status: 'pending'
    });

    const user = await User.findById(userId);

    await Activity.create({
      type: 'update',
      message: `New Claim Request: ${user?.fullName || 'Anonymous'} is interested in ${listing.title}`,
      user: userId,
      time: "Just now"
    });

    res.json({ message: "Interest expressed! Waiting for admin approval.", claimRequest });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You've already requested this item." });
    }
    res.status(500).json({ message: error.message });
  }
});

// --- Admin Claim Mediation (The Transfer Desk) ---

app.get('/api/admin/claim-requests', async (_req, res) => {
  try {
    await connectToDatabase();
    const requests = await ClaimRequest.find({ status: 'pending' })
      .populate('userId', 'fullName email area')
      .populate('listingId')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/claim-requests/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    const request = await ClaimRequest.findById(id).populate('listingId');
    if (!request) return res.status(404).json({ message: "Request not found." });

    // 1. Mark this request as approved
    request.status = 'approved';
    await request.save();

    // 2. Mark the listing as claimed by this user
    const listing = await Listing.findByIdAndUpdate(request.listingId._id, {
      status: 'claimed',
      claimedBy: request.userId
    }, { new: true });

    // 3. Reject all OTHER pending requests for this same listing
    await ClaimRequest.updateMany(
      { listingId: request.listingId._id, _id: { $ne: id }, status: 'pending' },
      { status: 'rejected' }
    );

    await Activity.create({
      type: 'action',
      message: `Admin approved Transfer: ${listing.title} allocated to user.`,
      user: "Admin",
      time: "Just now"
    });

    res.json({ message: "Transfer authorized successfully!", listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/claim-requests/:id/reject', async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    await ClaimRequest.findByIdAndUpdate(id, { status: 'rejected' });
    res.json({ message: "Request declined." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- User Claim History ---

app.get('/api/users/:id/claim-requests', async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    const requests = await ClaimRequest.find({ userId: id })
      .populate('listingId')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Existing User Endpoints ---

app.post('/api/users', async (request, response) => {
  const { fullName, email, password, area } = request.body;

  if (!fullName || !email || !password || !area) {
    return response.status(400).json({
      message: 'Full name, email, password, and area are required.',
    });
  }

  if (password.length < 8) {
    return response.status(400).json({
      message: 'Password must be at least 8 characters long.',
    });
  }

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return response.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    const passwordHash = await hashPassword(password);
    const userCount = await User.countDocuments();
    const isVerified = userCount < 200;
    
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      area,
      isVerified,
    });

    return response.status(201).json({
      message: 'User created successfully.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        area: user.area,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || 'Unable to create user.',
    });
  }
});

app.post('/api/login', async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({
      message: 'Email and password are required.',
    });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return response.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return response.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    return response.json({
      message: 'Login successful.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        area: user.area,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || 'Unable to log in.',
    });
  }
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Payload too large. Please upload smaller images or fewer of them.' });
  }
  console.error('Server error:', err);
  res.status(500).json({ message: err.message || 'Internal server error.' });
});

app.listen(port, async () => {
  try {
    await connectToDatabase();
    await seedAdminData();
    console.log(`API server running on port ${port}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
});
