import psycopg2
from flask import Flask, request, jsonify

def connectiondb(query, params=None):
    print("Start")
    connection = None  # Initialize connection variable
    cursor = None      # Initialize cursor variable
    try:
        # Establish the database connection
        connection = psycopg2.connect(
            dbname='ftm',
            user='admin',
            password='password',
            host='147.232.205.117',
            port='5432'
        )
        cursor = connection.cursor()  # Now it is safe to create the cursor

        cursor.execute(query, params)  # Execute the query with parameters
        if query.strip().lower().startswith("select"):
            results = cursor.fetchall()  # Fetch all results if needed
            return results
        else:
            connection.commit()  # Commit the change for INSERT/UPDATE/DELETE

    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL:", error)
        return None

    finally:
        # Close cursor and connection if they were created
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()
        print("Uz je konec!!!!")

# Initialize Flask application
app = Flask(__name__)

@app.route('/Create_user', methods=['POST'])
def create_user():
    name = request.form.get('name')
    surname = request.form.get('surname')
    email = request.form.get('email')
    password = request.form.get('password')

    syntax = "INSERT INTO uzivatel (meno, priezvisko, email, heslo) VALUES (%s, %s, %s, %s);"
    result = connectiondb(syntax, (name, surname, email, password))

    if result:
        return jsonify({"message": "Používateľ vytvorený."}), 201 # Created
    elif result == None:
        return jsonify({"message": "Používateľ nevytvorený."}), 400 # Bad Request
    else:
        return jsonify({"error": "Nastala chyba!!!"}), 404 #Not Found
    

@app.route('/Check_user_exist', methods=['POST'])
def check_user_exist():
    email = request.form.get('email')
    
    syntax = "SELECT * FROM uzivatel WHERE email = %s;"
    result = connectiondb(syntax, (email,))
    
    if result:
        return jsonify({"message": "Používateľ existuje."}), 200 # OK
    elif result == None:
        return jsonify({"message": "Používateľ neexistuje."}), 204 # No Content
    else:
        return jsonify({"error": "Nastala chyba!!!"}), 404 #Not Found
    

@app.route('/Login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    syntax = "SELECT * FROM uzivatel WHERE email = %s AND heslo = %s;"
    result = connectiondb(syntax, (email, password))
    
    if result:
        return jsonify({"message": "Prihlásenie úspešné."}), 202 # Accepted
    elif result == None:
        return jsonify({"message": "Prihlásenie neúspešné."}), 406 # Not Acceptable
    else:
        return jsonify({"error": "Nastala chyba!!!"}), 404 #Not Found

if __name__ == '__main__':
    app.run(debug=True)