from mp3_tagger import MP3File, VERSION_BOTH
import os

path = "mp3/"
mp3s = os.listdir(path)
coast = 0
dreamland = 0
darkmatter = 0
neither = 0
for mp3 in mp3s:
  if (str(mp3).find(".mp3") > -1):
    print(mp3)
    eachMp3 = MP3File("mp3/" + mp3)
    print("Copying artist tag to comment tag: " + str(eachMp3.artist) + " --> " + str(eachMp3.comment))
    artist = str(eachMp3.artist)
    eachMp3.comment = artist
    print("Replacing artist with Art Bell")
    if str(mp3).find("Coast to") > -1:
      coast = coast + 1
      eachMp3.artist = "Art Bell"
    elif str(mp3).find("Dreamland") > -1:
      dreamland = dreamland + 1
      eachMp3.artist = "Art Bell"
    elif str(mp3).find("Dark Matter") > -1:
      darkmatter = darkmatter + 1
      eachMp3.artist = "Art Bell"
    else:
      neither = neither + 1
    eachMp3.save()
  else:
    print(str(mp3) + " not an mp3, skipping...")
print("Coast to Coast: " + str(coast))
print("Dreamland: " + str(dreamland))
print("Dark Matter: " + str(darkmatter))
print("Neither: " + str(neither))