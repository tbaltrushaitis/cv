##  ------------------------------------------------------------------------  ##
##                              Show help topic                               ##
##  ------------------------------------------------------------------------  ##

include ./bin/.bash_colors

##  ------------------------------------------------------------------------  ##

.PHONY: help

help: banner
	@ echo ${BCyan}---------------------------------------------------------${NC};
	@ echo ${BBlue}AVAILABLE ${BWhite}CLI-Commands:${NC};
	@ echo "\t" make ${BPurple}clean${NC} "\t" - CLEAR directories and delete files;
	@ echo "\t" make ${BPurple}setup${NC} "\t" - check for php, node and bower installations;
	@ echo "\t" make ${BPurple}build${NC} "\t" - BUILD project from sources;
	@ echo "\t" make ${BPurple}release${NC} "\t" - COMPILE project distro;
	@ echo "\t" make ${BPurple}deploy${NC} "\t" - DEPLOY compiled project to \"webroot\" directory;
	@ echo "\t" make ${BRed}all${NC} "\t" -${BGreen}Run all operations for current stage from NODE_ENV file${NC};
	@ echo "\t" make ${BRed}rebuild${NC} "\t" -${BGreen}Execute [build, release, deploy] tasks${NC};
	@ echo "\t" make ${BRed}redeploy${NC} " "-${BGreen}Execute [rebuild, deploy] tasks${NC};
	@ echo ${BCyan}---------------------------------------------------------${NC};

##  ------------------------------------------------------------------------  ##
