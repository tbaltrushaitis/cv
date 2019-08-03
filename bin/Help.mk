##  ------------------------------------------------------------------------  ##
##                              Show help topic                               ##
##  ------------------------------------------------------------------------  ##

THIS_FILE = $(lastword $(MAKEFILE_LIST))
$(info [THIS_FILE:$(THIS_FILE)])

##  ------------------------------------------------------------------------  ##

.PHONY: help

help: banner
	@ echo ${BCyan}---------------------------------------------------------${NC};
	@ echo ${BBlue}DEVELOPMENT${NC} ${White}Commands${NC}:;
	@ echo "\t" make ${Purple}help${NC} "\t" - show usage info;
	@ echo "\t" make ${Yellow}clean${NC} "\t" - CLEAR directories and delete files;
	@ echo "\t" make ${Yellow}setup${NC} "\t" - Check for installations of node, bower and other dependencies;
	@ echo "\t" make ${Yellow}build${NC} "\t" - BUILD project from sources into [${Cyan}$(DIR_BUILD)${NC}];
	@ echo "\t" make ${Yellow}dist${NC} "\t" - COMPILE project distro to [${Cyan}$(DIR_DIST)${NC}];
	@ echo "\t" make ${BYellow}deploy${NC} "\t" - SYNC public dir [${Purple}${DIR_WEB}${NC}] with compiled project distro;
	@ echo "\t" make ${BRed}rebuild${NC} "\t" - Run [${White}build${NC}, ${White}release${NC}, ${White}deploy${NC}] tasks;
	@ echo "\t" make ${BRed}redeploy${NC} " " - Run [${White}rebuild${NC}, ${White}deploy${NC}] tasks;
	@ echo "\t" make ${BRed}all${NC} "\t" - Run ${White}all${NC} defined tasks for current stage [${Red}$(APP_ENV)${NC}] which is read from [${Cyan}NODE_ENV${NC}];
	@ echo ${BCyan}---------------------------------------------------------${NC};

##  ------------------------------------------------------------------------  ##
