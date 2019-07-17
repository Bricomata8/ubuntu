# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# don't put duplicate lines or lines starting with space in the history.
# See bash(1) for more options
HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=1000
HISTFILESIZE=2000

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# If set, the pattern "**" used in a pathname expansion context will
# match all files and zero or more directories and subdirectories.
#shopt -s globstar

# make less more friendly for non-text input files, see lesspipe(1)
#[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# set variable identifying the chroot you work in (used in the prompt below)
if [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

# set a fancy prompt (non-color, unless we know we "want" color)
case "$TERM" in
    xterm-color|*-256color) color_prompt=yes;;
esac

# uncomment for a colored prompt, if the terminal has the capability; turned
# off by default to not distract the user: the focus in a terminal window
# should be on the output of commands, not on the prompt
#force_color_prompt=yes

if [ -n "$force_color_prompt" ]; then
    if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
	# We have color support; assume it's compliant with Ecma-48
	# (ISO/IEC-6429). (Lack of such support is extremely rare, and such
	# a case would tend to support setf rather than setaf.)
	color_prompt=yes
    else
	color_prompt=
    fi
fi

if [ "$color_prompt" = yes ]; then
    PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
else
    PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
fi
unset color_prompt force_color_prompt

# If this is an xterm set the title to user@host:dir
case "$TERM" in
xterm*|rxvt*)
    PS1="\[\e]0;${debian_chroot:+($debian_chroot)}\u@\h: \w\a\]$PS1"
    ;;
*)
    ;;
esac

# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    alias dir='dir --color=auto'
    alias vdir='vdir --color=auto'

    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi

# colored GCC warnings and errors
#export GCC_COLORS='error=01;31:warning=01;35:note=01;36:caret=01;32:locus=01:quote=01'

# some more ls aliases
#alias ll='ls -l'
#alias la='ls -A'
#alias l='ls -CF'

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi

############################################################

export PATH=$PATH:/home/aghiles/Aghiles/Tool/commands::/home/aghiles/Aghiles/Tool/commands/x
export ONOS_ROOT="/home/aghiles/Aghiles/Program/gw/sdn/tool/onos"
source $ONOS_ROOT/tools/dev/bash_profile
alias trans='trans -b -t fr'
alias xd='tracker tag -ts'
alias matlab='/usr/local/MATLAB/R2016b/bin/matlab'
alias matlabx='/usr/local/MATLAB/R2016b/bin/matlab -nodesktop -nosplash -r'

export PATH=/home/aghiles/Downloads/Software/omnetpp-5.5.1/bin:$PATH

flash (){
sudo dd $1 $2 bs=1M status=progress && sync
}

# function to set terminal title  
function set-title() {
  if [[ -z "$ORIG" ]]; then
    ORIG=$PS1
  fi
  TITLE="\[\e]2;$*\a\]"
  PS1=${ORIG}${TITLE}
}

alias arduino-compile='arduino-cli compile --fqbn arduino:avr:uno'
alias arduino-exec='arduino-cli upload -p /dev/ttyACM0 --fqbn arduino:avr:uno'
alias arduino-log='set-title Arduino;screen /dev/ttyACM0 38400'
alias arduino-update='arduino-cli core update-index'

## --------------------------------------------------
##------ NS3 + WAF + NetAnim
NS_Path=/usr/local/ns3
NSdir=ns-3.26
NetAnimDir=netanim-3.107
NSallinonedir=ns-allinone-3.26

waf=$NS_Path/$NSallinonedir/$NSdir/
NetAnim=$NS_Path/$NSallinonedir/$NetAnimDir/
PATH=$PATH:$waf:$NetAnim

## run waf with output at dir:
alias wafo='waf --cwd=$PWD --run '

## run waf with output at dir + animation:
alias wafvo='waf --cwd=$PWD --visualize --run '

## --------------------------------------------------

#function waf {
#    CWD="$PWD"
#    cd $NS3CUR >/dev/null
#    waf --cwd="$CWD" $*
#    cd - >/dev/null
#}

#function wafr {
#    waf --run "$*"
#}


