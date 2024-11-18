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
    return bcrypt.checkpw(
        plaintext_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


# Initialize Flask application
app = Flask(__name__)
CORS(app)


@app.route("/Create_user", methods=["POST"])
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
    syntax = (
        "INSERT INTO uzivatel (meno, priezvisko, email, heslo) VALUES (%s, %s, %s, %s);"
    )
    result = connectiondb(syntax, (name, surname, email, password))

    # Return
    if not result:
        return jsonify({"message": "Používateľ vytvorený."}), 201  # Created
    else:
        return (
            jsonify({"error": "Nastala chyba na servery!!!"}),
            500,
        )  # Internal Server Error


@app.route("/Check_user_exist", methods=["POST"])
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
        return (
            jsonify({"error": "Nastala chyba na servery!!!"}),
            500,
        )  # Internal Server Error


@app.route("/Login", methods=["POST"])
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
            return (
                jsonify(
                    {"message": "Prihlásenie úspešné.", "role": f"{result1[0][0]}"}
                ),
                202,
            )  # Accepted
        elif result1 == []:
            return (
                jsonify({"message": "Prihlásenie úspešné", "role": "after-reg"}),
                202,
            )  # Accepted
        else:
            return (
                jsonify({"error": "Nastala chyba na servery!!!"}),
                500,
            )  # Internal Server Error

    elif compare == False:
        return jsonify({"message": "Prihlásenie neúspešné."}), 406  # Not Acceptable
    else:
        return (
            jsonify({"error": "Nastala chyba na servery!!!"}),
            500,
        )  # Internal Server Error


@app.route("/Create_family", methods=["POST"])
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
        return (
            jsonify({"error": "Nastala chyba na servery!!!"}),
            500,
        )  # Internal Server Error


@app.route("/Add_to_family", methods=["POST"])
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

        return (
            jsonify(
                {"message": "Clen bol pridany do rodiny ako Rodic", "role": "parent"}
            ),
            202,
        )  # Accepted
    elif result1:
        # SQL query
        syntax2 = "SELECT id FROM uzivatel WHERE email = %s"
        result2 = connectiondb(syntax2, (email,))

        syntax3 = "INSERT INTO clen (id_rodina, id_uzivatel, rola) VALUES (%s, %s, %s)"
        connectiondb(syntax3, (result1[0][0], result2[0][0], "kid"))

        return (
            jsonify({"message": "Clen bol pridany do rodiny ako Dieta", "role": "kid"}),
            202,
        )  # Accepted
    elif result == [] and result1 == []:
        return (
            jsonify({"message": "Clen nebol pridany do ziadnej rodiny"}),
            400,
        )  # Bad Request
    else:
        return (
            jsonify({"error": "Nastala chyba na servery!!!"}),
            500,
        )  # Internal Server Error


@app.route("/Add_rewards", methods=["POST"])
def add_rewards():
    # Input
    email = request.form.get("email")
    name_reward = request.form.get("name_reward")
    value = request.form.get("value")

    # SQL query
    syntax = "SELECT id FROM uzivatel WHERE meno = %s"
    result = connectiondb(syntax, (email))

    syntax1 = "INSERT INTO odmena (nazov, cena) VALUES (%s, %s)"
    result1 = connectiondb(syntax1, (name_reward, value))

    syntax2 = "SELECT nazov, cena FROM ulohy where id_uzivatel = %s RIGHT JOIN odmena ON ulohy.id_odmena = odmena.id"
    result2 = connectiondb(syntax2, (result[0][0]))

    # Return
    if result2 & result1:
        return (
            jsonify({"message": "Uspesny zapis a vypis odmien"}, result2),
            202,
        )  # Accepted
    elif result2:
        return jsonify({"message": "Uspesny vypis odmien"}, result2), 202  # Accepted
    # elif result2 == None or result1 == None:
    #    return jsonify({"message": "Problem so zapisom alebo vypisom odmien"}), 400 # Bad Request
    else:
        return (
            jsonify({"error": "Nastala chyba na servery!!!"}),
            500,
        )  # Internal Server Error


@app.route("/Delete_family", methods=["POST"])
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
        return (
            jsonify({"error": "Nastala chyba na servery!!!"}),
            500,
        )  # Internal Server Error


@app.route("/Add_tasks", methods=["POST"])
def add_tasks():
    # Input
    id = request.form.get('id')
    task = request.form.get('task')
    date_from = request.form.get('date_from')
    date_to = request.form.get('date_to')
    reward = request.form.get('reward')

    # SQL query
    syntax = "SELECT id FROM odmena WHERE nazov = %s"
    result = connectiondb(syntax, (reward,))

    syntax1 = "INSERT INTO ulohy (id_uzivatel, uloha, cas_od, cas_do, id_odmena, stav) VALUES (%s, %s, %s, %s, %s, %s)"
    result1 = connectiondb(syntax1, (id, task, date_from, date_to, "100", "not done")) #TODO: potom prepisat "100" na result[0][0]

    # Return
    if not result1:
        return jsonify({"message": "Pridanie ulohy uspesne"}), 200 # OK
    else:
        return (
            jsonify({"error": "Nastala chyba na servery!!!"}),
            500,
        )  # Internal Server Error

    
@app.route('/Parents_tasks', methods=['POST'])
def parent_tasks():
    # Input
    email = request.form.get("email")

    # SQL query
    syntax = "SELECT id_rodina FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "SELECT id_uzivatel FROM clen WHERE id_rodina = %s"
    result1 = connectiondb(syntax1, (result[0][0],))

    syntax2 = "SELECT * FROM ulohy WHERE id_uzivatel = %s"
    for i in result1:
        result2 = connectiondb(syntax2, (result1[0][i]))

    # Return
    if result2:
        return (
            jsonify({"message": "Vypis uloh uspesne", "return": f"{result2}"}),
            202,
        )  # Accepted
    elif result2 == []:
        return jsonify({"message": "Vypis uloh neuspesne"}), 400  # Bad Request
    else:
        return (
            jsonify({"error": "Nastala chyba na servery!!!"}),
            500,
        )  # Internal Server Error


@app.route("/Parents_rewards", methods=["POST"])
def parents_rewards():
    # Input
    email = request.form.get("email")

    # SQL query
    syntax = "SELECT id_rodina FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "SELECT id_uzivatel FROM clen WHERE id_rodina = %s"
    result1 = connectiondb(syntax1, (result[0][0],))

    syntax2 = "SELECT meno, nazov, datum FROM aktivovanie INNER JOIN uzivatel ON uzivatel.id = aktivovanie.id_uzivatela INNER JOIN odmena ON odmena.id = aktivovanie.id_odmena WHERE id_uzivatel = %s"
    for i in result1:
        result2 = connectiondb(syntax2, (result1[0][i]))

    # Return
    if result2:
        return (
            jsonify({"message": "Vypis odmien uspesne", "return": f"{result2}"}),
            202,
        )  # Accepted
    elif result2 == []:
        return jsonify({"message": "Vypis odmien neuspesne"}), 400  # Bad Request
    else:
        return (
            jsonify({"error": "Nastala chyba na servery!!!"}),
            500,
        )  # Internal Server Error


@app.route("/Kids_dashboard", methods=["POST"])
def kids_dashboard():
    # Input
    email = request.form.get("email")

    # SQL query
    syntax = "SELECT * FROM ulohy RIGHT JOIN uzivatel ON uzivatel.id = ulohy.id_uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "SELECT nazov, datum FROM uzivatel INNER JOIN aktivovanie ON aktivovanie.id_uzivatela = uzivatel.id INNER JOIN odmena ON odmena.id = aktivovanie.id_odmena WHERE email = %s"
    result1 = connectiondb(syntax1, (email,))

    # Return
    if result and result1:
        return (
            jsonify(
                {
                    "message": "Vypis uloh a odmien uspesne",
                    "return": f"{result}",
                    "return1": f"{result1}",
                }
            ),
            202,
        )  # Accepted
    elif result == [] or result1 == []:
        return jsonify({"message": "Vypis uloh a odmien neuspesne"}), 400  # Bad Request
    else:
        return (
            jsonify({"error": "Nastala chyba na servery!!!"}),
            500,
        )  # Internal Server Error


# @app.route('/Kids_exchange', methods=['POST'])
# def kids_exchange():
#    # Input
#    name = request.form.get('name')
#
#    # SQL query
#    syntax = ""

@app.route('/Select', methods=['POST'])
def select():
    # Input
    email = request.form.get('email')

    # SQL query
    syntax = "SELECT id_rodina FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE email = %s"
    result = connectiondb(syntax, (email,))

    syntax1 = "SELECT uzivatel.id, meno FROM uzivatel RIGHT JOIN clen ON uzivatel.id = clen.id_uzivatel WHERE id_rodina = %s AND rola = 'kid'"
    result1 = connectiondb(syntax1, (result[0][0],))

    # Return
    if result1:
        return jsonify({"return": f"{result1}"}), 202 # Accepted
    elif result1 == []:
        return jsonify({"message": "Bezdetny"}), 204 # No Content
    else:
        return jsonify({"error": "Nastala chyba na servery!!!"}), 500 # Internal Server Error

if __name__ == '__main__':
    app.run(host='147.232.205.117', port=5000)