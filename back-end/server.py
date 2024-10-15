import psycopg2

def connectiondb():
    print("start")
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

        select_query = """SELECT * FROM Uzivatel"""  # Correct SQL syntax
        cursor.execute(select_query)  # Execute the query
        results = cursor.fetchall()  # Fetch all results if needed
        print(results)  # Print or process the results

    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL:", error)

    finally:
        # Close cursor and connection if they were created
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()
        print("Uz je konec!!!!")

if __name__ == '__main__':
    connectiondb()