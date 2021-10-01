from pymongo import MongoClient

from flask import Flask, render_template, jsonify, request
import datetime

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.test2

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/api/memo', methods=['POST'])
def create():
    title = request.form['title']
    comment = request.form['comment']
    date = datetime.datetime.now()
    print(date)
    doc = {
        "title":title,
        "comment":comment,
        "date":date
    }
    db.memos.insert_one(doc)
    return jsonify({'msg': '저장완료'})

@app.route('/api/memo', methods=['GET'])
def read():
    memos = list(db.memos.find({}, {'_id':0}))
    print(memos)
    return jsonify(memos)


@app.route('/api/memo', methods=['DELETE'])
def delete():
    title = request.form['title']
    db.memos.delete_one({'title':title})
    return jsonify({'msg': '삭제완료'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
