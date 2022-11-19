##  ------------------------------------------------------------------------  ##
##                                Build Project                               ##
##  ------------------------------------------------------------------------  ##
$(shell set -x)

# Since we rely on paths relative to the makefile location,
# abort if make isn't being run from there.
$(if $(findstring /,$(MAKEFILE_LIST)),$(error Please only invoke this makefile from the directory it resides in))
THIS_FILE := $(lastword $(MAKEFILE_LIST))
TO_NULL = 2>&1 >/dev/null
# $(info [THIS_FILE:${THIS_FILE}])

##  ------------------------------------------------------------------------  ##
##  Suppress display of executed commands
##  ------------------------------------------------------------------------  ##
$(VERBOSE).SILENT:

##  ------------------------------------------------------------------------  ##
.EXPORT_ALL_VARIABLES:
.IGNORE:

##  ------------------------------------------------------------------------  ##
# Use one shell to run all commands in a given target rather than using
# the default setting of running each command in a separate shell
##  ------------------------------------------------------------------------  ##
.ONESHELL:

##  ------------------------------------------------------------------------  ##
# set -e = bash immediately exits if any command has a non-zero exit status.
# set -u = a reference to any shell variable you haven't previously
#    defined -- with the exceptions of $* and $@ -- is an error, and causes
#    the program to immediately exit with non-zero code.
# set -o pipefail = the first non-zero exit code emitted in one part of a
#    pipeline (e.g. `cat file.txt | grep 'foo'`) will be used as the exit
#    code for the entire pipeline. If all exit codes of a pipeline are zero,
#    the pipeline will emit an exit code of 0.
# .SHELLFLAGS := -eu -o pipefail -c

##  ------------------------------------------------------------------------  ##
# Emits a warning if you are referring to Make variables that don’t exist.
##  ------------------------------------------------------------------------  ##
MAKEFLAGS += --warn-undefined-variables

##  ------------------------------------------------------------------------  ##
# Removes a large number of built-in rules. Remove "magic" and only do
#    what we tell Make to do.
##  ------------------------------------------------------------------------  ##
MAKEFLAGS += --no-builtin-rules

##  ========================================================================  ##
$(shell [ -f ./.bowerrc ] || cp -prfu config/.bowerrc ./)
$(shell [ -f ./.npmrc ] || cp -prfu config/.npmrc ./)
$(shell [ -f ./.env ] || echo "NODE_ENV=production" >> .env)
$(shell [ -f ./VERSION ] || echo "0.0.0" > VERSION)

##  ========================================================================  ##
##  Environment variables for the build
##  ========================================================================  ##
include .env

# The shell in which to execute make rules
SHELL := /bin/sh

# The CMake executable
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file
# RM = /usr/bin/cmake -E remove -f

# Escaping for special characters
EQUALS = =

##  ========================================================================  ##
APP_NAME := cv
APP_PREF := cv_
APP_SLOG := "CV + PORTFOLIO"
APP_LOGO := ./assets/BANNER


APP_REPO := $(shell git ls-remote --get-url)
GIT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
GIT_COMMIT := $(shell git rev-list --remove-empty --max-count=1 --reverse --remotes --date-order)
CODE_VERSION := $(strip $(shell cat ./VERSION))

##  ------------------------------------------------------------------------  ##
DT = $(shell date +'%T')
TS = $(shell date +'%s')
DZ = $(shell date +'%Y%m%dT%H%M%S%:z')

WD := $(shell pwd -P)
BD := $(WD)/bin

BUILD_FILE = BUILD-$(CODE_VERSION)
BUILD_CNTR = $(strip $(shell [ -f "$(BUILD_FILE)" ] && cat $(BUILD_FILE) || echo 0))
BUILD_CNTR := $(shell echo $$(( $(BUILD_CNTR) + 1 )))

BUILD_TMPL := config/build.tpl
BUILD_DATA := config/build.json
BUILD_FULL := $(shell date +'%Y-%m-%dT%H:%M:%S%:z')
BUILD_DATE := $(shell date +'%Y-%m-%d')
BUILD_TIME := $(shell date +'%H:%M:%S')
BUILD_YEAR := $(shell date +'%Y')
BUILD_HASH := $(shell echo "$(BUILD_FULL)" | md5sum | cut -b -4)

##  ------------------------------------------------------------------------  ##
##  Colors definition
##  ------------------------------------------------------------------------  ##
include $(BD)/Colors

