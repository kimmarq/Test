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
            overlay: {},
            block_entity_positions: { previous : -1, current: 0, queue: 1 }
        };

        _this.next = function(callback) {
            if(_this.data.currentblock < (_this.data.blocks.length)) {
                goTo((_this.data.currentblock + 1), callback);
                _this.trigger("next");
            }
        }

        _this.previous = function(callback) {
            if(_this.data.currentblock > 1){
                goTo((_this.data.currentblock - 1), callback);
                _this.trigger("previous");
            }
        }

        // INVISIBLE.
        var goTo = function(n, callback) {
            // UPDATING BLOCK ENTITY VARIABLES.
            updateBlockData(n);

            // MOVING CONTAINER ACCORDING STYLES.
            moveContainer(n);

            // CALL EXISTS => EXECUTE.
            if(callback)
                callback(_this);
        } 

        var updateBlockData = function (n) {
            _this.data.currentblock = n;

            var previousIndex, currentIndex;
            currentIndex = (n - 1);
            previousIndex = currentIndex == 0 ? -1 : currentIndex - 1

            // Loop through blocks
            for(var i = 0; i < (_this.data.blocks.length); i++){
                if (i == currentIndex) {
                    _this.data.blocks[i].updateBlockPosition(_this.data.block_entity_positions.current);
                }
                else if (i <= previousIndex) {
                    _this.data.blocks[i].updateBlockPosition(_this.data.block_entity_positions.previous);
                }
                else if (i > currentIndex) {
                    _this.data.blocks[i].updateBlockPosition(_this.data.block_entity_positions.queue);
                }
                else {
                    _this.data.blocks[i].updateBlockPosition(-2);
                }
            }
        }

        // MOVE CONTAINER.
        var moveContainer = function(n){
            if (n == 1) {
                $(_this.data.block_container).css("top", "100px");
            }
            else {
                if (n == 2)
                    $(_this.data.block_container).css("top", "-20px");
                else {
                    var nextPixel = (Math.abs((n - 2) * 120) * -1) - 20;
                    $(_this.data.block_container).css("top", (nextPixel + "px"));
                }
            }
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

        /* UPDATE BLOCK ENTITY */
        blockEntity.prototype.updateBlockPosition = function (pos) {
            switch (pos) {
                case -1: {
                    this.current = false;
                    $(this.html).addClass("previous").removeClass("current").removeClass("queue"); break;
                }
                case 0: {
                    this.current = true;
                    $(this.html).addClass("current").removeClass("previous").removeClass("queue"); break;
                }
                case 1: {
                    this.current = false;
                    $(this.html).addClass("queue").removeClass("previous").removeClass("current"); break;
                }
                default: {
                    this.current = false;
                    $(this.html).removeClass("queue").removeClass("previous").removeClass("current"); break;
                }
            }
        }

        var _initialize = function(args, callback){
            $.extend(_this.data, args);

            // REGISTERING BLOCKS.
            var blck_lngth = $(_this.data.block_selector).length;
            if(blck_lngth > 0)  {
                _this.data.currentblock = 1;
                for(var i = 0; i < blck_lngth; i++){
                    registerBlock($(_this.data.block_selector)[i]);
                }
            }

            // PROVIDED CURRENT BLOCK BY USER COULD NOT BE WITHIN RANGE.
            if(_this.data.currentblock > 0 && _this.data.currentblock < (_this.data.blocks.length + 1)) {
                goTo(_this.data.currentblock, callback)
            }
        }
        this.constructor = _initialize(args, callback);

        return this;
    }        
}(jQuery))