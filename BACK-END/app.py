from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Load main dataset
print("🔹 Loading dataset...")
df = pd.read_excel("MYOB_35000_Customers_Dataset.xlsx")

# Extract addon columns
addon_columns = df.columns[2:]

# Precompute customer-addon matrix
print("🔹 Precomputing customer-addon matrix...")
customer_matrix = df[addon_columns].values

# Load curated addon relationships if you want them (optional)
# relations_df = pd.read_excel("Acumatica_Addon_Relationships.xlsx")
# addon_relations = {}
# for _, row in relations_df.iterrows():
#     primary = row["Primary Addon"]
#     related = [r for r in row[1:].values if pd.notna(r)]
#     addon_relations[primary] = related

# Create Flask app
app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return jsonify({"message": "Keyword-based Inventory Recommendation API is running."})

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    if not data or "customer_number" not in data:
        return jsonify({"error": "Please provide customer_number"}), 400

    customer_number = data["customer_number"]
    selected_addon = data.get("selected_addon", None)

    if not selected_addon:
        return jsonify({"error": "Please provide selected_addon keyword"}), 400

    # Find all columns matching the keyword
    matching_columns = [col for col in addon_columns if selected_addon.lower() in col.lower()]
    if not matching_columns:
        return jsonify({"error": f"No matching addons found for '{selected_addon}'"}), 404

    # Build a sub-matrix only for matching columns
    matrix_subset = df[matching_columns].values

    # Check if the customer exists
    customer_row = df[df["Customer Number"] == customer_number]

    if customer_row.empty:
        # 🟢 NEW CUSTOMER

        # 1️⃣ Try co-occurrence logic
        cooccurrence_counts = {}
        for idx in range(customer_matrix.shape[0]):
            if any(customer_matrix[idx][addon_columns.get_loc(col)] == 1 for col in matching_columns):
                for addon in matching_columns:
                    if customer_matrix[idx][addon_columns.get_loc(addon)] == 1:
                        cooccurrence_counts[addon] = cooccurrence_counts.get(addon, 0) + 1

        if cooccurrence_counts:
            # Found co-occurrence counts
            recommended_sorted = sorted(cooccurrence_counts, key=cooccurrence_counts.get, reverse=True)
            recommendation_list = []
            for addon in recommended_sorted:
                recommendation_list.append({
                    "addon": addon,
                    "already_installed": 0
                })
        else:
            # No co-occurrence: fallback to most popular addons in matching columns
            total_counts = df[matching_columns].sum().sort_values(ascending=False)
            recommendation_list = []
            for addon in total_counts.index:
                recommendation_list.append({
                    "addon": addon,
                    "already_installed": 0
                })

        return jsonify({
            "customer_number": customer_number,
            "selected_addon": selected_addon,
            "recommended_addons": recommendation_list
        })

    else:
        # 🟢 EXISTING CUSTOMER
        customer_index = customer_row.index[0]

        # Compute similarity using only matching columns
        similarities = cosine_similarity(
            matrix_subset[customer_index].reshape(1, -1),
            matrix_subset
        ).flatten()

        similar_indices = similarities.argsort()[::-1][1:51]

        # Count frequency of each addon in similar customers
        addon_counts = {}
        for idx in similar_indices:
            for addon in matching_columns:
                if matrix_subset[idx][matching_columns.index(addon)] == 1:
                    addon_counts[addon] = addon_counts.get(addon, 0) + 1

        recommended_sorted = sorted(addon_counts, key=addon_counts.get, reverse=True)

        # Determine which are installed
        current_installed = set(
            c for c in matching_columns if customer_row.iloc[0][c] == 1
        )

        installed_related = []
        not_installed_related = []
        for addon in recommended_sorted:
            if addon in current_installed:
                installed_related.append({"addon": addon, "already_installed": 1})
            else:
                not_installed_related.append({"addon": addon, "already_installed": 0})

        # Limit to 4 installed and 6 not installed
        installed_related = installed_related[:4]
        not_installed_related = not_installed_related[:6]

        recommendation_list = installed_related + not_installed_related

        return jsonify({
            "customer_number": customer_number,
            "selected_addon": selected_addon,
            "recommended_addons": recommendation_list
        })

if __name__ == "__main__":
    app.run(debug=True)
