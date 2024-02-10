var gameTile = function(mapTile, config) {
    let container = null;
    let sprite = null;
    let skullSprite = null;
    let tileSourceSize = 172;
    let isBatchMarked = false;
    let isDisabled = false;
    let isRevealed = false;
    let textElement = null;

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
        if (textElement) {
            textElement.destroy();
            textElement = null;
        }
        
        let label = null;
        if (mapTile.tileType == 'number') {
            label = mapTile.bombCount + '';
        }
        else if (mapTile.tileType == 'bomb') {
            label = '💣';
        }

        if (label !== null) {
            textElement = new PIXI.Text(
                label,
                labelHelper.getConfigForTileLabel(labelHelper.getColorForLabel(label), true)
            );

            textElement.x = config.tileWidthAndHeight / 2 - ((mapTile.tileType == 'bomb') ? 10 : 5);
            textElement.y = config.tileWidthAndHeight / 2 - 10;

            container.addChild(textElement);
        }
    }

    function bindEvent(eventName, callback) {
        if (callback) {
            container.on(eventName, (mouseEvent) => { 
                container.cursor = 'pointer';
                callback(mapTile, mouseEvent); 
            });
        }
    }

    mapTile.showHidden = function() {
        if (!textElement) {
            createLabel();
        }
    }

    mapTile.isTileRevealed = function() {
        return isRevealed;
    }

    mapTile.toggleTileMarking = function() {
        if (!isRevealed) {
            if (isDisabled) {
                statHelper.decreaseStat(statHelper.statType.MarkedBombs);
                skullSprite.visible = false;
                isDisabled = false;
            }
            else {
                if (textElement) {
                    textElement.destroy();
                    textElement = null;
                }

                statHelper.increaseStat(statHelper.statType.MarkedBombs);
                skullSprite.visible = true;
                isDisabled = true;
            }
        }
    }

    mapTile.highlightTile = function(batch) {
        container.cursor = interactionHelper.getNextMode() || 'pointer';

        if (!isDisabled || !batch) {
            if (batch) {
                isBatchMarked = true;
            }

            sprite.tint = '#00FF00';
        }
    }

    mapTile.unlightTile = function(batch) {
        container.cursor = 'pointer';

        if (batch) {
            isBatchMarked = false;
        }

        if (!isBatchMarked) {
            sprite.tint = '#FFFFFF';
        }
    }

    mapTile.reveal = function(skipEvent) {
        if (!isDisabled && !isRevealed) {
            isBatchMarked = false;

            createSprite(config.assetRegister['empty']);
            createLabel();
    
            if (mapTile.tileType === 'bomb') {
                statHelper.increaseStat(statHelper.statType.DetonatedBombs);
            }

            if (!skipEvent && config.onReveal) {
                config.onReveal(mapTile); 
            }

            isDisabled = true;
            isRevealed = true;
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
    container.cursor = 'pointer';
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