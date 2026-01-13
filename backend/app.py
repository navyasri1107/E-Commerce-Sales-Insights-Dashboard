

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)
# Get absolute path of backend folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Create path to data file
DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'ecommerce_sales.csv')

# Load CSV into DataFrame
df = pd.read_csv(DATA_PATH)

# Convert order_date to datetime
df['order_date'] = pd.to_datetime(df['order_date'])

print("CSV loaded successfully!")


# Load dataset
df = pd.read_csv('../data/ecommerce_sales.csv')
df['order_date'] = pd.to_datetime(df['order_date'])

@app.route('/')
def home():
    return "Backend is running and CSV is loaded!"

@app.route('/api/filter_sales')
def filter_sales():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    filtered_df = df.copy()

    if start_date:
        filtered_df = filtered_df[filtered_df['order_date'] >= start_date]

    if end_date:
        filtered_df = filtered_df[filtered_df['order_date'] <= end_date]

    response = {
        "total_sales": float(filtered_df['total_price'].sum()),
        "total_orders": int(filtered_df['order_id'].nunique()),
        "average_order_value": float(filtered_df['total_price'].mean()),
        "unique_customers": int(filtered_df['customer_id'].nunique())
    }

    return jsonify(response)
@app.route('/api/generate_csv')
def generate_csv():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    filtered_df = df.copy()

    if start_date:
        filtered_df = filtered_df[filtered_df['order_date'] >= start_date]

    if end_date:
        filtered_df = filtered_df[filtered_df['order_date'] <= end_date]

    report_path = os.path.join(os.path.dirname(__file__), 'sales_report.csv')
    filtered_df.to_csv(report_path, index=False)

    return send_file(report_path, as_attachment=True)


# KPIs endpoint
@app.route('/api/kpis')
def kpis():
    total_sales = int(df['total_price'].sum())                # convert to Python int
    total_orders = int(df.shape[0])                           # convert to Python int
    average_order_value = float(total_sales / total_orders)   # convert to Python float
    unique_customers = int(df['customer_id'].nunique())       # convert to Python int
    
    return jsonify({
        'total_sales': total_sales,
        'total_orders': total_orders,
        'average_order_value': average_order_value,
        'unique_customers': unique_customers
    })


# Sales by month endpoint
@app.route('/api/sales_by_month')
def sales_by_month():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    filtered_df = df.copy()
    if start_date:
        filtered_df = filtered_df[filtered_df['order_date'] >= start_date]
    if end_date:
        filtered_df = filtered_df[filtered_df['order_date'] <= end_date]
    
    df_month = filtered_df.groupby(filtered_df['order_date'].dt.to_period('M'))['total_price'].sum().reset_index()
    df_month['order_date'] = df_month['order_date'].astype(str)
    
    # Convert to chart.js friendly format
    response = {
        "labels": df_month['order_date'].tolist(),
        "values": df_month['total_price'].tolist()
    }
    return jsonify(response)


# Top products endpoint
@app.route('/api/top_products')
def top_products():
    top = df.groupby('product_id')['total_price'].sum().sort_values(ascending=False).head(10)
    return jsonify({
        "labels": top.index.tolist(),
        "values": top.values.tolist()
    })

# Top categories endpoint
@app.route('/api/top_categories')
def top_categories():
    top = df.groupby('product_category')['total_price'].sum().sort_values(ascending=False).head(10)
    return jsonify({
        "labels": top.index.tolist(),
        "values": top.values.tolist()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.1', port=5000)

