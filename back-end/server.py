import paramiko
import psycopg2
import socket

def create_ssh_tunnel(ssh_host, ssh_port, ssh_user, ssh_key_filepath, db_port=5432):
    try:
        # Create SSH client
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        # Connect to the SSH server
        ssh.connect(ssh_host, port=ssh_port, username=ssh_user, key_filename=ssh_key_filepath)

        # Start an SSH tunnel
        local_port = 5432  # Local port for PostgreSQL
        transport = ssh.get_transport()
        transport.request_port_forward('localhost', local_port, 'localhost', db_port)

        return ssh, local_port

    except Exception as e:
        print(f"Error with SSH connection: {e}")
        return None, None

def connect_to_database(db_name, db_user, db_password, local_port):
    try:
        # Connect to the PostgreSQL database on the local port
        connection = psycopg2.connect(
            dbname=db_name,
            user=db_user,
            password=db_password,
            host='localhost',
            port=local_port
        )
        return connection
    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        return None

def main():
    # SSH parameters
    ssh_host = "147.232.205.117"  # Replace with your SSH server address
    ssh_port = 22                # Default SSH port
    ssh_user = "root"   # Replace with your SSH username
    ssh_key_filepath = "path/to/your/private/key"  # Replace with the path to your SSH key

    # Database parameters
    db_name = "ftm"  # Replace with your database name
    db_user = "admin"        # Replace with your PostgreSQL username
    db_password = "password" # Replace with your PostgreSQL password

    # Create SSH tunnel
    ssh, local_port = create_ssh_tunnel(ssh_host, ssh_port, ssh_user, ssh_key_filepath)

    if ssh and local_port:
        try:
            # Connect to the PostgreSQL database
            connection = connect_to_database(db_name, db_user, db_password, local_port)

            if connection:
                print("Connected to the database!")
                # Use the connection (create a cursor, execute queries, etc.)
                cursor = connection.cursor()
                cursor.execute("SELECT NOW();")  # Example query to get current time
                current_time = cursor.fetchone()
                print("Current time in the database:", current_time)

                # Clean up
                cursor.close()
                connection.close()

        finally:
            # Close the SSH tunnel
            ssh.close()
            print("SSH tunnel closed.")

if __name__ == '__main__':
    main()