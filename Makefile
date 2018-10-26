##  ------------------------------------------------------------------------  ##
##                                Build Project                               ##
##  ------------------------------------------------------------------------  ##

.SILENT:
.EXPORT_ALL_VARIABLES:
.IGNORE:
.ONESHELL:

SHELL = /bin/sh

##  ------------------------------------------------------------------------  ##

$(shell if [ ! -f ./NODE_ENV ] 2>&1 >/dev/null; then cp -prv config/.NODE_ENV ./NODE_ENV ; fi);
$(shell if [ ! -f ./.bowerrc ] 2>&1 >/dev/null; then cp -prv config/.bowerrc ./ ; fi);

APP_NAME := cv
APP_SLOG := "CV+PORTFOLIO"
APP_LOGO := ./assets/BANNER
APP_REPO := $(shell git ls-remote --get-url)

APP_ENV := $(shell [ -f ./NODE_ENV ] && cat ./NODE_ENV || cat ./config/.NODE_ENV)
CODE_VERSION := $(shell cat ./VERSION)

GIT_COMMIT := $(shell git rev-list --remove-empty --remotes --max-count=1 --date-order --reverse)
WD := $(shell pwd -P)
DT = $(shell date +'%Y%m%d%H%M%S')

BUILD_FULL := $(shell date +'%Y-%m-%dT%H:%M:%SZ')
BUILD_DATE := $(shell date +'%Y-%m-%d')
BUILD_TIME := $(shell date +'%H:%M:%S')
BUILD_YEAR := $(shell date +'%Y')

include ./bin/Colors

##  ------------------------------------------------------------------------  ##

CONTENT = $(strip $(shell cat config/build.tpl))
CONTENT := $(subst BUILD_FULL,$(BUILD_FULL),$(CONTENT))
CONTENT := $(subst BUILD_DATE,$(BUILD_DATE),$(CONTENT))
CONTENT := $(subst BUILD_TIME,$(BUILD_TIME),$(CONTENT))
CONTENT := $(subst BUILD_YEAR,$(BUILD_YEAR),$(CONTENT))
CONTENT := $(subst GIT_COMMIT,$(GIT_COMMIT),$(CONTENT))
CONTENT := $(subst CODE_VERSION,$(CODE_VERSION),$(CONTENT))
$(info [${Cyan}${DT}${NC}] CONTENT [${BYellow}${CONTENT}${NC}])
$(file > config/build.json,${CONTENT})
$(info [${Cyan}${DT}${NC}] Created file [${BYellow}${WD}/config/build.json${NC}])

##  ------------------------------------------------------------------------  ##
$(file > COMMIT,${GIT_COMMIT});
$(info [${Cyan}${DT}${NC}] Created file [${BYellow}COMMIT${NC}:${BPurple}${GIT_COMMIT}${NC}]);

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

$(info [$(Cyan)$(DT)$(NC)] $(BYellow)Default goal is$(NC): [$(BPurple)$(.DEFAULT_GOAL)]$(NC));
##  ------------------------------------------------------------------------  ##
##                                  INCLUDES                                  ##
##  ------------------------------------------------------------------------  ##

include ./bin/*.mk

##  ------------------------------------------------------------------------  ##

.PHONY: default

# default: all;
default: dev;

##  ------------------------------------------------------------------------  ##

.PHONY: test

test: banner state help;
	@ NODE_ENV=${APP_ENV}; npm run test

##  ------------------------------------------------------------------------  ##

.PHONY: setup setup-globals setup-deps build release deploy

setup: setup-globals setup-deps ;

setup-globals:
	@ npm i -g bower gulp

setup-deps:
	@ npm i
	@ bower i --production

build:
	@ NODE_ENV=${APP_ENV}; npm run prepare
	@ NODE_ENV=${APP_ENV}; npm run build

# @ NODE_ENV=${APP_ENV}; gulp build

release:
	@ NODE_ENV=${APP_ENV}; gulp dist

deploy:
	@ NODE_ENV=${APP_ENV}; gulp deploy

##  ------------------------------------------------------------------------  ##

.PHONY: rebuild redeploy

rebuild: build;
redeploy: rebuild deploy banner;

##  ------------------------------------------------------------------------  ##

.PHONY: all full cycle cycle-dev dev
#* means the word "all" doesn't represent a file name in this Makefile;
#* means the Makefile has nothing to do with a file called "all" in the same directory.

all: clean banner cycle;

full: clean-all all;

cycle: rights setup build deploy banner;
cycle-dev: build deploy banner;

dev: clean-build clean-files cycle-dev;

##  ------------------------------------------------------------------------  ##
