# 📚 EBSCO Library Search Worker

Cloudflare Worker สำหรับค้นหาทรัพยากรห้องสมุดธรรมศาสตร์ผ่าน EBSCO Discovery Service

## 🚀 Quick Start

### Prerequisites
- Cloudflare account
- EBSCO API credentials
- Node.js & npm

### Installation
```bash
# Clone project
git clone <repository-url>
cd ebsco-library-worker

# Install dependencies
npm install

# Create .dev.vars for local development
echo "EBSCO_USER=your_username
EBSCO_PASS=your_password  
EBSCO_PROFILE=your_profile" > .dev.vars

# Run locally
npm run dev

# Deploy
npm run deploy
```

## 📖 API Usage

### Search Endpoint
```bash
GET /search?q={query}&{parameters}

# Examples
/search?q=machine learning
/search?q=การเงิน&limiter=LA99:Thai
/search?q=AU:John Smith&searchmode=bool
/search?q=psychology&limiter=RV:y,FT:y&sort=date
```

### Publication Endpoint
```bash
GET /publication?q={query}&{parameters}

# Example
/publication?q=Nature&limiter=DT1:2023-2024
```

### Parameters
| Parameter | Values | Description |
|-----------|--------|-------------|
| q | string | Search query (required) |
| searchmode | smart, bool, all, any | Search mode |
| sort | relevance, date, date2 | Sort order |
| limiter | See below | Filters |
| expander | fulltext, relatedsubjects | Expand search |

### Common Limiters
- `FT:y` - Full text only
- `RV:y` - Peer reviewed
- `FC:y` - Catalog only (books)
- `FT1:y` - Available in library
- `FM20:y` - eBooks only
- `LA99:Thai` - Thai language
- `LA99:English` - English language
- `DT1:2020-2024` - Date range

### Field Codes
- `AU:` - Author
- `TI:` - Title
- `SU:` - Subject
- `IB:` - ISBN

## 🏗️ Project Structure
```
├── src/
│   ├── index.js          # Main worker
│   ├── handlers/         # Route handlers
│   ├── services/         # EBSCO auth
│   └── utils/           # Helpers
├── wrangler.toml         # Cloudflare config
└── .dev.vars            # Local env vars
```

## 🔧 Configuration

### wrangler.toml
```toml
name = "library-search-worker"
main = "src/index.js"

[[kv_namespaces]]
binding = "KV"
id = "your-kv-namespace-id"
```

### Environment Variables
```
EBSCO_USER=your_username
EBSCO_PASS=your_password
EBSCO_PROFILE=your_profile
```

## 🧪 Testing
```bash
# Run tests
npm test

# Test locally
curl http://localhost:8787/search?q=test
```

## 📝 Example Queries

```bash
# หนังสือภาษาไทย
/search?q=การเงิน&limiter=LA99:Thai,FC:y

# บทความวิชาการล่าสุด
/search?q=AI&limiter=RV:y&sort=date

# ค้นหาด้วยชื่อผู้แต่ง
/search?q=AU:ประเวศ วะสี

# eBooks ภาษาอังกฤษ
/search?q=programming&limiter=FM20:y,LA99:English
```

## 🤝 Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License
MIT

## 🙏 Credits
- Thammasat University Library
- EBSCO Information Services
- Cloudflare Workers
