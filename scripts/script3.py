import pandas as pd
import random

# All categories with their tools
categories = {
    "Data Synchronisation": [
        "Weka One", "TIG Freight", "Celigo Integration Platform (Shopify)", "Virtual Cabinet",
        "HammerTech", "biotime", "Buildlogic", "Celigo Integration Platform (Amazon)",
        "Bizex POS", "Straightsell B2B Ordering Portal for MYOB"
    ],
    "Billing and Invoices": [
        "KIM", "TRAILD", "KIM Transport Management System", "Ocerra AP Automation",
        "Autodesk Construction Cloud", "Container Tracking", "ProSpend: Expense Manager",
        "Buildlogic", "Lightyear", "AcuRebate"
    ],
    "Inventory Management": [
        "Quality Management Suite for MYOB Acumatica", "Weka One", "TIG Freight",
        "NETSTOCK", "DSD Delivery", "Neto Commerce Platform",
        "Retail Express by Maropost", "Straightsell Order Approval Website for MYOB",
        "Container Tracking", "Lightspeed (X-Series) and MYOB Integrations"
    ],
    "E-Commerce": [
        "Weka One", "TIG Freight", "Neto Commerce Platform", "Retail Express by Maropost",
        "Straightsell Order Approval Website for MYOB", "Celigo Integration Platform (Shopify)",
        "RouteWise", "Straightsell B2B Ordering Portal for MYOB",
        "MYOB Acumatica + Shopify Integration", "Shopify for MYOB Acumatica"
    ],
    "Job Management": [
        "Velixo – Reporting, Budgeting & Data automation in Excel", "KIM", "SolBox SmartMove",
        "KIM Transport Management System", "Autodesk Construction Cloud",
        "TOKN", "biotime",
        "Buildlogic", "Acu Process Manufacturing", "RouteWise"
    ],
    "Manufacturing": [
        "Quality Management Suite for MYOB Acumatica", "NETSTOCK", "TRAILD Expense Management",
        "DSD Delivery", "Straightsell Order Approval Website for MYOB",
        "TOKN The Next-Gen Enterprise App Platform for MYOB Acumatica",
        "Container Tracking", "Acu Process Manufacturing", "SyncHub", "ezyCollect"
    ],
    "Business Intelligence": [
        "SolBox SmartMove", "Ocerra AP Automation", "TRAILD Expense Management",
        "Phocas Business Intelligence Software", "HammerTech", "Buildlogic",
        "SyncHub", "Modano", "SQUIZZ.com", "Phocas Financial Statements"
    ],
    "Tools for Accountants": [
        "TRAILD", "Ocerra AP Automation", "Phocas Business Intelligence Software",
        "Virtual Cabinet", "CarbonView", "Lightyear",
        "Accounts Payable Automation Solution for MYOB", "ezyCollect",
        "Simple Invest 360", "Business Spend Management"
    ],
    "CRM": [
        "Celigo Integration Platform (Shopify)", "Container Tracking", "Celigo Integration Platform (Amazon)",
        "WooCommerce + MYOB Integrations", "DSD Van Sales", "HubSpot Integration + myob (Integration Fox)",
        "Celigo Integration Platform (WooCommerce)", "Zoho and MYOB Acumatica Connector",
        "Sales Pulse", "Pepperi"
    ],
    "Point of Sale": [
        "Neto Commerce Platform", "Retail Express by Maropost", "BPOS",
        "Lightspeed (X-Series) and MYOB Integrations", "Bizex POS",
        "Shopify for MYOB Acumatica", "Lightspeed & MYOB Acumatica Integration",
        "EDIStech", "Pepperi", "1Retail POS"
    ]
}

# Create column headers
columns = ["Customer Number", "Customer Name"]
for category, tools in categories.items():
    for tool in tools:
        columns.append(f"{category}: {tool}")

# Generate data
rows = []
for i in range(35000):
    cust_num = 1000 + i
    cust_name = f"Company {i+1}"
    row = [cust_num, cust_name]
    # Random installs: 0 or 1
    row += [random.choice([0,1]) for _ in range(len(columns)-2)]
    rows.append(row)

# Build DataFrame
df = pd.DataFrame(rows, columns=columns)

# Save to Excel
df.to_excel("MYOB_35000_Customers_Dataset.xlsx", index=False)

print("✅ Dataset created: MYOB_35000_Customers_Dataset.xlsx")
