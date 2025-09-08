import io
import pandas as pd
from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_health():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_upload_missing_columns():
    # Only one required column
    df = pd.DataFrame({"entity": ["X"]})
    buf = io.BytesIO()
    df.to_csv(buf, index=False)
    buf.seek(0)
    files = {"file": ("test.csv", buf.getvalue(), "text/csv")}
    r = client.post("/upload", files=files)
    assert r.status_code == 400
    assert "Missing columns" in r.json()["detail"]

