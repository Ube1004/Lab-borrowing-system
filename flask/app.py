from flask import Flask, jsonify , render_template, request
import sqlite3
import logging
from qrscanner import qrscan

user = "Admin"


app = Flask(__name__)

#HOME
@app.route('/')
def home():
    return render_template('index.html')

#SEE ITEMS
@app.route('/items')
def get_items():
    db_conn = sqlite3.connect('sql.db')
    cursor = db_conn.cursor()

    

    cursor.execute("SELECT * FROM Items")
    rows = cursor.fetchall()

    db_conn.close()
    data = []

    for row in rows:
        data.append({
            "ItemID": row[0],
            "Code": row[1],
            "Category": row[2],
            "Type": row[3],
            "Status": row[4]
        })

    return jsonify(data)

#QR SCANNER
@app.route('/qrscan')
def qr_scan():
    
    codes = qrscan()

    if not codes:
        return jsonify([])
    
    placeholder = ','.join('?' * len(codes))

    db_conn = sqlite3.connect('sql.db')
    cursor = db_conn.cursor()
    cursor.execute(f"SELECT * FROM Items WHERE Code IN ({placeholder})", codes)
    rows = cursor.fetchall()

    db_conn.close()

    data = []
    found_codes = []
    for row in rows:
        data.append({
            "ItemID": row[0],
            "Code": row[1],
            "Category": row[2],
            "Type": row[3],
            "Status": row[4]

            
        
        })
        found_codes.append(row[1])
    #Log    
    #logging.basicConfig(filename='log.txt', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    #for item in data:
    #    logging.info("scanned items: %s", item)
        
    missing = [code for code in codes if code not in found_codes]

    return jsonify({
        "items": data,
        "missing": missing
    })
    
    
#QR MAKER
@app.route('/qrmaker' , methods=['POST'])
def qr_create():

    db_conn = sqlite3.connect('sql.db')
    cursor = db_conn.cursor()


    from qrcreate import qrcreate
    data = request.get_json()
    category = data.get('category', '')
    type_ = data.get('type', '')
    cursor.execute("SELECT COUNT(*) FROM Items WHERE Type = ?", (type_,))
    count = cursor.fetchone()[0] + 1
    print(count)
    qrcreate(category, type_, count)
    qr = f"{category[0].upper()}{type_[0].upper()}{count:03d}".upper().strip()
    cursor.execute("INSERT INTO Items (Code, Type, Category, Status) VALUES (?, ?, ?, ?)", (qr, type_, category, "Available"))
    db_conn.commit()
    db_conn.close()

    return "QR code created successfully!" + str(f" \nQR Code save as: {category[0].upper()}{type_[0].upper()}{count:03d}" + " in QR folder")

#BORROW
@app.route('/borrow')
def borrow():
    return "Borrowing functionality is under development."

#TEST
@app.route('/hi')
def say_hello():
    return "Hello, World!"

@app.route('/modify', methods=['POST'])
def modify_item():
    data = request.get_json()
    ItemID = data.get('ItemID')
    new_status = data.get('status')
    new_category = data.get('category')
    new_type = data.get('type')

    print("ItemID:", ItemID)
    print("Status:", new_status)
    print("Category:", new_category)
    print("Type:", new_type)
    
    if not ItemID or not new_status:
        return jsonify({"error": "ItemID and status are required."}), 400

    db_conn = sqlite3.connect('sql.db')
    cursor = db_conn.cursor()
    cursor.execute("UPDATE Items SET Status = ?, Category = ?, Type = ? WHERE ItemID = ?", (new_status, new_category, new_type, ItemID))
    db_conn.commit()
    db_conn.close()
    

    return jsonify({"message": f"Item with ID {ItemID} updated to status {new_status}."})








if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)


#for d in data:
 #   print(d)

