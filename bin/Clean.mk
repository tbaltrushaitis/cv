##  ------------------------------------------------------------------------  ##
##                                 Clean Environment                          ##
##  ------------------------------------------------------------------------  ##

.PHONY: clean clean-all
.PHONY: clean-deps
.PHONY: clean-build clean-dist clean-files

clean-all: clean clean-dist
	@ echo "Done: Clean all";

clean: clean-build clean-files
	@ echo "Done: Clean";

clean-build:
	@ echo "Cleaning build ... ";
	@ rm -rf ${DIR_BUILD}

clean-dist:
	@ echo "Cleaning distro ... ";
	@ rm -rf ${DIR_DIST}

clean-deps:
	@ echo "Cleaning deps ... ";
	@ rm -rf \
		bower_modules/ \
		node_modules/ ;

clean-files:
	@ echo "Cleaning files ... ";
	@ rm -rf COMMIT \
		*.md \
		bitbucket-pipelines.yml \
		codeclimate-config.patch \
		_config.yml \
		package-lock.json \
		yarn.lock \
		yarn-error.log ;

##  ------------------------------------------------------------------------  ##
