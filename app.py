from flask import Flask, render_template, request, jsonify
import pandas as pd
from thefuzz import process
from currency_converter import CurrencyConverter

app = Flask(__name__)

EXCEL_FILE = 'excelBE.xlsx'
df = pd.read_excel(EXCEL_FILE)
c = CurrencyConverter()

def get_salaries(job_title):
    choices = df['job title'].tolist()
    matches = process.extract(job_title, choices)  # Extract all matches without score_cutoff
    
    # Filter matches by a reasonable score threshold
    threshold = 60
    filtered_matches = [match for match in matches if match[1] >= threshold]
    
    corrected_job_titles = [match[0] for match in filtered_matches]
    salaries = []

    for title in corrected_job_titles:
        filtered_df = df[df['job title'] == title]
        for index, row in filtered_df.iterrows():
            salary = row['salary']
            currency = row['currency']
            if currency != 'EUR':
                salary = c.convert(salary, currency, 'EUR')
            salaries.append([row['country'], round(salary, 2), 'EUR'])
    
    return corrected_job_titles, salaries

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    job_title = request.form['job_title']
    corrected_job_titles, salaries = get_salaries(job_title)
    return jsonify({'corrected_job_titles': corrected_job_titles, 'salaries': salaries})

if __name__ == '__main__':
    app.run(debug=True)
