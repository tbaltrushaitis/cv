##  ------------------------------------------------------------------------  ##
##                                Build Project                               ##
##  ------------------------------------------------------------------------  ##

.SILENT:
# .IGNORE:
.EXPORT_ALL_VARIABLES:
.ONESHELL:

SHELL = /bin/sh
THIS_FILE := $(lastword $(MAKEFILE_LIST))
TO_NULL = 2>&1 >/dev/null

# $(info [THIS_FILE:${THIS_FILE}])
##  ------------------------------------------------------------------------  ##
# $(shell [ -f NODE_ENV ] || cp -prfu config/.NODE_ENV ./NODE_ENV);
##  ------------------------------------------------------------------------  ##

##  ------------------------------------------------------------------------  ##
$(shell [ -f ./.bowerrc ] || cp -prfu config/.bowerrc ./);
$(shell [ -f ./.npmrc ] || cp -prfu config/.npmrc ./);
##  ------------------------------------------------------------------------  ##

APP_NAME := cv
APP_PREF := cv_
APP_SLOG := "CV + PORTFOLIO"
APP_LOGO := ./assets/BANNER
APP_REPO := $(shell git ls-remote --get-url)

$(shell [ -f ./VERSION ] || echo "0.0.0" > VERSION)
$(shell [ -f ./.env ] || echo "NODE_ENV=production" >> .env)

CODE_VERSION := $(strip $(shell cat ./VERSION))
GIT_BRANCH := $(shell git rev-list --remove-empty --max-count=1 --reverse --branches)
GIT_COMMIT := $(shell git rev-list --remove-empty --max-count=1 --reverse --remotes --date-order)

DT = $(shell date +'%T')
TS = $(shell date +'%s')
DZ = $(shell date +'%Y%m%dT%H%M%S%:z')

WD := $(shell pwd -P)
BD := $(WD)/bin

BUILD_FILE = BUILD-$(CODE_VERSION)
BUILD_CNTR = $(strip $(shell [ -f "$(BUILD_FILE)" ] && cat $(BUILD_FILE) || echo 0))
BUILD_CNTR := $(shell echo $$(( $(BUILD_CNTR) + 1 )))

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

FMP := ffmpeg -hide_banner -y -loglevel "error" -stats
# FIGLET := figlet -t -f standard -f border -f gay -S
FIGLET := figlet-toilet -t -k -f standard -F border -F gay

DAT = [$(Gray)$(DT)$(NC)]
BEGIN = $(Yellow)$(On_Blue)BEGIN$(NC) TARGET
RESULT = $(White)$(On_Purple)RESULT$(NC)
DONE = $(Yellow)$(On_Green)DONE$(NC) TARGET
FINE = $(Yellow)$(On_Green)FINISHED GOAL$(NC)
TARG = [$(Orange) $@ $(NC)]
STG  = $(shell echo '$@' | tr [:lower:] [:upper:])
THIS = [$(Red) $(THIS_FILE) $(NC)]
OKAY = [$(White) OK $(NC)]

##  ------------------------------------------------------------------------  ##
##  BUILDs counter
##  ------------------------------------------------------------------------  ##
$(file > $(BUILD_FILE),$(BUILD_CNTR))
$(info $(DAT) Created file [$(Yellow)$(BUILD_FILE)$(NC):$(Red)$(BUILD_CNTR)$(NC)])

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
$(info $(DAT) Created file [$(Yellow)BUILD_CONTENT$(NC):$(White)$(WD)/config/build.json$(NC)])

##  ------------------------------------------------------------------------  ##
##  COMMIT information
##  ------------------------------------------------------------------------  ##
$(file > COMMIT,$(GIT_COMMIT));
$(info $(DAT) Created file [$(BYellow)COMMIT$(NC):$(White)$(GIT_COMMIT)$(NC)]);

##  ------------------------------------------------------------------------  ##
##                               DIRECTORIES                                  ##
##  ------------------------------------------------------------------------  ##

ARC := arch
SRC := src
BLD := build-$(CODE_VERSION)
DST := dist-$(CODE_VERSION)
WEB := web-$(CODE_VERSION)-$(BUILD_CNTR)

$(shell [ -d $(ARC) ] || mkdir $(ARC))

##  ------------------------------------------------------------------------  ##
##                                 PATHS                                      ##
##  ------------------------------------------------------------------------  ##

DIR_SRC := $(WD)/$(SRC)
DIR_BUILD := $(WD)/$(BLD)
DIR_DIST := $(WD)/$(DST)
DIR_WEB := $(WD)/$(WEB)

$(shell [ -d $(DIR_SRC) ]   || mkdir $(DIR_SRC))
$(shell [ -d $(DIR_BUILD) ] || mkdir $(DIR_BUILD))
$(shell [ -d $(DIR_DIST) ]  || mkdir $(DIR_DIST))
$(shell [ -d $(DIR_WEB) ]   || mkdir $(DIR_WEB))

##  ------------------------------------------------------------------------  ##

