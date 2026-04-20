# Zerodha Stocks - Portfolio Analytics Platform

A full-stack trading dashboard project with a deterministic Portfolio Risk & Analysis Engine.

## What This Project Includes

- User authentication (signup/login with JWT)
- Holdings, positions, and order workflows
- Portfolio analytics endpoint with:
  - Total investment
  - Current value
  - Profit/Loss and P/L%
  - Stock-wise allocation
  - Sector-wise allocation
- Deterministic risk scoring (`0-100`) based on rule logic
- Explainable risk breakdown (rule + observation)
- HHI-based concentration analysis
- Rule-based insights (no AI)
- Caching with TTL and invalidation on portfolio updates

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Dashboard: React, Chart.js, Axios
- Frontend: React, React Router

## Repository Structure

- `backend/` API server, auth, holdings/orders, analysis services
- `dashboard/` authenticated trading dashboard and analytics UI
- `frontend/` landing/auth app that redirects to dashboard

## Key Architecture

### Backend Services

- `PortfolioService`: computes totals and allocations
- `RiskService`: calculates explainable risk score
- `AnalysisService`: orchestrates analytics + caching

### Risk Model (Deterministic)

Risk score is computed from fixed rules and normalized between `0-100`.

Example factors:

- Single stock concentration (`>40%`)
- Single sector concentration (`>60%`)
- Portfolio concentration using HHI
- Top-3 holdings dependency
- Low holdings count

HHI interpretation bands:

- `0-0.15` -> diversified
- `0.15-0.25` -> moderate concentration
- `>0.25` -> high concentration

## Caching Strategy

Portfolio analysis uses TTL caching to reduce redundant computation and improve response time.

- Cache key: per user (`portfolio-analysis:<userId>`)
- TTL: `45s`
- Explicit invalidation on holdings/order updates

## Setup

## 1) Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas/local MongoDB

## 2) Backend env

Create `backend/.env`:

```env
MONGO_URL=<your_mongodb_connection_string>
MONGO_DB_NAME=zerodha
PORT=3002
JWT_SECRET=<your_secret>
```

## 3) Install dependencies

```bash
npm install --prefix backend
npm install --prefix dashboard
npm install --prefix frontend
```

## Run Locally

Start each app in separate terminals:

### Backend

```bash
cd backend
npm run start
```

### Dashboard

```bash
cd dashboard
npm run start
```

### Frontend

```bash
cd frontend
npm run start
```

Default ports:

- Frontend: `3000`
- Dashboard: `3001` (or next free port)
- Backend API: `3002`

## Host Consistency Note

The project is configured to prefer same-host URLs by default:

- Frontend redirects to dashboard using current host
- Frontend/Dashboard API clients use current host + backend port (`3002`)

Optional env overrides:

- `REACT_APP_DASHBOARD_URL`
- `REACT_APP_DASHBOARD_PORT`
- `REACT_APP_API_URL`

## API Highlights

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /allHoldings`
- `POST /newOrder`
- `GET /api/portfolio/analysis`

`GET /api/portfolio/analysis` returns:

- totals
- stock and sector allocation
- diversification metrics (HHI, top3Weight, effectiveStocks)
- risk score and explainable factors
- insights
- cache metadata
- methodology metadata

## Interview Talking Points

- Why deterministic risk scoring over black-box models
- How HHI and sector concentration capture portfolio risk
- Why TTL caching + invalidation improves scalability
- How explainable factors improve trust and usability

## Build Commands

```bash
npm run build --prefix frontend
npm run build --prefix dashboard
```

Backend syntax check:

```bash
node --check backend/index.js
```
