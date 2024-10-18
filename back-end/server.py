import psycopg2
from flask import Flask, request

def connectiondb(query, params=None):
    print("Start")
    connection = None  # Initialize connection variable
    cursor = None      # Initialize cursor variable
    try:
        # Establish the database connection
        connection = psycopg2.connect(
            dbname='ftm',      # Replace with your database name
            user='admin',      # Replace with your username
            password='password',  # Replace with your password
            host='147.232.205.117',          # Replace with your host (e.g., 'localhost')
            port='5432'           # Replace with your database port
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
    connectiondb(syntax, (name, surname, email, password))

    return "Používateľ vytvorený."

@app.route('/Check_user_exist', methods=['GET'])
def check_user_exist():
    email = request.args.get('email')
    
    syntax = "SELECT * FROM uzivatel WHERE email = %s;"
    result = connectiondb(syntax, (email,))
    
    if result:
        return "Používateľ existuje."
    else:
        return "Používateľ neexistuje."

@app.route('/Login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    syntax = "SELECT * FROM uzivatel WHERE email = %s AND heslo = %s;"
    result = connectiondb(syntax, (email, password))
    
    if result:
        return "Prihlásenie úspešné."
    else:
        return "Nesprávne prihlasovacie údaje."

if __name__ == '__main__':
    app.run(debug=True)