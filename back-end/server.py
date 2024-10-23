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
    # Input
    name = request.form.get('name')
    surname = request.form.get('surname')
    email = request.form.get('email')
    password = request.form.get('password')

    # SQL query
    syntax = "INSERT INTO uzivatel (meno, priezvisko, email, heslo) VALUES (%s, %s, %s, %s);"
    result = connectiondb(syntax, (name, surname, email, password))

    # Return
    if result:
        return jsonify({"message": "Používateľ vytvorený."}), 201 # Created
    elif result == None:
        return jsonify({"message": "Používateľ nevytvorený."}), 400 # Bad Request
    else:
        return jsonify({"error": "Nastala chyba!!!"}), 404 #Not Found
    

@app.route('/Check_user_exist', methods=['POST'])
def check_user_exist():
    # Input
    email = request.form.get('email')
    
    # SQL query
    syntax = "SELECT * FROM uzivatel WHERE email = %s;"
    result = connectiondb(syntax, (email,))
    
    print(result)

    # Return
    if result:
        return jsonify({"message": "Používateľ existuje."}), 200 # OK
    elif result == []:
        return jsonify({"message": "Používateľ neexistuje."}), 400 # Bad Request
    else:
        return jsonify({"error": "Nastala chyba!!!"}), 404 #Not Found
    

@app.route('/Login', methods=['POST'])
def login():
    # Input
    email = request.form.get('email')
    password = request.form.get('password')

    # SQL query
    syntax = "SELECT * FROM uzivatel WHERE email = %s AND heslo = %s;"
    result = connectiondb(syntax, (email, password))
    
    # Return Login
    if result:
        # Get ID from result
        id = result[0]
        syntax1 = "SELECT rola FROM clen WHERE ID = %s;"
        result1 = connectiondb(syntax1, (id))

        print(result1)
        
        # Return Role
        if result1:
            return jsonify({"message": f"Prihlásenie úspešné. {result1[3]}"}), 202 # Accepted
        elif result1 == None:
            return jsonify({"message": "Prihlásenie úspešné. AfterReg"}), 202 # Accepted
        else:
            return jsonify({"error": "Nastala chyba pri Role!!!"}), 404 #Not Found
        
    elif result == []:
        return jsonify({"message": "Prihlásenie neúspešné."}), 406 # Not Acceptable
    else:
        return jsonify({"error": "Nastala chyba pri Login!!!"}), 404 #Not Found

if __name__ == '__main__':
    app.run(host = '147.232.205.117')