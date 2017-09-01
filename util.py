from datetime import datetime
from model import Checkin
from sqlalchemy import or_, and_


def format_string_time(time_str):
    return datetime.strptime(time_str, '%H:%M').time()

def format_string_date(date_str):

    return datetime.strptime(date_str, '%Y-%m-%d').date() 

def find_checkins(d,at,dt,selected_park_id):

    return Checkin.query.filter( 
                    Checkin.checkin_date == d,
                    Checkin.park_id == selected_park_id,
                    or_(and_(Checkin.departure_time >= dt, 
                             Checkin.arrival_time<=dt, 
                             Checkin.arrival_time >= at),
                        and_(Checkin.departure_time <= dt,
                             Checkin.departure_time >= at,
                             Checkin.arrival_time <= at),
                        and_(Checkin.departure_time <= dt,
                             Checkin.departure_time > Checkin.arrival_time,
                             Checkin.arrival_time >= at),
                        and_(Checkin.departure_time>= dt, 
                             dt > at,
                             Checkin.arrival_time <= at)
                        )).all()
