var gui=require("nw.gui"),moment=require("moment"),fs=require("fs"),win=gui.Window.get().enterFullscreen();window.debugLevel=10,window.menu=new Menu({}),window.session=new Session({}),window.eventLog=new Logger,window.network=new Network,$(".arrow-next").click(function(){session.nextStage()}),$(".arrow-prev").click(function(){session.prevStage()});