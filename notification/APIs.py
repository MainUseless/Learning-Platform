from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
from DB import conn

app = Flask(__name__)
CORS(app)

@app.route('/notification', methods=['POST'])
def add_notification():
  data = request.get_json()
  stud_id = data['stud_id']
  message = data['message']

  conn = sqlite3.connect('notification.db')
  c = conn.cursor()

  stmt = '''INSERT INTO notifications (stud_id, message, is_read) VALUES (?, ?, 0)'''
  c.execute(stmt, (stud_id, message))

  conn.commit()
  conn.close()

  return jsonify({'message': 'Notification added'}), 201

@app.route('/notifications', methods=['GET'])
def get_unread_notifications():
  stud_id = request.args.get('stud_id')
  conn = sqlite3.connect('notification.db')
  c = conn.cursor()

  stmt = '''SELECT * FROM notifications WHERE stud_id = ? AND is_read = 0'''
  notifications = c.execute(stmt, (stud_id,)).fetchall()

  unread_notifications = [{'id': n[1], 'message': n[2]} for n in notifications]

  update_stmt = '''UPDATE notifications SET is_read = 1 WHERE stud_id = ? AND is_read = 0'''
  c.execute(update_stmt, (stud_id,))

  conn.commit()
  conn.close()

  return jsonify(unread_notifications)

@app.route('/unreadnotification', methods=['GET'])
def get_unread_notification_count():
    stud_id = request.args.get('stud_id')
    
    conn = sqlite3.connect('notification.db')
    c = conn.cursor()

    stmt = '''SELECT COUNT(*) FROM notifications WHERE stud_id = ? AND is_read = 0'''
    unread_count = c.execute(stmt, (stud_id,)).fetchone()[0]

    return "You Have " + str(unread_count) + " Unread Notifications"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8082)
    # app.run(debug=True)