from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import io

app = Flask(__name__)
CORS(app)

latest_summary = None

def is_missing(val):
    return pd.isna(val) or str(val).strip().upper() in ["", "N/A", "NONE"]

@app.route('/analyze', methods=['POST'])
def analyze_contacts():
    global latest_summary
    try:
        data = request.get_json()
        df = pd.DataFrame(data)

        phone_fields = [col for col in df.columns if "phone" in col.lower()]
        important_fields = ["First Name", "Last Name", "E-mail Address"] + phone_fields

        # ✅ Basic Missing Counts
        missing_names = df.apply(
            lambda row: is_missing(row.get("First Name")) or is_missing(row.get("Last Name")),
            axis=1
        ).sum()
        missing_emails = df["E-mail Address"].apply(is_missing).sum() if "E-mail Address" in df else 0
        missing_phones = df[phone_fields].apply(lambda row: all(is_missing(val) for val in row), axis=1).sum() if phone_fields else 0

        # ✅ Top 5 companies
        top_companies = df["Company"].value_counts().head(5).items() if "Company" in df else []

        # ✅ Severely incomplete (missing 3 of 4 key fields)
        def is_severely_incomplete(row):
            count = sum([
                is_missing(row.get("First Name")),
                is_missing(row.get("Last Name")),
                is_missing(row.get("E-mail Address")),
                all(is_missing(row.get(field)) for field in phone_fields)
            ])
            return count >= 3

        severely_incomplete_count = df.apply(is_severely_incomplete, axis=1).sum()

        # ✅ Email domain classification
        def classify_email(email):
            if not isinstance(email, str) or "@" not in email:
                return "unknown"
            domain = email.split("@")[1].lower()
            if domain in ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]:
                return "free"
            elif "." in domain:
                return "business"
            return "unknown"

        domain_types = df["E-mail Address"].apply(classify_email) if "E-mail Address" in df else pd.Series(dtype=str)
        email_category_breakdown = {
            "free": int((domain_types == "free").sum()),
            "business": int((domain_types == "business").sum()),
            "unknown": int((domain_types == "unknown").sum())
        }

        # ✅ Average number of missing fields (First, Last, Email, Phone)
        def missing_fields_count(row):
            return sum([
                is_missing(row.get("First Name")),
                is_missing(row.get("Last Name")),
                is_missing(row.get("E-mail Address")),
                all(is_missing(row.get(field)) for field in phone_fields)
            ])

        avg_missing_fields = df.apply(missing_fields_count, axis=1).mean()

        # ✅ Final summary
        latest_summary = {
            "total_contacts": len(df),
            "missing_names": int(missing_names),
            "missing_emails": int(missing_emails),
            "missing_phones": int(missing_phones),
            "top_companies": list(top_companies),
            "severely_incomplete_count": int(severely_incomplete_count),
            "email_category_breakdown": email_category_breakdown,
            "avg_missing_fields": round(avg_missing_fields, 2)
        }

        return jsonify({
            "status": "success",
            "summary": latest_summary
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/full-stats')
def full_stats():
    global latest_summary
    if not latest_summary:
        return jsonify({"status": "error", "message": "No data available"}), 400
    return jsonify(latest_summary)

if __name__ == '__main__':
    app.run(debug=True)
