# 파이썬 설치 확인
# > python --version

# 파이썬 가상 환경 생성
# > python -m venv myenv

# 파이썬 가상 환경 활성화
# (Windows) > myenv\Scripts\activate
# (macOs / Linux) > source myenv/bin/activate

# 파이썬 패키지 설치
# > pip install requests
# > pip install flask
# > pip install mysql-connector-python
# > pip install flask_cors

# Flask 앱 생성
from flask import Flask

app = Flask(__name__)

@app.route('/')
def flask_test():
    return 'flask test'

if __name__ == '__main__':
    app.run()
# > python test_env.py

# 파이썬 가상 환경 종료
# > deactivate


# > git init
# > git status
# > git remote -v
# > git branch 브랜치이름
# > git checkout 브랜치이름
# > git branch
# > git add 파일이름
# > git add .
# > git commit -m "커밋 메시지"
# > git push origin 브랜치이름
