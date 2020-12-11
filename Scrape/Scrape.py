import os
import requests
from bs4 import BeautifulSoup as bs
import re

def html2text(node):
    if not hasattr(node, 'contents'):
        return node.replace('&nbsp;', ' ')
    if node.isSelfClosing:
        return ' '
    return ''.join([html2text(x) for x in node.contents])
def downloadPodcast(n,f):
  return
with requests.Session() as req:
  podnames = []
  podcasts = []
  r = requests.get("https://anchor.fm/s/a7a0d78/podcast/rss")
  xml = bs(r.content, "xml")
  #summary = soup.find_all("itunes:summary")
  for item in xml.find_all("item", text=False):
    for idx, child in enumerate(item.children):
      if (idx == 13):
        podcast = (str(child).split("url=\"")[1].split("\"/>")[0])
      if (idx == 15):
        filename = (str(child).split("&gt;")[1].split("&lt")[0].replace("&amp;", "&").replace("amp; "," ").replace("nbsp;", " "))
      downloadPodcast(filename, podcast)
  res = "\n".join("{} {}".format(x, y) for x, y in zip(podnames, podcasts))
  print(res)
    
  print("-------End-------")