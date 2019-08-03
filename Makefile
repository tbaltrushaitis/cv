##  ------------------------------------------------------------------------  ##
##                                Build Project                               ##
##  ------------------------------------------------------------------------  ##

.SILENT:
.EXPORT_ALL_VARIABLES:
.IGNORE:
.ONESHELL:

SHELL = /bin/sh
THIS_FILE := $(lastword $(MAKEFILE_LIST))
TO_NULL = 2>&1 >/dev/null

##  ------------------------------------------------------------------------  ##
$(shell [ -f NODE_ENV ] || cp -prfu config/.NODE_ENV ./NODE_ENV);
$(shell [ -f .bowerrc ] || cp -prfu config/.bowerrc ./);
$(shell [ -f .npmrc ] || cp -prfu config/.npmrc ./);
##  ------------------------------------------------------------------------  ##

APP_NAME := cv
APP_SLOG := CV+PORTFOLIO
APP_LOGO := ./assets/BANNER
APP_REPO := $(shell git ls-remote --get-url)

CODE_VERSION := $(shell cat ./VERSION)
GIT_BRANCH := $(shell git rev-list --remove-empty --max-count=1 --reverse --branches)
GIT_COMMIT := $(shell git rev-list --remove-empty --max-count=1 --reverse --remotes --date-order)

WD := $(shell pwd -P)
DT = $(shell date +'%Y-%m-%dT%H:%M:%S%:z')
TS = $(shell date +'%T')

# $(shell [ -f .env ] && source .env || echo test)

APP_ENV := $(strip $(shell [ -f .env ] && cat .env || (touch .env && echo "TOUCHED FILE: [.env]")))
APP_ENV := $(strip $(shell [ -f NODE_ENV ] && cat NODE_ENV || cat config/.NODE_ENV))
ifeq ($(APP_ENV),)
$(info [$(White)$(TS)$(NC)] APP_ENV is NOT DETECTED!)
endif

BUILD_FILE = BUILD-$(CODE_VERSION)
BUILD_CNTR = $(strip $(shell [ -f "$(BUILD_FILE)" ] && cat $(BUILD_FILE) || echo 0))
BUILD_CNTR := $(shell echo $$(( $(BUILD_CNTR) + 1 )))

BUILD_FULL := $(shell date +'%Y-%m-%dT%H:%M:%S%:z')
BUILD_DATE := $(shell date +'%Y-%m-%d')
BUILD_TIME := $(shell date +'%H:%M:%S')
BUILD_YEAR := $(shell date +'%Y')
BUILD_HASH := $(shell echo "$(BUILD_FULL)" | md5sum | cut -b -4)

##  ------------------------------------------------------------------------  ##
##  Colors definitions
##  ------------------------------------------------------------------------  ##

include bin/Colors

##  ------------------------------------------------------------------------  ##
##  BUILDs counter
##  ------------------------------------------------------------------------  ##
$(file > $(BUILD_FILE),$(BUILD_CNTR))
$(info [$(White)$(TS)$(NC)] Created file [$(Yellow)$(BUILD_FILE)$(NC):$(Purple)$(BUILD_CNTR)$(NC)])

##  ------------------------------------------------------------------------  ##
##  BUILD information
##  ------------------------------------------------------------------------  ##
BUILD_CONTENT = $(strip $(shell cat config/build.tpl))
BUILD_CONTENT := $(subst BUILD_CNTR,$(BUILD_CNTR),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_FULL,$(BUILD_FULL),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_DATE,$(BUILD_DATE),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_TIME,$(BUILD_TIME),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_YEAR,$(BUILD_YEAR),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_HASH,$(BUILD_HASH),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst GIT_COMMIT,$(GIT_COMMIT),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst CODE_VERSION,$(CODE_VERSION),$(BUILD_CONTENT))

$(file > config/build.json,$(BUILD_CONTENT))
$(info [$(White)$(TS)$(NC)] Created file [$(Yellow)BUILD_CONTENT$(NC):$(Purple)$(WD)/config/build.json$(NC)])

