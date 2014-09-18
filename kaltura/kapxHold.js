mw.kalturaPluginWrapper(function(){

	mw.PluginManager.add( 'kapxHold', mw.KBaseComponent.extend({

		defaultConfig: {
			parent: "videoHolder",
			order: 41,
			displayImportance: 'high',
			align: "right",
			cssClass: "break-slate",
			title: 'We are taking a break !!!',
			img: "/kaltura/kapx-hold-template.gif"
		},
		getComponent: function() {
			if( !this.$el ) {
				var $img = [];
				$img = $( '<img style="width:100%;position: absolute; height: 100%" />' )
					.attr({
						alt: this.getConfig('title'),
						src: this.getConfig('img')
					});
				this.$el = $('<div style="width:100%;position: absolute; height: 100%" />')
					.addClass ( this.getCssClass() )
					.append( $img );

				this.$el.hide();
			}
			return this.$el;
		} ,

		setup: function(){

			var _this = this;
            _this.isReady = false;
            _this.isPaused = false;
			var playerInPlugin = this.embedPlayer;

			$(this.embedPlayer).bind('playerReady',function(){
                _this.isReady = true;
			});
/*
			$(this.embedPlayer).bind('monitorEvent',function(){
			});
			$(this.embedPlayer).bind('onpause',function(){
			});
			$(this.embedPlayer).bind('onplay',function(){
			});
			$(this.embedPlayer).bind('seeked',function(){
			});
			$(this.embedPlayer).bind('onOpenFullScreen',function(){
			});
			$(this.embedPlayer).bind('mediaLoaded',function(){
			});
			$(this.embedPlayer).bind('firstPlay',function(){
			});

*/
			$(this.embedPlayer).bind('volumeChanged',function(){
				//turn on the muted flag only if the end user muted and not if this plugin
				//muted. This is so we will not get on muted after this plugin turn the volume to 0
				if(!_this.externalMute){
					if(_this.getPlayer().volume == 0) {
						_this.muted = true;
					}else{
						_this.muted = false;
					}
				}
			});
			$(this.embedPlayer).bind('kapxPauseVideo',function(){
				if (_this.isReady && !_this.isPaused) {
                    // TODO: Implement a more efficient mechanism to prevent constant calls to this method.
                    // KAPx.console.log('kapxHold.kapxPauseVideo');
                    _this.$el.show();
                    _this.embedPlayer.getInterface().find( ".controlsContainer").hide();
                    //mute only if the end user was unmuted
                    if(!_this.muted){
                        _this.externalMute = true;
                        _this.getPlayer().toggleMute();
                        _this.externalMute = false;
                    }
                    _this.isPaused = true;
                }
			});
			$(this.embedPlayer).bind('kapxResumeVideo',function(){
				if (_this.isReady) {
                    // KAPx.console.log('kapxHold.kapxResumeVideo');
                    _this.$el.hide();
                    _this.embedPlayer.getInterface().find( ".controlsContainer").show();
                    //unmute only if the end user was unmuted before the break
                    if(!_this.muted){
                        _this.getPlayer().toggleMute();
                    }
                    _this.isPaused = false;
                }
			});

		}

	}));

});