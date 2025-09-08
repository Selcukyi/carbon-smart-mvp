from typing import List, Tuple
import pandas as pd

REQUIRED_COLUMNS = [
    "entity",
    "facility",
    "scope",
    "activity_name",
    "unit",
    "amount",
    "factor_code",
    "period",
]


def _read_dataframe(file_bytes: bytes, filename: str) -> pd.DataFrame:
    if filename.lower().endswith(".csv"):
        return pd.read_csv(pd.io.common.BytesIO(file_bytes))
    if filename.lower().endswith(".xlsx") or filename.lower().endswith(".xls"):
        return pd.read_excel(pd.io.common.BytesIO(file_bytes))
    raise ValueError("Unsupported file type. Upload CSV or XLSX.")


def parse_activity_file(file_bytes: bytes, filename: str) -> Tuple[pd.DataFrame, List[str]]:
    df = _read_dataframe(file_bytes, filename)
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    return df, missing

