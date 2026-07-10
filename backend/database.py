import sqlite3

DATABASE = "placement.db"


# Database connection
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# Create tables
def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        department TEXT,
        cgpa REAL,
        skills TEXT,
        placement_status TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS companies(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT,
        role TEXT,
        package TEXT
    )
    """)

    conn.commit()
    conn.close()


# Add student
def add_student(name, department, cgpa, skills, status):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO students
    (name, department, cgpa, skills, placement_status)
    VALUES (?,?,?,?,?)
    """,
    (name, department, cgpa, skills, status))

    conn.commit()
    conn.close()


# Get all students
def get_students():
    conn = get_db_connection()
    cursor = conn.cursor()

    students = cursor.execute(
        "SELECT * FROM students"
    ).fetchall()

    conn.close()

    return students