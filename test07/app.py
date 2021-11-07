import os
from pymongo import MongoClient
from flask import Flask, render_template, jsonify, request, Response
from datetime import datetime, timedelta
import jwt
from flask_socketio import SocketIO, emit


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app)

SECRET = "secret"

client = MongoClient('localhost', 27017)
db = client.test3


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/api/memo', methods=['POST'])
def create():

    token = request.headers.get("Authorization")

    id = ''
    if token is not None:
        try:
            id = jwt.decode(token, SECRET, algorithms="HS256")['id']
        except jwt.InvalidTokenError:
            return Response(status=401)
    if id != '':
        writer_id = id
    else:
        writer_id = '비회원'

    title = request.form['title']
    comment = request.form['comment']
    date = datetime.now().strftime('%Y.%m.%d %H:%M:%S')

    total_count = db.memos.count()

    if total_count > 0:
        memo_id = db.memos.find_one(sort=[("memo_id", -1)])['memo_id'] + 1
    else:
        memo_id = 1

    doc = {
        "memo_id":memo_id,
        "title":title,
        "comment":comment,
        "date":date,
        "click":0,
        'writer_id': writer_id
    }

    x = db.memos.insert_one(doc)

    return jsonify({'msg': '저장완료'})

@app.route('/api/memos', methods=['GET'])
def read():
    order = request.args.get('order')
    limit = int(request.args.get('limit'))
    page = int(request.args.get('page'))
    type = request.args.get('type')

    total_count = db.memos.find({}).count()
    total_page = (total_count // limit) + (1 if total_count % limit >= 1 else 0)
    skip = (page-1) * limit

    if type == 'my':
        token = request.headers.get('Authorization')
        try:
            id = jwt.decode(token, SECRET, algorithms="HS256")['id']
        except jwt.InvalidTokenError:
            return Response(status=401)

        if order == 'asc':
            memos = list(db.memos.find({'writer_id': id}, {'_id': False}).sort([('click', 1)]).skip(skip).limit(limit))
        else:
            memos = list(db.memos.find({'writer_id': id}, {'_id': False}).sort([('click', -1)]).skip(skip).limit(limit))
    else:
        if order == 'asc':
            memos = list(db.memos.find({}, {'_id': False}).sort([('click', 1)]).skip(skip).limit(limit))
        else:
            memos = list(db.memos.find({}, {'_id': False}).sort([('click', -1)]).skip(skip).limit(limit))

    paging = {
        'total_count': total_count,
        'total_page': total_page,
        'page': page,
    }

    return jsonify({"memos": memos, 'paging': paging})

@app.route('/api/memo/<int:id>', methods=['GET'])
def read_details(id):
    click = db.memos.find_one({'memo_id': id}, {'_id': False})['click']
    new_click = click+1

    db.memos.update({'memo_id': id}, {'$set': {'click': new_click}})

    memo = db.memos.find_one({'memo_id': id}, {'_id': 0})

    comments = list(db.comments.find({'memo_id': id}, {'_id': False}))
    return jsonify({"memo": memo, "comments": comments})

@app.route('/api/memo', methods=['GET'])
def read_details_edit_form():
    memo_id = int(request.args.get('id'))

    memo = db.memos.find_one({'memo_id': memo_id}, {'_id': 0})

    return jsonify({"memo": memo})

@app.route('/api/memo', methods=['PUT'])
def update():
    memo_id = int(request.form['id'])
    title = request.form['title']
    comment = request.form['comment']

    db.memos.update_one(
        {'memo_id': memo_id},
        {'$set': {'title': title, 'comment': comment}}
    )

    return jsonify({"msg": "수정완료"})

@app.route('/api/memo', methods=['DELETE'])
def delete():
    id = int(request.args.get('id'))
    db.memos.delete_one({'memo_id': id})
    db.comments.delete_many({'memo_id': id})
    return jsonify({'msg': '삭제완료'})


#========= 회원가입 / 로그인 ============#

@app.route('/signup', methods=['POST'])
def signup():

    id = request.form['id']
    pw = request.form['pw']

    find_user = db.members.find_one({'id': id})
    if find_user is not None:
        return jsonify({"result": 'fail', "msg":"이미 존재하는 ID 입니다."})
    else:
        doc = {
            'id': id,
            'password': pw
        }
        db.members.insert_one(doc)
    return jsonify({"result": "success", "msg": "회원가입에 성공했습니다."})

@app.route('/signin', methods=['POST'])
def signin():
    id = request.form['id']
    pw = request.form['pw']

    find_user = db.members.find_one({'id': id, 'password': pw}, {'_id': False})

    if find_user is None:
        return jsonify({"result": 'fail', "msg": "인증에 실패했습니다."})

    payload = {
        "id": id,
        "exp": datetime.utcnow() + timedelta(seconds=60 * 60 * 1)
    }
    token = jwt.encode(payload, SECRET, algorithm='HS256')

    return jsonify({"result": "success", "msg": "로그인에 성공했습니다.", "token": token, 'id': id})

@app.route('/comment', methods=['POST'])
def add_comment():
    comment = request.form['comment']
    memo_id = int(request.form['memo_id'])

    doc = {
        'comment': comment,
        'memo_id': memo_id
    }

    db.comments.insert_one(doc)

    find_memo = db.memos.find_one({'memo_id': memo_id}, {'_id': False})
    socketio.emit(find_memo['writer_id'], "ok")

    return jsonify({"result": "success", "msg": "댓글달기 완료"})

@app.route('/token-decode', methods=["GET"])
def decode_token():
    token = request.args.get('token')
    try:
        id = jwt.decode(token, SECRET, algorithms="HS256")['id']
        print('decoded-token-id: ', id)
    except jwt.InvalidTokenError:
        return Response(status=401)
    return jsonify({"result": "success", "id": id})

if __name__ == '__main__':
    # app.run('0.0.0.0', port=5000, debug=True)
    socketio.run(app, debug=True)
