import jwt
from flask import Flask, request, jsonify, Response
import sqlite3
from flask_cors import CORS
import requests
import os
from DB import conn

app = Flask(__name__)
CORS(app)

@app.route('/notification', methods=['POST'])
def add_notification():
	data = request.get_json()
	token_body = decode_token(request)
	stud_id = token_body['stud_id']
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
	token_body = decode_token(request)
	stud_id = token_body['stud_id']
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
    token_body = decode_token(request)
    stud_id = token_body['stud_id']
    
    conn = sqlite3.connect('notification.db')
    c = conn.cursor()

    stmt = '''SELECT COUNT(*) FROM notifications WHERE stud_id = ? AND is_read = 0'''
    unread_count = c.execute(stmt, (stud_id,)).fetchone()[0]

    return "You Have " + str(unread_count) + " Unread Notifications"

@app.route('/', methods=['GET'])
def test():
    return "Hello World!"

def decode_token(request):
    encoded_token = request.headers.get('Authorization', None)
    encoded_token = encoded_token.split(' ')[1]
    try:
        # Set verify_signature to False to skip signature validation
        token = jwt.decode(encoded_token, options={"verify_signature": False}) 
        return token
    except Exception as e:
        print(f"Error decoding JWT: {e}")
        return None

@app.before_request
def validate_token():
    try:
        encoded_token = request.headers.get('Authorization', None)
        if encoded_token is None:
            return Response('Unauthorized: Authorization header is missing', status=401)
            
        encoded_token = encoded_token.split(' ')[1]
        
        res = requests.get(os.getenv('AUTH_URL'), headers={'Authorization': f'Bearer {encoded_token}'})
        
        if res.status_code != 200:
            return Response('Unauthorized: Authorization header is Invalid', status=401)
            
    except Exception as e:
        return Response('error: Internal server error', status=500)

    return

if __name__ == "__main__":
    print("Starting Notification Service")    
    app.run(host='0.0.0.0', port=8082)
    # app.run(debug=True)