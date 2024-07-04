from flask import Flask, render_template, request, flash
import pandas as pd

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Path to the Excel file
EXCEL_FILE = 'excelBE.xlsx'

# Read the Excel file into a Pandas DataFrame
df = pd.read_excel(EXCEL_FILE)

# Function to fetch salaries based on job title
def get_salaries(job_title):
    filtered_df = df[df['job title'].str.contains(job_title, case=False, na=False)]
    if not filtered_df.empty:
        salaries = filtered_df[['country', 'salary', 'currency']].values.tolist()
        return salaries
    else:
        return []

# Route for the main page
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        job_title = request.form['job_title']

        # Fetch salaries with countries
        salaries = get_salaries(job_title)

        if not salaries:
            flash('No data found for the given job title.', 'warning')

        return render_template('salary_search.html', salaries=salaries, job_title=job_title)

    return render_template('salary_search.html')

if __name__ == '__main__':
    app.run(debug=True)
