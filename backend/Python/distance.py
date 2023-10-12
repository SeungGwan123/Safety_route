import math

# 두 점 간의 유클리드 거리 계산
def euclidean_distance(point1, point2):
    x1, y1 = point1
    x2, y2 = point2
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

# 점과 선분 사이의 거리 계산
def point_to_line_distance(point, line_start, line_end):
    x, y = point
    x1, y1 = line_start
    x2, y2 = line_end

    # 선분의 길이 계산
    line_length = euclidean_distance(line_start, line_end)

    # 선분이 수직인 경우 예외 처리
    if line_length == 0:
        return euclidean_distance(point, line_start)

    # 선분의 방향 벡터 계산
    dx = (x2 - x1) / line_length
    dy = (y2 - y1) / line_length

    # 점과 선분의 시작점과의 상대적 위치 벡터 계산
    relative_x = x - x1
    relative_y = y - y1

    # 점과 선분 사이의 거리 계산
    dot_product = relative_x * dx + relative_y * dy

    if dot_product < 0:
        # 점이 선분의 시작점 앞에 있는 경우
        return euclidean_distance(point, line_start)
    elif dot_product > line_length:
        # 점이 선분의 끝점 뒤에 있는 경우
        return euclidean_distance(point, line_end)
    else:
        # 점이 선분 위에 있는 경우
        perpendicular_distance = abs(relative_x * dy - relative_y * dx)
        return perpendicular_distance
    
def coordinate_to_meter(c):
    # 위도 36도 기준 : 경도1도=90180m 위도1도=110940m
    # 어림잡아 1도 차이 = 100000m 로 설정
    return c * 100000