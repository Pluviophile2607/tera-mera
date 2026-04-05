import cors from 'cors';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
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
const SESSION_COOKIE_NAME = 'tera_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const SESSION_SECRET = process.env.SESSION_SECRET || 'local-dev-session-secret';
const rateLimitStores = new Map();

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
    if (userCount <= 3) {
      const hashedPassword = await hashPassword('password123');
      await User.create([
        { fullName: "John Doe", email: "john@example.com", passwordHash: hashedPassword, area: "Palava", isVerified: true },
        { fullName: "Jane Smith", email: "jane@example.com", passwordHash: hashedPassword, area: "Dombivali", isVerified: true },
        { fullName: "Shadow Trader", email: "shadow@trader.io", passwordHash: hashedPassword, area: "Thane", isBanned: true, isVerified: true },
        { fullName: "Anita Desai", email: "anita@example.com", passwordHash: hashedPassword, area: "Palava", isVerified: true },
        { fullName: "Vikram Singh", email: "vikram@example.com", passwordHash: hashedPassword, area: "Thane", isVerified: true }
      ]);
      console.log('Seeded initial users.');
    }

    const listingCount = await Listing.countDocuments();
    if (listingCount === 0) {
      const users = await User.find();
      const john = users.find(u => u.email === 'john@example.com');
      const jane = users.find(u => u.email === 'jane@example.com');
      const anita = users.find(u => u.email === 'anita@example.com');

      if (john && jane && anita) {
        await Listing.create([
          { userId: john._id, title: "Bosch Power Drill", category: "Tools", condition: "Good as New", type: "Lend", location: "Palava", status: "available", images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=300"] },
          { userId: jane._id, title: "Modern Ceramic Vase", category: "Home & Decor", condition: "Brand New", type: "Gift", location: "Dombivali", status: "pending", images: ["https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=300"] },
          { userId: anita._id, title: "KitchenAid Mixer", category: "Kitchen", condition: "Well-loved", type: "Sell", price: 45, location: "Palava", status: "available", images: ["https://images.unsplash.com/photo-1594385208974-2e75f9d863f3?auto=format&fit=crop&q=80&w=300"] },
          { userId: jane._id, title: "Looking for a Lawn Mower", category: "Garden", condition: "Good as New", type: "Request", location: "Dombivali", status: "available" }
        ]);
        console.log('Seeded initial listings.');

        const listings = await Listing.find({ status: 'available', type: { $ne: 'Request' } });
        if (listings.length > 0) {
          await ClaimRequest.create({
            listingId: listings[0]._id,
            userId: anita._id,
            message: "I really need this drill for a weekend project. I promise to keep it clean!",
            status: 'pending'
          });
          console.log('Seeded initial claim request.');
        }
      }
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

let initializationPromise;

export async function initializeServer() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      await connectToDatabase();
      await seedAdminData();
    })().catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }

  return initializationPromise;
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

function toBase64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(input) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - (base64.length % 4)) % 4;
  return Buffer.from(`${base64}${'='.repeat(padding)}`, 'base64').toString('utf8');
}

function signSessionPayload(payload) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
}

function createSessionToken(user) {
  const payload = JSON.stringify({
    id: user._id.toString(),
    email: user.email,
    isAdmin: Boolean(user.isAdmin),
    exp: Date.now() + SESSION_TTL_MS,
  });

  return `${toBase64Url(payload)}.${signSessionPayload(payload)}`;
}

