#! /usr/bin/python
import os

HTML = ['.html', '.htm']
eternal_src = '~/Personal/eternallife/hourlyPrayers'
home_dir = os.path.expanduser(eternal_src)

html_files = [ f for f in os.listdir(home_dir) if (os.path.isfile(os.path.join(home_dir, f)) and (os.path.splitext(f)[1] in HTML))]
for file in html_files:
	file_ext = os.path.splitext(file)
	print file_ext

	with open(os.path.join(home_dir, file)) as file_content:
		print file_content.read()


