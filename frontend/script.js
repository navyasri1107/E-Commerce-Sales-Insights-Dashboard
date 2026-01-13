let salesByMonthChart, topProductsChart, topCategoriesChart;

// Function to load KPIs
function loadKPIs(startDate = '', endDate = '') {
    fetch(`http://127.0.0.1:5000/api/filter_sales?start_date=${startDate}&end_date=${endDate}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('total-sales').innerText = "Total Sales: ₹ " + data.total_sales.toLocaleString();
            document.getElementById('total-orders').innerText = "Total Orders: " + data.total_orders;
            document.getElementById('avg-order-value').innerText = "Average Order Value: ₹ " + data.average_order_value.toFixed(2);
            document.getElementById('unique-customers').innerText = "Unique Customers: " + data.unique_customers;
        })
        .catch(err => console.error('Error loading KPIs:', err));
}

// Function to load Sales by Month chart
function loadSalesByMonth(startDate = '', endDate = '') {
    fetch(`http://127.0.0.1:5000/api/sales_by_month?start_date=${startDate}&end_date=${endDate}`)
        .then(res => res.json())
        .then(data => {
            const ctx = document.getElementById('salesByMonthChart').getContext('2d');
            if (salesByMonthChart) salesByMonthChart.destroy();
            salesByMonthChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
    label: 'Sales by Month',
    data: data.values,

    // LINE COLOR
    borderColor: 'rgba(54, 162, 235, 1)',

    // SHADED REGION COLOR
    backgroundColor: 'rgba(54, 162, 235, 0.3)',

    // IMPORTANT → Enables shading
    fill: true,

    // Smooth curve
    tension: 0,

    // Optional improvements
    pointRadius: 4,
    pointBackgroundColor: 'rgba(54, 162, 235, 1)'
}]

                },
               options: {
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: 'top'
        },
        title: {
            display: true,
            text: 'Sales by Month',
            font: {
                size: 16,
                weight: 'bold'
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Month',
                font: {
                    size: 14,
                    weight: 'bold'
                }
            }
        },
        y: {
            title: {
                display: true,
                text: 'Sales Amount',
                font: {
                    size: 14,
                    weight: 'bold'
                }
            },
            ticks: {
                callback: function(value) {
                    return value.toLocaleString(); // neat numbers
                }
            }
        }
    }
}

            });
        })
        .catch(err => console.error('Error loading Sales by Month:', err));
}

// Function to load Top Products chart
function loadTopProducts(startDate = '', endDate = '') {
    fetch(`http://127.0.0.1:5000/api/top_products?start_date=${startDate}&end_date=${endDate}`)
        .then(res => res.json())
        .then(data => {
            const ctx = document.getElementById('topProductsChart').getContext('2d');
            if (topProductsChart) topProductsChart.destroy();
            topProductsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Top Products',
                        data: data.values,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
    responsive: true,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: 'Top Products by Sales',
            font: {
                size: 16,
                weight: 'bold'
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Product ID',
                font: {
                    size: 14,
                    weight: 'bold'
                }
            },
            ticks: {
                maxRotation: 45,
                minRotation: 45
            }
        },
        y: {
            title: {
                display: true,
                text: 'Sales Amount',
                font: {
                    size: 14,
                    weight: 'bold'
                }
            },
            ticks: {
                callback: function(value) {
                    return value.toLocaleString();
                }
            }
        }
    }
}

            });
        })
        .catch(err => console.error('Error loading Top Products:', err));
}

// Function to load Top Categories chart
function loadTopCategories(startDate = '', endDate = '') {
    fetch(`http://127.0.0.1:5000/api/top_categories?start_date=${startDate}&end_date=${endDate}`)
        .then(res => res.json())
        .then(data => {
            const ctx = document.getElementById('topCategoriesChart').getContext('2d');
            if (topCategoriesChart) topCategoriesChart.destroy();
            topCategoriesChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Top Categories',
                        data: data.values,
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                        ]
                    }]
                },
                options:{
                    responsive:true,
                    plugins:{
                        legend:{display:true,position:'bottom'},
                        title:{display:true,text:'Top Categories ',font:{size:16,weight:'bold'},
                        padding:{bottom:10}}
                    }
            }

            });
        })
        .catch(err => console.error('Error loading Top Categories:', err));
}

// Load dashboard initially
function loadDashboard() {
    loadKPIs();
    loadSalesByMonth();
    loadTopProducts();
    loadTopCategories();
}

// Event listener for Filter button
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();

    document.getElementById('filter-btn').addEventListener('click', () => {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        loadKPIs(startDate, endDate);
        loadSalesByMonth(startDate, endDate);
        loadTopProducts(startDate, endDate);
        loadTopCategories(startDate, endDate);
    });
});
document.getElementById('download-csv').addEventListener('click', () => {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // Open the CSV download in a new browser tab
    const url = `http://127.0.0.1:5000/api/generate_csv?start_date=${startDate}&end_date=${endDate}`;
    window.open(url, '_blank');
});
