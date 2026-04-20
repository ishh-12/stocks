// require("dotenv").config()
// Loads .env variables (PORT, DB URL, JWT secret)
require("dotenv").config();

/*What is Express?
Express is a web framework for Node.js that makes it easy to build web servers and APIs. Think of it as a toolkit for handling HTTP requests and responses. */

const express = require("express");// Import Express
const mongoose = require("mongoose");
const cors = require("cors"); 
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { TransactionsModel } = require("./model/TransactionsModel");
const UserModel = require("./model/UserModel");
const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const analysisService = require("./services/portfolio/analysisService");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB_NAME || "zerodha";
const JWT_SECRET = process.env.JWT_SECRET;

const app = express(); // Create an Express application instance Creates server object

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://ishh-12-stocks-frontend-six.vercel.app",
  "http://127.0.0.1:3002",
  "https://ishh-12-stocks-maho.vercel.app",
  "https://ishh-12-stocks-dash.vercel.app",
  "https://stocky-beta.vercel.app",
  "https://ishh-12-stocks-zbhu.vercel.app",
  "https://stocky-bk5mn20dx-aish1.vercel.app",
]);

const allowedOriginPatterns = [
  // Allow Vercel preview deployments for this account while keeping scope limited.
  /^https:\/\/[a-z0-9-]+-aish1\.vercel\.app$/i,
];

/*Why const app = express()?

express() creates a new Express application object
This app object is your web server - it handles all incoming requests
You configure routes, middleware, and settings on this app object */

let isDatabaseReady = false;
let isConnectingToDatabase = false;
let reconnectTimer = null;

const defaultHoldings = [
  {
    name: "BHARTIARTL",
    qty: 2,
    avg: 538.05,
    price: 541.15,
    net: "+0.58%",
    day: "+2.99%",
  },
  {
    name: "HDFCBANK",
    qty: 2,
    avg: 1383.4,
    price: 1522.35,
    net: "+10.04%",
    day: "+0.11%",
  },
  {
    name: "HINDUNILVR",
    qty: 1,
    avg: 2335.85,
    price: 2417.4,
    net: "+3.49%",
    day: "+0.21%",
  },
  {
    name: "INFY",
    qty: 1,
    avg: 1350.5,
    price: 1555.45,
    net: "+15.18%",
    day: "-1.60%",
    isLoss: true,
  },
  {
    name: "ITC",
    qty: 5,
    avg: 202.0,
    price: 207.9,
    net: "+2.92%",
    day: "+0.80%",
  },
  {
    name: "KPITTECH",
    qty: 5,
    avg: 250.3,
    price: 266.45,
    net: "+6.45%",
    day: "+3.54%",
  },
  {
    name: "M&M",
    qty: 2,
    avg: 809.9,
    price: 779.8,
    net: "-3.72%",
    day: "-0.01%",
    isLoss: true,
  },
  {
    name: "RELIANCE",
    qty: 1,
    avg: 2193.7,
    price: 2112.4,
    net: "-3.71%",
    day: "+1.44%",
  },
  {
    name: "SBIN",
    qty: 4,
    avg: 324.35,
    price: 430.2,
    net: "+32.63%",
    day: "-0.34%",
    isLoss: true,
  },
  {
    name: "SGBMAY29",
    qty: 2,
    avg: 4727.0,
    price: 4719.0,
    net: "-0.17%",
    day: "+0.15%",
  },
  {
    name: "TATAPOWER",
    qty: 5,
    avg: 104.2,
    price: 124.15,
    net: "+19.15%",
    day: "-0.24%",
    isLoss: true,
  },
  {
    name: "TCS",
    qty: 1,
    avg: 3041.7,
    price: 3194.8,
    net: "+5.03%",
    day: "-0.25%",
    isLoss: true,
  },
  {
    name: "WIPRO",
    qty: 4,
    avg: 489.3,
    price: 577.75,
    net: "+18.08%",
    day: "+0.32%",
  },
];

