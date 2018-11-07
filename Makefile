##  ------------------------------------------------------------------------  ##
##                                Build Project                               ##
##  ------------------------------------------------------------------------  ##

.SILENT:
.EXPORT_ALL_VARIABLES:
.IGNORE:
.ONESHELL:

SHELL = /bin/sh

##  ------------------------------------------------------------------------  ##
$(shell [ -f NODE_ENV ] || cp -prfu config/.NODE_ENV ./NODE_ENV);
$(shell [ -f .bowerrc ] || cp -prfu config/.bowerrc ./);
$(shell [ -f .npmrc ] || cp -prfu config/.npmrc ./);
##  ------------------------------------------------------------------------  ##

APP_NAME := cv
APP_SLOG := CV+PORTFOLIO
APP_LOGO := ./assets/BANNER
APP_REPO := $(shell git ls-remote --get-url)

APP_ENV := $(shell [ -f NODE_ENV ] && cat NODE_ENV || cat config/.NODE_ENV)
CODE_VERSION := $(shell cat ./VERSION)

GIT_COMMIT := $(shell git rev-list --remove-empty --remotes --max-count=1 --date-order --reverse)
WD := $(shell pwd -P)
DT = $(shell date +'%Y%m%d%H%M%S')

BUILD_FULL := $(shell date +'%Y-%m-%dT%H:%M:%SZ')
BUILD_DATE := $(shell date +'%Y-%m-%d')
BUILD_TIME := $(shell date +'%H:%M:%S')
BUILD_YEAR := $(shell date +'%Y')
BUILD_HASH := $(shell echo "$(BUILD_FULL)" | md5sum | cut -b -32)

include ./bin/Colors

##  ------------------------------------------------------------------------  ##

BUILD_CONTENT = $(strip $(shell cat config/build.tpl))
BUILD_CONTENT := $(subst BUILD_FULL,$(BUILD_FULL),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_DATE,$(BUILD_DATE),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_TIME,$(BUILD_TIME),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_YEAR,$(BUILD_YEAR),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_HASH,$(BUILD_HASH),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst GIT_COMMIT,$(GIT_COMMIT),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst CODE_VERSION,$(CODE_VERSION),$(BUILD_CONTENT))
$(info [$(White)$(DT)$(NC)] BUILD_CONTENT [$(Yellow)$(BUILD_CONTENT)$(NC)])
$(file > config/build.json,$(BUILD_CONTENT))
$(info [$(White)$(DT)$(NC)] Created file [$(Yellow)BUILD_CONTENT$(NC):$(BPurple)$(WD)/config/build.json$(NC)])

##  ------------------------------------------------------------------------  ##

$(file > COMMIT,$(GIT_COMMIT));
$(info [$(White)$(DT)$(NC)] Created file [$(BYellow)COMMIT$(NC):$(BPurple)$(GIT_COMMIT)$(NC)]);

DIR_SRC := ${WD}/src
DIR_BUILD := ${WD}/build-${CODE_VERSION}
DIR_DIST := ${WD}/dist-${CODE_VERSION}
DIR_WEB := ${WD}/webroot

# APP_DIRS := $(addprefix ${WD}/,build-* dist-* webroot)

##  ------------------------------------------------------------------------  ##

# Query the default goal.
ifeq ($(.DEFAULT_GOAL),)
.DEFAULT_GOAL := default
endif
$(info [$(White)$(DT)$(NC)] $(BYellow)Goal$(NC) [$(Yellow)DEFAULT$(NC):$(BPurple)$(.DEFAULT_GOAL)$(NC)]);

##  ------------------------------------------------------------------------  ##
##                                  INCLUDES                                  ##
##  ------------------------------------------------------------------------  ##

include ./bin/*.mk

##  ------------------------------------------------------------------------  ##

.PHONY: default

default: test ;

##  ------------------------------------------------------------------------  ##

.PHONY: test

test: state help usage banner ;
	@ NODE_ENV=${APP_ENV}; npm run test

##  ------------------------------------------------------------------------  ##

.PHONY: setup setup-globals setup-deps build dist deploy watch

setup: setup-globals setup-deps ;

setup-globals:
	@ npm i -g bower gulp

setup-deps:
	@ npm i
	@ bower i --production

build:
	# @ NODE_ENV=${APP_ENV}; npm run prepare
	@ NODE_ENV=${APP_ENV}; npm run build

# @ NODE_ENV=${APP_ENV}; gulp build

dist:
	@ NODE_ENV=${APP_ENV}; gulp dist

deploy:
	@ NODE_ENV=${APP_ENV}; npm run deploy

watch:
	@ NODE_ENV=${APP_ENV}; npm run watch

##  ------------------------------------------------------------------------  ##

.PHONY: rebuild redeploy config

rebuild: build ;
redeploy: rebuild deploy banner ;

config:
	@ NODE_ENV=${APP_ENV}; npm run config

##  ------------------------------------------------------------------------  ##

.PHONY: all full cycle cycle-dev dev
#* means the word "all" doesn't represent a file name in this Makefile;
#* means the Makefile has nothing to do with a file called "all" in the same directory.

all: clean cycle banner ;

full: clean-all all banner ;

cycle: rights setup build deploy banner ;
cycle-dev: build deploy banner ;

# dev: clean-build clean-files cycle-dev;
dev: clean-build cycle-dev watch banner ;

##  ------------------------------------------------------------------------  ##
