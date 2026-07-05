# IPO Risk & Priority Engine
### ML-Driven Cross-Sectional Analysis of IPO Success and Risk Profiling

> A machine learning platform for analyzing Indian IPOs through predictive modeling, risk profiling, and explainable AI to support investors, regulators, and financial institutions in making data-driven decisions.

---

# Overview

Traditional IPO evaluation relies heavily on historical averages, financial ratios, and manual market analysis. However, modern financial markets exhibit highly non-linear relationships influenced by macroeconomic conditions, sector-specific trends, regulatory changes, and investor behavior.

This project introduces an end-to-end machine learning framework capable of transforming raw IPO datasets into actionable investment insights.

Rather than predicting a single numeric outcome, the system prioritizes IPO opportunities using learning-to-rank techniques while simultaneously identifying anomalous offerings, generating interpretable explanations, and producing stakeholder-specific analytical reports.

The platform combines machine learning, feature engineering, explainable AI, and interactive dashboards into a unified decision-support system.

---

# Problem Statement

IPO investment decisions are often affected by:

- Inconsistent financial disclosures
- Sector-specific performance bias
- Macroeconomic volatility
- Limited transparency
- Difficult-to-interpret statistical models

Existing approaches typically rely on traditional regression models that struggle to capture complex market relationships.

Our objective was to design a scalable ML-driven framework capable of:

- ranking IPO opportunities
- profiling investment risk
- identifying market anomalies
- explaining model decisions
- supporting data-driven financial analysis

---

# My Contributions

As part of this collaborative project, I was responsible for the machine learning and application development components.

My work included:

- Designing the complete ML pipeline
- Feature engineering and preprocessing workflows
- Training and validating XGBoost Ranking and Regression models
- Implementing GroupKFold cross-validation
- Developing SHAP-based explainability
- Building the FastAPI backend
- Developing the React dashboard used for visualization and reporting
- Creating automated context generation for AI-powered reporting

Data collection and aggregation from regulatory filings, NSE/BSE datasets, and macroeconomic sources were performed collaboratively within the project team.

---

# Machine Learning Pipeline

The system follows an end-to-end data science workflow.

```
Raw IPO Data
        │
        ▼
Data Cleaning
        │
        ▼
Feature Engineering
        │
        ▼
XGBoost Learning-to-Rank
        │
        ├─────────────► SHAP Explainability
        │
        ▼
Priority Scores
        │
        ├─────────────► Sector Analysis
        │
        ├─────────────► Risk Profiling
        │
        ▼
FastAPI Backend
        │
        ▼
React Dashboard
```

---

# Data Pipeline

The project integrates structured financial data collected from:

- NSE & BSE historical IPO records
- Company fundamentals
- Macroeconomic indicators
- Regulatory information

The preprocessing pipeline performs:

- schema validation
- feature normalization
- missing value handling
- temporal feature generation
- sector grouping
- leakage prevention

A derived feature

```
years_since_ipo
```

captures changing market behaviour across different regulatory periods.

---

# Models Used

## XGBoost Ranker

Primary prediction engine

Objective:

```
rank:ndcg
```

Rather than minimizing regression error, the model learns to rank IPOs by expected investment priority.

---

## XGBoost Regressor

Fallback model for estimating expected listing returns when ranking constraints are insufficient.

---

## GroupKFold Validation

Sector-aware validation prevents information leakage between companies belonging to the same industry.

---

## SHAP Explainability

SHAP values provide feature-level explanations for every prediction, allowing users to understand why an IPO received a particular priority score.

---

# Key Features

✔ Machine Learning Based IPO Ranking

✔ Sector-Normalized Priority Scores

✔ Explainable AI (SHAP)

✔ Risk Profiling

✔ Interactive Dashboard

✔ FastAPI REST Backend

✔ React Frontend

✔ AI Report Generation

---

# Technology Stack

## Machine Learning

- Python
- XGBoost
- Scikit-learn
- SHAP
- Pandas
- NumPy

## Backend

- FastAPI

## Frontend

- React
- TypeScript

## Database

- PostgreSQL

---

# Repository Structure

```
server/
│
├── app.py
├── context_builder.py
├── xgb_priority_pipeline.py
├── analysis/
└── data/

perplex-ui/
```

---

# API Endpoints

| Endpoint | Description |
|----------|-------------|
| POST /train | Train ML pipeline |
| GET /scores | Issuer predictions |
| GET /sector-summary | Sector analysis |
| GET /context | Structured ML context |
| GET /report | Markdown report |

---

# Running the Project

## Backend

```bash
cd server

python -m venv .venv

pip install -r requirements.txt

python xgb_priority_pipeline.py

python context_builder.py

python -m uvicorn app:app --reload
```

## Frontend

```bash
cd perplex-ui

npm install

npm run dev
```

---

# Future Improvements

- Integration of live IPO feeds
- Financial news sentiment analysis using FinBERT
- Real-time market monitoring
- Advanced anomaly detection
- Portfolio optimization
- Cloud deployment pipeline

---

# Research Focus

This project demonstrates practical applications of:

- Machine Learning
- Financial Data Analytics
- Explainable AI
- Learning-to-Rank Models
- Data Engineering
- Predictive Analytics
- Decision Support Systems