const defaultPositions = [
  {
    product: "CNC",
    name: "EVEREADY",
    qty: 2,
    avg: 316.27,
    price: 312.35,
    net: "+0.58%",
    day: "-1.24%",
    isLoss: true,
  },
  {
    product: "CNC",
    name: "JUBLFOOD",
    qty: 1,
    avg: 3124.75,
    price: 3082.65,
    net: "+10.04%",
    day: "-1.35%",
    isLoss: true,
  },
];

const ensureDatabaseReady = (req, res, next) => {
  if (isDatabaseReady) {
    next();
    return;
  }

  res.status(503).json({
    success: false,
    message: "Database is not connected. Check your MongoDB connection and backend logs.",
  });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Missing auth token. Please login again.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};



const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  try {
    const parsedOrigin = new URL(origin);
    if (allowedOrigins.has(parsedOrigin.origin)) {
      return true;
    }

    return allowedOriginPatterns.some((pattern) =>
      pattern.test(parsedOrigin.origin)
    );
  } catch {
    return false;
  }
};
/*Middleware Setup (app.use)
Middleware are functions that run between receiving a request and sending a response. They can modify requests, add data, or handle errors.
Why app.use?

app.use() tells Express to use middleware for ALL routes
The order matters - middleware runs in the order you define it
Routes (like authRoutes) are also middleware that handle specific paths */

app.use(express.json());// Parse JSON data from requests

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
); // Handle Cross-Origin Resource Sharing


// Define routes
// app.get("/", ...)
// app.use("/api/auth", authRoutes)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend working",
    databaseReady: isDatabaseReady,
    dbName,
  });
});

app.use(
  session({
    secret: "zerodha-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);// Manage user sessions

app.use(passport.initialize());// Initialize authentication
app.use(passport.session());

passport.use(
  UserModel.createStrategy({
    usernameField: "email",
    passwordField: "password",
  })
);

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

app.use("/api/auth", authRoutes);// Mount routes at /api/auth path
app.use("/api/portfolio", authenticateToken, ensureDatabaseReady, portfolioRoutes);

app.get("/api/health", (req, res) => {
  res.status(isDatabaseReady ? 200 : 503).json({
    success: isDatabaseReady,
    message: isDatabaseReady
      ? "Backend and database are connected"
      : "Backend is running but database is not connected",
  });
});

app.get("/addHoldings", authenticateToken, ensureDatabaseReady, async (req, res) => {
  const userId = req.user.id;

  const existingCount = await HoldingsModel.countDocuments({ userId });
  if (existingCount > 0) {
    return res.json({
      success: true,
      message: "User holdings already exist.",
    });
  }

  await HoldingsModel.insertMany(
    defaultHoldings.map((item) => ({
      userId,
      name: item.name,
      qty: item.qty,
      avg: item.avg,
      price: item.price,
      net: item.net,
      day: item.day,
      isLoss: item.isLoss || false,
    }))
  );

  analysisService.invalidateUser(userId);

  res.json({
    success: true,
    message: "Holdings seeded for user.",
  });
});

app.get("/addPositions", authenticateToken, ensureDatabaseReady, async (req, res) => {
  const userId = req.user.id;

  const existingCount = await PositionsModel.countDocuments({ userId });
  if (existingCount > 0) {
    return res.json({
      success: true,
      message: "User positions already exist.",
    });
  }

  await PositionsModel.insertMany(
    defaultPositions.map((item) => ({
      userId,
      product: item.product,
      name: item.name,
      qty: item.qty,
      avg: item.avg,
      price: item.price,
      net: item.net,
      day: item.day,
      isLoss: item.isLoss,
    }))
  );

  res.json({
    success: true,
    message: "Positions seeded for user.",
  });
});

app.get("/allHoldings", authenticateToken, ensureDatabaseReady, async (req, res) => {
  const userId = req.user.id;

  try {
    const allHoldings = await HoldingsModel.find({ userId });

    res.json(allHoldings);
  } catch (err) {
    console.error("Failed to fetch holdings from DB:", err.message || err);
    res.status(500).json({
      success: false,
      message: "Unable to fetch holdings from database.",
    });
  }
});

app.get("/allPositions", authenticateToken, ensureDatabaseReady, async (req, res) => {
  const userId = req.user.id;

  try {
    const allPositions = await PositionsModel.find({ userId });

    res.json(allPositions);
  } catch (err) {
    console.error("Failed to fetch positions from DB:", err.message || err);
    res.status(500).json({
      success: false,
      message: "Unable to fetch positions from database.",
    });
  }
});

app.get("/funds/summary", authenticateToken, ensureDatabaseReady, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("balance username email").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const transactions = await TransactionsModel.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(25)
      .lean();

    return res.json({
      success: true,
      data: {
        balance: Number(user.balance) || 0,
        transactions,
      },
    });
  } catch (err) {
    console.error("Failed to load funds summary:", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Unable to load funds summary.",
    });
  }
});

