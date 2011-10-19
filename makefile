# To run this makefile, you must do the following.
#
# 1.)  Download http://closure-compiler.googlecode.com/files/compiler-latest.zip
#      and place compiler.jar within the tools directory.
#
# 2.)  Install closure-linter tool at by following
#      http://code.google.com/closure/utilities/docs/linter_howto.html
#
# 3.)  Download the JSDoc toolkit found at
#      http://code.google.com/p/jsdoc-toolkit and place the jsdoc-toolkit
#      directory within the tools directory.

# Create the list of files
files =	js/source/allplayers.base.js\
	js/source/allplayers.api.js\
	js/source/allplayers.entity.js\
	js/source/allplayers.date.js\
	js/source/allplayers.event.js\
	js/source/allplayers.group.js\
	js/source/allplayers.groups.js\
	js/source/allplayers.location.js\
	js/source/allplayers.calendar.js

.DEFAULT_GOAL := all

all: jslint js jsdoc

# Perform a jsLint on all the files.
jslint: ${files}
	gjslint $^

# Create an aggregated js file and a compressed js file.
js: ${files}
	@echo "Generating aggregated js/allplayers.js file"
	@cat > js/allplayers.js $^
	@echo "Generating compressed js/allplayers.compressed file"
	@java -jar tools/compiler.jar --js js/allplayers.js --js_output_file js/allplayers.compressed.js

# Create the documentation from source code.
jsdoc: ${files}
	@echo "Generating documetation."
	@java -jar tools/jsdoc-toolkit/jsrun.jar tools/jsdoc-toolkit/app/run.js -a -t=tools/jsdoc-toolkit/templates/jsdoc -d=doc $^

# Fix the js style on all the files.
fixjsstyle: ${files}
	fixjsstyle $^
