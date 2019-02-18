##  ------------------------------------------------------------------------  ##
##                                 Clean Environment                          ##
##  ------------------------------------------------------------------------  ##

include bin/.bash_colors

.PHONY: clean clean-all clean-full
.PHONY: clean-build clean-dist clean-files clean-deps

clean: clean-build clean-files
	@ echo [${BYellow}${On_Blue}COMPLETED${NC}] Clean;

clean-all: clean clean-dist
	@ echo [${BYellow}${On_Blue}COMPLETED${NC}] Clean ALL;

clean-full: clean-all clean-deps
	@ echo [${BYellow}${On_Blue}COMPLETED${NC}] Clean FULL;

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
		node_modules/ ;
	@ echo [${White}OK${NC}];

clean-files:
	@ echo -n "Clean: files \t ... ";
	@ rm -rf BUILD-* \
		COMMIT \
		*.md \
		package-lock.json \
		.bowerrc \
		.npmrc \
		bitbucket-pipelines.yml \
		codeclimate-config.patch \
		_config.yml \
		yarn.lock \
		yarn-error.log ;
	@ echo [${White}OK${NC}];

##  ------------------------------------------------------------------------  ##
