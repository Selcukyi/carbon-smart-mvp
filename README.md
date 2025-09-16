# 🔍 CarbonLens

A comprehensive carbon emission management platform with AI-powered insights, EU ETS compliance, and real-time analytics.

## ✨ Features

- **📊 Real-time Dashboard**: Live carbon emission monitoring with KPI cards
- **🤖 AI-Powered Insights**: GPT-5 powered analysis, recommendations, and risk assessment
- **⚖️ EU ETS Compliance**: Automated allowance tracking and financial impact calculation
- **📤 Data Upload**: CSV/Excel file processing with emission factor mapping
- **🏢 Multi-Entity Management**: Organizational hierarchy with group companies
- **🔐 Authentication**: Role-based access control (Admin, Group Manager, Entity User)
- **🌙 Dark/Light Mode**: Responsive design with theme switching

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔑 Demo Credentials
- **Email**: admin@carbonmvp.com
- **Password**: password
- **Roles**: Admin, Group Manager, Entity User

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with SQLAlchemy ORM
- **Database**: SQLite (development), PostgreSQL (production ready)
- **AI Integration**: OpenAI GPT-5 for intelligent insights
- **Authentication**: JWT-based with role management
- **API**: RESTful with automatic OpenAPI documentation

### Frontend (React)
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: Custom CSS with responsive design
- **Charts**: Recharts for data visualization

## 📊 Key Metrics

- **Total Emissions**: Real-time CO₂e tracking across all scopes
- **EU ETS Compliance**: Allowance vs. usage with financial impact
- **Carbon Intensity**: Emissions per revenue unit
- **AI Insights**: Dynamic analysis and recommendations

## 🔧 Configuration

### Environment Variables
```bash
# Backend (.env)
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=sqlite:///./carbon_smart.db
SECRET_KEY=your_secret_key
```

## 🏢 Hubs & Routes

### Overview Hub
**Endpoint**: `GET /`  
**Description**: Landing page with project overview and navigation  
**Features**: Modern hero section, feature highlights, call-to-action

### Dashboard Hub
**Endpoint**: `GET /dashboard`  
**Description**: Main dashboard with KPIs and charts  
**Features**: 
- Total emissions KPI cards
- EU ETS financial impact
- Scope breakdown charts
- Top activities table

### Emissions Hub
**Endpoint**: `GET /emissions`  
**Description**: Detailed emissions analysis and reporting  
**Query Parameters**:
- `start` (date): Start date (YYYY-MM-DD)
- `end` (date): End date (YYYY-MM-DD)  
- `entities` (string): Comma-separated entity IDs
- `pareto` (boolean): Enable 80/20 analysis

**Sample Request**:
```bash
curl "http://localhost:8000/emissions?start=2025-01-01&end=2025-12-31&entities=1,2&pareto=false"
```

**Response Structure**:
```json
{
  "summary": {
    "total_tco2e": 2776.44,
    "yoy_pct": -5.7
  },
  "series": [...],
  "scopes": [...],
  "top_categories": [...]
}
```

### Compliance Hub
**Endpoint**: `GET /compliance`  
**Description**: EU ETS compliance monitoring and risk analysis  
**Query Parameters**:
- `start` (date): Start date (YYYY-MM-DD)
- `end` (date): End date (YYYY-MM-DD)
- `entities` (string): Comma-separated entity IDs
- `prices` (string): Comma-separated price scenarios

**Sample Request**:
```bash
curl "http://localhost:8000/compliance?start=2025-01-01&end=2025-12-31&entities=1,2&prices=90,120,150"
```

**Response Structure**:
```json
{
  "current_overshoot_tco2e": 329.82,
  "ytd_cost_eur": 28199.61,
  "allowances": [...],
  "scenarios": [...]
}
```

### Intensity Hub
**Endpoint**: `GET /intensity`  
**Description**: Carbon intensity analysis and productivity metrics  
**Query Parameters**:
- `start` (date): Start date (YYYY-MM-DD)
- `end` (date): End date (YYYY-MM-DD)
- `entities` (string): Comma-separated entity IDs

**Sample Request**:
```bash
curl "http://localhost:8000/intensity?start=2025-01-01&end=2025-12-31&entities=1,2"
```

**Response Structure**:
```json
{
  "current_intensity": 2.28,
  "yoy_change_pct": -5.2,
  "series": [...],
  "site_scatter": [...],
  "correlation": 0.894
}
```

### LLM Explain API
**Endpoint**: `POST /api/llm/explain`  
**Description**: AI-powered context-aware explanations  
**Request Body**:
```json
{
  "context": "emissions|compliance|intensity|overview",
  "data": { /* hub-specific data */ }
}
```

**Response Structure**:
```json
{
  "summary": "AI-generated analysis summary",
  "actions": [
    "Action item 1",
    "Action item 2", 
    "Action item 3"
  ]
}
```

### Screenshots
*[Screenshots will be added showing each hub interface]*

- **Dashboard**: KPI cards, charts, and overview metrics
- **Emissions**: Line charts, scope breakdown, top categories table
- **Compliance**: EU ETS status, price scenarios, risk analysis
- **Intensity**: Trend charts, scatter plots, leaderboard table

### Switching to PostgreSQL
The application is designed to work with both SQLite (development) and PostgreSQL (production). To switch to PostgreSQL:

1. **Install PostgreSQL** and create a database
2. **Update environment variables**:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/carbonlens
   ```
3. **Install additional dependencies**:
   ```bash
   pip install psycopg2-binary
   ```
4. **Run migrations** (when implemented):
   ```bash
   alembic upgrade head
   ```

The application will automatically detect the database type and configure accordingly.

### API Endpoints
- `GET /api/llm/insights` - AI-powered analysis
- `POST /api/llm/explain` - Context-aware AI explanations
- `POST /api/upload` - File upload and processing
- `GET /api/entities` - Organizational entities
- `GET /api/allowances` - EU ETS allowance data

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)
- **Frontend**: Deploy to Vercel with automatic GitHub integration
- **Backend**: Deploy to Railway with PostgreSQL database
- **Cost**: Free tier available

### Option 2: Netlify (Frontend) + Render (Backend)
- **Frontend**: Deploy to Netlify with build automation
- **Backend**: Deploy to Render with managed database
- **Cost**: Free tier available

### Option 3: Full AWS Deployment
- **Frontend**: AWS S3 + CloudFront
- **Backend**: AWS Lambda + API Gateway
- **Database**: AWS RDS PostgreSQL
- **Cost**: Pay-as-you-go

## 📈 Roadmap

- [ ] Real-time data streaming
- [ ] Advanced reporting and exports
- [ ] Mobile application
- [ ] Integration with ERP systems
- [ ] Carbon offset marketplace
- [ ] Regulatory compliance automation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@carbonmvp.com

---

**Built with ❤️ for a sustainable future**