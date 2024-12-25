# Imports
from datetime import datetime
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS

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

#Function for deleting database records at midnight
def deleting_records():

    # Current date and time
    current_datetime = datetime.now()

    # Formatted date and time
    formatted_datetime = current_datetime.strftime("%d.%m.%Y %H:%M:%S")

    #SQL query
    syntax = "DELETE FROM ulohy WHERE stav = %s or stav = %s"
    connectiondb(syntax, ("done", "notDone"))

    syntax1 = "DELETE FROM aktivovanie WHERE stav = %s"
    connectiondb(syntax1, ("t",))

    syntax2 = "UPDATE ulohy SET stav = %s WHERE cas_do <= %s"
    connectiondb(syntax2, ("notDone", formatted_datetime))

    syntax3 = "SELECT cena_odmeny, id_uzivatel FROM ulohy WHERE stav = %s"
    result = connectiondb(syntax3, ('notDone',))

    syntax4 = "UPDATE penazenka SET zostatok_penazenky = %s WHERE id_uzivatel = %s"
    for row in result:
        cena_odmeny = row[0]
        id_uzivatel = row[1]
        connectiondb(syntax4, (-cena_odmeny, id_uzivatel))


if __name__ == '__main__':
    deleting_records()