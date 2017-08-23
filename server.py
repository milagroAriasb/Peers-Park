"""Peers @ Park"""

# from jinja2 import StrictUndefined
from model import User, Kid, Checkin, Kid_checkin, db, connect_to_db 

from flask import Flask, render_template, request, flash, redirect, session, jsonify

from flask_debugtoolbar import DebugToolbarExtension

from datetime import datetime


app = Flask(__name__)
app.secret_key = "ABC"


@app.route('/')
def index():
    """Homepage."""

    return render_template("home.html")


@app.route('/login')
def login():
    """login."""

    return render_template("facebook.html")

@app.route('/logout')
def logout():
    """Log out."""

    del session["user_id"]
    flash("Logged Out.")
    
    return redirect("/")
    #return render_template("home.html")



@app.route('/add_user', methods=["POST"])
def add_user():
    """getting user data from facebook API"""

    # get data from login/facebook template
    user_name = request.form.get("name")
    user_email = request.form.get("email")
    user_location = request.form.get("location")
    
    # create a new user
    new_user = User(name=user_name, email=user_email, location=user_location)

    db.session.add(new_user)
    db.session.commit()
    
    # Add session to user 
    session["user_id"] = new_user.user_id
    return (user_email + ' added')

@app.route('/add_checkin')
def add_checkin():
    """nnn"""

# get a list of kid objects to make checkbox
    kids= db.session.query(Kid).filter_by(user_id=session['user_id']).all()

# render checkin template and send the kid objects
    return render_template("checkin.html", kids=kids)


@app.route('/add_checkin', methods=["POST"])
def add_checkin_db():
    """creating a checkin in the db"""

    # Get form variables from checking.html
    checkin_date = request.form["date"]
    checkin_arrival_time = request.form["arrival-time"]
    checkin_departure_time= request.form["departure-time"]
    checkin_park_id = request.form["park-id"]
    checkin_kids_id = request.form.getlist("kids")
    print checkin_kids_id
    for kid in checkin_kids_id:
        print kid
    # print '/\n\n\n\n\n\n\n\n\n##############DATA FROM FORM###########################\n\n\n\n\n\n\n\n\n'
    # print checkin_date
    # print checkin_arrival_time
    # print checkin_departure_time
    # print checkin_park_id
    # print checkin_kids_id

    
    #convert string into datetime 
    # date_time_date = datetime.strptime(checkin_date, '%Y-%m-%d')
    # date_time_checkin_arrival_time = datetime.strptime(checkin_arrival_time, '%H:%M')
    # date_time_checkin_departure_time = datetime.strptime(checkin_departure_time, '%H:%M')
    

    # print '/######################################### after datetime.strptime\n\n\n\n\n\n\n\n\n'
    # print date_time_date
    # # print date_time_checkin_arrival_time
    # print date_time_checkin_departure_time

    # create a new checkin
    new_checkin = Checkin(user_id=session["user_id"], 
                        checkin_date=checkin_date, 
                        arrival_time=checkin_arrival_time, 
                        departure_time=checkin_departure_time, 
                        park_id=checkin_park_id,)

    db.session.add(new_checkin)
    db.session.commit()
    
    print '/\n\n\n\n\n\n\n\n\n######################################### for kids checkin \n\n\n\n\n\n\n\n\n'

    # # db.session.query(Checkin.checkin_id).filter_by(max(checkin_id))
    # print last_key
    # print new_checkin.user_id
    # print new_checkin.arrival_time
    # print new_checkin.park_id
    print checkin_kids_id
    print new_checkin.checkin_id

    for kid_id in checkin_kids_id:
        new_kid_checkin = Kid_checkin(checkin_id=new_checkin.checkin_id, 
                                  kid_id=kid_id)
        db.session.add(new_kid_checkin)
    db.session.commit()
       
    return redirect("/")

@app.route('/selectedPark')
def selected_park():
    """Click on one park on the map."""

    return render_template("selected_park.html")

@app.route('/selectedPark/park.json')
def get_park_data():
    date = request.args.get('date')
    start_time_to_check = request.args.get('start_time_to_check')
    end_time_to_check = request.args.get('end_time_to_check')
    selected_park_id = request.args.get('selected_park_id')
    

    results = {"checkins":["bar"]}
    return jsonify(results)


@app.route('/see_near_by_parks')
def near_parks():
    """Click on one park on the map."""

    return render_template("see_near_by_parks.html")


@app.route('/add_kid')
def add_kid():
    """Click on one park on the map."""

    return render_template("add_kid.html")


@app.route('/add_kid', methods=['POST'])
def add_kid_db():
    """Process registration."""

    # Get form variables
    kid_name = request.form["name"]
    kid_date_of_birth = request.form["date_of_birth"]
    kid_gender = request.form["gender"]
    
    # print '*****************/\n\n\n\n\n\n\n\n\n\n'
    # print session["user_id"]

    new_kid = Kid(name=kid_name, gender=kid_gender, date_of_birth=kid_date_of_birth, user_id=session["user_id"])

    db.session.add(new_kid)
    db.session.commit()

    flash("kid %s added." % kid_name)
    
    return redirect("/")


if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the point
    # that we invoke the DebugToolbarExtension

    # Do not debug for demo
    app.debug = True
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(host="0.0.0.0")
