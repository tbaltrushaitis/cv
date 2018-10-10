##  ------------------------------------------------------------------------  ##
##                                 Clean Environment                          ##
##  ------------------------------------------------------------------------  ##

.PHONY: clean clean-all
.PHONY: clean-repo clean-deps
.PHONY: clean-build clean-dist clean-files

clean-all: clean clean-dist

clean: clean-build clean-files

clean-repo:
	@ ${RM} -rf ${APP_NAME}

clean-build:
	@ rm -rf ${DIR_BUILD}

clean-dist:
	@ rm -rf ${DIR_DIST}

clean-deps:
	@ rm -rf \
		bower_modules/ \
		node_modules/ ;

clean-files:
	@ rm -rf COMMIT \
		package-lock.json \
		bitbucket-pipelines.yml \
		codeclimate-config.patch \
		_config.yml ;

##  ------------------------------------------------------------------------  ##
