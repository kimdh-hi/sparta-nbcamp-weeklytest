from pymongo import MongoClient
from flask import Flask, render_template, jsonify, request, redirect
import datetime
import uuid
import math

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.test3

@app.route('/', methods=['GET'])
def index():
    limit = request.args.get('limit')
    total_count = db.memos.find({}).count()
    if limit is not None:
        paging_button_num = total_count / limit
    else:
        paging_button_num = total_count / 5
    paging_button_num = math.ceil(paging_button_num)
    return render_template('index.html', paging_button_num=int(paging_button_num)+1)

@app.route('/api/memo', methods=['POST'])
def create():
    memo_id = request.form['id']

    if memo_id == '':
        title = request.form['title']
        comment = request.form['comment']
        date = datetime.datetime.now()
        memo_id = str(uuid.uuid1())
        doc = {
            "memo_id":memo_id,
            "title":title,
            "comment":comment,
            "date":date,
            "click":0
        }
        x = db.memos.insert_one(doc)

        return jsonify({'msg': '저장완료'})
    else:
        title = request.form['title']
        comment = request.form['comment']
        memos = db.memos.update({'memo_id':memo_id}, {'$set': {'title': title, 'comment': comment}})

        return jsonify({'msg': '수정완료'})

@app.route('/api/memos', methods=['GET'])
def read():

    offset = request.args.get('offset')
    limit = request.args.get('limit')
    sort_condition = request.args.get('sort')
    total_count = db.memos.find({}).count()
    if sort_condition == 'desc':
        memos = db.memos.find({},{'_id':False}).sort([('click',-1)])
    else:
        memos = db.memos.find({}, {'_id': False}).sort([('click', 1)])

    if offset is None and limit is None:
        offset = 0
        limit = 5
    memos = memos.skip(int(offset))
    memos = list(memos.limit(int(limit)))

    return jsonify(memos)

@app.route('/api/memo', methods=['GET'])
def read_details():
    memo_id = request.args.get('id')
    print(memo_id)
    memo = db.memos.find_one({'memo_id':memo_id}, {'_id':False})

    click = memo['click']
    new_click = click+1
    db.memos.update({'memo_id':memo_id}, {'$set':{'click':new_click}})

    memos = db.memos.find_one({'memo_id':memo_id}, {'_id':0})

    return jsonify(memos)

@app.route('/api/memo/edit', methods=['GET'])
def get_edit_data():
    memo_id = request.args.get('id')
    memo = db.memos.find_one({'memo_id':memo_id}, {'_id':False})
    return jsonify(memo)

@app.route('/api/memo', methods=['PUT'])
def update():
    title = request.form['title']
    comment = request.form['comment']



@app.route('/api/memo', methods=['DELETE'])
def delete():
    id = request.form['id']
    print(id)
    db.memos.delete_one({'memo_id':id})
    return jsonify({'msg': '삭제완료'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
