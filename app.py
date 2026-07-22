import os
import functools
import requests
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, session, flash

# --- Firebase Admin SDK Imports ---
import firebase_admin
from firebase_admin import credentials, firestore

# ============================================================
# Flask App Initialization
# ============================================================
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'smart_farmer_service_center_secret_2026')

# ============================================================
# Firebase Admin SDK Initialization
# Requires 'serviceAccountKey.json' in the project root.
# Download from: Firebase Console → Project Settings → Service Accounts
# ============================================================
SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')

if not firebase_admin._apps:
    if os.path.exists(SERVICE_ACCOUNT_PATH):
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred)
        print("[Firebase] Connected to Firestore successfully.")
    else:
        print("[Firebase] ERROR: 'serviceAccountKey.json' not found.")
        print("[Firebase] Download it from Firebase Console -> Project Settings -> Service Accounts.")
        print("[Firebase] Place it in the project root directory as 'serviceAccountKey.json'.")
        raise FileNotFoundError(
            "Missing serviceAccountKey.json. Download it from Firebase Console and place it in the project root."
        )

# Get Firestore client reference
db = firestore.client()

# ============================================================
# Firestore Collection References
# These map to our four data entities (equivalent to SQLite tables)
# ============================================================
USERS_COL     = 'users'
PRODUCTS_COL  = 'products'
ORDERS_COL    = 'orders'
CONTACTS_COL  = 'contacts'


# ============================================================
# DATABASE SEEDING
# Seeds default admin user and 4 product catalog items if empty
# ============================================================
def seed_initial_data():
    """
    Checks Firestore collections and injects seed data if they are empty.
    This runs once at app startup.
    """
    # --- Seed Products if collection is empty ---
    products_ref = db.collection(PRODUCTS_COL)
    existing_products = list(products_ref.limit(1).stream())

    if not existing_products:
        print("[Firestore] Seeding initial products catalog...")
        seed_products = [
            {
                'name': 'Premium Hybrid Wheat Seeds',
                'category': 'Seeds',
                'price': 25.00,
                'image': 'wheat_seeds.png',
                'description': 'A premium strain of high-yield, disease-resistant hybrid wheat seeds suitable for dryland and irrigated soils.'
            },
            {
                'name': 'Organic Compost Fertilizer',
                'category': 'Fertilizers',
                'price': 15.50,
                'image': 'organic_fertilizer.png',
                'description': 'Rich, slow-release organic soil conditioner crafted from naturally composted leaf mulch and poultry humus.'
            },
            {
                'name': 'Ergonomic Hand Trowel',
                'category': 'Tools',
                'price': 12.99,
                'image': 'hand_trowel.png',
                'description': 'Heavy-duty stainless steel hand trowel featuring an ergonomic non-slip gel handle for seamless soil excavation.'
            },
            {
                'name': 'Eco-Friendly Neem Pest Spray',
                'category': 'Pesticides',
                'price': 18.75,
                'image': 'eco_pest_control.png',
                'description': 'Cold-pressed organic neem oil formulation that controls aphids, spider mites, and whiteflies without leaving toxic residues.'
            }
        ]
        for product in seed_products:
            products_ref.add(product)
        print("[Firestore] Seeded " + str(len(seed_products)) + " products.")

    # --- Seed Default Admin User if no admin exists ---
    admin_query = db.collection(USERS_COL).where(
        filter=firestore.FieldFilter('is_admin', '==', True)
    ).limit(1).stream()

    if not list(admin_query):
        print("[Firestore] Seeding default admin user...")
        db.collection(USERS_COL).add({
            'name': 'System Administrator',
            'email': 'admin@farmer.com',
            'password': 'admin123',
            'is_admin': True,
            'created_at': datetime.utcnow()
        })
        print("[Firestore] Admin user seeded: admin@farmer.com / admin123")


# Run seeding at startup
seed_initial_data()


# ============================================================
# HELPER: Convert Firestore document to a plain dict
# Adds 'id' field from the document reference
# ============================================================
def doc_to_dict(doc):
    """Converts a Firestore document snapshot to a Python dict with its ID."""
    d = doc.to_dict()
    d['id'] = doc.id
    return d


# ============================================================
# SECURITY DECORATORS
# ============================================================