##  ------------------------------------------------------------------------  ##
##  Shorthands
##  ------------------------------------------------------------------------  ##
LN := ln -sf --backup=simple
CP := cp -prf --backup=simple
MV := mv -f

FMP := ffmpeg -hide_banner -stats -loglevel error -y
FIGLET := figlet-toilet -t -k -f standard -F border -F gay
TOILET := figlet-toilet -t -f small -F border
GULP := gulp --color

ARGS = $(shell echo '$@' | tr [:upper:] [:lower:])
STG  = $(shell echo '$@' | tr [:lower:] [:upper:])

DAT = [$(Gray)$(DT)$(NC)]
BEGIN = $(Yellow)$(On_Blue)BEGIN$(NC) RECIPE
RESULT = $(White)$(On_Purple)RESULT$(NC)
DONE = $(White)$(On_Green)DONE RECIPE$(NC)
FINE = $(Yellow)$(On_Green)FINISHED GOAL$(NC)
TARG = [$(Orange) $@ $(NC)]
THIS = [$(Red) $(THIS_FILE) $(NC)]
OKAY = [$(White) OK $(NC)]


##  ------------------------------------------------------------------------  ##
##                               ENVIRONMENT                                  ##
##  ------------------------------------------------------------------------  ##
NODE_ENV := $(shell grep NODE_ENV ./.env | cut -d "=" -f 2)
APP_ENV := $(NODE_ENV)
DEBUG := $(shell grep DEBUG ./.env | cut -d "=" -f 2)
APP_DEBUG := $(DEBUG)
ifeq ($(APP_ENV),)
$(info $(DAT) $(Orange)APP_ENV$(NC) is $(Yellow)$(On_Red)NOT DETECTED$(NC)!)
endif


##  ------------------------------------------------------------------------  ##
##  BUILDs counter
##  ------------------------------------------------------------------------  ##
$(file > $(BUILD_FILE),$(BUILD_CNTR))
$(info $(DAT) Write build counter in [$(Yellow)$(BUILD_FILE)$(NC):$(Red)$(BUILD_CNTR)$(NC)])


##  ------------------------------------------------------------------------  ##
##  BUILD information
##  ------------------------------------------------------------------------  ##
BUILD_CONTENT = $(strip $(shell cat $(BUILD_TMPL)))
BUILD_CONTENT := $(subst BUILD_CNTR,$(BUILD_CNTR),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_FULL,$(BUILD_FULL),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_DATE,$(BUILD_DATE),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_TIME,$(BUILD_TIME),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_YEAR,$(BUILD_YEAR),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst BUILD_HASH,$(BUILD_HASH),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst APP_ENV,$(APP_ENV),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst GIT_BRANCH,$(GIT_BRANCH),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst GIT_COMMIT,$(GIT_COMMIT),$(BUILD_CONTENT))
BUILD_CONTENT := $(subst CODE_VERSION,$(CODE_VERSION),$(BUILD_CONTENT))

$(file > $(BUILD_DATA),$(BUILD_CONTENT))
$(info $(DAT) Created file [$(Yellow)BUILD_DATA$(NC):$(Cyan)$(BUILD_DATA)$(NC)]);


##  ------------------------------------------------------------------------  ##
##  COMMIT information
##  ------------------------------------------------------------------------  ##
$(file > COMMIT,$(GIT_COMMIT));
$(info $(DAT) Created file [$(Yellow)COMMIT$(NC):$(Gray)$(GIT_COMMIT)$(NC)]);


##  ------------------------------------------------------------------------  ##
##                               DIRECTORIES                                  ##
##  ------------------------------------------------------------------------  ##
ARC := arch
SRC := src
VER := v$(CODE_VERSION)-b$(BUILD_CNTR)
BLD := build-$(CODE_VERSION)-$(BUILD_CNTR)
DST := dist-$(CODE_VERSION)-$(BUILD_CNTR)
WEB := web-$(CODE_VERSION)-$(BUILD_CNTR)
DEV := dev-$(CODE_VERSION)-$(BUILD_CNTR)
APP_UID := $(shell echo "$(APP_NAME)" | tr [:lower:] [:upper:])-$(VER)-$(APP_ENV)


##  ------------------------------------------------------------------------  ##
##                                 PATHS                                      ##
##  ------------------------------------------------------------------------  ##
DIR_ARC := $(WD)/$(ARC)
DIR_SRC := $(WD)/$(SRC)
DIR_BUILD := $(WD)/$(BLD)-$(APP_ENV)
DIR_DIST := $(WD)/$(DST)-$(APP_ENV)
DIR_WEB := $(WD)/$(WEB)-$(APP_ENV)


