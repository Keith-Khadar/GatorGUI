from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import paramiko
import threading

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

def stream_output(ip, username, password):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(ip, username=username, password=password, look_for_keys=False, allow_agent=False)

        channel = ssh.get_transport().open_session()
        channel.exec_command('source /opt/ros/noetic/setup.bash && source ~/catkin_ws/devel/setup.bash && roslaunch navigator_launch simulation.launch')

        while not channel.exit_status_ready():
            if channel.recv_ready():
                output = channel.recv(1024).decode('utf-8')
                socketio.emit('robot_output', {'data': output})
            if channel.recv_stderr_ready():
                error = channel.recv_stderr(1024).decode('utf-8')
                socketio.emit('robot_output', {'data': f'Error: {error}'})
        ssh.close()
    except Exception as e:
        socketio.emit('robot_output', {'data': f'Exception: {str(e)}'})

@app.route('/start-robot', methods=['POST'])
def start_robot_route():
    data = request.get_json()
    ip = data.get('ip')
    username = data.get('username')
    password = data.get('password')
    threading.Thread(target=stream_output, args=(ip, username, password)).start()
    return jsonify({'status': 'success', 'message': 'Started streaming output'}), 200

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
