import pandas as pd
import time
import json
#from requests import Session
import urllib
import re
import math
import geocode

with open('uk_towns_and_cities.txt') as data_file:    
    read_data = data_file.read()
towns_and_cities=[re.sub(r'\(.+?\)\s*', '', x) for x in read_data.split("\n") if len(x) > 0]

with open('countries.txt') as f:    
    countries = f.read()
countries = [z.replace(" {Republic}", "") for z in countries.split("\n")]


def __add_to_dict_if_not_in(dictionary, word):
	if (len(dictionary) == 0) or (word not in dictionary.keys()):
		dictionary[word] = 1
	else:
		dictionary[word] += 1

	return dictionary


def extract_location(json_records):
	dictionary = {}
	for article in json_records:
		most_affected_places = {}
		dictionary[article["title"]] = []
		content = article["content"].replace(".", "").replace(",", "").split(" ") + article["title"].split(" ")
		caps = [i for i in content if i.istitle()]
		# ****** *******
		for word in caps:
			index_of_word = caps.index(word)
			if caps[index_of_word - 1] + " " + word in article:
				word = caps[index_of_word - 1] + " " + word 
			elif word + " " + caps[index_of_word + 1]  in article:
				word = caps[index_of_word - 1] + " " + word 
			# ****** *******
			if word in towns_and_cities:
				if word in towns_and_cities: 
					most_affected_places = __add_to_dict_if_not_in(most_affected_places, word)

			elif word in countries:
				if word in most_affected_places:
					most_affected_places = __add_to_dict_if_not_in(most_affected_places, word)

		list_of_lists  = [[k, most_affected_places[k]] for k in most_affected_places]
		
		list_of_lists = sorted(list_of_lists, key = lambda x: (-x[1]))
		dictionary[article["title"]] = [x[0] for x in list_of_lists]
	
	return dictionary


with open('1275_guardian.json') as data_file:    
    data = json.load(data_file)

flood_articles = []
flood_words = ["flood"]

for article in data:
	title = article["title"]
	if "flood" in title:
		flood_articles.append(article)

test = extract_location(flood_articles)

test = ['Cardiff', 'Broadway', 'York', 'Walton', 'Eagle', 'Bridlington', 
'Mytholmroyd', 'Whitby', 'Plymouth', 'Leeds', 'Dartmouth', 'London', 
'Doncaster', 'Law', 'Scarborough',
'Sandy', 'California', 'Read', 'Sheffield', 
,'Read', 'Lancaster', 'Houston', 'York', 'Oxford', 'Keith',
 'Westminster', 'Read', 'Water', 'Leeds', 'Cardiff', 'Manchester', 
 'Street', 'Sandy']

locations = []

place_names = []

for i in test:
	places = test[i]
	for place in places:
		place_names.append(place)
		lat_lng = geocode.geocode(place)
		if lat_lng != False:
			locations.append(lat_lng)

print(locations)




['Cardiff', 'Broadway', 'York', 'Walton', 'Eagle', 'Bridlington', 
'Mytholmroyd', 'Whitby', 'Plymouth', 'Leeds', 'Dartmouth', 'London', 
'Doncaster', 'Law', 'Scarborough',
'Sandy', 'California', 'Read', 'Sheffield', 
,'Read', 'Lancaster', 'Houston', 'York', 'Oxford', 'Keith',
 'Westminster', 'Read', 'Water', 'Leeds', 'Cardiff', 'Manchester', 
 'Street', 'Sandy']






place_names = {
	'Cardiff': 341000,
	'Broadway': 2540,
	'York': 198051,
	'Walton': 22834, 
	'Eagle': 21646, 
	'Bridlington': 33837, 
	'Mytholmroyd': 3949, 
	'Whitby': 13213,
	'Plymouth', 
	'Leeds', 
	'Dartmouth', 
	'London',


}





