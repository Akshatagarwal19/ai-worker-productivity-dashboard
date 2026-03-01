# AI-Powered Worker Productivity Dashboard

Live Application: https://ai-worker-productivity-dashboard-xvup.onrender.com 
GitHub Repository: https://github.com/Akshatagarwal19/ai-worker-productivity-dashboard.git

---

## 📌 Overview

This project implements a production-style, full-stack web application that ingests AI-generated CCTV events and computes worker, workstation, and factory-level productivity metrics.

The system simulates an AI-powered manufacturing environment with 6 workers and 6 workstations. It focuses on clean architecture, time-based metric computation, and scalability considerations aligned with real-world MLOps practices.

---

## 🏗 Architecture Overview

Edge (AI CCTV Cameras)  
↓  
Event Ingestion API (Node.js + Express)  
↓  
SQLite Database  
↓  
Metrics Aggregation Service  
↓  
REST APIs  
↓  
React Dashboard  

### System Components

**1. Ingestion Layer**
- Receives structured JSON AI events
- Validates and persists events
- Supports dummy data regeneration

**2. Persistence Layer**
- SQLite database (lightweight demo environment)
- Stores workers, workstations, and AI events

**3. Metrics Computation Layer**
- Aggregates time-based and production metrics
- Handles out-of-order timestamps
- Applies assumptions for incomplete event streams

**4. Presentation Layer**
- React dashboard
- Factory-level summary
- Worker-level metrics table
- Workstation-level metrics table
- Dummy data regeneration button

---

## 🗄 Database Schema

### Workers
- `worker_id` (Primary Key)
- `name`

### Workstations
- `station_id` (Primary Key)
- `name`

### Events
- `id` (Primary Key)
- `timestamp`
- `worker_id`
- `workstation_id`
- `event_type`
- `confidence`
- `count`

---

## 📊 Metric Definitions

### Worker-Level Metrics
- **Active Time**: Total duration between consecutive `working` events
- **Idle Time**: Duration between `idle` states
- **Utilization %**:  
  `activeTime / (activeTime + idleTime) * 100`
- **Total Units Produced**: Sum of `product_count` events
- **Units per Hour**:  
  `totalUnits / (activeTime in hours)`

### Workstation-Level Metrics
- **Occupancy Time**: Duration when associated worker is in `working` state
- **Utilization %**: Derived from occupancy presence
- **Total Units Produced**
- **Throughput Rate**:  
  `totalUnits / (occupancyTime in hours)`

### Factory-Level Metrics
- Total productive time (sum of worker active time)
- Total production count
- Average utilization across workers
- Average production rate

---

## ⏱ Time-Based Assumptions

1. Event durations are calculated using timestamp differences between consecutive events.
2. Events are sorted chronologically before metric computation.
3. If the last event has no successor, a 5-minute window is assumed.
4. Product count events are aggregated independently from time-state transitions.

---

## ⚙ Handling System Challenges

### 1️⃣ Intermittent Connectivity
- Edge buffering recommended at camera level
- Retry logic with idempotent ingestion endpoints
- Event ordering handled during aggregation

### 2️⃣ Duplicate Events
Recommended approaches:
- Composite unique index (timestamp + worker_id + event_type)
- Event hash-based deduplication
- Idempotency keys

### 3️⃣ Out-of-Order Timestamps
- Events sorted before computing metrics
- Late-arriving events can trigger re-aggregation

---

## 🧠 Model Versioning Strategy

To support multiple AI model versions:
- Add `model_version` column to Events table
- Track metrics per model version
- Enable comparative performance analysis

---

## 📉 Model Drift Detection

Drift detection strategies:
- Monitor confidence score distribution shifts
- Track change in production variance
- Alert on deviation thresholds
- Maintain historical baseline metrics

---

## 🔁 Retraining Strategy

- Periodic evaluation job
- Trigger retraining pipeline when drift detected
- Store retrained models in model registry
- Gradual rollout with version comparison

---

## 📈 Scaling Strategy

### From 5 → 100+ Cameras
- Replace SQLite with PostgreSQL
- Introduce message queue (Kafka) for ingestion
- Separate ingestion and analytics services
- Horizontal scaling of compute layer

### Multi-Site Deployment
- Multi-tenant schema
- Regional data isolation
- Cloud-native container orchestration
- Centralized monitoring

---

## 🐳 Running Locally (Docker)

Build container:

```bash
docker build -t factory-dashboard .

```
Run container: 

```bash
docker run -p 5000:5000 factory-dashboard .

```

Open in browser:

```Code
http://localhost:5000

```
## 🚀 Live Deployment
Deployed using Render with Docker-based build.

Live URL: https://ai-worker-productivity-dashboard-xvup.onrender.com

## 📌 Design Tradeoffs

 - SQLite chosen for simplicity in demo environment

 - Metrics computed synchronously for clarity

 - Single-container architecture for ease of deployment

 - Assumed fixed 5-minute fallback window for final events

---

## 📬 Conclusion

This implementation demonstrates:

 - Clean event ingestion architecture

 - Time-based metric computation

 - Production-aware assumptions

 - Scalable system design thinking

 - Docker-based deployment

 - MLOps-aligned design considerations

 