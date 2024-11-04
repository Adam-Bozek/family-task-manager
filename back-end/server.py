import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import string
import random

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

# Compare password with saved hash
def check_password(plaintext_password, hashed_password):
    return bcrypt.checkpw(plaintext_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Initialize Flask application
app = Flask(__name__)
CORS(app)

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
    if not result:
        return jsonify({"message": "Používateľ vytvorený."}), 201 # Created
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error
    

@app.route('/Check_user_exist', methods=['POST'])
def check_user_exist():
    # Input
    email = request.form.get('email')
    
    # SQL query
    syntax = "SELECT * FROM uzivatel WHERE email = %s;"
    result = connectiondb(syntax, (email,))

    # Return
    if result:
        return jsonify({"message": "Používateľ existuje."}), 200 # OK
    elif result == []:
        return jsonify({"message": "Používateľ neexistuje."}), 400 # Bad Request
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error
    

@app.route('/Login', methods=['POST'])
def login():
    # Input
    email = request.form.get('email')
    password = request.form.get('password')

    # SQL query
    syntax = "SELECT * FROM uzivatel WHERE email = %s;"
    result = connectiondb(syntax, (email,))

    if check_password(password, result[0][4]):
        compare = True
    else:
        compare = False
    
    # Return Login
    if compare:
        # Get ID from result
        id = result[0]
        syntax1 = "SELECT rola FROM clen WHERE ID = %s;"
        result1 = connectiondb(syntax1, (id))
        
        # Return Role
        if result1:
            return jsonify({"message": "Prihlásenie úspešné.", "role": f"{result1[3]}"}), 202 # Accepted
        elif result1 == None:
            return jsonify({"message": "Prihlásenie úspešné", "role": "after-reg"}), 202 # Accepted
        else:
            return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error
        
    elif compare == False:
        return jsonify({"message": "Prihlásenie neúspešné."}), 406 # Not Acceptable
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error


@app.route('/Create_family', methods=['POST'])
def create_family():
    # Input
    name_family = request.form.get('family_name')
    name = request.form.get('name')

    # Generate 16-digit code
    N = 16
    code = ''.join(random.choices(string.ascii_lowercase + string.punctuation, k=N))
    code1 = ''.join(random.choices(string.ascii_lowercase + string.punctuation, k=N))

    # SQL query
    syntax = "INSERT INTO rodina (meno, jedinecny_kod_R, jedineecny_kod_D) VALUES (%s, %s, %s)"
    result = connectiondb(syntax, (name_family, code, code1))

    # Return Create_family
    if result:
        # SQL query
        syntax1 = "SELECT id FROM uzivatel WHERE meno = %s"
        result1 = connectiondb(syntax1, (name))

        syntax2 = "INSERT INTO clen (id_rodina, id_uzivatel, rola) VALUES (%s, %s, %s)"
        connectiondb(syntax2, (result[0], result1, "Rodič"))

        return jsonify({"message": "Rodina sa vytvorila"}), 202 # Accepted
    elif result == None:
        return jsonify({"message": "Rodina sa nevytvorila"}), 400 # Bad Request
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error
    

@app.route('/Add_to_family', methods=["POST"])
def add_to_family():
    # Input
    string = request.form.get('string')
    name = request.form.get('name')

    # SQL query
    syntax = "SELECT id FROM rodina WHERE jedinecny_kod_R = %s"
    result = connectiondb(syntax, (string))

    # SQL query
    syntax1 = "SELECT id FROM rodina WHERE jedinecny_kod_D = %s"
    result1 = connectiondb(syntax1, (string))

    # Return Add_to_family
    if result:
        # SQL query
        syntax2 = "SELECT id FROM uzivatel WHERE meno = %s"
        result2 = connectiondb(syntax2, (name))

        syntax3 = "INSERT INTO clen (id_rodina, id_uzivatela, rola) VALUES (%s, %s, %s)"
        connectiondb(syntax3, (result[0], result2, "Rodič"))

        return jsonify({"message": "Clen bol pridany do rodiny ako Rodic"}), 202 # Accepted
    elif result1:
        # SQL query
        syntax2 = "SELECT id FROM uzivatel WHERE meno = %s"
        result2 = connectiondb(syntax2, (name))

        syntax3 = "INSERT INTO clen (id_rodina, id_uzivatela, rola) VALUES (%s, %s, %s)"
        connectiondb(syntax3, (result[0], result2, "DIeťa"))

        return jsonify({"message": "Clen bol pridany do rodiny ako Dieta"}), 202 # Accepted
    elif result == None & result1 == None:
        return jsonify({"message": "Clen nebol pridany do ziadnej rodiny"}), 400 # Bad Request
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error
    

@app.route('/Add_rewards', methods=["POST"])
def add_rewards():
    # Input
    name = request.form.get('name')
    name_reward = request.form.get('name_reward')
    value = request.form.get('value')

    # SQL query
    syntax = "SELECT id FROM uzivatel WHERE meno = %s"
    result = connectiondb(syntax, (name))

    syntax1 = "INSERT INTO odmena (nazov, cena) VALUES (%s, %s)"
    result1 = connectiondb(syntax1, (name_reward, value))

    syntax2 = "SELECT nazov, cena FROM ulohy where id_uzivatel = %s RIGHT JOIN odmena ON ulohy.id_odmena = odmena.id"
    result2 = connectiondb(syntax2, (result))

    if result2 & result1:
        return jsonify({"message": "Uspesny zapis a vypis odmien"}, result2), 202 # Accepted
    elif result2:
        return jsonify({"message": "Uspesny vypis odmien"}, result2), 202 # Accepted
    elif result2 == None or result1 == None:
        return jsonify({"message": "Problem so zapisom alebo vypisom odmien"}), 400 # Bad Request
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error
    
@app.route('/Delete_family', methods=['POST'])
def delete_family():
     # Input
    name = request.form.get('name')

    # SQL query
    syntax = "SELECT id FROM uzivatel WHERE name = %s"
    result = connectiondb(syntax, (name))

    syntax1 = "SELECT id_rodina WHERE id_uzivatel = %s"
    result1 = connectiondb(syntax1, (result))

    syntax2 = "DELETE FROM rodina WHERE id = %s"
    result2 = connectiondb(syntax2, (result1))

    syntax3 = "DELETE FROM cle WHERE id_rodina = %s"
    result3 = connectiondb(syntax3, (result1))

    if result2 & result3:
        return jsonify({"message": "Vymazanie rodiny aj clenov uspesne"}), 202 # Accepted
    elif result2 == None or result3 == None:
        return jsonify({"message": "Problem s vymazanim rodiny alebo clenov rodiny"}), 400 # Bad Request
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error
    
#@app.route('/Add_tasks', methods=['POST'])
#def add_tasks();
    
#@app.route('Parents_tasks' methods=['POST'])
#def parent_tasks():
    
#@app.route('/Parents_rewards', methods=['POST'])
#def parents_rewards():
    
#@app.route('/Kids_dashboard', methods=['POST'])
#def kids_dashboard():
    
#@app.route('/Kids_exchange', methods=['POST'])
#def kids_exchange():

if __name__ == '__main__':
    app.run(host='147.232.205.117', port=5000)