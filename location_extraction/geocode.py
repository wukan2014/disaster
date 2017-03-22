import urllib, json
import urllib.request

import codecs

not_a_place = ["floor", "establishment", "point_of_interest", "parking"]

def geocode(location):
	print(location)
	url = "http://maps.googleapis.com/maps/api/geocode/json?address="+ location 
	response = urllib.request.urlopen(url)
	reader = codecs.getreader("utf-8")
	answer = json.load(reader(response))["results"]


	if len(answer) > 0:
		types = answer[0]["types"]
		for i in types:
			if i in not_a_place:
				return False
		return answer[0]["geometry"]["location"]
	else: 
		return False

