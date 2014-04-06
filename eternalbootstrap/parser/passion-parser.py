import os
import re
from bs4 import BeautifulSoup

HTML = ['.html', '.htm']
eternal_src = '~/Personal/eternallife/hourlyPrayers'
template_src = '~/Personal/eternalbootstrap/eternalbootstrap/parser'
home_dir = os.path.expanduser(eternal_src)
template_dir = os.path.expanduser(template_src)
template = open(os.path.join(template_dir, 'template')).read()


def get_title_and_time(soup):
	title = soup.find('td', 'title')
	content = title.text.split('-')
	return content[0].strip(), content[1].strip()


def get_prayer(soup):
	prayer = soup.find('td', 'prayer')
	return prayer.text.strip()


def get_fruit(soup):
	prayer = soup.find('td', 'fruit')
	return prayer.text.strip()


def get_image_url_and_alt(soup):
	img = soup.find('img')
	return img['src'].strip(), img['alt'].strip()


slide_list = []
html_files = sorted([ f for f in os.listdir(home_dir) if (os.path.isfile(os.path.join(home_dir, f)) and (os.path.splitext(f)[1] in HTML))])

for file in html_files:
	file_ext = os.path.splitext(file)
	
	with open(os.path.join(home_dir, file)) as file_content:
		soup = BeautifulSoup(file_content.read())
		title, time = get_title_and_time(soup)
		prayer = get_prayer(soup)	
		fruit = get_fruit(soup)
		image_url, image_alt = get_image_url_and_alt(soup)
		slide_list.append(template.format(title=title, time=time, prayer=prayer, fruit=fruit, img_url=image_url, img_alt=image_alt))
		slide_list.append('\n')

with open(os.path.join(template_dir, 'slides.html'), 'w+') as slides_html:
	slides_html.write(''.join(slide_list))

