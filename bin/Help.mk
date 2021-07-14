##  ------------------------------------------------------------------------  ##
##                              Show help topic                               ##
##  ------------------------------------------------------------------------  ##

THIS_FILE = $(lastword $(MAKEFILE_LIST))
# $(info [THIS_FILE:$(THIS_FILE)])

##  ------------------------------------------------------------------------  ##

H1 = ${Yellow}${On_Blue}
H2 = " - "${Blue}
H3 = "\\t"
HR = ${Cyan}"----------------------------------------------------------"${NC}

.PHONY: help

help: banner
	@ echo "$(HR)" ;
	@ echo "$(H1) DEVELOPMENT Commands $(NC):" ;
	@ echo "$(H3) make $(Yellow)help$(NC) \t - show usage info" ;
	@ echo "$(H3) make $(Yellow)clean$(NC) \t - CLEAR directories and delete files" ;
	@ echo "$(H3) make $(Yellow)setup$(NC) \t - Check for installations of node, bower and other dependencies" ;
	@ echo "$(H3) make $(Yellow)build$(NC) \t - BUILD project from sources into [$(Cyan) $(DIR_BUILD) $(NC)]" ;
	@ echo "$(H3) make $(Yellow)dist$(NC) \t - compile project $(White)distro$(NC) to [$(Cyan) $(DIR_DIST) $(NC)]" ;
	@ echo "$(H3) make $(Yellow)deploy$(NC) \t - SYNC public dir [$(Cyan) $(DIR_WEB) $(NC)] with compiled project $(White)distro$(NC)" ;
	@ echo "$(H3) make $(Red)rebuild$(NC) \t - Run [$(White)build$(NC), $(White)dist$(NC)] tasks" ;
	@ echo "$(H3) make $(Red)redeploy$(NC)   - Run [$(White)rebuild$(NC), $(White)deploy$(NC)] tasks" ;
	@ echo "$(H3) make $(Red)all$(NC) \t - Run $(White)all$(NC) defined tasks for current stage [$(Red) $(APP_ENV) $(NC)] which was read from [$(Cyan) NODE_ENV $(NC)]" ;
	@ echo "$(HR)" ;

##  ------------------------------------------------------------------------  ##