def login_required(f):
    """
    Decorator: Blocks unauthenticated users.
    Redirects to /login if no active session exists.
    """
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('You must sign in to view this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


def admin_required(f):
    """
    Decorator: Blocks non-admin users from admin routes.
    Redirects to dashboard if session is not an admin.
    """
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Administrator authentication is required.', 'warning')
            return redirect(url_for('login'))
        if not session.get('is_admin'):
            flash('Access denied. Administrator credentials required.', 'danger')
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    return decorated_function


# ============================================================
# WEATHER INTEGRATION HELPER
# Uses OpenWeatherMap API with a structured mock fallback
# ============================================================
def get_weather_forecast(city_name):
    """
    Queries OpenWeatherMap API for current weather.
    Falls back to plausible mock data if API key is not configured.
    """
    api_key = os.environ.get('OPENWEATHER_API_KEY', '')

    if api_key:
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}&units=metric"
            response = requests.get(url, timeout=4)
            if response.status_code == 200:
                data = response.json()
                return {
                    'city': data.get('name', city_name),
                    'temp': round(data['main']['temp']),
                    'humidity': data['main']['humidity'],
                    'wind_speed': data['wind']['speed'],
                    'condition': data['weather'][0]['description'].capitalize()
                }
        except Exception:
            pass  # Silently fall through to mock data

    # Dynamic mock fallback based on city name patterns
    city_lower = city_name.lower().strip()
    if any(k in city_lower for k in ['phoenix', 'cairo', 'delhi', 'dubai', 'miami', 'mumbai']):
        return {'city': city_name.capitalize(), 'temp': 34, 'humidity': 22, 'wind_speed': 3.1, 'condition': 'Sunny and Clear'}
    elif any(k in city_lower for k in ['seattle', 'london', 'portland', 'dublin', 'amsterdam']):
        return {'city': city_name.capitalize(), 'temp': 13, 'humidity': 85, 'wind_speed': 5.2, 'condition': 'Light Rain Showers'}
    elif any(k in city_lower for k in ['anchorage', 'moscow', 'oslo', 'reykjavik']):
        return {'city': city_name.capitalize(), 'temp': -2, 'humidity': 76, 'wind_speed': 4.5, 'condition': 'Scattered Snow'}
    else:
        seed = sum(ord(c) for c in city_name)
        return {
            'city': city_name.capitalize(),
            'temp': 16 + (seed % 12),
            'humidity': 45 + (seed % 35),
            'wind_speed': round(2.0 + (seed % 6) * 0.8, 1),
            'condition': 'Partly Cloudy'
        }


# ============================================================
# ROUTE CONTROLLERS
# ============================================================

@app.route('/')
def index():
    """
    [GET] Renders the home landing page with hero slider.
    """
    return render_template('index.html')


@app.route('/services')
def services():
    """
    [GET] Renders the six agriculture guidance service modules.
    """
    return render_template('services.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    """
    [GET, POST] Creates a new farmer user account in Firestore.
    Enforces unique email and minimum 6-character password constraints.
    """
    if request.method == 'POST':
        name     = request.form.get('name', '').strip()
        email    = request.form.get('email', '').strip()
        password = request.form.get('password', '').strip()

        if not name or not email or not password:
            flash('All registration fields are required.', 'danger')
            return render_template('register.html')

        if len(password) < 6:
            flash('Password must be at least 6 characters long.', 'danger')
            return render_template('register.html')

        # Check if email already exists in Firestore 'users' collection
        existing = db.collection(USERS_COL).where(
            filter=firestore.FieldFilter('email', '==', email)
        ).limit(1).stream()

        if list(existing):
            flash('That email address is already registered. Please sign in.', 'danger')
            return render_template('register.html')

        # Write new user document to Firestore
        db.collection(USERS_COL).add({
            'name': name,
            'email': email,
            'password': password,    # NOTE: In production, hash passwords (e.g. bcrypt)
            'is_admin': False,
            'created_at': datetime.utcnow()
        })

        flash('Registration successful! Please sign in to access your dashboard.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    [GET, POST] Authenticates user credentials against Firestore 'users' collection.
    Populates session and routes admins to /admin, farmers to /dashboard.
    """
    if request.method == 'POST':
        email    = request.form.get('email', '').strip()
        password = request.form.get('password', '').strip()

        if not email or not password:
            flash('Email and password are required.', 'danger')
            return render_template('login.html')

        # Query Firestore for matching user by email
        user_query = db.collection(USERS_COL).where(
            filter=firestore.FieldFilter('email', '==', email)
        ).limit(1).stream()

        user_docs = list(user_query)

        if user_docs:
            user = doc_to_dict(user_docs[0])
            if user.get('password') == password:
                # Populate session with authenticated user data
                session['user_id']   = user['id']
                session['user_name'] = user['name']
                session['is_admin']  = bool(user.get('is_admin', False))
                session['cart']      = {}

                flash(f"Welcome back, {user['name']}!", 'success')

                # Route by role
                if user.get('is_admin'):
                    return redirect(url_for('admin'))
                return redirect(url_for('dashboard'))

        flash('Invalid email address or password combination.', 'danger')

    return render_template('login.html')


@app.route('/logout')
def logout():
    """
    [GET] Destroys the session and redirects to the home page.
    """
    session.clear()
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('index'))


