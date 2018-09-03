##  ------------------------------------------------------------------------  ##
##                                 Clean Environment                          ##
##  ------------------------------------------------------------------------  ##

.PHONY: clean clean-all
.PHONY: clean-repo clean-src clean-deps
.PHONY: clean-build clean-dist clean-web clean-files

clean-all: clean clean-web clean-files

clean: clean-build clean-dist

clean-repo:
	@ ${RM} -rvf ${APP_NAME}

clean-src:
	@ rm -rvf ${DIR_SRC}

clean-build:
	@ rm -rvf ${DIR_BUILD}

clean-dist:
	@ rm -rvf ${DIR_DIST}

clean-web:
	@ rm -rvf ${DIR_WEB}

clean-deps:
	@ rm -rvf \
		bower_modules/ \
		node_modules/ ;

clean-files:
	@ rm -rvf ${APP_DIRS} \
		bitbucket-pipelines.yml \
		codeclimate-config.patch \
		_config.yml ;

##  ------------------------------------------------------------------------  ##
