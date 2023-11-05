# test.ipynb 먼저 확인
# db_connection 확인
# > myenv\Scripts\activate
# > python main.py

# 인천대-> CGV
# http://127.0.0.1:5001/find_safe_route?depart_x=126.63486&depart_y=37.37692&arrive_x=126.64251&arrive_y=37.38308
# 계양구
# http://127.0.0.1:5001/find_safe_route?depart_x=126.73344&depart_y=37.52977&arrive_x=126.7428&arrive_y=37.53829
from flask import Flask, request, Response, jsonify, make_response
from flask_cors import CORS
import requests
import traceback
import mysql.connector
import json


from distance import point_to_line_distance
from distance import coordinate_to_meter

def isCCTV_near(CCTV, nodes):
    point = [CCTV[12], CCTV[11]]
    for i in range(len(nodes)-1):
        distance_coordinate = point_to_line_distance(point, nodes[i], nodes[i+1])
        distance_meter = coordinate_to_meter(distance_coordinate)
        if distance_meter < 100:
            return True
    return False

app = Flask(__name__)
CORS(app)  
app.config['JSON_AS_ASCII'] = False

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
            # response = {'code': 200, 'OSRM_response': OSRM_response.json(), 'near_cctv': near_cctv}
            response = {'code': 200, 'data': {'OSRM_response': OSRM_response.json(), 'near_cctv': near_cctv}}
            return make_response(json.dumps(response, ensure_ascii=False))
    except Exception as e:
        err = traceback.format_exc()
        response = {'code': 400, 'message': err}
        return make_response(json.dumps(response, ensure_ascii=False))

if __name__ == '__main__':
    db_connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="tkrhdrhkdduf",
        database="safety_route"
    )
    # db_connection = mysql.connector.connect(
    #     host="localhost",
    #     user="root",
    #     password="root",
    #     database="safety_route"
    # )
    cursor = db_connection.cursor()
    app.run(host='0.0.0.0', port=5001)
    cursor.close()
    db_connection.close()