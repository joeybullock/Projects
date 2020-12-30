from mp3_tagger import MP3File, VERSION_1, VERSION_2, VERSION_BOTH
import os

path = "mp3/"
mp3s = os.listdir(path)
a = 1
for index, mp3 in enumerate(mp3s):
  if (str(mp3).find(".mp3") > -1):
    print(mp3)
    eachMp3 = MP3File("mp3/" + mp3)
    eachMp3.set_version(VERSION_BOTH)
    newComment = str(mp3).split("with Art Bell - ")[1].split(".mp3")[0]
    print(newComment)
    eachMp3.band = str(newComment)
    print(a)
    thisTrack = a
    eachMp3.track = str(thisTrack)
    eachMp3.save()
    a = a + 1
    if index < 887:
      nextFilesYear = MP3File("mp3/"+mp3s[index + 1])
      if str(nextFilesYear.year) != str(eachMp3.year):
        a = 1
  else:
    print(str(mp3) + " not an mp3, skipping...")