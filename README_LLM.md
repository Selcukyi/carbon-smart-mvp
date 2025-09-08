# Carbon Emission App - LLM Entegrasyonu

Bu proje, gerçek LLM (Large Language Model) entegrasyonu ile çalışan bir karbon emisyonu yönetim uygulamasıdır.

## 🚀 Özellikler

### Backend LLM Entegrasyonu
- **OpenAI GPT-4** entegrasyonu
- **Gerçek AI analizi** ve öneriler
- **Risk değerlendirmesi** 
- **Performans metrikleri**
- **Fallback sistem** (API key yoksa mock data)

### Frontend LLM Özellikleri
- **Gerçek zamanlı AI analizi**
- **Loading states** ve error handling
- **Yenile butonu** ile manuel güncelleme
- **Responsive tasarım**

## 🛠️ Kurulum

### 1. Backend Kurulumu

```bash
cd backend
pip install -r requirements.txt
```

### 2. OpenAI API Key Ayarlama

```bash
# Environment variable olarak
export OPENAI_API_KEY="your-openai-api-key-here"

# Veya .env dosyası oluştur
echo "OPENAI_API_KEY=your-openai-api-key-here" > .env
```

### 3. Backend Başlatma

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Frontend Kurulumu

```bash
cd frontend
npm install
```

### 5. Frontend Başlatma

```bash
npm run dev
```

## 📊 LLM API Endpoints

### 1. Emisyon Analizi
```
GET /api/llm/analysis
```
AI-powered emisyon analizi ve executive summary

### 2. Öneriler
```
GET /api/llm/recommendations
```
Karbon azaltma önerileri ve ROI hesaplamaları

### 3. Risk Değerlendirmesi
```
GET /api/llm/risk-assessment
```
Karbon riskleri ve azaltma stratejileri

### 4. Tüm İçgörüler
```
GET /api/llm/insights
```
Tüm LLM analizlerini tek seferde getir

### 5. Özel Veri Analizi
```
POST /api/llm/analyze-custom-data
Content-Type: application/json

{
  "total_emissions": 2847,
  "scope1": 1247,
  "scope2": 1456,
  "scope3": 144,
  "eu_ets_allowances": 2600,
  "eu_ets_used": 2847,
  "eu_ets_price": 85.50
}
```

## 🤖 LLM Servis Özellikleri

### Analiz Türleri
1. **Executive Summary**: Yönetici özeti ve ana bulgular
2. **Key Findings**: Temel bulgular ve öncelik alanları
3. **Financial Impact**: Finansal etki analizi
4. **Compliance Status**: Uyumluluk durumu

### Öneriler
- **Başlık ve açıklama**
- **Maliyet tahmini**
- **Yıllık tasarruf**
- **Uygulama süresi**
- **Öncelik seviyesi** (high/medium/low)
- **Beklenen emisyon azaltımı**

### Risk Analizi
- **Risk kategorileri**: Uyumluluk, finansal, operasyonel, reputasyon
- **Olasılık değerlendirmesi**: High/Medium/Low
- **Etki analizi**: € miktarı
- **Azaltma stratejileri**

## 🔧 Konfigürasyon

### Backend Config
```python
# app/core/config.py
class Settings(BaseSettings):
    openai_api_key: str = ""  # OpenAI API key
    environment: str = "development"
    database_url: str = "sqlite:///./carbon_mvp.db"
```

### Frontend Config
```javascript
// src/lib/config.js
export const FEATURE_FLAGS = {
  MOCK: false, // Gerçek LLM API'sini kullan
};

export const BACKEND_URL = "http://localhost:8000";
```

## 🧪 Test

### LLM Servis Testi
```bash
cd backend
python3 test_llm.py
```

### API Testi
```bash
# Emisyon analizi
curl http://localhost:8000/api/llm/analysis

# Tüm içgörüler
curl http://localhost:8000/api/llm/insights
```

## 📈 Kullanım Senaryoları

### 1. Gerçek Zamanlı Analiz
- Dashboard'da "🔄 Yenile" butonuna tıklayın
- AI verilerinizi analiz eder ve yeni öneriler sunar

### 2. Özel Veri Analizi
- Upload sayfasından veri yükleyin
- AI otomatik olarak analiz eder ve öneriler sunar

### 3. Risk Yönetimi
- Allowances sayfasında risk analizi görüntüleyin
- AI riskleri değerlendirir ve azaltma stratejileri önerir

## 🔒 Güvenlik

- API key'ler environment variable olarak saklanır
- Fallback sistem API key yoksa mock data kullanır
- CORS ayarları yapılandırılmıştır

## 🚨 Hata Yönetimi

### Backend
- OpenAI API hatalarında fallback responses
- Detaylı logging ve error handling
- Graceful degradation

### Frontend
- Loading states ve error messages
- Fallback to mock data
- User-friendly error notifications

## 📝 Notlar

- OpenAI API key olmadan da çalışır (fallback mode)
- Gerçek LLM analizi için OpenAI API key gerekli
- Tüm analizler Türkçe ve İngilizce destekler
- Response'lar JSON formatında döner

## 🔄 Güncellemeler

- LLM analizleri cache'lenmez, her seferinde fresh data
- Manual refresh butonu ile yeniden analiz
- Real-time data processing