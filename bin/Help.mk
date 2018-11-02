##  ------------------------------------------------------------------------  ##
##                              Show help topic                               ##
##  ------------------------------------------------------------------------  ##

.PHONY: help

help: banner
	@ echo ${BCyan}---------------------------------------------------------${NC};
	@ echo ${BBlue}AVAILABLE ${BWhite}CLI-Commands:${NC};
	@ echo "\t" make ${BPurple}clean${NC} "\t" - CLEAR directories and delete files;
	@ echo "\t" make ${BPurple}setup${NC} "\t" - Check for installations of php, node, bower and other dependencies;
	@ echo "\t" make ${BPurple}build${NC} "\t" - BUILD project from sources;
	@ echo "\t" make ${BPurple}release${NC} "\t" - COMPILE project distro;
	@ echo "\t" make ${BPurple}deploy${NC} "\t" - DEPLOY compiled project to \"webroot\" directory;
	@ echo "\t" make ${BRed}all${NC} "\t" - Run ${BYellow}all${NC} operations for current stage from NODE_ENV file;
	@ echo "\t" make ${BRed}rebuild${NC} "\t" - Run [${BYellow}build, release, deploy${NC}] tasks;
	@ echo "\t" make ${BRed}redeploy${NC} " " - Run [${BYellow}rebuild, deploy${NC}] tasks;
	@ echo ${BCyan}---------------------------------------------------------${NC};

##  ------------------------------------------------------------------------  ##
