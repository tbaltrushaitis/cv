##  ------------------------------------------------------------------------  ##
##                                Build Project                               ##
##  ------------------------------------------------------------------------  ##

# .SILENT:
.EXPORT_ALL_VARIABLES:
.IGNORE:
.ONESHELL:

##  ------------------------------------------------------------------------  ##

APP_NAME := cv
APP_SLOG := "CV+PORTFOLIO"
APP_LOGO := ./assets/BANNER
APP_REPO := $(shell git ls-remote --get-url)

APP_ENV := $(shell cat ./NODE_ENV)
CODE_VERSION := $(shell cat ./VERSION)

GIT_COMMIT := $(shell git rev-list --remove-empty --remotes --max-count=1 --date-order --reverse)
WD := $(shell pwd -P)
DT = $(shell date +'%Y%m%d%H%M%S')

include ./bin/Colors.mk

##  ------------------------------------------------------------------------  ##

# COMMIT_EXISTS := $(shell [ -e COMMIT ] && echo 1 || echo 0)
# ifeq ($(COMMIT_EXISTS), 0)
$(file > COMMIT,${GIT_COMMIT})
$(warning ${BYellow}[${DT}] Created file [COMMIT]${NC})
# endif

DIR_SRC := ${WD}/src
DIR_BUILD := ${WD}/build-${CODE_VERSION}
DIR_DIST := ${WD}/dist-${CODE_VERSION}
DIR_WEB := ${WD}/webroot

APP_DIRS := $(addprefix ${WD}/,build-* dist-* webroot)

##  ------------------------------------------------------------------------  ##
# Query the default goal.

ifeq ($(.DEFAULT_GOAL),)
.DEFAULT_GOAL := default
endif

##  ------------------------------------------------------------------------  ##
##                                  INCLUDES                                  ##
##  ------------------------------------------------------------------------  ##

include ./bin/*.mk

##  ------------------------------------------------------------------------  ##

.PHONY: default

default: all;

##  ------------------------------------------------------------------------  ##
# $(info [${DT}]${BYellow} Default goal is: [$(.DEFAULT_GOAL)]${NC});

.PHONY: test

test: banner state help;
	@ NODE_ENV=${APP_ENV}; gulp test

##  ------------------------------------------------------------------------  ##

.PHONY: setup build deploy dev

setup:
	@ npm i -g npm
	@ npm i -g bower
	@ npm i
	@ bower i

build:
	@ NODE_ENV=${APP_ENV}; gulp build

deploy:
	@ NODE_ENV=${APP_ENV}; gulp deploy

# deploy:
# 	@  cp -prv ${DIR_SRC}/* ./ 		 \
# 	&& sudo chmod a+x app/bin/*.sh ;

dev: rights build deploy;
	# @ NODE_ENV=development; gulp build

##  ------------------------------------------------------------------------  ##

.PHONY: rebuild redeploy

rebuild: build;
redeploy: rebuild deploy banner;

##  ------------------------------------------------------------------------  ##

.PHONY: all full cycle
#* means the word "all" doesn't represent a file name in this Makefile;
#* means the Makefile has nothing to do with a file called "all" in the same directory.

all: banner clean cycle;

full: clean-all all;

cycle: rights setup build deploy;

##  ------------------------------------------------------------------------  ##
