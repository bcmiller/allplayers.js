# To run this makefile, you must do the following.
#
# 1.)  Download http://closure-compiler.googlecode.com/files/compiler-latest.zip
#      and place compiler.jar within the tools directory.
#
# 2.)  Install closure-linter tool at by....
#
#        a.) Install easy_install by running...
#
#               sudo apt-get install python-setuptools
#
#        b.) Install the Google Closure linter tool by following...
#
#               http://code.google.com/closure/utilities/docs/linter_howto.html
#
# 3.)  Download the JSDoc toolkit found at
#      http://code.google.com/p/jsdoc-toolkit and place the jsdoc-toolkit
#      directory within the tools directory.
#

# Create the list of files
files =	src/allplayers.date.js\
	src/allplayers.event.js\
	src/allplayers.event.api.js\
	src/allplayers.group.js\
	src/allplayers.group.api.js\
	src/allplayers.location.js\
	src/allplayers.calendar.js

docfiles = drupal.api.js/src/drupal.api.js\
	drupal.api.js/src/drupal.system.js\
	drupal.api.js/src/drupal.system.api.js\
	drupal.api.js/src/drupal.entity.js\
	drupal.api.js/src/drupal.node.js\
	drupal.api.js/src/drupal.node.api.js\
	drupal.api.js/src/drupal.user.js\
	drupal.api.js/src/drupal.user.api.js\
	src/allplayers.date.js\
	src/allplayers.event.js\
	src/allplayers.event.api.js\
	src/allplayers.group.js\
	src/allplayers.group.api.js\
	src/allplayers.location.js\
	src/allplayers.calendar.js

.DEFAULT_GOAL := all

all: makecore jslint js jsdoc

makecore:
	cd drupal.api.js; make -B; cd ..;

# Perform a jsLint on all the files.
jslint: ${files}
	gjslint $^

# Create an aggregated js file and a compressed js file.
js: ${files}
	@echo "Generating aggregated bin/allplayers.js file"
	@cat > bin/allplayers.js $^
	@echo "Generating compressed bin/allplayers.compressed file"
	@java -jar tools/compiler.jar --js bin/allplayers.js --js_output_file bin/allplayers.compressed.js

# Create the documentation from source code.
jsdoc: ${docfiles}
	@echo "Generating documetation."
	@java -jar tools/jsdoc-toolkit/jsrun.jar tools/jsdoc-toolkit/app/run.js -a -t=tools/jsdoc-toolkit/templates/jsdoc -d=doc $^

# Fix the js style on all the files.
fixjsstyle: ${files}
	fixjsstyle $^

# Install the necessary tools.
tools:
	apt-get install python-setuptools
	apt-get install unzip
	wget http://closure-compiler.googlecode.com/files/compiler-latest.zip -P tools
	unzip tools/compiler-latest.zip -d tools
	rm tools/compiler-latest.zip tools/COPYING tools/README
	easy_install http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz
	wget http://jsdoc-toolkit.googlecode.com/files/jsdoc_toolkit-2.4.0.zip -P tools
	unzip tools/jsdoc_toolkit-2.4.0.zip -d tools
	mv tools/jsdoc_toolkit-2.4.0/jsdoc-toolkit tools/jsdoc-toolkit
	rm -rd tools/jsdoc_toolkit-2.4.0
	rm tools/jsdoc_toolkit-2.4.0.zip

# Install the necessary libraries
libraries:
	wget http://arshaw.com/fullcalendar/downloads/fullcalendar-1.5.2.zip -P libraries
	unzip libraries/fullcalendar-1.5.2.zip -d libraries
	sudo mv libraries/fullcalendar-1.5.2 libraries/fullcalendar
	sudo rm libraries/fullcalendar-1.5.2.zip