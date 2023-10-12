# test_env.py 먼저 확인
# > myenv\Scripts\activate
# > python test_api.py
# http://127.0.0.1:5000/test1?param1=12&param2=34 접속
# http://127.0.0.1:5000/test2?param1=56&param2=78 접속
from flask import Flask, request, Response, jsonify

app = Flask(__name__)

@app.route('/test1', methods=['GET'])
def get_params1():
    param1 = request.args.get('param1')
    param2 = request.args.get('param2')
    if param1 and param2:
        response = {
            'function': 'get_params1',
            'return1': param1,
            'return2': param2,
            'message': 'ok'
        }
        return jsonify(response), 200
    return Response('Unauthorized', 400)

@app.route('/test2', methods=['GET'])
def get_params2():
    param1 = request.args.get('param1')
    param2 = request.args.get('param2')
    if param1 and param2:
        response = {
            'function': 'get_params2',
            'return1': param1,
            'return2': param2,
            'message': 'ok'
        }
        return jsonify(response), 200
    return Response('Unauthorized', 400)

if __name__ == '__main__':
    app.run()