##  ------------------------------------------------------------------------  ##
##  COMMIT information
##  ------------------------------------------------------------------------  ##
$(file > COMMIT,$(GIT_COMMIT));
$(info [$(White)$(TS)$(NC)] Created file [$(BYellow)COMMIT$(NC):$(BPurple)$(GIT_COMMIT)$(NC)]);

##  ------------------------------------------------------------------------  ##
##                               DIRECTORIES                                  ##
##  ------------------------------------------------------------------------  ##

ARC := arch
SRC := src
BLD := build-${CODE_VERSION}
DST := dist-${CODE_VERSION}
WEB := webroot

$(shell [ -d $(ARC) ] || mkdir $(ARC))

##  ------------------------------------------------------------------------  ##
##                                 PATHS                                      ##
##  ------------------------------------------------------------------------  ##

DIR_SRC := $(WD)/$(SRC)
DIR_BUILD := $(WD)/$(BLD)
DIR_DIST := $(WD)/$(DST)
DIR_WEB := $(WD)/$(WEB)

##  ------------------------------------------------------------------------  ##
##  Query default goal.
##  ------------------------------------------------------------------------  ##
ifeq ($(.DEFAULT_GOAL),)
.DEFAULT_GOAL := default
endif
$(info [$(White)$(TS)$(NC)] Goal [$(Yellow)DEFAULT$(NC):$(Cyan)$(.DEFAULT_GOAL)$(NC)]);
$(info [$(White)$(TS)$(NC)] Goal [$(Yellow)CURRENT$(NC):$(Cyan)$(MAKECMDGOALS)$(NC)]);

##  ------------------------------------------------------------------------  ##
##                                  INCLUDES                                  ##
##  ------------------------------------------------------------------------  ##

include ./bin/*.mk

##  ------------------------------------------------------------------------  ##

.PHONY: default

default: run ;

##  ------------------------------------------------------------------------  ##

.PHONY: test config tasklist tasktree

test: banner state help ;
	@ export NODE_ENV="${APP_ENV}"; npm run test

config:
	@ export NODE_ENV="${APP_ENV}"; npm run config

# critical:
# 	@ export NODE_ENV="${APP_ENV}"; npm run crit

tasklist:
	@ gulp --tasks --depth 1 --color

tasktree:
	@ gulp --tasks --depth 2 --color

##  ------------------------------------------------------------------------  ##

.PHONY: build dist deploy pre-update update

setup: setup-deps ;
	@ touch setup

setup-deps:
	@ npm i -g bower ;
	@ npm i ;
	@ bower i --production ;
	@ touch setup-deps

build:
	@ export NODE_ENV="${APP_ENV}"; npm run build

dist:
	@ export NODE_ENV="production"; npm run build
	@ export NODE_ENV="production"; npm run dist
	@ tar -c "${DST}" | gzip -9 > "${ARC}/${APP_NAME}-v${CODE_VERSION}-b${BUILD_CNTR}.tar.gz"

deploy:
	@ export NODE_ENV="${APP_ENV}"; npm run deploy

pre-update:
	@ rm -f setup setup-deps ;

update: pre-update setup ;

##  ------------------------------------------------------------------------  ##

.PHONY: rebuild redeploy rb rd

rebuild: build ;
redeploy: rebuild deploy banner ;

rb: rebuild ;
rd: redeploy ;

##  ------------------------------------------------------------------------  ##

.PHONY: all full cycle cycle-dev dev run watch
#* means the word "all" doesn't represent a file name in this Makefile;
#* means the Makefile has nothing to do with a file called "all" in the same directory.

all: clean cycle banner ;

full: clean-all all banner ;

cycle: setup build deploy ;
cycle-dev: build deploy ;

dev: clean banner cycle-dev ;
	@ export NODE_ENV="${APP_ENV}"; npm run dev ;

dev-setup: clean-deps setup banner cycle-dev ;
	@ export NODE_ENV="${APP_ENV}"; npm run dev ;

run: banner help cycle dist banner ;

watch:
	@ export NODE_ENV="${APP_ENV}"; npm run watch

##  ------------------------------------------------------------------------  ##
