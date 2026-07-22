# Smart Farmer Service Center

A production-ready, clean, modular, and highly responsive web application designed for farmers and agricultural service providers. Built using Python Flask, SQLite, HTML5, CSS3, Bootstrap 5, and vanilla JavaScript.

## Features
1. **Interactive Weather Tracker**: Displays temperature, humidity, wind conditions, and sky states dynamically for search query city coordinates. Includes dynamic weather icon illustrations and fallbacks.
2. **Quality Inputs Marketplace Store**: Products are organized under logical filters (Seeds, Fertilizers, Tools, Pesticides) with smooth card transitions and elevational hover structures.
3. **Dynamic Invoice checkout system**: Standard cart operations managed in-session with sequential logs saved inside the orders database.
4. **Agriculture Guidance Modules**: Grid containing 6 specialized support programs (Crop Suggestions, Soil tests, etc.).
5. **Secure Authentication Flow**: Custom decorators separating administrator dashboards from farmer accounts.
6. **Robust Admin Panel**: Manage catalog listings, check user transactions, and answer inquiry tickets from a consolidated view.

## Technology Stack
- **Backend Controller**: Flask (Python 3)
- **Database Engine**: SQLite3
- **Styling UI Framework**: Bootstrap 5 + Custom Glassmorphic CSS3
- **Frontend Logic**: Vanilla ES6 JavaScript (needs-validation forms, image slide rotators, timer fade alerts)

## Directory Structure
```text
Farmer-Service-Center/
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
│       ├── wheat_seeds.png
│       ├── organic_fertilizer.png
│       ├── hand_trowel.png
│       └── eco_pest_control.png
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── services.html
│   ├── store.html
│   ├── contact.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── admin.html
├── app.py
├── requirements.txt
└── README.md
```

## Database Schema Tables
1. **users**: ID, Name, Email, Password, is_admin (Default: 0).
2. **products**: ID, Name, Category, Price, Image, Description.
3. **orders**: ID, User ID, Product ID, Quantity, Total Amount, Date.
4. **contacts**: ID, Name, Email, Message.

*Note: Automatically seeds default administrator credentials (`admin@farmer.com` / `admin123`) and 4 primary product items if database is empty.*

## Setup and Running Instructions
1. Install Python 3.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Access the web interface at `http://localhost:5000` in your web browser.