@app.route('/dashboard')
@login_required
def dashboard():
    """
    [GET] Farmer overview dashboard.
    Fetches weather data for the searched city, current user profile,
    and the 2 most recently added products as recommendations.
    """
    city = request.args.get('city', 'Greenfields').strip()
    weather_info = get_weather_forecast(city)

    # Fetch current user profile from Firestore
    user_doc = db.collection(USERS_COL).document(session['user_id']).get()
    user = doc_to_dict(user_doc) if user_doc.exists else {'name': session['user_name'], 'email': ''}

    # Fetch latest 2 products for the recommendation panel
    recommended_docs = db.collection(PRODUCTS_COL).limit(2).stream()
    recommended = [doc_to_dict(d) for d in recommended_docs]

    return render_template('dashboard.html', user=user, weather=weather_info, city=city, recommended_products=recommended)


@app.route('/store')
def store():
    """
    [GET] Fetches all products from Firestore and renders the catalog grid.
    """
    products_docs = db.collection(PRODUCTS_COL).stream()
    products_list = [doc_to_dict(d) for d in products_docs]
    return render_template('store.html', products=products_list, view_mode='products')


@app.route('/cart/add/<string:product_id>')
@login_required
def add_to_cart(product_id):
    """
    [GET] Adds a product to the session cart dictionary.
    The cart is a dict of { product_id: quantity }.
    """
    if session.get('is_admin'):
        flash('Administrators cannot make purchases.', 'warning')
        return redirect(url_for('store'))

    # Verify the product exists in Firestore before adding to cart
    product_doc = db.collection(PRODUCTS_COL).document(product_id).get()
    if not product_doc.exists:
        flash('Product not found in catalog.', 'danger')
        return redirect(url_for('store'))

    cart = session.get('cart', {})
    cart[product_id] = cart.get(product_id, 0) + 1
    session['cart'] = cart

    product = doc_to_dict(product_doc)
    flash(f"'{product['name']}' added to your cart.", 'success')
    return redirect(url_for('store'))


@app.route('/cart', methods=['GET', 'POST'])
@login_required
def cart():
    """
    [GET] Builds cart line items from Firestore and displays the checkout invoice.
    [POST] Processes checkout — writes each line item to the 'orders' collection,
           then clears the session cart and redirects to dashboard.
    """
    if session.get('is_admin'):
        flash('Administrator sessions cannot access cart checkout.', 'warning')
        return redirect(url_for('store'))

    cart_session = session.get('cart', {})

    if request.method == 'POST':
        if not cart_session:
            flash('Your cart is empty. Add items before checking out.', 'warning')
            return redirect(url_for('store'))

        try:
            # Write each cart line item as a separate order document in Firestore
            for prod_id, qty in cart_session.items():
                product_doc = db.collection(PRODUCTS_COL).document(prod_id).get()
                if product_doc.exists:
                    product = doc_to_dict(product_doc)
                    item_total = product['price'] * qty
                    db.collection(ORDERS_COL).add({
                        'user_id':    session['user_id'],
                        'user_name':  session['user_name'],
                        'product_id': prod_id,
                        'product_name': product['name'],
                        'quantity':   qty,
                        'total':      item_total,
                        'order_date': datetime.utcnow()
                    })

            # Clear the session cart after successful checkout
            session['cart'] = {}
            flash('Order placed successfully! Your checkout is complete.', 'success')
            return redirect(url_for('dashboard'))

        except Exception as e:
            flash(f'Checkout error: {str(e)}', 'danger')
            return redirect(url_for('cart'))

    # --- GET: Build itemized invoice from Firestore ---
    cart_items = []
    subtotal   = 0.0

    for prod_id, qty in cart_session.items():
        product_doc = db.collection(PRODUCTS_COL).document(prod_id).get()
        if product_doc.exists:
            product = doc_to_dict(product_doc)
            item_subtotal = product['price'] * qty
            subtotal += item_subtotal
            cart_items.append({
                'id':       product['id'],
                'name':     product['name'],
                'category': product['category'],
                'price':    product['price'],
                'image':    product['image'],
                'quantity': qty,
                'subtotal': item_subtotal
            })

    return render_template('store.html', cart_items=cart_items, subtotal=subtotal, view_mode='cart')


