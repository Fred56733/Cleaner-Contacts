from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd

import matplotlib
matplotlib.use("Agg")  # ✅ Prevent crash by using non-GUI backend

import matplotlib.pyplot as plt
import io

app = Flask(__name__)
CORS(app)  # Default CORS for development

latest_summary = None  # Cache the last summary data for chart

def is_missing(val):
    return pd.isna(val) or str(val).strip().upper() in ["", "N/A", "NONE"]

@app.route('/analyze', methods=['POST'])
def analyze_contacts():
    global latest_summary
    try:
        data = request.get_json()
        df = pd.DataFrame(data)

        phone_fields = [col for col in df.columns if "phone" in col.lower()]

        missing_names = df.apply(
            lambda row: is_missing(row.get("First Name")) or is_missing(row.get("Last Name")),
            axis=1
        ).sum()

        missing_emails = df["E-mail Address"].apply(is_missing).sum()

        missing_phones = df[phone_fields].apply(
            lambda row: all(is_missing(val) for val in row),
            axis=1
        ).sum()

        dedup_key = df.apply(
            lambda row: f"{str(row.get('First Name')).strip().upper()}-"
                        f"{str(row.get('Last Name')).strip().upper()}-"
                        f"{str(row.get('E-mail Address')).strip().upper()}-"
                        f"{str(row.get('Mobile Phone')).strip() if not pd.isna(row.get('Mobile Phone')) else ''}",
            axis=1
        )

        duplicate_count = dedup_key.duplicated().sum()

        latest_summary = {
            "total_contacts": len(df),
            "missing_names": int(missing_names),
            "missing_emails": int(missing_emails),
            "missing_phones": int(missing_phones),
            "duplicates": int(duplicate_count)
        }

        return jsonify({
            "status": "success",
            "summary": latest_summary
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/summary-chart')
def summary_chart():
    global latest_summary
    if not latest_summary:
        return "No data available", 400

    plt.clf()
    keys = ["missing_names", "missing_emails", "missing_phones", "duplicates"]
    values = [latest_summary[k] for k in keys]

    plt.figure(figsize=(6, 4))
    plt.bar(keys, values, color="skyblue")
    plt.title("Contact Summary Stats")
    plt.ylabel("Count")
    plt.xlabel("Category")

    img = io.BytesIO()
    plt.savefig(img, format="png")
    img.seek(0)

    return send_file(img, mimetype="image/png")

if __name__ == '__main__':
    app.run(debug=True)
