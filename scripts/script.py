import pandas as pd
import numpy as np

# Number of customers
num_customers = 35000

# Acumatica Addon Names
addons = [
    "Financial Management",
    "Distribution Management",
    "CRM",
    "Project Accounting",
    "Manufacturing Management",
    "Field Service Management",
    "Fixed Assets",
    "Payroll Management",
    "Commerce Edition",
    "Warehouse Management",
    "Construction Edition",
    "Intercompany Accounting",
    "Time and Expense Management",
    "Service Management",
    "Advanced Expense Management",
    "Document Management and OCR",
    "Requisition Management",
    "Budgeting and Forecasting",
    "Advanced Revenue Recognition",
    "Tax Management",
    "Equipment Management",
    "Advanced Inventory",
    "Advanced Financial Reporting",
    "Mobile App Extension",
    "EDI Integration"
]

# Initialize data
data = []

for i in range(num_customers):
    customer_number = 1001 + i
    customer_id = f"Customer {i + 1}"

    # Randomly choose how many addons are installed
    num_installed = np.random.randint(3, 9)  # Between 3 and 8 addons

    # Randomly pick installed addons
    installed_indices = np.random.choice(len(addons), size=num_installed, replace=False)

    # Create row
    row = [customer_number, customer_id]
    for idx in range(len(addons)):
        if idx in installed_indices:
            row.append(1)
        else:
            row.append(0)

    data.append(row)

# Create DataFrame
columns = ["Customer Number", "Customer ID"] + addons
df = pd.DataFrame(data, columns=columns)

# Save to Excel
df.to_excel("Acumatica_Customers_35000.xlsx", index=False)

print("✅ Excel file 'Acumatica_Customers_35000.xlsx' created successfully.")
