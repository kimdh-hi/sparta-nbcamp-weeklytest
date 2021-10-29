import os
from pymongo import MongoClient
from flask import Flask, render_template, jsonify, request, redirect
import datetime

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.test3

pypy = os.environ['PYPY']

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/api/memo', methods=['POST'])
def create():

    title = request.form['title']
    comment = request.form['comment']
    date = datetime.datetime.now().strftime('%Y.%m.%d %H:%M:%S')

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
        "click":0
    }

    x = db.memos.insert_one(doc)

    return jsonify({'msg': '저장완료'})

@app.route('/api/memos', methods=['GET'])
def read():
    order = request.args.get('order')
    limit = int(request.args.get('limit'))
    page = int(request.args.get('page'))

    total_count = db.memos.find({}).count()
    total_page = (total_count // limit) + (1 if total_count % limit >= 1 else 0)
    skip = (page-1) * limit

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

    return jsonify({"memo": memo})

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

    print(memo_id, title, comment)

    db.memos.update_one(
        {'memo_id': memo_id},
        {'$set': {'title': title, 'comment': comment}}
    )

    return jsonify({"msg": "수정완료"})

@app.route('/api/memo', methods=['DELETE'])
def delete():
    id = int(request.args.get('id'))
    db.memos.delete_one({'memo_id':id})
    return jsonify({'msg': '삭제완료'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