app.get("/transactions", authenticateToken, ensureDatabaseReady, async (req, res) => {
  try {
    const transactions = await TransactionsModel.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .lean();

    return res.json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    console.error("Failed to fetch transactions:", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch transaction history.",
    });
  }
});

app.post("/add-funds", authenticateToken, ensureDatabaseReady, async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid amount greater than zero.",
      });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const currentBalance = Number(user.balance) || 0;
    const newBalance = Number((currentBalance + amount).toFixed(2));

    user.balance = newBalance;
    await user.save();

    const transaction = await TransactionsModel.create({
      userId: req.user.id,
      type: "add",
      amount,
      balanceAfter: newBalance,
    });

    return res.status(200).json({
      success: true,
      message: "Funds added successfully.",
      data: {
        balance: newBalance,
        transaction,
      },
    });
  } catch (err) {
    console.error("Failed to add funds:", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Unable to add funds.",
    });
  }
});

app.post("/withdraw", authenticateToken, ensureDatabaseReady, async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid amount greater than zero.",
      });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const currentBalance = Number(user.balance) || 0;
    if (amount > currentBalance) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance.",
      });
    }

    const newBalance = Number((currentBalance - amount).toFixed(2));

    user.balance = newBalance;
    await user.save();

    const transaction = await TransactionsModel.create({
      userId: req.user.id,
      type: "withdraw",
      amount,
      balanceAfter: newBalance,
    });

    return res.status(200).json({
      success: true,
      message: "Funds withdrawn successfully.",
      data: {
        balance: newBalance,
        transaction,
      },
    });
  } catch (err) {
    console.error("Failed to withdraw funds:", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Unable to withdraw funds.",
    });
  }
});

