import os
import requests
from bs4 import BeautifulSoup as bs
import re

podlist = []
r = requests.get("https://anchor.fm/s/a7a0d78/podcast/rss")
soup = bs(r.content, features="html.parser")
#summary = soup.find_all("itunes:summary")
summary = soup.find_all("item" "enclosure")
for s in summary:
  string = s.string
  print(string[3:-5].replace("&nbsp;","").replace("&amp;","&"))

print("-------End-------")