APP_ENV := $(shell grep NODE_ENV .env | cut -d "=" -f 2)
ifeq ($(APP_ENV),)
$(info $(DAT) $(Orange)APP_ENV$(NC) is $(Yellow)$(On_Red)NOT DETECTED$(NC)!)
endif

##  ------------------------------------------------------------------------  ##
##  Query default goal
##  ------------------------------------------------------------------------  ##
ifeq ($(.DEFAULT_GOAL),)
.DEFAULT_GOAL := default
endif
$(info $(DAT) $(Yellow)$(On_Purple)GOALS$(NC));
$(info $(DAT)   \-- $(Orange)DEFAULT$(NC): [$(White)$(.DEFAULT_GOAL)$(NC)]);
$(info $(DAT)   \-- $(Orange)CURRENT$(NC): [$(Blue)$(MAKECMDGOALS)$(NC)]);

##  ------------------------------------------------------------------------  ##
##                                  INCLUDES                                  ##
##  ------------------------------------------------------------------------  ##

include $(BD)/*.mk

##  ------------------------------------------------------------------------  ##

PHONY := default

default: run ;
	@ echo "$(DAT) $(FINE): $(TARG)" ;

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
	@ echo "$(DAT) $(BEGIN): $(TARG)"
	gulp --tasks --depth 1 --color
	@ echo "$(DAT) $(FINE): $(TARG)"

tasktree: ;
	@ echo "$(DAT) $(BEGIN): $(TARG)"
	gulp --tasks --depth 2 --color
	@ echo "$(DAT) $(FINE): $(TARG)"

# critical:
# 	@ export NODE_ENV="${APP_ENV}"; npm run crit
	# @ echo "$(DAT) $(FINE): $(TARG)"

##  ------------------------------------------------------------------------  ##
##  Create videos from *.gif files
##  ------------------------------------------------------------------------  ##
PHONY += print-names video

# DIR_IMGS := $(DIR_SRC)/assets/img/works
DIR_IMGS := assets/img/works
GIF_FILES := $(notdir $(wildcard $(DIR_SRC)/$(DIR_IMGS)/*.gif))
BASE_NAMES := $(basename $(GIF_FILES))
MPEG_FILES := $(patsubst %.gif,%.mp4,$(DIR_BUILD)/$(GIF_FILES))
WEBM_FILES := $(patsubst %.gif,%.webm,$(DIR_BUILD)/$(GIF_FILES))

print-names: ;
	@ echo "$(DAT) $(BEGIN): $(TARG)"
	@ echo "$(DAT) DIR_IMGS = $(DIR_IMGS)"
	@ echo "$(DAT) GIF_FILES = $(GIF_FILES)"
	@ echo "$(DAT) BASE_NAMES = $(BASE_NAMES)"
	@ echo "$(DAT) MPEG_FILES = $(MPEG_FILES)"
	@ echo "$(DAT) WEBM_FILES = $(WEBM_FILES)"
	@ echo "$(DAT) $(DONE): $(TARG)"

video: print-names ;
	$(FIGLET) "$(STG)"
	@ echo "$(DAT) $(BEGIN): $(TARG)" ;
	# @ $(foreach fbase, $(BASE_NAMES), $(FMP) -i "$(DIR_IMGS)/$(fbase).gif" -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p -y "$(DIR_IMGS)/$(fbase).mp4" -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" ;)
	$(foreach fbase, $(BASE_NAMES), $(FMP) -i "$(DIR_SRC)/$(DIR_IMGS)/$(fbase).gif" -b:v 0 -crf 25 -f mp4 -vcodec libx264 -y "$(DIR_BUILD)/$(DIR_IMGS)/$(fbase).mp4" -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" ;)
	@ echo "$(DAT) [$(RESULT)] $(Purple)MPEG$(NC) files:"
	ls -ls $(DIR_BUILD)/$(DIR_IMGS)/*.mp4 | grep mp4
	$(foreach fbase, $(BASE_NAMES), $(FMP) -i "$(DIR_SRC)/$(DIR_IMGS)/$(fbase).gif" -c libvpx-vp9 -b:v 0 -crf 41 -y "$(DIR_BUILD)/$(DIR_IMGS)/$(fbase).webm" ;)
	@ echo "$(DAT) [$(RESULT)] $(Purple)WEBM$(NC) files:"
	ls -ls $(DIR_BUILD)/$(DIR_IMGS)/*.webm | grep webm
	@ echo "$(DAT) $(FINE): $(TARG)" ;

##  ------------------------------------------------------------------------  ##

PHONY += pre-update update

setup-deps: ;
	$(FIGLET) "$(STG)"
	@ echo "$(DAT) $(BEGIN): $(TARG)"
	npm i
	bower i --allow-root --production
	touch ./setup-deps
	@ echo "$(DAT) $(DONE): $(TARG)"

setup: setup-deps ;
	$(FIGLET) "$(STG)"
	@ echo "$(DAT) $(BEGIN): $(TARG)"
	touch ./setup
	@ echo "$(DAT) $(FINE): $(TARG)"

pre-build: ;
	@ echo "$(DAT) $(BEGIN): $(TARG)"
	rm -vf build
	@ echo "$(DAT) $(DONE): $(TARG)"

build: setup ;
	$(FIGLET) "$(STG)"
	@ echo "$(DAT) $(BEGIN): $(TARG)"
	export NODE_ENV="${APP_ENV}"; npm run bower
	cd ${WD} && cp -prf ${DIR_SRC}/* ${DIR_BUILD}/
	export NODE_ENV="${APP_ENV}"; npm run build
	touch ./build
	@ echo "$(DAT) $(FINE): $(TARG)"

pre-dist: ;
	@ echo "$(DAT) $(BEGIN): $(TARG)"
	cd ${WD} && rm -vf dist
	@ echo "$(DAT) $(DONE): $(TARG)"

dist: build ;
	$(FIGLET) "$(STG)"
	# @ export NODE_ENV="production"; npm run dist
	cd ${WD} && mkdir -p ${DST}
	cd ${WD} && cp -prf ${BLD}/* ${DST}/
	cd ${WD} && rm -vrf ${DST}/resources
	cd ${WD} && tar -c "${DST}" | gzip -9 > "${ARC}/${APP_NAME}-v${CODE_VERSION}-b${BUILD_CNTR}.tar.gz"
	cd ${WD} && touch ./dist
	@ echo "$(DAT) $(FINE): $(TARG)"

pre-deploy: ;
	# $(FIGLET) "$(STG)"
	@ echo "$(DAT) $(BEGIN): $(TARG)"
	rm -vf deploy
	@ echo "$(DAT) $(DONE): $(TARG)"

deploy: dist video ;
	$(FIGLET) "$(STG)"
	# @ echo "$(DAT) $(BEGIN): $(TARG)"
	cd ${WD} && cp -prv ${DST}/* ${WEB}/
	export NODE_ENV="${APP_ENV}"; npm run deploy
	cd ${WD} && rm -vf webroot 2>&1 >/dev/null
	cd ${WD} && ln -sf ${WEB} webroot
	cd ${WD} && touch ./deploy
	@ echo "$(DAT) $(FINE): $(TARG)"

pre-update: ;
	@ echo "$(DAT) $(BEGIN): $(TARG)"
	cd ${WD} && rm -vf setup setup-deps
	@ echo "$(DAT) $(DONE): $(TARG)"

update: pre-update setup ;
	$(FIGLET) "$(STG)"
	@ echo "$(DAT) $(FINE): $(TARG)"

##  ------------------------------------------------------------------------  ##

PHONY += rebuild redeploy rb rd

rebuild: pre-build build pre-dist dist ;
	$(FIGLET) "$(STG)"
	@ echo "$(DAT) $(DONE): $(TARG)"

redeploy: pre-deploy rebuild deploy ;
	$(FIGLET) "$(STG)"
	@ echo "$(DAT) $(DONE): $(TARG)"

rb: rebuild ;
	# $(FIGLET) "$(STG)"
	@ echo "$(DAT) $(FINE): $(TARG)"

rd: redeploy ;
	# $(FIGLET) "$(STG)"
	@ echo "$(DAT) $(FINE): $(TARG)"


##  ------------------------------------------------------------------------  ##

PHONY += _all full cycle cycle-dev dev dev-setup run watch
#* means the word "all" doesn't represent a file name in this Makefile;
#* means the Makefile has nothing to do with a file called "all" in the same directory.

_all: clean cycle banner ;
	@ echo "$(DAT) $(FINE): $(TARG)"

full: clean-all _all banner ;
	@ echo "$(DAT) $(FINE): $(TARG)"

cycle: dist ;
	@ echo "$(DAT) $(FINE): $(TARG)"

cycle-dev: rd ;
	@ echo "$(DAT) $(DONE): $(TARG)"

dev: clean-dev banner cycle-dev ;
	export NODE_ENV="${APP_ENV}"; npm run dev
	@ echo "$(DAT) $(FINE): $(TARG)"

dev-setup: clean-deps setup banner cycle-dev ;
	@ export NODE_ENV="${APP_ENV}"; npm run dev
	@ echo "$(DAT) $(DONE): $(TARG)"

# run: pre-build pre-dist pre-deploy cycle deploy help banner ;
	@ echo "$(DAT) $(FINE): $(TARG)"
run: pre-build pre-dist pre-deploy build dist deploy banner ;
	$(FIGLET) "$(STG)"
	@ echo "$(DAT) $(FINE): $(TARG)"

watch:
	export NODE_ENV="${APP_ENV}"; npm run watch
	@ echo "$(DAT) $(FINE): $(TARG)"

##  ------------------------------------------------------------------------  ##
##  Declare the contents of the .PHONY variable as phony. We keep that
##  information in a variable so we can use it in if_changed and friends.
.PHONY: $(PHONY)

##  ------------------------------------------------------------------------  ##
