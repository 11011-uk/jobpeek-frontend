# 🚀 Job Scraper & Viewer – Deployment & Operations Guide

---

## 1. **Project Structure Overview**

```
Web scrapping/
│
├── main.py                # FastAPI backend (serves API and static files)
├── jobs.db                # SQLite database (job data, formatted/cached)
├── jobparsing.py          # Scraper script (fetches jobs, updates jobs.db)
├── static/                # Frontend (HTML, JS, CSS)
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── .env                   # Environment variables (API keys, etc.)
├── requirements.txt       # Python dependencies (create if missing)
└── README.md              # Project documentation (this file)
```

---

## 2. **Backend Deployment (Railway or Render)**

### **A. Prepare Your Backend**

1. **Ensure your repo contains:**
   - `main.py`
   - `jobs.db` (your SQLite database)
   - `requirements.txt` (see below)
   - `.env` (with your OpenRouter API key, but do NOT commit this to public repos)
   - `static/` folder (for serving frontend if you want backend to serve static too)

2. **Create `requirements.txt`** (if missing):

   ```
   fastapi
   uvicorn
   python-dotenv
   openai
   sqlite3
   bs4
   requests
   ```

   *(Add any other dependencies you use, e.g., selenium, if you want to run the scraper on the server)*

3. **Push your code to GitHub.**

---

### **B. Deploy to Railway or Render**

