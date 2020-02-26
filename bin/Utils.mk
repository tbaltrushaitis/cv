##  ------------------------------------------------------------------------  ##
##                             Utility Helpers                                ##
##  ------------------------------------------------------------------------  ##

# include bin/Colors
# include bin/.bash_colors

THIS_FILE = $(lastword $(MAKEFILE_LIST))
# $(info [THIS_FILE:${THIS_FILE}])


##  ------------------------------------------------------------------------  ##
##                      Report Environment Variables                          ##
##  ------------------------------------------------------------------------  ##

H1 = ${Yellow}${On_Blue}
H2 = " - "${Blue}
H3 = "\\t"
HR = ${Cyan}"----------------------------------------------------------"${NC}

.PHONY: state

state:;
	@ echo "$(HR)" ;
	@ echo "$(H1) ENVIRONMENT VARS $(NC)" ;
	@ echo "$(H2) APPLICATION $(NC)" ;
	@ echo "$(H3) DT \t\t = [$(Gray) $(DT) $(NC)]" ;
	@ echo "$(H3) TS \t\t = [$(Gray) $(TS) $(NC)]" ;
	@ echo "$(H3) DAT \t\t = $(DAT)" ;
	@ echo "$(H3) APP_NAME \t = [$(Cyan) $(APP_NAME) $(NC)]" ;
	@ echo "$(H3) APP_ENV \t = [$(Red) $(APP_ENV) $(NC)]" ;
	@ echo "$(H3) APP_LOGO \t = [$(White)$(APP_LOGO)$(NC)]" ;
	@ echo "$(H3) APP_DEBUG \t = [$(APP_DEBUG)]" ;
	@ echo "$(H2) REPOSITORY $(NC)" ;
	@ echo "$(H3) APP_REPO \t = [$(White) $(APP_REPO) $(NC)]" ;
	@ echo "$(H3) GIT_BRANCH \t = [$(White) $(GIT_BRANCH) $(NC)]" ;
	@ echo "$(H3) GIT_COMMIT \t = [$(Yellow) $(GIT_COMMIT) $(NC)]" ;
	@ echo "$(H2) ENGINE $(NC)" ;
	@ echo "$(H3) WD \t\t = [$(WD)]" ;
	@ echo "$(H3) DIR_SRC \t = [$(DIR_SRC)]" ;
	@ echo "$(H2) TARGETS $(NC)" ;
	@ echo "$(H3) CODE_VERSION \t = [$(Yellow) $(CODE_VERSION) $(NC)]" ;
	@ echo "$(H3) BUILD_COUNTER \t = [$(Purple) $(BUILD_CNTR) $(NC)]" ;
	@ echo "$(H2) DIRS $(NC)" ;
	@ echo "$(H3) DIR_BUILD \t = [$(DIR_BUILD)]" ;
	@ echo "$(H3) DIR_DIST \t = [$(DIR_DIST)]" ;
	@ echo "$(H3) DIR_WEB \t = [$(Orange) $(DIR_WEB) $(NC)]" ;
	@ echo "$(HR)" ;

# @ cat ${APP_LOGO} ;

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
