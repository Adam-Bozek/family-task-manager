import psycopg2

def connectiondb():
    print("start")
    try:
        
    
        """cursor=connection.cursor()

        select_query=Select * from Uzivatel
        cursor.execute(select_query)
        connection.commit()"""
    except (Exception, psycopg2.Error) as error:
        print(error)

    if connection:
        cursor.close()
        connection.close()
        print("Uz je konec!!!!")

if __name__=='__main__':
    #connectiondb()
    conn = psycopg2.connect(
    host="147.232.205.117",
    port="3306",
    database="ftm",
    user="admin",
    password="password"
)