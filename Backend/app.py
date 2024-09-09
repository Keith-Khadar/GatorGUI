from flask import Flask, request, jsonify
from flask_cors import CORS
import paramiko

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


def start_robot(ip, username, password):
    try:
        # Setup SSH client
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(ip, username=username, password=password, look_for_keys=False, allow_agent=False)
  
        # Run the roslaunch command
        command = 'source /opt/ros/noetic/setup.bash && source ~/catkin_ws/devel/setup.bash && roslaunch navigator_launch simulation.launch'
        stdin, stdout, stderr = ssh.exec_command(command)
        output = stdout.read().decode('utf-8')
        error = stderr.read().decode('utf-8')
        
        ssh.close()

        if error:
            return {'status': 'error', 'message': error}, 500
        return {'status': 'success', 'message': output}, 200
    except Exception as e:
        return {'status': 'error', 'message': str(e)}, 500

@app.route('/start-robot', methods=['POST'])
def start_robot_route():
    data = request.get_json()
    ip = data.get('ip')
    username = data.get('username')
    password = data.get('password')

    return jsonify(start_robot(ip, username, password))


def check_ssh_connection(ip, username, password):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(ip, username=username, password=password, look_for_keys=False, allow_agent=False)

        ssh.close()
        return {'status': 'success', 'message': 'Connected successfully'}, 200
    except Exception as e:
        return {'status': 'error', 'message': str(e)}, 500

@app.route('/check-ssh', methods=['POST'])
def check_ssh_route():
    data = request.get_json()
    ip = data.get('ip')
    username = data.get('username')
    password = data.get('password')

    return jsonify(check_ssh_connection(ip, username, password))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
