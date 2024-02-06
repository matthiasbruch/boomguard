var gameStage = function() {
    let appInstance = null;
    let assetTileList = null;
    
    async function initialize(app) {
        appInstance = app;
        explosionHelper.initialize(appInstance);

        assetTileList = ['desert1', 'desert2', 'desert3', 'desert4', 'empty', 'skull'];

        for (var assetTileIdx = 0; assetTileIdx < assetTileList.length; assetTileIdx++) {
            var assetName = assetTileList[assetTileIdx];

            // Texture loading and caching
            assetRegister[assetName] = await PIXI.Assets.load('images/tiles/' + assetName + '.png')
        }
    }
    
    const NUMBER_OF_COLUMNS = 30;
    const NUMBER_OF_ROWS = 18;
    let assetRegister = {};
    let map = null;

    function start() {
        var tileWidthAndHeight = Math.floor(800 / NUMBER_OF_COLUMNS);
        var offsetX = 10;
        var offsetY = 60;
        var numberOfBombs = 99;

        map = mapHelper.generateMap(NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, numberOfBombs);

        for (var x = 0; x < NUMBER_OF_COLUMNS; x++) {
            for (var y = 0; y < NUMBER_OF_ROWS; y++) {
                var tileKey = x + '_' + y

                map[tileKey].coverType = assetTileList[Math.floor(Math.random() * 4)];

                map[tileKey].sprite = gameTile(map[tileKey], {
                    offsetX: offsetX,
                    offsetY: offsetY,
                    assetRegister: assetRegister,
                    tileWidthAndHeight: tileWidthAndHeight,
                    mouseDown: handleTileMouseDown,
                    mouseUp: handleTileMouseUp,
                    mouseRightClick: handleTileRightClick,
                    onReveal: handleTileReveal
                });

                map[tileKey].sprite.children[0].tint = (map[tileKey].tileType == 'empty') ? '#FF0000': '#FFFFFF';

                appInstance.stage.addChild(map[tileKey].sprite);
            }
        }
    }

    function handleTileMouseDown(mapTile, mouseEvent) {
        if (mouseEvent.data.button === 1) {
            batchHighlightTiles(mapTile);
        }
    }

    function handleTileMouseUp(mapTile, mouseEvent) {
        if (mouseEvent.data.button === 0) {
            mapTile.reveal(); 
            handleTileReveal(mapTile);
        }
        else if (mouseEvent.data.button === 1) {
            batchRevealTiles();
        }
    }

    function handleTileRightClick(mapTile, mouseEvent) {
        mapTile.markTile();
    }

    function handleTileReveal(mapTile) {
        if (mapTile.tileType === 'bomb') {
            var tileCenter = mapTile.getTileCenter();
            explosionHelper.playExplosion(tileCenter.xPos, tileCenter.yPos);
            console.log('game over');
        }
        else if (mapTile.tileType === 'empty') {
            var emptyFields = mapHelper.getAttachedTilesOfType('empty', mapTile.xPos, mapTile.yPos);
            var emptyAndNumberFields = mapHelper.extendByOne(emptyFields);

            for (var tileKey in emptyAndNumberFields) {
                emptyAndNumberFields[tileKey].reveal(true);
            }
        }
    }

    let lastBatch = null;
    function batchHighlightTiles(mapTile) {
        lastBatch = mapHelper.getBatchTiles(mapTile.xPos, mapTile.yPos);

        for (var i = 0; i < lastBatch.length; i++) {
            lastBatch[i].highlightTile(true);
        }
    }

    function batchRevealTiles() {
        for (var i = 0; i < lastBatch.length; i++) {
            lastBatch[i].reveal();
        }
    }

    return {
        initialize: initialize,
        start: start
    };
}();