from flask import Flask, render_template, redirect
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
import js2py # module crashing
import cgi
[] , jsFile =   ("backend/index.js")

app = Flask(__name__)

app.config['SECRET_KEY'] = 'C2HWGVoMGfNTBsrYQg8EcMrdTimkZfAb'

Bootstrap(app)


class NameForm(FlaskForm):
    name = StringField('Enter a Twitter User', validators=[DataRequired()])
    submit = SubmitField('Submit')

@app.route('/', methods=['GET', 'POST'])
def index():
    form = NameForm()
    message = ""
    if form.validate_on_submit():
        name = form.name.data
        jsFile.searchForTweets(name)
        sentiment_score = jsFile.sentimentScores
        botometer_score = jsFile.botScore
        print (sentiment_score[1])
        print (botometer_score)



    return render_template('index.html', names=name, form=form, message=message)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True)