##  ------------------------------------------------------------------------  ##
##  Query the default goal
##  ------------------------------------------------------------------------  ##
ifeq ($(.DEFAULT_GOAL),)
.DEFAULT_GOAL := _default
endif
$(info $(DAT) $(Yellow)$(On_Purple)GOALS$(NC));
$(info $(DAT)   \-- $(Orange)DEFAULT$(NC): [$(White)$(.DEFAULT_GOAL)$(NC)]);
$(info $(DAT)   \-- $(Orange)CURRENT$(NC): [$(Purple)$(MAKECMDGOALS)$(NC)]);


##  ------------------------------------------------------------------------  ##
##                                  INCLUDES                                  ##
##  ------------------------------------------------------------------------  ##
include $(BD)/*.mk

##  ------------------------------------------------------------------------  ##
##                             SET DEFAULT GOAL                               ##
##  ------------------------------------------------------------------------  ##
PHONY := _default

# _default: run ;
_default: $(APP_ENV) ;
	@ echo "$(DAT) $(FINE): $(TARG)" ;


##  ------------------------------------------------------------------------  ##
##                             CREATE PROJECT PATHs                           ##
##  ------------------------------------------------------------------------  ##
PHONY += mkdirs

mkdirs: ;
	# @ echo "$(HR)" ;
	@ [ -d $(DIR_ARC) ]   || mkdir -p $(DIR_ARC)
	@ [ -d $(DIR_SRC) ]   || mkdir -p $(DIR_SRC)
	@ [ -d $(DIR_BUILD) ] || mkdir -p $(DIR_BUILD)
	@ [ -d $(DIR_DIST) ]  || mkdir -p $(DIR_DIST)
	@ [ -d $(DIR_WEB) ]   || mkdir -p $(DIR_WEB)
	@ echo "$(DAT) $(DONE): $(TARG)" ;
	# @ echo "$(HR)" ;

##  ------------------------------------------------------------------------  ##
PHONY += test config

test: banner state help ;
	@ export NODE_ENV="${APP_ENV}"; npm run test
	@ echo "$(DAT) $(FINE): $(TARG)"

config: ;
	@ echo "$(DAT) $(BEGIN): $(TARG)"
	export NODE_ENV="${APP_ENV}"; npm run config
	@ echo "$(DAT) $(FINE): $(TARG)"

##  ------------------------------------------------------------------------  ##
PHONY += tasklist tasktree critical

tasklist: ;
	gulp --tasks --depth 3 --color
	@ echo "$(DAT) $(FINE): $(TARG)"

tasktree: ;
	gulp --tasks --depth 5 --color
	@ echo "$(DAT) $(FINE): $(TARG)"

# critical: ;
# 	@ export NODE_ENV="${APP_ENV}"; npm run crit
# 	@ echo "$(DAT) $(FINE): $(TARG)"

##  ------------------------------------------------------------------------  ##
PHONY += bower

bower: ;
	@ echo "$(HR)" ;
	$(FIGLET) "MK: $(STG)"
	export NODE_ENV="${APP_ENV}"; npm run bower
	@ echo "$(DAT) $(DONE): $(TARG)"
	@ echo "$(HR)" ;


##  ------------------------------------------------------------------------  ##
##  Setup packages used by installer
##  ------------------------------------------------------------------------  ##
setup: setup-deps ;
	@ touch ./$(ARGS)
	@ echo "$(DAT) $(DONE): $(TARG)"

setup-deps: ;
	@ echo "$(DAT) $(BEGIN): $(TARG)"
	sudo apt-get -qq -y install pwgen figlet toilet toilet-fonts jq
	npm i --verbose gulp
	npm i --verbose gulp-cli
	npm i --verbose
	$(FIGLET) "BOWER: $(STG)"
	bower i --allow-root --production --verbose
	@ touch ./$(ARGS)
	@ echo "$(DAT) $(DONE): $(TARG)"


##  ------------------------------------------------------------------------  ##
PHONY += pre-update update reupdate

pre-build:| clean-build setup bower ;
	# @ echo "$(DAT) $(BEGIN): $(TARG)"
	# @ cd ${WD} && $(RM) -vf ./build
	# @ export NODE_ENV="${APP_ENV}"; npm run populate
	@ echo "$(DAT) $(DONE): $(TARG)"

# build: mkdirs setup ;
# build: mkdirs setup bower ;
build: mkdirs ;
	$(FIGLET) "MK: $(STG)"
	@ cd ${WD} && cp -prf ${SRC}/* ${DIR_BUILD}/
	export NODE_ENV="${APP_ENV}"; npm run build
	@ touch ./$(ARGS)
	@ echo "$(DAT) $(DONE): $(TARG) [$(Cyan)$(DIR_BUILD)$(NC)]"
	@ echo "$(HR)" ;

pre-dist: ;
	@ cd ${WD} && $(RM) -vf ./dist
	@ cd ${WD} && $(RM) -rf ${DIR_DIST}/*
	@ echo "$(DAT) $(DONE): $(TARG)"

dist: build video ;
	$(FIGLET) "MK: $(STG)"
	cd ${WD} && cp -prf ${DIR_BUILD}/* ${DIR_DIST}/
	cd ${WD} && $(RM) -rf ${DIR_DIST}/resources
	$(TOILET) "MK: BACKUP"
	@ cd ${WD} && tar -c "${DST}-${APP_ENV}" | gzip -9 > "${ARC}/${APP_NAME}-${VER}-${APP_ENV}.tar.gz"
	@ echo "Archived to: [${Blue}${ARC}/${APP_NAME}-${VER}-${APP_ENV}.tar.gz${NC}]"
	@ cd ${WD} && touch ./$(ARGS)
	@ echo "$(DAT) $(DONE): $(TARG) [$(Cyan)$(DIR_DIST)$(NC)]"
	@ echo "$(HR)" ;

pre-deploy: ;
	$(RM) -vf ./deploy
	@ echo "$(DAT) $(DONE): $(TARG)"

deploy: dist pre-deploy ;
	$(FIGLET) "MK: $(STG)"
	cd ${WD} && cp -prf ${DIR_DIST}/* ${DIR_WEB}/
	$(RM) -vf devroot 2>&1 >/dev/null
	$(RM) -vf webroot 2>&1 >/dev/null
	$(LN) ${DIR_DIST} devroot
	$(LN) ${DIR_WEB} webroot
	touch ./$(ARGS)
	@ echo "$(DAT) $(DONE): $(TARG) [$(Cyan)$(DIR_WEB)$(NC)]"
	@ echo "$(HR)" ;

pre-update: ;
	@ cd ${WD} && $(RM) ./setup ./setup-deps
	@ echo "$(DAT) $(DONE): $(TARG)"

update: setup ;
	@ echo "$(DAT) $(FINE): $(TARG)"

reupdate: pre-update update ;
	@ echo "$(DAT) $(FINE): $(TARG)"


##  ------------------------------------------------------------------------  ##
DIR_IMGS := assets/img/works
GIF_FILES := $(notdir $(wildcard $(DIR_SRC)/$(DIR_IMGS)/*.gif))
BASE_NAMES := $(basename $(GIF_FILES))
MPEG_FILES := $(patsubst %.gif,%.mp4,"$(DIR_BUILD)/$(DIR_IMGS)/$(GIF_FILES)")
WEBM_FILES := $(patsubst %.gif,%.webm,"$(DIR_BUILD)/$(DIR_IMGS)/$(GIF_FILES)")


##  ------------------------------------------------------------------------  ##
##  Create backup archive
##  ------------------------------------------------------------------------  ##
PHONY += backup

backup: ;
	@ echo "$(HR)" ;
	$(TOILET) "MK: $(STG)"
	@ tar -cv "${DST}-${APP_ENV}" | gzip -9 > "${ARC}/${APP_NAME}-${VER}-${APP_ENV}.tar.gz"
	@ echo "$(DAT) $(FINE): $(TARG) [$(APP_VER)]"
	@ echo "$(HR)" ;


##  ------------------------------------------------------------------------  ##
##  Create videos from *.gif files
##  ------------------------------------------------------------------------  ##
# PHONY += print-names video
PHONY += print-names

print-names: ;
	@ echo "$(HR)" ;
	@ echo "$(DAT) $(BEGIN): $(TARG)" ;
	@ echo "$(DAT) DIR_IMGS \t= [$(White)$(DIR_IMGS)$(NC)]"
	@ echo "$(DAT) BASE_NAMES \t= [$(Gray)$(BASE_NAMES)$(NC)]"
	@ echo "$(DAT) GIF_FILES \t= [$(Cyan)$(GIF_FILES)$(NC)]"
	# @ echo "$(DAT) MPEG_FILES \t= [$(Orange)$(MPEG_FILES)$(NC)]"
	# @ echo "$(DAT) WEBM_FILES \t= [$(Purple)$(WEBM_FILES)$(NC)]"
	@ echo "$(DAT) $(DONE): $(TARG)"
	@ echo "$(HR)" ;

video: print-names ;
	$(FIGLET) "MK: $(STG)"
	# @ echo "$(DAT) $(BEGIN): $(TARG)" ;
	# $(foreach fbase, $(BASE_NAMES), $(FMP) -i "$(DIR_BUILD)/$(DIR_IMGS)/$(fbase).gif" -b:v 0 -crf 25 -f mp4 -vcodec libx264 -y "$(DIR_BUILD)/$(DIR_IMGS)/$(fbase).mp4" -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" ;)
	# @ echo "$(DAT) [$(RESULT)] $(Purple)MPEG$(NC) files:"
	# ls -l $(DIR_BUILD)/$(DIR_IMGS)/*.mp4 | grep mp4 --color
	$(foreach fbase, $(BASE_NAMES), $(FMP) -i "$(DIR_BUILD)/$(DIR_IMGS)/$(fbase).gif" -c libvpx-vp9 -b:v 0 -crf 41 -y "$(DIR_BUILD)/$(DIR_IMGS)/$(fbase).webm" ;)
	@ echo "$(DAT) [$(RESULT)] $(Orange)WEBM$(NC) files:"
	ls -l $(DIR_BUILD)/$(DIR_IMGS)/*.webm | grep webm --color
	@ touch ./$(ARGS)
	@ echo "$(DAT) $(DONE): $(TARG)" ;
	@ echo "$(HR)" ;


##  ------------------------------------------------------------------------  ##
PHONY += rebuild redeploy rb rd

# rebuild: pre-build build pre-dist dist ;
rebuild: pre-build build ;
	@ echo "$(DAT) $(DONE): $(TARG) [$(Red)$(VER)$(NC)]"

# redeploy: build pre-dist dist pre-deploy deploy ;
# redeploy: pre-dist dist pre-deploy deploy ;
# redeploy: pre-dist dist deploy ;
redeploy: pre-dist deploy ;
	@ echo "$(DAT) $(DONE) $(TARG): [$(Cyan)$(DIR_WEB)$(NC)]"

rb: rebuild ;
	@ echo "$(DAT) $(DONE): $(TARG) [$(Red)$(VER)$(NC)]"

rd: redeploy ;
	@ echo "$(DAT) $(DONE): $(TARG) [$(Red)$(VER)$(NC)]"


##  ------------------------------------------------------------------------  ##
PHONY += _all all full cycle cycle-dev dev dev-setup prod production run watch
#* means the word "all" doesn't represent a file name in this Makefile;
#* means the Makefile has nothing to do with a file called "all" in the same directory.

_all: clean cycle banner ;
	@ echo "$(DAT) $(DONE): $(TARG)"

all: _all ;
	@ echo "$(DAT) $(DONE): $(TARG)"

full: clean-all _all banner ;
	@ echo "$(DAT) $(DONE): $(TARG)"

cycle: dist ;
	@ echo "$(DAT) $(DONE): $(TARG)"

cycle-dev: redeploy ;
	@ echo "$(DAT) $(DONE): $(TARG)"

dev: clean-dev banner cycle-dev ;
	# @ export NODE_ENV="${APP_ENV}"; npm run dev
	@ echo "$(DAT) $(DONE): $(TARG) [$(Red)$(VER)$(NC)]"

dev-setup: clean-deps setup banner cycle-dev ;
	@ export NODE_ENV="${APP_ENV}"; npm run dev
	@ echo "$(DAT) $(DONE): $(TARG)"

# run: pre-build build pre-dist dist pre-deploy deploy banner ;
run: pre-build build pre-dist dist pre-deploy deploy banner ;
	# $(FIGLET) "MK: $(STG): [$(VER)]"
	@ echo "$(DAT) $(DONE): $(TARG) [$(Red)$(VER)$(NC)]"

production: run ;
	@ echo "$(DAT) $(DONE): $(TARG) [$(Red)$(VER)$(NC)]"

prod: production ;
	@ echo "$(DAT) $(DONE): $(TARG)"

watch:
	export NODE_ENV="${APP_ENV}"; npm run watch
	@ echo "$(DAT) $(DONE): $(TARG)"


##  ------------------------------------------------------------------------  ##
##  Declare the contents of the .PHONY variable as phony. We keep that
##  information in a variable so we can use it in if_changed and friends.
##  ------------------------------------------------------------------------  ##
.PHONY: $(PHONY)

##  ------------------------------------------------------------------------  ##
