##  ------------------------------------------------------------------------  ##
##                             Utility Helpers                                ##
##  ------------------------------------------------------------------------  ##

.ONESHELL:

# include ./bin/.bash_colors
# include bin/Colors
include bin/.bash_colors

##  ------------------------------------------------------------------------  ##
##                      Report Environment Variables                          ##
##  ------------------------------------------------------------------------  ##

.PHONY: state

state:
	@ echo ${BCyan}---------------------------------------------------------${NC};
	@ echo ${Orange}${On_Blue}ENVIRONMENT VARS:${NC};
	@ echo ${BCyan}APPLICATION:${NC};
	@ echo "\t DT \t\t = ${DT}";
	@ echo "\t APP_NAME \t = ${APP_NAME}";
	@ echo "\t APP_ENV \t = ${BRed}${APP_ENV}${NC}";
	@ echo "\t APP_DEBUG \t = ${APP_DEBUG}";
	@ echo "\t APP_LOGO \t = ${APP_LOGO}";
	@ echo ${BCyan}REPOSITORY:${NC};
	@ echo "\t APP_BRANCH \t = ${APP_BRANCH}";
	@ echo "\t APP_REPO \t = ${APP_REPO}";
	@ echo "\t GIT_COMMIT \t = ${Yellow}${GIT_COMMIT}${NC}";
	@ echo ${BCyan}ENGINE:${NC};
	@ echo "\t WD \t\t = ${WD}";
	@ echo "\t DIR_SRC \t = ${DIR_SRC}";
	@ echo ${BCyan}TARGETS:${NC};
	@ echo "\t DIR_BUILD \t = ${DIR_BUILD}";
	@ echo "\t DIR_DIST \t = ${DIR_DIST}";
	@ echo "\t DIR_WEB \t = ${DIR_WEB}";
	@ echo ${BCyan}---------------------------------------------------------${NC};


##  ------------------------------------------------------------------------  ##
##                            Show project banner                             ##
##  ------------------------------------------------------------------------  ##

.PHONY: banner

banner:
	@ if [ -f "${APP_LOGO}" ]; then cat "${APP_LOGO}"; fi


##  ------------------------------------------------------------------------  ##
##                 Lists all targets defined in this makefile                 ##
##  ------------------------------------------------------------------------  ##

.PHONY: list
list:
	@$(MAKE) -pRrn : -f $(MAKEFILE_LIST) 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | egrep -v -e '^[^[:alnum:]]' -e '^$@$$' | sort


##  ------------------------------------------------------------------------  ##
##                 Set/fix files and dirs owners and permissions              ##
##  ------------------------------------------------------------------------  ##

.PHONY: rights

rights:
	@ find . -type f -exec chmod 664 {} 2>/dev/null \;
	@ find . -type d -exec chmod 775 {} 2>/dev/null \;
	@ find . -type f -name "*.sh" -name "*.mk" -exec chmod a+x {} 2>/dev/null \;

##  ------------------------------------------------------------------------  ##
