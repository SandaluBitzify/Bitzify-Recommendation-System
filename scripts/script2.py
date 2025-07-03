import random
import pandas as pd
 
# Weighted ERP add-ons by industry (probabilities simulate real preference)
industry_addon_weights = {
    "Manufacturing": {
        "MRP": 0.9, "MES": 0.7, "APS": 0.6, "PLM": 0.8, "QMS": 0.8, "WMS": 0.7,
        "General Ledger": 0.8, "Accounts Payable": 0.9, "Payroll": 0.7,
        "CRM": 0.5, "Inventory Management": 0.9, "Warehouse Management": 0.8,
        "Project Management": 0.6, "Time Tracking": 0.5
    },
    "Retail": {
        "POS": 0.9, "E-commerce Integration": 0.8, "Loyalty Program": 0.7, "Payment Gateway Integration": 0.8,
        "General Ledger": 0.7, "Accounts Payable": 0.8, "CRM": 0.7,
        "Inventory Management": 0.7, "Warehouse Management": 0.6,
        "Marketing Automation": 0.6
    },
    "Distribution": {
        "Inventory Management": 0.9, "Warehouse Management": 0.9, "Demand Forecasting": 0.8,
        "SCM": 0.9, "EDI": 0.7,
        "General Ledger": 0.7, "Accounts Payable": 0.8, "Payroll": 0.6,
        "CRM": 0.5
    },
    "Professional Services": {
        "Project Management": 0.9, "Time Tracking": 0.9, "Job Costing": 0.8,
        "Billing": 0.8, "CRM": 0.7,
        "General Ledger": 0.7, "Accounts Payable": 0.7,
        "Payroll": 0.6
    },
    "Construction": {
        "Project Management": 0.9, "Job Costing": 0.9, "Billing": 0.8,
        "General Ledger": 0.8, "Accounts Payable": 0.8,
        "Payroll": 0.7, "CRM": 0.5,
        "Inventory Management": 0.6
    },
    "Healthcare": {
        "QMS": 0.8, "Payroll": 0.7, "HR Management": 0.8,
        "CRM": 0.6, "General Ledger": 0.7,
        "Inventory Management": 0.5
    },
    "Finance": {
        "General Ledger": 0.95, "Accounts Payable": 0.9, "Accounts Receivable": 0.9,
        "Tax Compliance": 0.85, "Multi-Currency": 0.7, "Fixed Assets": 0.75,
        "Payroll": 0.6, "CRM": 0.4
    }
}
 
# ERP systems popularity by region
region_erp_popularity = {
    "North America": ["SAP", "Oracle NetSuite", "Microsoft Dynamics", "Infor", "Odoo"],
    "Europe": ["SAP", "Oracle NetSuite", "Microsoft Dynamics", "Infor", "Odoo"],
    "Asia-Pacific": ["SAP", "Oracle NetSuite", "Microsoft Dynamics", "MYOB", "Odoo"],
    "Middle East": ["SAP", "Oracle NetSuite", "Infor", "Microsoft Dynamics"],
    "South America": ["SAP", "Oracle NetSuite", "Microsoft Dynamics", "Odoo"],
    "Africa": ["SAP", "Oracle NetSuite", "Microsoft Dynamics", "Odoo"]
}
 
regions = list(region_erp_popularity.keys())
industries = list(industry_addon_weights.keys())
 
def generate_weighted_addons(industry):
    weights = industry_addon_weights[industry]
    chosen = []
    for addon, weight in weights.items():
        if random.random() < weight:
            chosen.append(addon)
    # Ensure 3-6 addons per combo
    if len(chosen) < 3:
        possible = set(weights.keys()) - set(chosen)
        chosen += random.sample(list(possible), min(3 - len(chosen), len(possible)))
    if len(chosen) > 6:
        chosen = random.sample(chosen, 6)
    return sorted(chosen)

 
def generate_synthetic_dataset(n=200):
    data = []
    for _ in range(n):
        region = random.choice(regions)
        erp_system = random.choice(region_erp_popularity[region])
        industry = random.choice(industries)
        addons = generate_weighted_addons(industry)
        data.append({
            "Region": region,
            "ERP System": erp_system,
            "Industry": industry,
            "ERP Add-Ons": ", ".join(addons)
        })
    return pd.DataFrame(data)
 
# Generate dataset
df = generate_synthetic_dataset(200)
print(df.head(20))

# Save to Excel
df.to_excel("erp_synthetic_dataset.xlsx", index=False)

print("Excel file saved successfully!")