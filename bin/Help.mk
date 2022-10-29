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
	@ echo "$(H1) Commands$(NC):" ;
	@ echo "$(H3) make $(Green)help$(NC) \t\t - Show $(White)usage$(NC) info" ;
	@ echo "$(H3) make $(Green)state$(NC) \t\t - Print environment settings" ;
	@ echo "$(H3) make $(Green)test$(NC) \t\t - Perform various tests" ;
	@ echo "$(H3) make $(Yellow)clean$(NC) \t\t - CLEAR directories and delete files" ;
	@ echo "$(H3) make $(Yellow)setup$(NC) \t\t - Check for installations of node, bower and other dependencies" ;
	@ echo "$(H3) make $(Yellow)build$(NC) \t\t - BUILD project from sources into [$(Cyan)$(BLD)$(NC)]" ;
	@ echo "$(H3) make $(Yellow)dist$(NC) \t\t - compile project $(White)distro$(NC) in [$(Cyan)$(DST)$(NC)]" ;
	@ echo "$(H3) make $(Yellow)deploy$(NC) \t\t - SYNC compiled project $(White)distro$(NC) to public dir [$(Cyan)$(WEB)$(NC)]" ;
	@ echo "$(H3) make $(Yellow)rebuild$(NC), $(BYellow)rb$(NC) \t - Run [$(White)build$(NC), $(White)dist$(NC)] tasks" ;
	@ echo "$(H3) make $(Yellow)redeploy$(NC), $(BYellow)rd$(NC) \t - Run [$(White)rebuild$(NC), $(White)deploy$(NC)] tasks" ;
	@ echo "$(H3) make $(Orange)all$(NC) \t\t - Run $(White)all$(NC) defined tasks for current stage [$(Red)$(APP_ENV)$(NC)] which was read from [$(Cyan)NODE_ENV$(NC)]" ;
	@ echo "$(HR)" ;

##  ------------------------------------------------------------------------  ##
