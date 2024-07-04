from flask import Flask, render_template, request, jsonify, flash
import pandas as pd

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

EXCEL_FILE = 'excelBE.xlsx'
df = pd.read_excel(EXCEL_FILE)

def get_salaries(job_title):
    filtered_df = df[df['job title'].str.contains(job_title, case=False, na=False)]
    if not filtered_df.empty:
        salaries = filtered_df[['country', 'salary', 'currency']].values.tolist()
        return salaries
    else:
        return []

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('salary_search.html')

@app.route('/search', methods=['POST'])
def search():
    job_title = request.form['job_title']
    salaries = get_salaries(job_title)
    return jsonify(salaries)

if __name__ == '__main__':
    app.run(debug=True)