function verifySessionToken(token) {
  try {
    if (!token || !token.includes('.')) return null;

    const [encodedPayload, signature] = token.split('.');
    const payload = fromBase64Url(encodedPayload);
    const expectedSignature = signSessionPayload(payload);
    const providedSignature = Buffer.from(signature);
    const validSignature = Buffer.from(expectedSignature);

    if (providedSignature.length !== validSignature.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(providedSignature, validSignature)) {
      return null;
    }

    const session = JSON.parse(payload);
    if (!session.exp || session.exp < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

function parseCookies(headerValue = '') {
  return headerValue.split(';').reduce((cookies, part) => {
    const [rawName, ...rawValue] = part.trim().split('=');
    if (!rawName) return cookies;
    cookies[rawName] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});
}

function setSessionCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';
  const parts = [
    `${SESSION_COOKIE_NAME}=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ];

  if (isProduction) {
    parts.push('Secure');
  }

  res.setHeader('Set-Cookie', parts.join('; '));
}

function clearSessionCookie(res) {
  const isProduction = process.env.NODE_ENV === 'production';
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Max-Age=0',
  ];

  if (isProduction) {
    parts.push('Secure');
  }

  res.setHeader('Set-Cookie', parts.join('; '));
}

async function attachCurrentUser(req, _res, next) {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[SESSION_COOKIE_NAME];
    const session = verifySessionToken(token);

    if (!session?.id) {
      req.currentUser = null;
      return next();
    }

    await connectToDatabase();
    const user = await User.findById(session.id);
    req.currentUser = user || null;
    return next();
  } catch {
    req.currentUser = null;
    return next();
  }
}

function requireAuth(req, res, next) {
  if (!req.currentUser) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  return next();
}

function requireAdmin(req, res, next) {
  if (!req.currentUser) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  if (!req.currentUser.isAdmin) {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  return next();
}

function requireSelfOrAdmin(req, res, next) {
  if (!req.currentUser) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  if (req.currentUser.isAdmin || req.currentUser._id.toString() === req.params.id) {
    return next();
  }

  return res.status(403).json({ message: 'You do not have access to this resource.' });
}

function serializeUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    area: user.area,
    isVerified: user.isVerified,
    isAdmin: user.isAdmin,
  };
}

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function createRateLimiter({
  key = 'global',
  windowMs,
  max,
  message = 'Too many requests. Please try again later.',
  scope = 'ip',
} = {}) {
  if (!rateLimitStores.has(key)) {
    rateLimitStores.set(key, new Map());
  }

  const store = rateLimitStores.get(key);

  return (req, res, next) => {
    const now = Date.now();
    const identity = scope === 'user'
      ? req.currentUser?._id?.toString() || getClientIp(req)
      : getClientIp(req);
    const bucketKey = `${key}:${identity}`;
    const entry = store.get(bucketKey);

    if (!entry || entry.resetAt <= now) {
      store.set(bucketKey, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({ message });
    }

    entry.count += 1;
    return next();
  };
}

const authRateLimit = createRateLimiter({
  key: 'auth',
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts. Please try again in a few minutes.',
});

const signupRateLimit = createRateLimiter({
  key: 'signup',
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many signup attempts. Please try again later.',
});

const writeRateLimit = createRateLimiter({
  key: 'writes',
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: 'Too many write actions. Please slow down and try again shortly.',
  scope: 'user',
});

const adminRateLimit = createRateLimiter({
  key: 'admin-actions',
  windowMs: 5 * 60 * 1000,
  max: 60,
  message: 'Too many admin actions. Please try again shortly.',
  scope: 'user',
});

app.get('/', (_request, response) => {
  response.json({
    ok: true,
    name: 'TeraMera API',
    message: 'Backend is running.',
    docsHint: 'Use /api/health to verify database connectivity.',
  });
});

app.get('/api', (_request, response) => {
  response.json({
    ok: true,
    name: 'TeraMera API',
    message: 'API root is running.',
    health: '/api/health',
  });
});

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

app.use(attachCurrentUser);

// --- Admin Endpoints ---

app.get('/api/admin/stats', requireAdmin, async (_req, res) => {
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

app.post('/api/admin/broadcast', requireAdmin, adminRateLimit, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required." });

  try {
    await connectToDatabase();
    await Activity.create({
      type: 'update',
      message: `SYSTEM BROADCAST: ${message}`,
      user: "Admin",
      time: "Just now"
    });
    res.json({ message: "Broadcast sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/flags', requireAdmin, async (_req, res) => {
  try {
    await connectToDatabase();
    const flags = await Report.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(flags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/flags/:id/resolve', requireAdmin, adminRateLimit, async (req, res) => {
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

app.get('/api/admin/activities', requireAdmin, async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  try {
    await connectToDatabase();
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(limit);
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

app.post('/api/listings', requireAuth, writeRateLimit, async (req, res) => {
  const { userId, title, category, condition, type, price, location, radius, images, description, urgency } = req.body;

  if (!userId || !title || !category || !condition || !type || !location) {
    return res.status(400).json({ message: 'Missing required fields for listing.' });
  }

  if (!req.currentUser.isAdmin && req.currentUser._id.toString() !== userId) {
    return res.status(403).json({ message: 'You cannot create listings for another user.' });
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
      description,
      urgency: urgency || 'Anytime',
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

app.get('/api/admin/listings/pending', requireAdmin, async (_req, res) => {
  try {
    await connectToDatabase();
    const pending = await Listing.find({ status: 'pending' }).populate('userId', 'fullName email').sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/listings', requireAdmin, async (_req, res) => {
  try {
    await connectToDatabase();
    const allListings = await Listing.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
    res.json(allListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/listings/:id/approve', requireAdmin, adminRateLimit, async (req, res) => {
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

app.post('/api/admin/listings/:id/reject', requireAdmin, adminRateLimit, async (req, res) => {
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

app.get('/api/users/:id/impact', requireSelfOrAdmin, async (req, res) => {
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

app.get('/api/users/:id/listings', requireSelfOrAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    const listings = await Listing.find({ userId: id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/users/:id/collected', requireSelfOrAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    const listings = await Listing.find({ claimedBy: id, status: 'claimed' }).sort({ updatedAt: -1, createdAt: -1 });
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

app.post('/api/admin/users/:id/ban', requireAdmin, adminRateLimit, async (req, res) => {
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

app.post('/api/admin/users/:id/unban', requireAdmin, adminRateLimit, async (req, res) => {
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

app.get('/api/admin/users', requireAdmin, async (_req, res) => {
  try {
    await connectToDatabase();
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/analytics', requireAdmin, async (_req, res) => {
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

app.get('/api/admin/matchmaking', requireAdmin, async (_req, res) => {
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

app.post('/api/admin/match', requireAdmin, adminRateLimit, async (req, res) => {
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

app.post('/api/listings/:id/claim', requireAuth, writeRateLimit, async (req, res) => {
  const { id } = req.params;
  const { userId, message = "" } = req.body;

  if (!req.currentUser.isAdmin && req.currentUser._id.toString() !== userId) {
    return res.status(403).json({ message: 'You cannot claim items for another user.' });
  }
  
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

app.get('/api/admin/claim-requests', requireAdmin, async (_req, res) => {
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

app.post('/api/admin/claim-requests/:id/approve', requireAdmin, adminRateLimit, async (req, res) => {
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

app.post('/api/admin/claim-requests/:id/reject', requireAdmin, adminRateLimit, async (req, res) => {
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

app.get('/api/users/:id/claim-requests', requireSelfOrAdmin, async (req, res) => {
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

app.post('/api/users', signupRateLimit, async (request, response) => {
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

    setSessionCookie(response, createSessionToken(user));
    
    // Log signup as a global activity
    await Activity.create({
      type: 'update',
      message: `New Citizen Registered: ${user.fullName}`,
      user: user._id.toString(),
      time: "Just now"
    });

    return response.status(201).json({
      message: 'User created successfully.',
      user: serializeUser(user),
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || 'Unable to create user.',
    });
  }
});

app.post('/api/login', authRateLimit, async (request, response) => {
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

    setSessionCookie(response, createSessionToken(user));

    return response.json({
      message: 'Login successful.',
      user: serializeUser(user),
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || 'Unable to log in.',
    });
  }
});

app.post('/api/logout', authRateLimit, (_request, response) => {
  clearSessionCookie(response);
  return response.json({ message: 'Logout successful.' });
});

// --- Error Handling Middleware ---
app.use((err, req, res, _next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Payload too large. Please upload smaller images or fewer of them.' });
  }
  console.error('Server error:', err);
  res.status(500).json({ message: err.message || 'Internal server error.' });
});

export async function startServer() {
  try {
    await initializeServer();
    app.listen(port, () => {
      console.log(`API server running on port ${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
}

const isDirectRun = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectRun) {
  startServer();
}

export default app;
