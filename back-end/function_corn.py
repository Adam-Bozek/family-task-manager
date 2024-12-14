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
    #SQL query
    syntax = "DELETE FROM ulohy WHERE stav = %s"
    connectiondb(syntax, ("done", ))

    syntax1 = "DELETE FROM aktivovanie WHERE stav = %s"
    connectiondb(syntax1, ("t", ))


if __name__ == '__main__':
    deleting_records()