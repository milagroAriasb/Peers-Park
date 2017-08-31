from datetime import datetime

def format_string_time(time_str):
    return datetime.strptime(time_str, '%H:%M').time()

def format_string_date(date_str):

    return datetime.strptime(date_str, '%Y-%m-%d').date() 