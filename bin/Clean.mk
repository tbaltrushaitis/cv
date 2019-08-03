##  ------------------------------------------------------------------------  ##
##                                 Clean Environment                          ##
##  ------------------------------------------------------------------------  ##

THIS_FILE = $(lastword $(MAKEFILE_LIST))
$(info [THIS_FILE:$(THIS_FILE)])

include bin/.bash_colors

.PHONY: clean clean-all clean-full
.PHONY: clean-build clean-dist clean-files clean-deps

clean: clean-build clean-files
	@ echo -n "Clean \t ... ";
	@ echo [${White}OK${NC}];

clean-all: clean clean-dist
	@ echo -n "Clean: all \t ... ";
	@ echo [${White}OK${NC}];

clean-full: clean-all clean-deps
	@ echo -n "Clean: full \t ... ";
	@ rm -rf build-* ;
	@ echo [${White}OK${NC}];

clean-build:
	@ echo -n "Clean: build \t ... ";
	@ rm -rf ${DIR_BUILD} ;
	@ echo [${White}OK${NC}];

clean-dist:
	@ echo -n "Clean: dist \t ... ";
	@ rm -rf ${DIR_DIST} ;
	@ echo [${White}OK${NC}];

clean-deps:
	@ echo -n "Clean: deps \t ... ";
	@ rm -rf \
		bower_modules/ \
		node_modules/ \
		package-lock.json \
		setup-deps \
		setup ;
	@ echo [${White}OK${NC}];

clean-files:
	@ echo -n "Clean: files \t ... ";
	@ rm -rf COMMIT \
		.bowerrc \
		.npmrc \
		bitbucket-pipelines.yml \
		codeclimate-config.patch \
		_config.yml \
		yarn.lock \
		*.md \
		*.log ;
	@ echo [${White}OK${NC}];

clean-dev: clean-deps clean-files clean-build clean-dist
	@ echo -n "Clean: dev \t ... ";
	@ echo [${White}OK${NC}];

##  ------------------------------------------------------------------------  ##
