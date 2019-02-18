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

CODE_VERSION := $(shell cat ./VERSION)
GIT_COMMIT := $(shell git rev-list --remove-empty --remotes --max-count=1 --date-order --reverse)
WD := $(shell pwd -P)
DT = $(shell date +'%Y%m%d%H%M%S')

APP_ENV := $(strip $(shell [ -f NODE_ENV ] && cat NODE_ENV || cat config/.NODE_ENV))
ifeq ($(APP_ENV),)
$(info [$(White)$(DT)$(NC)] APP_ENV is NOT DETECTED!)
APP_ENV := $(strip $(shell echo $([ -f NODE_ENV ] && cat NODE_ENV || cat config/.NODE_ENV)))
endif

BUILD_FILE = BUILD-$(CODE_VERSION)
BUILD_CNTR = $(strip $(shell [ -f "$(BUILD_FILE)" ] && cat $(BUILD_FILE) || echo 0))
BUILD_CNTR := $(shell echo $$(( $(BUILD_CNTR) + 1 )))

BUILD_FULL := $(shell date +'%Y-%m-%dT%H:%M:%SZ %Z')
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
$(info [$(White)$(DT)$(NC)] Created file [$(Yellow)$(BUILD_FILE)$(NC):$(BPurple)$(BUILD_CNTR)$(NC)])

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

# $(info [$(White)$(DT)$(NC)] BUILD_CONTENT [$(Yellow)$(BUILD_CONTENT)$(NC)])
$(file > config/build.json,$(BUILD_CONTENT))
$(info [$(White)$(DT)$(NC)] Created file [$(Yellow)BUILD_CONTENT$(NC):$(BPurple)$(WD)/config/build.json$(NC)])

##  ------------------------------------------------------------------------  ##

$(file > COMMIT,$(GIT_COMMIT));
$(info [$(White)$(DT)$(NC)] Created file [$(BYellow)COMMIT$(NC):$(BPurple)$(GIT_COMMIT)$(NC)]);

DIR_SRC := ${WD}/src
DIR_BUILD := ${WD}/build-${CODE_VERSION}
DIR_DIST := ${WD}/dist-${CODE_VERSION}
DIR_WEB := ${WD}/webroot

##  ------------------------------------------------------------------------  ##
##  Query default goal.
##  ------------------------------------------------------------------------  ##
ifeq ($(.DEFAULT_GOAL),)
.DEFAULT_GOAL := default
endif
$(info [$(White)$(DT)$(NC)] $(BYellow)Goal$(NC) [$(Yellow)DEFAULT$(NC):$(BPurple)$(.DEFAULT_GOAL)$(NC)]);
$(info [$(White)$(DT)$(NC)] $(BYellow)Goal$(NC) [$(Yellow)CURRENT$(NC):$(BPurple)$(MAKECMDGOALS)$(NC)]);

##  ------------------------------------------------------------------------  ##
##                                  INCLUDES                                  ##
##  ------------------------------------------------------------------------  ##

include ./bin/*.mk

##  ------------------------------------------------------------------------  ##

.PHONY: default

default: run ;

##  ------------------------------------------------------------------------  ##

.PHONY: test config tasklist tasktree

test: state help usage banner ;
	@ export NODE_ENV="${APP_ENV}"; npm run test

config:
	@ export NODE_ENV="${APP_ENV}"; npm run config

tasklist:
	@ gulp --tasks --depth 1 --color

tasktree:
	@ gulp --tasks --depth 2 --color

##  ------------------------------------------------------------------------  ##

.PHONY: setup-globals build dist deploy watch

setup: setup-deps ;
	@ touch setup

setup-deps:
	@ npm i ;
	@ bower i --production ;
	@ touch setup-deps

build:
	@ export NODE_ENV="${APP_ENV}"; npm run build

dist:
	@ export NODE_ENV="${APP_ENV}"; gulp dist

deploy:
	@ export NODE_ENV="${APP_ENV}"; npm run deploy

watch:
	@ export NODE_ENV="${APP_ENV}"; npm run watch

##  ------------------------------------------------------------------------  ##

.PHONY: rebuild redeploy

rebuild: build ;
redeploy: rebuild deploy banner ;

##  ------------------------------------------------------------------------  ##

.PHONY: all full cycle cycle-dev dev run
#* means the word "all" doesn't represent a file name in this Makefile;
#* means the Makefile has nothing to do with a file called "all" in the same directory.

all: clean cycle banner ;

full: clean-all all banner ;

cycle: rights setup build deploy ;
cycle-dev: build deploy ;

dev: clean-build cycle-dev banner ;
	@ export NODE_ENV="${APP_ENV}"; npm run dev --env=dev ;
	@ export NODE_ENV="${APP_ENV}"; npm run watch --env=dev ;

run: banner help ;
	@ export NODE_ENV="${APP_ENV}"; npm run all ;

##  ------------------------------------------------------------------------  ##
