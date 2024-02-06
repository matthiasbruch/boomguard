var gameTile = function(mapTile, config) {
    let container = null;
    let sprite = null;
    let skullSprite = null;
    let tileSourceSize = 172;
    let isBatchMarked = false;
    let isDisabled = false;

    function createSprite(assetName) {
        if (sprite !== null) {
            sprite.destroy();
        }
        
        if (skullSprite !== null) {
            skullSprite.destroy();
        }

        sprite = new PIXI.Sprite(assetName);
        sprite.anchor.x = 0;
        sprite.anchor.y = 0;

        sprite.scale.x = config.tileWidthAndHeight / tileSourceSize;
        sprite.scale.y = config.tileWidthAndHeight / tileSourceSize;

        skullSprite = new PIXI.Sprite(config.assetRegister['skull']);
        skullSprite.visible = false;
        skullSprite.anchor.x = 0;
        skullSprite.anchor.y = 0;

        skullSprite.scale.x = config.tileWidthAndHeight / tileSourceSize;
        skullSprite.scale.y = config.tileWidthAndHeight / tileSourceSize;

        container.addChild(sprite);
        container.addChild(skullSprite);
    }

    function createLabel() {
        var label = null;
        if (mapTile.tileType == 'number') {
            label = mapTile.bombCount + '';
        }
        else if (mapTile.tileType == 'bomb') {
            label = '💣';
        }

        if (label !== null) {
            var textElement = new PIXI.Text(
                label,
                labelHelper.getConfigForTileLabel(labelHelper.getColorForLabel(label))
            );

            textElement.x = config.tileWidthAndHeight / 2 - ((mapTile.tileType == 'bomb') ? 10 : 5);
            textElement.y = config.tileWidthAndHeight / 2 - 10;
            
            container.addChild(textElement);
        }
    }

    function bindEvent(eventName, callback) {
        if (callback) {
            container.on(eventName, (mouseEvent) => { callback(mapTile, mouseEvent); });
        }
    }

    mapTile.markTile = function() {
        skullSprite.visible = true;
        isDisabled = true;
    }

    mapTile.highlightTile = function(batch) {
        if (!isDisabled || !batch) {
            if (batch) {
                isBatchMarked = true;
            }

            sprite.tint = '#00FF00';
        }
    }

    mapTile.unlightTile = function(batch) {
        if (batch) {
            isBatchMarked = false;
        }

        if (!isBatchMarked) {
            sprite.tint = '#FFFFFF';
        }
    }

    mapTile.reveal = function(skipEvent) {
        if (!isDisabled) {
            isBatchMarked = false;

            createSprite(config.assetRegister['empty']);
            createLabel();
    
            if (!skipEvent && config.onReveal) {
                config.onReveal(mapTile); 
            }

            isDisabled = true;
        }
    }

    mapTile.getTileCenter = function() {
        return {
            xPos: container.x + (config.tileWidthAndHeight / 2),
            yPos: container.y + (config.tileWidthAndHeight / 2)
        }
    }

    container = new PIXI.Container();
    container.eventMode = 'static';
    container.x = mapTile.xPos * config.tileWidthAndHeight + config.offsetX;
    container.y = mapTile.yPos * config.tileWidthAndHeight + config.offsetY;

    createSprite(config.assetRegister[mapTile.coverType]);
    
    bindEvent('rightclick', config.mouseRightClick);
    bindEvent('mousedown', config.mouseDown);
    bindEvent('mouseup', config.mouseUp);

    // Highlight action
    container.on('mouseover', () => mapTile.highlightTile());
    container.on('mouseleave', () => mapTile.unlightTile());

    return container;
};