# practice/test.ipynb 먼저 확인
# > myenv\Scripts\activate
# > python main.py
# > python yolov5/my_detect.py --weights best5.pt --source "http://raspberrypi:8000/stream.mjpg" --device cpu --view-img

# 인천대-> CGV
# http://127.0.0.1:5001/find_safe_route?depart_x=126.63486&depart_y=37.37692&arrive_x=126.64251&arrive_y=37.38308
# 계양구
# http://127.0.0.1:5001/find_safe_route?depart_x=126.73344&depart_y=37.52977&arrive_x=126.7428&arrive_y=37.53829
from flask import Flask, request, Response, jsonify, make_response, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import requests
import traceback
import time
import mysql.connector
import json

detected_time, detected_cctv, detected_image_path = 0, 0, ''

from distance import point_to_line_distance
from distance import coordinate_to_meter

app = Flask(__name__)
CORS(app)  
app.config['JSON_AS_ASCII'] = False
socketio = SocketIO(cors_allowed_origins="*")  # Add Socket.IO to the app
socketio.init_app(app)

"""
# socket connect 알림
@socketio.on('connect')
def handle_connect():
    print('soketio connected')
"""

def send_signal(detected_time, detected_cctv, detected_image_path):
    socketio.emit('signal', {'data': {'warning': '위험', 'data': detected_cctv, 'image':detected_image_path}})


def isCCTV_near(CCTV, nodes):
    point = [CCTV[12], CCTV[11]]
    for i in range(len(nodes)-1):
        distance_coordinate = point_to_line_distance(point, nodes[i], nodes[i+1])
        distance_meter = coordinate_to_meter(distance_coordinate)
        if distance_meter < 100:
            return True
    return False

# 안전 경로 길찾기
@app.route('/find_safe_route', methods=['GET'])
def find_safe_route():
    try:
        # 매개변수 세팅 및 OSRM에 request
        depart_x = request.args.get('depart_x')
        depart_y = request.args.get('depart_y')
        arrive_x = request.args.get('arrive_x')
        arrive_y = request.args.get('arrive_y')
        OSRM_url = "http://localhost:5000/route/v1/foot/"+depart_x+","+depart_y+";"+arrive_x+","+arrive_y+"?alternatives=3&steps=true"
        OSRM_response = requests.get(url=OSRM_url)
        if OSRM_response.status_code == 404:
            response = {'code': 404, 'message': 'OSRM response 404'}
            return make_response(json.dumps(response, ensure_ascii=False))
        else:
            # nodes 채우기
            routes = OSRM_response.json()['routes']
            num_route = len(routes)
            nodes = [[] for _ in range(num_route)]
            near_cctv = [{} for _ in range(num_route)]
            for i in range(num_route):
                nodes[i] = [[float(depart_x), float(depart_y)]]
                near_cctv[i] = []
                steps = routes[i]['legs'][0]['steps']
                for step in steps:
                    nodes[i].append(step['maneuver']['location'])
                nodes[i].append([float(arrive_x), float(arrive_y)])
            # near_cctv 채우기
            select_query = "select * from CCTV where (촬영방면 not like '%넛출선착장%' and 촬영방면 not like '%민원실%' and 촬영방면 not like '%복지상담실%' and 촬영방면 not like '%선진포물량장%' and 촬영방면 not like '%청사%')"
            cursor.execute(select_query)
            CCTVs = cursor.fetchall()
            near_cctv_label = ['번호', '관리기관명', '소재지도로명주소', '소재지번주소', '설치목적', '카메라대수', '카메라화소', '촬영방면정보', '보관일수', '설치연월', '관리기관전화번호', 'WGS84위도', 'WGS84경도', '데이터기준일자']
            for CCTV in CCTVs:
                for i in range(num_route):
                    if isCCTV_near(CCTV, nodes[i]):
                        tmp_cctv = {}
                        for j in range(len(near_cctv_label)):
                            tmp_cctv[near_cctv_label[j]] = CCTV[j]
                        near_cctv[i].append(tmp_cctv)
            # response 보내기
            response = {'code': 200, 'data': {'OSRM_response': OSRM_response.json(), 'near_cctv': near_cctv}}
            return make_response(json.dumps(response, ensure_ascii=False))
    except Exception as e:
        err = traceback.format_exc()
        response = {'code': 400, 'message': err}
        return make_response(json.dumps(response, ensure_ascii=False))

# 칼 감지
@app.route('/knife_detected', methods=['GET'])
def knife_detected():
    global detected_time, detected_cctv, detected_image_path
    detected_time = int(request.args.get('detected_time'))   # 카메라 없을 시
    #detected_time = time.time()
    detected_cctv = 8326
    detected_image_path = "http://localhost:5001/static/detected/"+str(detected_time)+".jpg"
    send_signal(detected_time, detected_cctv, detected_image_path)
    return 'knife_detected at ' + str(detected_time) + " " + str(detected_cctv) + " " + detected_image_path

# detected 이미지 경로
@app.route('/detected/<filename>')
def detected(filename):
    return render_template('detected.html', filename=filename)

# 가장 최근 위험 상황
@app.route('/get_latest_warning', methods=['GET'])
def get_latest_warning():
    latest_warning = [detected_time, detected_cctv, detected_image_path]
    if time.time() - latest_warning[0] < 60*60:  # 가장 최근 위험 발생 시간이 현재로부터 1시간 이내라면
        response = {'code': 200, 'data': {'latest_warning': latest_warning}}
    else:
        response = {'code': 400}
    return make_response(json.dumps(response, ensure_ascii=False))

"""
# 시연 영상 용 임시
@app.route('/send_cctv_number', methods=['POST'])
def send_cctv_number():
    try:
        response = {
                  'cctv_number': 8326,
                'risk_level': "위험",
                'content': "현재 13시50분 cctv에 칼부림 일어남",
                'image': "https://image.news1.kr/system/photos/2023/7/21/6117093/article.jpg"
         }
        return make_response(json.dumps(response, ensure_ascii=False))
    except Exception as e:
        err = traceback.format_exc()
        response = {'code': 400, 'message': err}
        return make_response(json.dumps(response, ensure_ascii=False))
"""

if __name__ == '__main__':
    # db_connection = mysql.connector.connect(
    #     host="localhost",
    #     user="root",
    #     password="tkrhdrhkdduf",
    #     database="safety_route"
    # )
    db_connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="tmdrhks123",
        database="safety_route"
    )
    cursor = db_connection.cursor()
    # socketio.start_background_task(target=send_signal)
    socketio.run(app, port=5001, debug=True) 
    app.run(host='0.0.0.0', port=5001)
    cursor.close()
    db_connection.close()