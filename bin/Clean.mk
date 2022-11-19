##  ------------------------------------------------------------------------  ##
##                                 Clean Environment                          ##
##  ------------------------------------------------------------------------  ##
THIS_FILE = $(lastword $(MAKEFILE_LIST))
# $(info $(DAT) [THIS_FILE:$(THIS_FILE)])

.PHONY: clean clean-all clean-full
.PHONY: clean-build clean-dist clean-deps clean-files

clean: clean-build clean-files ;
	@ echo "$(DAT) $(FINE): $(TARG)" ;

clean-all: clean clean-dist ;
	@ echo "$(DAT) $(FINE): $(TARG)" ;

clean-full: clean-build clean-deps clean-all;
	rm -rf dist-* ;
	rm -rf build-* ;
	@ echo "$(DAT) $(FINE): $(TARG)" ;

clean-build: ;
	@ echo -n "Clean: build \t ... " ;
	rm -rf ${DIR_BUILD} ;
	rm -f ./build ;
	@ echo "$(OKAY)" ;

clean-dist: ;
	@ echo -n "Clean: dist \t ... " ;
	rm -rf ${DIR_DIST} ;
	rm -f ./dist ;
	@ echo "$(OKAY)" ;

clean-deps: ;
	@ echo -n "Clean: deps \t ... " ;
	rm -rf 						\
		bower_modules/ 	\
		node_modules/ 	\
		./setup-deps		\
		./setup					\
	;
	@ echo "$(OKAY)" ;

clean-files: ;
	@ echo -n "Clean: files \t ... " ;
	rm -rf COMMIT							\
		bitbucket-pipelines.yml	\
		package-lock.json 			\
		_config.yml							\
		*.lock									\
		*.md										\
		*.log										\
		./deploy								\
		./video									\
	;
	@ echo "$(OKAY)" ;

clean-dev: clean-files clean-build clean-dist ;
	# @ echo -n "Clean: dev \t ... " ;
	# @ echo "$(OKAY)" ;
	@ echo "$(DAT) $(DONE): $(TARG)" ;

##  ------------------------------------------------------------------------  ##
