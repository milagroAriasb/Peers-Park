"""Peers @ Park"""

# from jinja2 import StrictUndefined
from model import User, db, connect_to_db 

from flask import Flask, render_template, request, flash, redirect, session

from flask_debugtoolbar import DebugToolbarExtension


app = Flask(__name__)
app.secret_key = "ABC"


@app.route('/')
def index():
    """Homepage."""

    return render_template("home.html")

# @app.route('/fb_callback')
# def fb_callback():
#     """Homepage."""

#     print request.


@app.route('/login')
def login():
    """login."""

    return render_template("facebook.html")

@app.route('/selectedPark')
def selected_park():
    """Click on one park on the map."""

    return render_template("selected_park.html")

@app.route('/see_near_by_parks')
def near_parks():
    """Click on one park on the map."""

    return render_template("see_near_by_parks.html")

@app.route('/add_kid')
def add_kid():
    """Click on one park on the map."""

    return render_template("add_kid.html")

@app.route('/add_user', methods=["POST"])
def add_user():
    """getting user data from facebook API"""
    user_name = request.form.get("name")
    user_email = request.form.get("email")
    user_location = request.form.get("location")

    
    print user_name
    print user_email
    print  user_location
    






if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the point
    # that we invoke the DebugToolbarExtension

    # Do not debug for demo
    app.debug = True
    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(host="0.0.0.0")
