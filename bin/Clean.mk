##  ------------------------------------------------------------------------  ##
##                                 Clean Environment                          ##
##  ------------------------------------------------------------------------  ##

THIS_FILE = $(lastword $(MAKEFILE_LIST))
# $(info $(DAT) [THIS_FILE:$(THIS_FILE)])

.PHONY: clean clean-all clean-full
.PHONY: clean-build clean-dist clean-files clean-deps

clean: clean-build clean-files ;
	@ echo "$(DAT) $(FINE): $(TARG)" ;

clean-all: clean clean-dist ;
	@ echo "$(DAT) $(FINE): $(TARG)" ;

clean-full: clean-all clean-build clean-deps ;
	rm -rf build-* ;
	rm -rf web-* ;
	@ echo "$(DAT) $(FINE): $(TARG)" ;

clean-build: ;
	@ echo -n "Clean: build \t ... ";
	rm -rf ${DIR_BUILD} ;
	rm -f build ;
	@ echo "$(OKAY)" ;

clean-dist: ;
	@ echo -n "Clean: dist \t ... ";
	rm -rf ${DIR_DIST} ;
	rm -f dist ;
	@ echo "$(OKAY)" ;

clean-deps: ;
	@ echo -n "Clean: deps \t ... ";
	rm -rf 							\
		bower_modules/ 		\
		node_modules/ 		\
		package-lock.json \
		setup-deps				\
		setup ;
	@ echo "$(OKAY)" ;

clean-files: ;
	@ echo -n "Clean: files \t ... ";
	rm -rf COMMIT								\
		bitbucket-pipelines.yml		\
		codeclimate-config.patch	\
		_config.yml								\
		yarn.lock									\
		*.md											\
		*.log											\
		deploy ;
	@ echo "$(OKAY)" ;

clean-dev: clean-files clean-build clean-dist ;
	@ echo "$(DAT) $(DONE): $(TARG)" ;

##  ------------------------------------------------------------------------  ##
