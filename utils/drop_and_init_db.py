import os
import subprocess

def list_files(base_dir):
    """list all python (.py) files in base dir (excluding __init__.py)"""
    files_to_delete = []
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".py") and file != "__init__.py":
                files_to_delete.append(os.path.join(root, file))
    return files_to_delete

def delete_files(files):
    """delete all files from a lsit of files."""
    for file in files:
        try:
            os.remove(file)
            print(f"Deleted: {file}")
        except Exception as e:
            print(f"Error deleting {file}: {e}")

def drop_and_recreate_db(db_name, db_user, db_user_to_create, password):
    """drop then recreate database (db_name), then create a user w/ all privileges.
    Assumes a postgres user exists
    """
    commands = [
        f"sudo -u {db_user} psql -d postgres -c \"DROP DATABASE IF EXISTS {db_name};\"",
        f"sudo -u {db_user} psql -d postgres -c \"CREATE DATABASE {db_name};\"",
        f"sudo -u {db_user} psql -d postgres -c \"ALTER USER {db_user_to_create} WITH PASSWORD '{password}';\"",
        f"sudo -u {db_user} psql -d postgres -c \"GRANT ALL PRIVILEGES ON DATABASE {db_name} TO {db_user_to_create};\""
    ]
    
    for command in commands:
        try:
            subprocess.run(command, shell=True, check=True)
            print(f"Executed: {command}")
        except subprocess.CalledProcessError as e:
            print(f"Error executing command: {e}")

def main():

    # Set the Django base Migrations directory and database info
    django_base_dir = input("Enter the Django project migration directory: ")
    db_name = input("Enter the database name (to delete and recreate): ")
    db_user = input("Enter the database superuser to DROP, CREATE a new DB, and GRANT new DB user DB: ")
    db_user_to_grant = input(f"Enter the database user to create with priveldges on {db_name}: ")
    db_password = input(f"Enter the database user ({db_user_to_grant}) password: ")

    # List all Python files except __init__.py
    files_to_delete = list_files(django_base_dir)
    
    if not files_to_delete:
        print("No files to delete.")
        return
    
    print("The following files will be deleted:")
    for file in files_to_delete:
        print(file)
    
    confirmation = input("Are you sure you want to delete these files? (y/n): ")
    
    if confirmation.lower() == "y":

        # Delete the files
        delete_files(files_to_delete)
        
        # Drop and recreate the database
        drop_and_recreate_db(db_name, db_user, db_user_to_grant, db_password)
        print("Database dropped, recreated, and user privileges granted.")
    else:
        print("Operation cancelled.")

if __name__ == "__main__":
    main()