app.post("/newOrder", authenticateToken, ensureDatabaseReady, async (req, res) => {
  try {
    const userId = req.user.id;
    const name = String(req.body.name || "").trim().toUpperCase();
    const qty = Number(req.body.qty);
    const price = Number(req.body.price);
    const mode = String(req.body.mode || "").trim().toUpperCase();

    if (!name || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order payload.",
      });
    }

    if (mode !== "BUY" && mode !== "SELL") {
      return res.status(400).json({
        success: false,
        message: "Invalid order mode.",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let holding = await HoldingsModel.findOne({ userId, name });
    const orderValue = Number((qty * price).toFixed(2));

    if (mode === "BUY") {
      const currentBalance = Number(user.balance) || 0;
      if (orderValue > currentBalance) {
        return res.status(400).json({
          success: false,
          message: "Insufficient funds. Add money before placing this buy order.",
        });
      }

      user.balance = Number((currentBalance - orderValue).toFixed(2));
    } else if (mode === "SELL") {
      if (!holding) {
        return res.status(400).json({
          success: false,
          message: "You do not hold this stock, so it cannot be sold.",
        });
      }

      const oldQty = Number(holding.qty) || 0;
      if (qty > oldQty) {
        return res.status(400).json({
          success: false,
          message: "You cannot sell more shares than you hold.",
        });
      }
    }

    const newOrder = new OrdersModel({
      userId,
      name,
      qty,
      price,
      mode,
    });
    await newOrder.save();

    if (mode === "BUY") {
      if (!holding) {
        holding = new HoldingsModel({
          userId,
          name,
          qty,
          avg: price,
          price,
          net: "0.00%",
          day: "0.00%",
          isLoss: false,
        });
      } else {
        const oldQty = Number(holding.qty) || 0;
        const oldAvg = Number(holding.avg) || 0;
        const newQty = oldQty + qty;
        const newAvg = ((oldQty * oldAvg) + (qty * price)) / newQty;

        holding.qty = newQty;
        holding.avg = Number(newAvg.toFixed(2));
        holding.price = price;
      }

      await holding.save();

      await user.save();

      await TransactionsModel.create({
        userId,
        type: "buy",
        amount: orderValue,
        balanceAfter: user.balance,
      });
    } else if (mode === "SELL") {
      const oldQty = Number(holding.qty) || 0;
      const newQty = oldQty - qty;
      const currentBalance = Number(user.balance) || 0;

      if (newQty <= 0) {
        await HoldingsModel.deleteOne({ _id: holding._id });
      } else {
        holding.qty = newQty;
        holding.price = price;
        await holding.save();
      }

      user.balance = Number((currentBalance + orderValue).toFixed(2));
      await user.save();

      await TransactionsModel.create({
        userId,
        type: "sell",
        amount: orderValue,
        balanceAfter: user.balance,
      });
    }

    analysisService.invalidateUser(userId);

    return res.status(200).json({
      success: true,
      message: "Order saved.",
    });
  } catch (err) {
    console.error("Failed to save order:", err.message || err);
    return res.status(500).json({
      success: false,
      message: "Failed to save order.",
    });
  }
});

const scheduleReconnect = () => {
  if (reconnectTimer || isDatabaseReady) {
    return;
  }

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectDatabase();
  }, 5000);
};

mongoose.connection.on("connected", () => {
  isDatabaseReady = true;
  isConnectingToDatabase = false;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  console.log("DB connected");
});

mongoose.connection.on("disconnected", () => {
  isDatabaseReady = false;
  isConnectingToDatabase = false;
  console.log("DB disconnected");
  scheduleReconnect();
});

mongoose.connection.on("error", (err) => {
  isDatabaseReady = false;
  isConnectingToDatabase = false;
  console.error("Failed to connect to DB:", err);
  scheduleReconnect();
});

let server;
let serverStartRetryTimer = null;
//Starting the Server (app.listen)
/*Why app.listen?

This actually starts the server and makes it listen for connections
PORT is usually 3000, 3001, 3002, etc.
The callback function runs when the server successfully starts
Without this, your server doesn't run! */
const startServer = () => {
  if (serverStartRetryTimer) {
    clearTimeout(serverStartRetryTimer);
    serverStartRetryTimer = null;
  }

  server = app.listen(PORT, () => {
    console.log("App started on port " + PORT);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is busy. Retrying server start in 3s...`);
      serverStartRetryTimer = setTimeout(startServer, 3000);
      return;
    }

    console.error("Server error:", err);
  });
};

const connectDatabase = async () => {
  if (isDatabaseReady || isConnectingToDatabase) {
    return;
  }

  isConnectingToDatabase = true;
  const startedAt = Date.now();

  console.log("Connecting to DB...");

  try {
    await mongoose.connect(uri, {
      dbName,
      family: 4,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    });

    console.log(`Using DB: ${dbName}`);
    console.log(`DB connection ready in ${Date.now() - startedAt}ms`);
  } catch (err) {
    isDatabaseReady = false;
    isConnectingToDatabase = false;
    console.error("Initial DB connection failed:", err.message || err);
    scheduleReconnect();
  }
};

connectDatabase();
startServer();

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});
