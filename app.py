from flask import Flask, render_template, jsonify, request
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client.dbStock

import requests
from bs4 import BeautifulSoup

@app.route('/')
def home():
   return render_template('index.html')

@app.route('/codes')
def codes():
   group = request.args.get('group')
   res = list(db.codes.find({'group':group}, {'_id':False}))

   return jsonify(res)

#==분류 코드 가져오기==#
@app.route('/base/codes')
def basecodes():
   codes = list(db.codes.find({}).distinct('group'))

   return jsonify(codes)

@app.route('/stock', methods = ['POST'])
def save_info():
   info = request.json

   market = info['market']
   sector = info['sector']
   tag = info['tag']

   code = list(db.stocks.find({"market":market, "sector":sector, "tag":tag}, {'_id':0, "market":0, "sector":0, "tag":0}))

   return jsonify(code)

@app.route('/stock', methods=['GET'])
def get_info():
    code = request.args.get('code')
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}

    data = requests.get('https://finance.naver.com/item/main.nhn?code=' + code, headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')
    amount = soup.select_one('#_market_sum').text
    amount = amount.replace('\n', '')
    amount = amount.replace('\t', '')
    if soup.select_one('#_per') is None:
        per = 'N/A'
    else:
        per = soup.select_one('#_per').text
    price = soup.select_one(
        '#content > div.section.trade_compare > table > tbody > tr:nth-child(1) > td:nth-child(2)').text

    print(amount, per, price)

    return jsonify({'amount': amount, 'per': per, 'price': price})


if __name__ == '__main__':
   app.run('0.0.0.0',port=5000,debug=True)