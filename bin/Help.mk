##  ------------------------------------------------------------------------  ##
##                              Show help topic                               ##
##  ------------------------------------------------------------------------  ##

.PHONY: help

help: banner
	@ echo ${BCyan}---------------------------------------------------------${NC};
	@ echo ${BBlue}DEVELOPMENT${NC} ${White}Commands${NC}:;
	@ echo "\t" make ${Purple}clean${NC} "\t" - CLEAR directories and delete files;
	@ echo "\t" make ${Purple}setup${NC} "\t" - Check for installations of php, node, bower and other dependencies;
	@ echo "\t" make ${Purple}build${NC} "\t" - BUILD project from sources;
	@ echo "\t" make ${Purple}release${NC} "\t" - COMPILE project distro;
	@ echo "\t" make ${BPurple}deploy${NC} "\t" - sync public dir [${Yellow}${DIR_WEB}${NC}] with compiled project distro [${Cyan}$(DIR_DIST)${NC}];
	@ echo "\t" make ${BRed}rebuild${NC} "\t" - Run [${Yellow}build, release, deploy${NC}] tasks;
	@ echo "\t" make ${BRed}redeploy${NC} " " - Run [${Yellow}rebuild, deploy${NC}] tasks;
	@ echo "\t" make ${BRed}all${NC} "\t" - Run ${Yellow}all${NC} defined tasks for current stage [${Red}$(APP_ENV)${NC}] read from ${Cyan}NODE_ENV${NC};
	@ echo ${BCyan}---------------------------------------------------------${NC};

##  ------------------------------------------------------------------------  ##