#### **Railway**
1. Go to [Railway](https://railway.app/) and sign up.
2. Click "New Project" → "Deploy from GitHub repo".
3. Select your repo.
4. Set environment variables:
   - `OPENAI_API_KEY` (your OpenRouter key)
5. Set the start command:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
6. Deploy!  
   - Railway will give you a public backend URL (e.g., `https://your-app.up.railway.app`).

#### **Render**
1. Go to [Render](https://render.com/) and sign up.
2. Create a new "Web Service" → Connect your GitHub repo.
3. Set environment variables:
   - `OPENAI_API_KEY`
4. Set the start command:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Deploy!

---

### **C. Database Handling**

- **Option 1: Bundle `jobs.db` in your repo**  
  - This is fine for small/medium DBs and low-traffic sites.
  - When you push to GitHub, include `jobs.db` (or upload it manually in the Railway/Render dashboard if needed).
  - **Note:** If you update the DB locally (e.g., after scraping), you must re-upload or re-deploy with the new DB.

- **Option 2: Use a Managed Database (Advanced, Optional)**
  - For scaling, use Railway/Render’s free Postgres add-on.
  - You’ll need to update your code to use Postgres instead of SQLite.

---

## 3. **Frontend Deployment (Netlify)**

### **A. Prepare Your Frontend**

- Your frontend is the `static/` folder (`index.html`, `app.js`, `styles.css`).

### **B. Deploy to Netlify**

1. Go to [Netlify](https://www.netlify.com/) and sign up.
2. Click "Add new site" → "Import an existing project" from GitHub.
3. Select your repo.
4. Set the publish directory to `static`.
5. Deploy!

**After deployment:**
- Update the `API_BASE` in `static/app.js` to point to your backend’s public URL (from Railway/Render), e.g.:
  ```js
  const API_BASE = "https://your-app.up.railway.app";
  ```
- Commit and push this change to GitHub, Netlify will auto-redeploy.

---

## 4. **Job Scraper (`jobparsing.py`) – How to Run**

- **Best Practice:**  
  - Run the scraper **locally** on your machine (or a cloud VM if you want to automate).
  - After scraping, upload the new `jobs.db` to your backend (commit and push, or upload via dashboard).
  - **Why?**  
    - Scraping is slow and can be blocked by the source site if run from a public server.
    - Railway/Render free plans may not allow long-running background jobs.

- **Automation (Optional):**
  - Use a cheap/free VPS (e.g., Oracle Cloud Free Tier, AWS Free Tier, or a local Raspberry Pi) to run the scraper on a schedule.
  - After scraping, upload the new DB to your backend deployment.

---

## 5. **Performance Tips**

- **Frontend:**  
  - Use sessionStorage/localStorage to persist visited jobs across reloads (optional).
  - Lazy-load jobs (already done).
- **Backend:**  
  - Pre-format jobs in batches (run a script to call GPT for all jobs and cache results in DB).
  - Use a CDN for static files (Netlify does this automatically).
- **Scraper:**  
  - Run in parallel (with care) to speed up scraping, but don’t overload the source site.

---

## 6. **Files to Upload/Deploy**

| File/Folder      | Backend (Railway/Render) | Frontend (Netlify) |
|------------------|:------------------------:|:------------------:|
| main.py          |           ✅            |         ❌         |
| jobs.db          |           ✅            |         ❌         |
| jobparsing.py    |   (local/manual only)   |         ❌         |
| static/          |           ✅            |         ✅         |
| requirements.txt |           ✅            |         ❌         |
| .env             |   (set as env var)      |         ❌         |

---

## 7. **What to Change in Code**

- In `static/app.js`, set:
  ```js
  const API_BASE = "https://your-backend-url.up.railway.app";
  ```
- In `main.py`, ensure you use `load_dotenv(override=True)` at the top.
- In your deployment dashboard, set the `OPENAI_API_KEY` environment variable (do NOT commit `.env` to public repos).

---

## 8. **Example `requirements.txt`**

```
fastapi
uvicorn
python-dotenv
openai
bs4
requests
sqlite3
```

---

## 9. **Summary Table**

| Task                | Where/How to Do It                                      |
|---------------------|--------------------------------------------------------|
| Scrape jobs         | Run `jobparsing.py` locally, update `jobs.db`          |
| Deploy backend      | Railway/Render, include `main.py`, `jobs.db`, `static/`|
| Deploy frontend     | Netlify, only `static/` folder                         |
| Set API key         | Railway/Render dashboard, as env var                   |
| Update API_BASE     | In `static/app.js`, to backend public URL              |
| Update DB           | Re-upload `jobs.db` to backend when you scrape new jobs|

---

## 10. Pre-formatting Script (Batch GPT Formatting)

### What is it?
A Python script that iterates through all jobs in your `jobs.db`, calls the GPT model for each job (if not already formatted), and saves the formatted result in the `formatted_description` column. This ensures all jobs are formatted before deployment, so users never wait for GPT at runtime.

### When/Where to Run
- **After scraping new jobs** with `jobparsing.py` (locally).
- **After changing the GPT prompt** (to reformat all jobs).
- **Run locally** on your machine (recommended for cost and control).
- **Workflow:**
  1. Scrape jobs → update `jobs.db`.
  2. Run pre-formatting script → update `formatted_description` for all jobs.
  3. Upload new `jobs.db` to backend (commit/push or upload via dashboard).

### Example Script
```python
import sqlite3
from main import call_gpt_format, save_formatted_to_db

def batch_format_all_jobs(db_path="jobs.db"):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT entity_id, title, company, location, description, formatted_description FROM jobs")
    jobs = cur.fetchall()
    for entity_id, title, company, location, description, formatted in jobs:
        if formatted:
            continue  # already formatted
        print(f"Formatting: {title} ({entity_id})...")
        formatted_text = call_gpt_format(title, company, location, description)
        save_formatted_to_db(entity_id, formatted_text)
    conn.close()

if __name__ == "__main__":
    batch_format_all_jobs()
```

### Benefits
- **Fast user experience:** All jobs load instantly, no GPT wait time.
- **Consistent formatting:** All jobs use the latest prompt.
- **Cost control:** You decide when/how often to call GPT.

---

## 11. Rich Text (Bold/Markdown) in Formatted Descriptions

### Problem
GPT may output `**text**` for bold, but your frontend displays it as plain text.

### Solution
- **Option 1:** Use a JS Markdown-to-HTML library (like [marked.js](https://marked.js.org/)) in your frontend to render formatted descriptions as HTML.
- **Option 2:** Write a simple JS function to replace `**text**` with `<b>text</b>` or `<strong>text</strong>` before inserting into the DOM.
- **Security:** Always use `textContent` for user data unless you sanitize/convert markdown to HTML safely.

### Example (Option 2, Simple Bold Only)
```js
function renderBold(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
}
// Usage:
// document.getElementById('job-description').innerHTML = renderBold(job.description);
```

---

## 12. How to Run and Deploy pre_main.py (Pre-formatted Backend)

### Running Locally

1. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn python-dotenv sqlite3 bs4 openai requests
   ```
2. **Run the backend:**
   ```bash
   uvicorn pre_main:app --reload
   ```
   or for production:
   ```bash
   uvicorn pre_main:app --host 0.0.0.0 --port 8000
   ```
3. **Open your browser at:**
   - http://127.0.0.1:8000

### Deployment (Railway/Render for Backend, Netlify for Frontend)

#### Backend (Railway/Render)
- **Files to upload:**
  - `pre_main.py` (or `main.py` for on-demand GPT)
  - `jobs.db`
  - `static/` folder
  - `requirements.txt`
- **Start command:**
  - For pre-formatted only:
    ```
    uvicorn pre_main:app --host 0.0.0.0 --port $PORT
    ```
  - For on-demand formatting:
    ```
    uvicorn main:app --host 0.0.0.0 --port $PORT
    ```
- **Set environment variables:**
  - If using GPT: `OPENAI_API_KEY`
- **Deploy!**

#### Frontend (Netlify)
- **Files to upload:**
  - Only the `static/` folder
- **Set publish directory:**
  - `static`
- **Update `API_BASE` in `static/app.js` to your backend’s public URL.**
- **Deploy!**

### Example requirements.txt
```
fastapi
uvicorn
python-dotenv
sqlite3
bs4
openai
requests
```

### Troubleshooting
- Make sure you are in the correct directory with all files present.
- All dependencies must be installed.
- Only one of `main.py` or `pre_main.py` is used as the backend entry point at a time.
- If you get an error running `uvicorn pre_main:app --reload`, check:
  - File is named `pre_main.py` and contains `app = FastAPI(...)`
  - No other process is using port 8000.
  - All dependencies are installed.

### What to Upload Where
| File/Folder      | Backend (Railway/Render) | Frontend (Netlify) |
|------------------|:-----------------------:|:------------------:|
| pre_main.py      |           ✅            |         ❌         |
| main.py          |   (optional, not both)  |         ❌         |
| jobs.db          |           ✅            |         ❌         |
| static/          |           ✅            |         ✅         |
| requirements.txt |           ✅            |         ❌         |
| batch_format_jobs.py | (optional, local)   |         ❌         |

---

