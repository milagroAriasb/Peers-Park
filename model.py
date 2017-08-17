"""Models and database functions for Peers @ Park project."""

from flask_sqlalchemy import SQLAlchemy

# This is the connection to the PostgreSQL database; we're getting
# this through the Flask-SQLAlchemy helper library. On this, we can
# find the `session` object, where we do most of our interactions
# (like committing, etc.)

db = SQLAlchemy()


#####################################################################
# Model definitions

class User(db.Model):
    """User of parks_checkin website."""

    __tablename__ = "users"

    user_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)

    first_name = db.Column(db.String(64), nullable=True)
    last_name = db.Column(db.String(64), nullable=True)
    email = db.Column(db.String(64), nullable=True)
    city = db.Column(db.String(15), nullable=True)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<User user_id=%s name =%s email=%s>" % (self.user_id, self.
                                               self.email)


class Kid(db.Model):
    """Kid on parks_checkin website."""

    __tablename__ = "kids"

    kid_id = db.Column(db.Integer,
                         autoincrement=True,
                         primary_key=True)
    name = db.Column(db.String(30))
    date_of_birth = db.Column(db.DateTime)
    gender = db.Column(db.String(10))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    #Define one to many relationship to user (one user can have many kids but each kid is related to only one user)
    user = db.relationship('User', backref='parks_checkin')

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<Kid Kid id=%s name=%s>" % (self.kid_id,
                                                 self.name)

class Checkin(db.Model):
    """Checking at a park by a user."""

    __tablename__ = "checkins"

    checkin_id = db.Column(db.Integer,
                          autoincrement=True,
                          primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    checking_date = db.Column(db.DateTime)
    arrival_time = db.Column(db.Integer)
    departure_time = db.Column(db.Integer)
    park_id = db.Column(db.Integer)


    #Define one to many relationship to user (one user can have many checkins but each checkin is related to only one user)
    user = db.relationship('User', backref='parks_checkin')


    def __repr__(self):
        """Provide helpful representation when printed."""
# ?????????????????????????Park ID integer need to change to %s? 
        s = "<Checkin checkin_id=%s checking_date=%s user_id=%s arrival_time=%s departure_time=%s> park_id=%s>"
        return s % (self.checkin_id, self.checking_date, self.user_id,
                    self.arrival_time, self.departure_time, self.park_id)

class Kid_checkin(db.Model):
    """Checking a specific kid at the park by a user."""

    __tablename__ = "kids_checkin"

    kid_checkin_id = db.Column(db.Integer,
                          autoincrement=True,
                          primary_key=True)
    checkin_id = db.Column(db.Integer, db.ForeignKey('checkins.checkin_id'))
    kid_id = db.Column(db.Integer, db.ForeignKey('kids.kid_id'))


    # Define relationship to check. Every checkin can have many many kid's checkins but each kid checkin is related on one checkin
    checkin = db.relationship('Checkin', backref='parks_checkin', order_by='checking_date')  
    
    #Define one to many relationship to kid (one kid can have many kid checkis but each kid checkin is related to only one kid)
    kid = db.relationship('Kid', backref='parks_checkin')
    

    def __repr__(self):
        """Provide helpful representation when printed."""

# Park ID integer need to change to %s? 
        s = "<Kid checkin checkin_id=%s checking_id=%s kid_id=%s >"
        return s % (self.checkin_id, self.checking_id, self.kid_id)




#####################################################################
# Helper functions

def connect_to_db(app):
    """Connect the database to our Flask app."""

    # Configure to use our PostgreSQL database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///parks'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)

 


if __name__ == "__main__":
    # As a convenience, if we run this module interactively, it will
    # leave you in a state of being able to work with the database
    # directly.

    from server import app
    connect_to_db(app)
    print "Connected to DB :)"
    db.create_all()
