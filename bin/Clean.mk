##  ------------------------------------------------------------------------  ##
##                                 Clean Environment                          ##
##  ------------------------------------------------------------------------  ##

.PHONY: clean clean-all clean-deps
.PHONY: clean-build clean-dist clean-files

clean-all: clean clean-dist
	@ echo "[DONE] Clean all";

clean: clean-build clean-files
	@ echo "[DONE] Clean";

clean-build:
	@ echo "Clean: build ... ";
	@ rm -rf ${DIR_BUILD}

clean-dist:
	@ echo "Clean: distro ... ";
	@ rm -rf ${DIR_DIST}

clean-deps:
	@ echo "Clean: deps ... ";
	@ rm -rf \
		bower_modules/ \
		node_modules/ ;

clean-files:
	@ echo "Clean: files ... ";
	@ rm -rf BUILD-* \
		COMMIT \
		*.md \
		bitbucket-pipelines.yml \
		codeclimate-config.patch \
		_config.yml \
		yarn.lock \
		yarn-error.log ;

##  ------------------------------------------------------------------------  ##
