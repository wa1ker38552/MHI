from flask import render_template
from flask import request
from flask import Flask
import json

database = json.loads(open('database.json', 'r').read())
rd = json.loads(open('p.json', 'r').read())

recommendation_data = [database[i] for i in rd['recommended']]
trending_data = [database[i] for i in rd['trending']]
latest_data = [database[i] for i in rd['latest']]


app = Flask(__name__)

@app.route('/')
def app_index():
    return render_template('index.html')

@app.route('/explore')
def app_explore():
    return render_template('explore.html')

@app.route('/library')
def app_library():
    return render_template('library.html')


@app.route('/api/get-recommended')
def api_get_recommended():
    return recommendation_data

@app.route('/api/get-trending')
def api_get_trending():
    return trending_data

@app.route('/api/get-latest')
def api_get_latest():
    return latest_data

@app.route('/api/get-all')
def api_get_all():
    return [database[key] for key in database]

@app.route('/api/get/<id>')
def api_get_id(id):
    if id in database:
        return database[id]
    return None

app.run()