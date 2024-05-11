from flask import Flask
import sqlite3

app = Flask(__name__)

conn = sqlite3.connect('notification.db')
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS notifications 
          (id INTEGER PRIMARY KEY, 
          stud_id INTEGER,
          message TEXT,
          is_read BOOLEAN
          )''')
conn.commit()
conn.close()
