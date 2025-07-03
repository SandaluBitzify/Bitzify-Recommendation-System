from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Load main dataset
print("🔹 Loading dataset...")
df = pd.read_excel("Acumatica_Customers_35000.xlsx")

# Extract addon columns
addon_columns = df.columns[2:]

# Precompute customer-addon matrix
print("🔹 Precomputing customer-addon matrix...")
customer_matrix = df[addon_columns].values

# Load curated addon relationships
print("🔹 Loading curated addon relationships...")
relations_df = pd.read_excel("Acumatica_Addon_Relationships.xlsx")

# Build dictionary: {Primary Addon: [related addons]}
addon_relations = {}
for _, row in relations_df.iterrows():
    primary = row["Primary Addon"]
    related = [r for r in row[1:].values if pd.notna(r)]
    addon_relations[primary] = related

# Create Flask app
app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return jsonify({"message": "Collaborative Recommendation API is running."})

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    if not data or "customer_number" not in data:
        return jsonify({"error": "Please provide customer_number"}), 400

    customer_number = data["customer_number"]
    selected_addon = data.get("selected_addon", None)

    customer_row = df[df["Customer Number"] == customer_number]

    # ✅ Handle new customer
    if customer_row.empty:
        if selected_addon and selected_addon in addon_columns:
            # Co-occurrence recommendations
            cooccurrence_counts = {}
            for idx in range(customer_matrix.shape[0]):
                if customer_matrix[idx][addon_columns.get_loc(selected_addon)] == 1:
                    for addon in addon_columns:
                        if addon != selected_addon and customer_matrix[idx][addon_columns.get_loc(addon)] == 1:
                            cooccurrence_counts[addon] = cooccurrence_counts.get(addon, 0) + 1

            recommended_sorted = sorted(cooccurrence_counts, key=cooccurrence_counts.get, reverse=True)

            recommendation_list = []
            for addon in recommended_sorted[:10]:
                recommendation_list.append({
                    "addon": addon,
                    "already_installed": 0
                })

        else:
            # No selected addon: recommend most popular addons overall
            total_counts = df[addon_columns].sum().sort_values(ascending=False)

            recommendation_list = []
            for addon in total_counts.index[:10]:
                recommendation_list.append({
                    "addon": addon,
                    "already_installed": 0
                })

    else:
        # ✅ Existing customer: collaborative filtering
        customer_index = customer_row.index[0]

        similarities = cosine_similarity(
            customer_matrix[customer_index].reshape(1, -1),
            customer_matrix
        ).flatten()

        similar_indices = similarities.argsort()[::-1][1:51]

        addon_counts = {}
        for idx in similar_indices:
            for addon in addon_columns[df.iloc[idx][addon_columns] == 1]:
                addon_counts[addon] = addon_counts.get(addon, 0) + 1

        recommended_sorted = sorted(addon_counts, key=addon_counts.get, reverse=True)

        current_installed = set(addon_columns[customer_row.iloc[0][addon_columns] == 1])

        recommendation_list = []
        for addon in recommended_sorted[:10]:
            recommendation_list.append({
                "addon": addon,
                "already_installed": int(addon in current_installed)
            })

    # ✅ Append all curated suggestions from addon_relations
    if selected_addon and selected_addon in addon_relations:
        for related in addon_relations[selected_addon]:
            recommendation_list.append({
                "addon": related,
                "already_installed": "acumatica suggested"
            })


    return jsonify({
        "customer_number": customer_number,
        "selected_addon": selected_addon,
        "recommended_addons": recommendation_list
    })

if __name__ == "__main__":
    app.run(debug=True)
