# Imports
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import string
import random


def connectiondb(query, params=None):
    print("Start")
    connection = None  # Initialize connection variable
    cursor = None  # Initialize cursor variable
    try:
        # Establish the database connection
        connection = psycopg2.connect(
            dbname="ftm",
            user="admin",
            password="password",
            host="147.232.205.117",
            port="5432",
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
        print("Uz je koniec!!!!")


# Compare password with saved hash
def check_password(plaintext_password, hashed_password):
    return bcrypt.checkpw(plaintext_password.encode("utf-8"), hashed_password.encode("utf-8"))


# Initialize Flask application
app = Flask(__name__)
CORS(app)

#TODO: zelene done, cervene notDone, zlte waiting, modre pending

# Function for create user
@app.route("/api/Create_user", methods=["POST"])
def create_user():
    # Input
    name = request.form.get("name")
    surname = request.form.get("surname")
    email = request.form.get("email")
    password = request.form.get("password")

    # Checking existing email
    result1 = check_user_exist()
    if result1[1] == 200:
        return jsonify({"message": "Používateľ nevytvorený."}), 406 # Not Acceptable

    # Checking existing email
    result1 = check_user_exist()
    if result1[1] == 200:
        return jsonify({"message": "Používateľ nevytvorený."}), 406 # Not Acceptable

    # SQL query
    syntax = "INSERT INTO uzivatel (meno, priezvisko, email, heslo) VALUES (%s, %s, %s, %s);"
    result = connectiondb(syntax, (name, surname, email, password))

    # Return
    if not result:
        return jsonify({"message": "Používateľ vytvorený."}), 201  # Created
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500  # Internal Server Error

# Function for check if user exist in DB
@app.route("/api/Check_user_exist", methods=["POST"])
def check_user_exist():
    # Input
    email = request.form.get("email")

    # SQL query
    syntax = "SELECT * FROM uzivatel WHERE email = %s;"
    result = connectiondb(syntax, (email,))

    # Return
    if result:
        return jsonify({"message": "Používateľ existuje."}), 200  # OK
    elif result == []:
        return jsonify({"message": "Používateľ neexistuje."}), 400  # Bad Request
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500  # Internal Server Error

# Function for login user
@app.route("/api/Login", methods=["POST"])
def login():
    # Input
    email = request.form.get("email")
    password = request.form.get("password")

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
        id = result[0][0]
        syntax1 = "SELECT rola FROM clen WHERE id_uzivatel = %s;"
        result1 = connectiondb(syntax1, (id,))

        # Return Role
        if result1:
            return jsonify({"message": "Prihlásenie úspešné.", "role": f"{result1[0][0]}"}), 202 # Accepted
        elif result1 == []:
            return jsonify({"message": "Prihlásenie úspešné", "role": "after-reg"}), 202 # Accepted
        else:
            return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

    elif compare == False:
        return jsonify({"message": "Prihlásenie neúspešné."}), 406  # Not Acceptable
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

# Function for create family
@app.route("/api/Create_family", methods=["POST"])
def create_family():
    # Input
    name_family = request.form.get("family_name")
    email = request.form.get("email")

    # Generate 16-digit code
    N = 16
    code = "".join(random.choices(string.ascii_lowercase + string.punctuation, k=N))
    code1 = "".join(random.choices(string.ascii_lowercase + string.punctuation, k=N))

    # SQL query
    syntax = "INSERT INTO rodina (jedinecny_kod_R, jedinecny_kod_D, nazov_rodiny) VALUES (%s, %s, %s)"
    result = connectiondb(syntax, (code, code1, name_family))

    # Return Create_family
    if not result:
        # SQL query
        syntax1 = "SELECT id FROM uzivatel WHERE email = %s"
        result1 = connectiondb(syntax1, (email,))

        syntax2 = "SELECT id FROM rodina WHERE jedinecny_kod_R = %s"
        result2 = connectiondb(syntax2, (code,))

        syntax3 = "INSERT INTO clen (id_rodina, id_uzivatel, rola) VALUES (%s, %s, %s)"
        connectiondb(syntax3, (result2[0][0], result1[0][0], "parent"))

        return jsonify({"message": "Rodina sa vytvorila"}), 202  # Accepted
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

# Function for add user ti family
@app.route("/api/Add_to_family", methods=["POST"])
def add_to_family():
    # Input
    string = request.form.get("string")
    email = request.form.get("email")

    # SQL query
    syntax = "SELECT id FROM rodina WHERE jedinecny_kod_R = %s"
    result = connectiondb(syntax, (string,))

    # SQL query
    syntax1 = "SELECT id FROM rodina WHERE jedinecny_kod_D = %s"
    result1 = connectiondb(syntax1, (string,))

    # Return Add_to_family
    if result:
        # SQL query
        syntax2 = "SELECT id FROM uzivatel WHERE email = %s"
        result2 = connectiondb(syntax2, (email,))

        syntax3 = "INSERT INTO clen (id_rodina, id_uzivatel, rola) VALUES (%s, %s, %s)"
        connectiondb(syntax3, (result[0][0], result2[0][0], "parent"))

        return jsonify({"message": "Clen bol pridany do rodiny ako Rodic", "role": "parent"}), 202 # Accepted
    elif result1:
        # SQL query
        syntax2 = "SELECT id FROM uzivatel WHERE email = %s"
        result2 = connectiondb(syntax2, (email,))

        syntax3 = "INSERT INTO clen (id_rodina, id_uzivatel, rola) VALUES (%s, %s, %s)"
        connectiondb(syntax3, (result1[0][0], result2[0][0], "kid"))

        syntax4 = "INSERT INTO penazenka (id_uzivatel, zostatok_penazenky) VALUES (%s, %s)"
        connectiondb(syntax4, (result2[0][0], "0"))

        return jsonify({"message": "Clen bol pridany do rodiny ako Dieta", "role": "kid"}), 202 # Accepted
    elif result == [] and result1 == []:
        return jsonify({"message": "Clen nebol pridany do ziadnej rodiny"}), 400 # Bad Request
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

# Function for add rewards in family
@app.route("/api/Add_rewards", methods=["POST"])
def add_rewards():
    # Input
    email = request.form.get("email")
    name = request.form.get("name")
    value = request.form.get("value")

    # SQL query
    syntax = "SELECT id_rodina FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "INSERT INTO odmena (nazov, cena, id_rodina) VALUES (%s, %s, %s)"
    result1 = connectiondb(syntax1, (name, value, result[0][0],))

    # Return
    if not result1:
        return jsonify({"message": "Uspesny zapis odmien"}), 202 # Accepted
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

# Function for delete whole family
@app.route("/api/Delete_family", methods=["POST"])
def delete_family():
    # Input
    email = request.form.get("email")

    # SQL query
    syntax = "SELECT id FROM uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "SELECT id_rodina FROM clen WHERE id_uzivatel = %s"
    result1 = connectiondb(syntax1, (result[0][0],))

    syntax2 = "DELETE FROM rodina WHERE id = %s"
    result2 = connectiondb(syntax2, (result1[0][0],))

    syntax3 = "DELETE FROM clen WHERE id_rodina = %s"
    result3 = connectiondb(syntax3, (result1[0][0],))

    # Return
    if not result2 and not result3:
        return jsonify({"message": "Vymazanie rodiny aj clenov uspesne"}), 202 # Accepted
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

# Function for add tasks for member
@app.route("/api/Add_tasks", methods=["POST"])
def add_tasks():
    # Input
    id = request.form.get('id')
    task = request.form.get('task')
    date_from = request.form.get('date_from')
    date_to = request.form.get('date_to')
    reward = request.form.get('reward')

    # SQL query
    syntax = "SELECT id_rodina FROM clen WHERE id_uzivatel = %s"
    result = connectiondb(syntax, (id,))

    syntax1 = "INSERT INTO ulohy (id_uzivatel, uloha, cas_od, cas_do, cena_odmeny, stav, id_rodina) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    result1 = connectiondb(syntax1, (id, task, date_from, date_to, reward, "pending", result[0][0]))

    # Return
    if not result1:
        return jsonify({"message": "Pridanie ulohy uspesne"}), 202 # Accepted
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error


# Function for display family tasks to parents dashboard
@app.route('/api/Parents_tasks', methods=['POST'])
def parent_tasks():
    # Import
    from datetime import datetime

    # Input
    email = request.form.get("email")

    # SQL query
    syntax = "SELECT id_rodina FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "SELECT ulohy.id, meno, uloha, cas_od, cas_do, cena_odmeny, stav FROM ulohy RIGHT JOIN uzivatel ON ulohy.id_uzivatel = uzivatel.id WHERE id_rodina = %s"
    result1 = connectiondb(syntax1, (result[0][0],))

    # Return
    if result1:
        # Processing datetime objects
        formatted_result = [
            {
                "id": row[0],
                "meno": row[1],
                "uloha": row[2],
                "cas_od": row[3].strftime("%Y-%m-%d") if isinstance(row[3], datetime) else row[3],
                "cas_do": row[4].strftime("%Y-%m-%d") if isinstance(row[4], datetime) else row[4],
                "cena_odmeny": row[5],
                "stav": row[6]
            }
            for row in result1
        ]
        return jsonify({"message": "Vypis uloh uspesne", "return": formatted_result}), 202 # Accepted
    elif result1 == []:
        return jsonify({"message": "Vypis uloh neuspesne"}), 400 # Bad Request
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error


# Function for display active rewards to parents dashboard
@app.route("/api/Parents_rewards", methods=["POST"])
def parents_rewards():
    # Input
    email = request.form.get("email")

    # SQL query
    syntax = "SELECT id_rodina FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "SELECT aktivovanie.id, uzivatel.meno, odmena.nazov, aktivovanie.stav FROM aktivovanie INNER JOIN uzivatel ON uzivatel.id = aktivovanie.id_uzivatela INNER JOIN odmena ON odmena.id = aktivovanie.id_odmena WHERE id_rodina = %s"
    result1 = connectiondb(syntax1, (result[0][0],))

    # Return
    if result1:
        return jsonify({"message": "Vypis odmien uspesne", "return": f"{result1}"}), 202 # Accepted
    elif result1 == []:
        return jsonify({"message": "Vypis odmien neuspesne"}), 400  # Bad Request
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500  # Internal Server Error


# Function for display kids dashboard
@app.route("/api/Kids_dashboard", methods=["POST"])
def kids_dashboard():
    # Import
    from decimal import Decimal
    from datetime import datetime

    # Input
    email = request.form.get("email")

    # SQL query
    syntax = "SELECT ulohy.id, meno, uloha, cas_od, cas_do, cena_odmeny, stav FROM ulohy RIGHT JOIN uzivatel ON uzivatel.id = ulohy.id_uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "SELECT odmena.nazov, aktivovanie.stav FROM uzivatel INNER JOIN aktivovanie ON aktivovanie.id_uzivatela = uzivatel.id INNER JOIN odmena ON odmena.id = aktivovanie.id_odmena WHERE email = %s"
    result1 = connectiondb(syntax1, (email,))

    syntax2 = "SELECT zostatok_penazenky FROM penazenka RIGHT JOIN uzivatel ON uzivatel.id = penazenka.id_uzivatel WHERE email = %s"
    result2 = connectiondb(syntax2, (email,))

    # Return
    if (result and result2) or result1:
        # Processing datetime objects
        formatted_result = [
            {
                "id": row[0],
                "meno": row[1],
                "uloha": row[2],
                "cas_od": row[3].strftime("%Y-%m-%d") if isinstance(row[3], datetime) else row[3],
                "cas_do": row[4].strftime("%Y-%m-%d") if isinstance(row[4], datetime) else row[4],
                "cena_odmeny": row[5],
                "stav": row[6]
            }
            for row in result
        ]

        # Convert result1 to handle Decimal
        formatted_result2 = [
            (float(row[0]) if isinstance(row[0], Decimal) else row[0])
            for row in result2
        ]

        # Convert big letters to small letters
        def convert(data):
            return [(text, 'true' if value is True else 'false') for text, value in data]
        
        data = result1
        converted_data = convert(data)

        return jsonify({"message": "Vypis uloh, odmien a penazenky uspesne", "return": f"{formatted_result}", "return1": f"{converted_data}", "return2": f"{formatted_result2}"}), 202 # Accepted
    elif result == [] or result1 == [] or result2 == []:
        return jsonify({"message": "Vypis uloh, odmien alebo penazenky neuspesne"}), 400  # Bad Request
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

# Function for kids exchange rewards
@app.route('/api/Kids_exchange', methods=['POST'])
def kids_exchange():
    # Input
    id = request.form.get('id')
    email = request.form.get('email')
    difference = request.form.get('difference')

    # SQL query
    syntax = "SELECT id FROM uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "INSERT INTO aktivovanie (id_uzivatela, id_odmena, stav) VALUES (%s, %s, %s)"
    result1 = connectiondb(syntax1, (result[0][0], id, "false"))

    if not result1:
        syntax2 = "UPDATE penazenka SET zostatok_penazenky = %s WHERE id_uzivatel = %s"
        connectiondb(syntax2, (difference, result[0][0],))
        return jsonify({"message": "Uspesne pridanie zaznamu"}), 202 # Accepted
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

# Function for display kids in family
@app.route('/api/Select', methods=['POST'])
def select():
    # Input
    email = request.form.get('email')

    # SQL query
    syntax = "SELECT id_rodina FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "SELECT uzivatel.id, uzivatel.meno FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE id_rodina = %s AND rola = 'kid'"
    result1 = connectiondb(syntax1, (result[0][0],))

    # Return
    if result1:
        return jsonify({"return": f"{result1}"}), 202 # Accepted
    elif result1 == []:
        return jsonify({"message": "Bezdetny"}), 204 # No Content
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

# Function for dispaly wallet and rewards to kids dashboard
@app.route('/api/Wallet', methods=['POST'])
def wallet():
    # Import
    from decimal import Decimal

    # Input
    email = request.form.get('email')

    # SQL query
    syntax = "SELECT zostatok_penazenky FROM uzivatel RIGHT JOIN penazenka ON uzivatel.id = penazenka.id_uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "SELECT id_rodina FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE email = %s"
    result1 = connectiondb(syntax1, (email,))

    syntax2 = "SELECT id, nazov, cena FROM odmena WHERE id_rodina = %s"
    result2 = connectiondb(syntax2, (result1[0][0],))

    # Convert result1 and result2 to handle Decimal
    formatted_result = [
        (float(row[0]) if isinstance(row[0], Decimal) else row[0])
        for row in result
    ]

    formatted_result2 = [
        (row[0], row[1], float(row[2]) if isinstance(row[2], Decimal) else row[2])
        for row in result2
    ]

    # Return
    if result1 and result2:
        return jsonify({"return": f"{formatted_result}", "return1": f"{formatted_result2}"}), 202 # Accepted
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

# Function for display hash code
@app.route('/api/Hash', methods=['POST'])
def hash():
    # Input
    email = request.form.get('email')

    # SQL query
    syntax = "SELECT id_rodina FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "SELECT jedinecny_kod_R, jedinecny_kod_D FROM rodina WHERE id = %s"
    result1 = connectiondb(syntax1, (result[0][0],))

    syntax2 = "SELECT meno, email, rola FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE id_rodina = %s"
    result2 = connectiondb(syntax2, (result[0][0],))

    # Return
    if result1 and result2:
        return jsonify({"return": f"{result1}", "return2": f"{result2}"}), 202 # Accepted
    elif result1 == [] or result2 == []:
        return jsonify({"message": "Nie je rodina alebo problem s db"}), 204 # No Content
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

# Function for delete member from family
@app.route('/api/Delete_member', methods=['POST'])
def delete_member():
    # Input
    email = request.form.get('email')

    # SQL query
    syntax = "SELECT id FROM uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "DELETE FROM clen WHERE id_uzivatel = %s"
    result1 = connectiondb(syntax1, (result[0][0],))

    # Return
    if not result1:
        return jsonify({"message": "Vymazanie clena uspesne"}), 202 # Accepted
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

# Function for display rewards to parents settings
@app.route('/api/Select_rewards', methods=['POST'])
def select_rewards():
    # Import
    from decimal import Decimal

    # Input
    email = request.form.get('email')

    # SQL query
    syntax = "SELECT id_rodina FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "SELECT id, nazov, cena FROM odmena WHERE id_rodina = %s"
    result1 = connectiondb(syntax1, (result[0][0],))

    # Return
    if result1:
        # Convert result1 to handle Decimal
        formatted_result1 = [
            (row[0], row[1], float(row[2]) if isinstance(row[2], Decimal) else row[2])
            for row in result1
        ]
        return jsonify({"message": "Vypis odmien uspesne", "return": formatted_result1}), 202 # Accepted
    elif result1 == []:
        return jsonify({"message": "Vypis odmien neuspesne"}), 400 # Bad Request
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error


# Function for delete reward for family
@app.route('/api/Delete_reward', methods=['POST'])
def delete_reward():
    # Input
    id = request.form.get('id')

    # SQL query
    syntax = "DELETE FROM aktivovanie WHERE id_odmena = %s"
    result = connectiondb(syntax, (id,))

    syntax1 = "DELETE FROM odmena WHERE id = %s"
    result1 = connectiondb(syntax1, (id,))

    # Return
    if not result:
        return jsonify({"message": "Vymazanie odmeny a prepojenia aktivovanie uspesne"}), 202 # Accepted
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error


# Function for delete reward for family
@app.route('/api/Delete_task', methods=['POST'])
def delete_task():
    # Input
    id = request.form.get('id')

    # SQL query
    syntax = "DELETE FROM ulohy WHERE id = %s"
    result = connectiondb(syntax, (id,))

    # Return
    if not result:
        return jsonify({"message": "Vymazanie ulohy uspesne"}), 202 # Accepted
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error


# Function for kids task confirmation
@app.route("/api/Kids_confirm", methods=['POST'])
def kids_confirm():
    # Input
    id = request.form.get("id")
    
    #SQL query
    syntax = "UPDATE ulohy SET stav = %s WHERE id = %s"
    result = connectiondb(syntax, ("waiting", id))

    #Return
    if not result:
        return jsonify({"message": "Zmena ulohy uspesne"}), 202 # Accepted
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error


#Function for parents task confirmation
@app.route("/api/Parents_Tconfirm", methods=['POST'])
def parents_Tconfirm():
    #Input
    id = request.form.get("id")

    #SQL query
    syntax = "UPDATE ulohy SET stav = %s WHERE id = %s"
    result = connectiondb(syntax, ("done", id))

    syntax1 = "SELECT cena_odmeny, id_uzivatel FROM ulohy WHERE id = %s"
    result1 = connectiondb(syntax1, (id,))

    syntax2 = "UPDATE penazenka SET zostatok_penazenky = %s WHERE id_uzivatel = %s"
    result2 = connectiondb(syntax2, (result1[0][0], result1[0][1]))

    #Return
    if not result and not result2:
        return jsonify({"message": "Zmena ulohy uspesne"}), 202 # Accepted
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error


#Function for parents reward confirm
@app.route("/api/Parents_Rconfirm", methods=['POST'])
def parents_Rconfirm():
    #Input
    id = request.form.get("id")

    #SQL query
    syntax = "UPDATE aktivovanie SET stav = %s WHERE id = %s"
    result = connectiondb(syntax, ("true", id))

    #Return
    if not result:
        return jsonify({"message": "Zmena odmeny uspesne"}), 202 # Accepted
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error


if __name__ == '__main__':
    app.run(host='147.232.205.117', port=5000)