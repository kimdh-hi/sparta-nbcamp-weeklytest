from pymongo import MongoClient

from flask import Flask, render_template, jsonify, request, redirect
import datetime

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.test3

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/api/memo', methods=['POST'])
def create():
    title = request.form['title']
    comment = request.form['comment']
    date = datetime.datetime.now()

    doc = {
        "title":title,
        "comment":comment,
        "date":date,
        "click":'0'
    }
    x = db.memos.insert_one(doc)
    print(x)
    return jsonify({'msg': '저장완료'})

@app.route('/api/memos', methods=['GET'])
def read():
    memos = list(db.memos.find({}, {'_id':0}))
    print(memos)
    return jsonify(memos)

@app.route('/api/memo', methods=['GET'])
def read_details():
    title = request.args.get('title')
    memo = db.memos.find_one({'title':title}, {'_id':False})

    click = memo['click']
    new_click = click+1
    db.memos.update({'title':title}, {'$set':{'click':new_click}})

    memos = list(db.memos.find({}, {'_id':0}))
    return jsonify(memos)

@app.route('/api/memo', methods=['PUT'])
def update():
    title = request.form['title']
    comment = request.form['comment']



@app.route('/api/memo', methods=['DELETE'])
def delete():
    title = request.form['title']
    db.memos.delete_one({'title':title})
    return jsonify({'msg': '삭제완료'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
