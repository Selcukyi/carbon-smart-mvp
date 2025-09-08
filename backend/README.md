Carbon MVP Backend

Setup:
- python -m venv venv
- source venv/bin/activate
- pip install -r backend/requirements.txt
- python -m backend.app.db.seed
- uvicorn backend.app.main:app --reload --port 8000