@app.route('/cart/clear')
@login_required
def clear_cart():
    """
    [GET] Empties the session cart dictionary.
    """
    session['cart'] = {}
    flash('Your cart has been cleared.', 'success')
    return redirect(url_for('cart'))


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """
    [GET, POST] Saves contact inquiry forms to the Firestore 'contacts' collection.
    """
    if request.method == 'POST':
        name    = request.form.get('name', '').strip()
        email   = request.form.get('email', '').strip()
        message = request.form.get('message', '').strip()

        if not name or not email or not message:
            flash('All contact fields are required.', 'danger')
            return render_template('contact.html')

        # Write the inquiry to Firestore 'contacts' collection
        db.collection(CONTACTS_COL).add({
            'name':       name,
            'email':      email,
            'message':    message,
            'created_at': datetime.utcnow()
        })

        flash('Thank you! Your message has been received. We will be in touch shortly.', 'success')
        return redirect(url_for('contact'))

    return render_template('contact.html')


@app.route('/admin')
@admin_required
def admin():
    """
    [GET] Renders the admin panel with KPI counts and full data tables
    for products, contacts, and order transactions.
    """
    # --- KPI Counters ---
    total_products = len(list(db.collection(PRODUCTS_COL).stream()))
    total_users    = len(list(db.collection(USERS_COL).stream()))
    total_contacts = len(list(db.collection(CONTACTS_COL).stream()))
    total_orders   = len(list(db.collection(ORDERS_COL).stream()))

    kpis = {
        'total_products': total_products,
        'total_users':    total_users,
        'total_contacts': total_contacts,
        'total_orders':   total_orders
    }

    # --- Full table data ---
    products_list = [doc_to_dict(d) for d in db.collection(PRODUCTS_COL).stream()]
    contacts_list = [doc_to_dict(d) for d in db.collection(CONTACTS_COL).stream()]

    # Orders joined with user and product names (already denormalized in Firestore)
    orders_raw = [doc_to_dict(d) for d in db.collection(ORDERS_COL).stream()]

    return render_template('admin.html', kpis=kpis, products=products_list, contacts=contacts_list, orders=orders_raw)


@app.route('/admin/product/add', methods=['POST'])
@admin_required
def admin_product_add():
    """
    [POST] Admin-only: Inserts a new product document into Firestore 'products' collection.
    """
    name        = request.form.get('name', '').strip()
    category    = request.form.get('category', '').strip()
    price_str   = request.form.get('price', '').strip()
    image       = request.form.get('image', '').strip()
    description = request.form.get('description', '').strip()

    if not all([name, category, price_str, image, description]):
        flash('All fields are required to add a product.', 'danger')
        return redirect(url_for('admin'))

    try:
        price = float(price_str)
        if price <= 0:
            raise ValueError
    except ValueError:
        flash('Price must be a valid positive number.', 'danger')
        return redirect(url_for('admin'))

    # Add new product document to Firestore
    db.collection(PRODUCTS_COL).add({
        'name':        name,
        'category':    category,
        'price':       price,
        'image':       image,
        'description': description
    })

    flash(f"Product '{name}' has been added to the catalog.", 'success')
    return redirect(url_for('admin'))


@app.route('/admin/product/delete/<string:product_id>')
@admin_required
def admin_product_delete(product_id):
    """
    [GET] Admin-only: Deletes a specific product document from Firestore by its document ID.
    """
    db.collection(PRODUCTS_COL).document(product_id).delete()
    flash('Product has been removed from the catalog.', 'success')
    return redirect(url_for('admin'))


# ============================================================
# URL adapter for store.html — product_id is now a string (Firestore doc ID)
# ============================================================

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
