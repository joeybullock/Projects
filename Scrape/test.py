from mp3_tagger import MP3File, VERSION_1, VERSION_2, VERSION_BOTH
import os

path = "mp3/"
mp3s = os.listdir(path)
idx = 1
for mp3 in mp3s:
  if (str(mp3).find(".mp3") > -1):

    idx = idx + 1
    print(idx)
  else:
    print(str(mp3) + " not an mp3, skipping...")