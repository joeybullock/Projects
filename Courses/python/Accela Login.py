import time
import pyautogui
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select

####  START CHROME WEBDRIVER  ####
driver = webdriver.Chrome('C:\Python\selenium\webdriver\Chrome\chromedriver.exe')
driver.get('https://avsupp3.accela.com')

####  LOGIN SCREEN  ####
time.sleep(10)

driver.switch_to.frame(1)

servprovcode_box = driver.find_element_by_id("servProvCode")
servprovcode_box.send_keys('ATLANTA_GA')
pyautogui.press('tab')

user_box = driver.find_element_by_name("username")
user_box.send_keys('jbullock')

pass_box = driver.find_element_by_name("password")
pass_box.send_keys('Springt1me18')

pass_box.send_keys(Keys.RETURN)
time.sleep(20)

####  START NEW PERMIT  ####
xPath = "/html/body/section/nav/div[1]/ul/li[3]/div/div/div[1]/header/div[2]/a/[@class='icon.icon-new']"
four_square = driver.find_element_by_xpath(xPath)
four_square.click()