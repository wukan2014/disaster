import pandas as pd
import time
import json
#from requests import Session
import urllib
import geocode
import re
import math

with open('uk_towns_and_cities.txt') as data_file:    
    read_data = data_file.read()
towns_and_cities=[re.sub(r'\(.+?\)\s*', '', x) for x in read_data.split("\n") if len(x) > 0]

with open('countries.txt') as f:    
    countries = f.read()
countries = [z.replace(" {Republic}", "") for z in countries.split("\n")]

def extract_location(json_records):
	for article in flood_articles:
		print(article["title"])
		

