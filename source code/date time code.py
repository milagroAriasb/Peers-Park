<!-- # html    
# <div id="datepicker">
#     <h1>What day and time will you arrive?</h1>
#     <p>Date: <input type="date" name='date' ></p>
#      <p>Time: <input type="time" name="arrival_time"></p>
#     <!-- <input type="text" id="time" class="form-control" data-format="HH:mm" data-template="HH : mm" name="arrival_time"> -->
#   </div>

 -->


@app.route('/map', methods=['POST'])
def driving_map():
    time_input = request.form.get('arrival_time')
    date_input = request.form.get('date')
    date_time = date_input + "|" + time_input
    print '\n\n*** LOOOOOOKKK****\n\n'
    print datetime.strptime(date_time, '%Y-%m-%d|%H:%M')
    
    start_address=request.form.get("originInput")
    payload = {'key': 'AIzaSyA5tDzhP-TkpUOI4dOZzkATen2OUCPasf4', 'address': start_address}
    info = requests.get('https://maps.googleapis.com/maps/api/geocode/json', params=payload)
    
    end_address=request.form.get("destinationInput")
    payload_2 = {'key': 'AIzaSyA5tDzhP-TkpUOI4dOZzkATen2OUCPasf4', 'address': end_address}
    info_2 = requests.get('https://maps.googleapis.com/maps/api/geocode/json', params=payload_2)

    time_input = request.form.get('arrival_time')
    # arrival_time = datetime.strptime(time_input, '%I:%M %p')
    num_seats=int(request.form.get('num_seats'))
    
    
    start_address = extract_data_fordb(info)
    end_address = extract_data_fordb(info_2)
    # create_drivingroute(start_address, end_address, arrival_time, num_seats)
    return redirect("/thank_you")

def extract_data_fordb(data):
    
    binary = data.content
    output = json.loads(binary)

    app.logger.debug(json.dumps(output, indent=4))

    results = output['results'][0]
    latitude = results['geometry']['location']['lat']
    longitude = results['geometry']['location']['lng']
    street_number = None
    street_name = None
    city = None
    state = None
    zip_code = None

    for address_components in results['address_components']:
        
        if address_components['types'][0]=='street_number':
            street_number=address_components['short_name']
        if address_components['types'][0]=='route':
            street_name=address_components['short_name']
        if address_components['types'][0]=='locality':
            city=address_components['short_name']
        if address_components['types'][0]=="administrative_area_level_1":
            state=address_components['short_name']
        if address_components['types'][0]=="postal_code":
            zip_code=address_components['short_name']

    street_address = "{num} {name}".format(num=street_number, name=street_name)

    address = Address.query.filter_by(street_address=street_address, 
                                      city=city, 
                                      state=state, 
                                      zip_code=zip_code).first()

    if not address:
        address = Address(street_address=street_address, 
                          city=city,
                          state=state,
                          zip_code=zip_code,
                          latitude=latitude,
                          longitude=longitude,
                          name_of_place=None)
    
    
        db.session.add(address)
        db.session.commit()
    return address