from flask import Flask, render_template, request, jsonify, flash
import pandas as pd
from fuzzywuzzy import process

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

EXCEL_FILE = 'excelBE.xlsx'
df = pd.read_excel(EXCEL_FILE)

def get_salaries(job_title):
    choices = df['job title'].tolist()
    best_match = process.extractOne(job_title, choices, score_cutoff=60)
    if best_match:
        corrected_job_title = best_match[0]
        filtered_df = df[df['job title'] == corrected_job_title]
        salaries = filtered_df[['country', 'salary', 'currency']].values.tolist()
        return corrected_job_title, salaries
    else:
        return job_title, []

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('salary_search.html')

@app.route('/search', methods=['POST'])
def search():
    job_title = request.form['job_title']
    corrected_job_title, salaries = get_salaries(job_title)
    return jsonify({'corrected_job_title': corrected_job_title, 'salaries': salaries})

if __name__ == '__main__':
    app.run(debug=True)
