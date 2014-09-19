/*V1.0*/

(function($){
	$.fn.blockmanager = function(args, callback){
        var _this = this;
        _this.data = {
            blocks : [],
            overlay_height: 100,
            block_height: 100,
            block_selector: ".block",
            block_container: ".block_container",
            currentblock : 0,
            overlay:{}
        };

        _this.next = function(callback) {
            if(_this.data.currentblock < (_this.data.blocks.length)) {
                _this.goTo((_this.data.currentblock + 1), callback);
                _this.trigger("next");
            }
        }

        _this.previous = function(callback) {
            if(_this.data.currentblock > 1){
                _this.goTo((_this.data.currentblock - 1), callback);
                _this.trigger("previous");
            }
        }

        _this.goTo = function(n, callback) {
            console.log("goto", n);
            _this.data.currentblock = n;

            updateBlockData(n);

            if(n == 1) {
                $(_this.data.block_container).css("top", "100px");
            }
            else {
                if(n == 2)
                    $(_this.data.block_container).css("top", "-20px");
                else {
                    var nextPixel = (Math.abs((n-2)*120) * -1) - 20;
                    $(_this.data.block_container).css("top", (nextPixel +"px"));
                }
            }

            if(callback)
                callback(_this);
        } 

        var updateBlockData = function(n){
            var previousIndex, currentIndex;
            currentIndex = (n - 1);
            previousIndex = currentIndex == 0 ? -1 : currentIndex - 1

            // Loop through blocks
            for(var i = 0; i < (_this.data.blocks.length); i++){
                if(i == currentIndex){
                    _this.data.blocks[i].current = false;
                    processCSSPosition("current", $(_this.data.blocks[i].html));
                }
                else if(i == previousIndex){
                    _this.data.blocks[i].current = true;
                    processCSSPosition("previous", $(_this.data.blocks[i].html));
                }
                else if(i > currentIndex){
                    _this.data.blocks[i].current = false;
                    processCSSPosition("queue", $(_this.data.blocks[i].html));
                }
                else{
                    _this.data.blocks[i].current = false;
                    processCSSPosition("default", $(_this.data.blocks[i].html));
                }
            }
        }

        var processCSSPosition = function(status, $element){
            switch(status)
            {
                case "previous" : {
                    $element.addClass("previous");

                    if($element.hasClass("current"))
                        $element.removeClass("current");

                    if($element.hasClass("queue"))
                        $element.removeClass("queue");

                    break;
                }

                case "current" : {
                    $element.addClass("current");

                    if($element.hasClass("previous"))
                        $element.removeClass("previous");

                    if($element.hasClass("queue"))
                        $element.removeClass("queue");

                    break;
                }

                case "queue" : {
                    $element.addClass("queue");

                    if($element.hasClass("previous"))
                        $element.removeClass("previous");

                    if($element.hasClass("current"))
                        $element.removeClass("current");

                    break;
                }
                default:{
                    if($element.hasClass("queue"))
                        $element.removeClass("queue");

                    if($element.hasClass("previous"))
                        $element.removeClass("previous");

                    if($element.hasClass("current"))
                        $element.removeClass("current");

                    break;
                }
            }
        }

        var moveContainer = function(){

        }

        var processBlockEvents = function(){
            // check if block is current

            // or check if block previous

            //
        }

        var registerBlock = function(element){
            _this.data.blocks.push(new blockEntity(element));
        }

        var blockEntity = function(element){
            this.html = element;
            this.current = false;
            this.style = this.html.style;
            return this;
        }

        var _initialize = function(args, callback){
            $.extend(_this.data, args);

            var blck_lngth = $(_this.data.block_selector).length;
            if(blck_lngth > 0)  {
                _this.data.currentblock = 1;
                for(var i = 0; i < blck_lngth; i++){
                    registerBlock($(_this.data.block_selector)[i]);
                }
            }

            if(_this.data.currentblock > 0 && _this.data.currentblock < (_this.data.blocks.length + 1)) {
                _this.goTo(_this.data.currentblock, callback)
            }
        }
        this.constructor = _initialize(args, callback);

        return this;
    }        
}(jQuery))