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

### API Endpoints
- `GET /api/llm/insights` - AI-powered analysis
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