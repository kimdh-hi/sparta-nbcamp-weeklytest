from flask import Flask, render_template, jsonify, request
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client.dbStock

@app.route('/')
def home():
   return render_template('index.html')


@app.route('/codes')
def codes():
   group = request.args.get('group')
   res = db.codes.find({'group':group}, {'_id':False})
   print(res)

   return ""

@app.route('/base/codes')
def basecodes():
   codes = db.codes.find({}, {'_id':False,'code':False,'name':False})
   codes = codes.distinct('group')

   return jsonify({'codes':codes})




if __name__ == '__main__':
   app.run('0.0.0.0',port=5000,debug=True)