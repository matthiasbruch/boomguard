var mapHelper = function() {

    let map = null;
    let config = {
        rows: 0,
        columns: 0
    }

    function generateMap(columns, rows, requiredBombs) {
        map = {};
        config.rows = rows;
        config.columns = columns;

        generateBombMap(config.columns, config.rows, requiredBombs);
        initializeNonBombFields(config.columns, config.rows);

        return map;
    }

    function generateBombMap(columns, rows, requiredBombs) {
        var bombCount = 0;

        while (bombCount < requiredBombs) {
            var x = Math.floor(Math.random() * columns);
            var y = Math.floor(Math.random() * rows);
            var tileKey = x + '_' + y;

            if (map[tileKey] === undefined) {
                map[tileKey] = {
                    tileType: 'bomb',
                    tileKey: tileKey,
                    xPos: x,
                    yPos: y
                }

                bombCount++;
            }
        }
    }

    function initializeNonBombFields(columns, rows) {
        for (var x = 0; x < columns; x++) {
            for (var y = 0; y < rows; y++) {
                var tileKey = x + '_' + y;
                
                if (map[tileKey] === undefined) {

                    var bombCount = countBombs(x, y);

                    if (bombCount && bombCount > 0) {
                        map[tileKey] = {
                            tileType: 'number',
                            tileKey: tileKey,
                            xPos: x,
                            yPos: y,
                            bombCount: bombCount
                        }
                    }
                    else {
                        map[tileKey] = {
                            tileType: 'empty',
                            tileKey: tileKey,
                            xPos: x,
                            yPos: y
                        }
                    }
                }
            }
        }
    }

    function getBatchTiles(x, y) {
        var tileList = [];

        addTileIfExists(tileList, x - 1, y - 1);
        addTileIfExists(tileList, x    , y - 1);
        addTileIfExists(tileList, x + 1, y -1);
        addTileIfExists(tileList, x - 1, y);
        addTileIfExists(tileList, x    , y);
        addTileIfExists(tileList, x + 1, y);
        addTileIfExists(tileList, x - 1, y + 1);
        addTileIfExists(tileList, x    , y + 1);
        addTileIfExists(tileList, x + 1, y + 1);

        return tileList;
    }

    function getRowTiles(yPos) {
        var tileList = [];

        for (var x = 0; x < config.columns; x++) {
            addTileIfExists(tileList, x, yPos);
        }

        return tileList;
    }

    function addTileIfExists(list, x, y) {
        var tileKey = x + '_' + y;

        var matchedTile = map[tileKey];

        if (matchedTile) {
            list.push(matchedTile);
        }
    }

    function countBombs(x, y) {
        var bombCount = 0;
        var currentTileKey = x + '_' + y;

        var batchTiles = getBatchTiles(x, y);
        for (var i = 0; i < batchTiles.length; i++) {
            bombCount += (batchTiles[i].tileKey != currentTileKey && batchTiles[i].tileType === 'bomb') ? 1 : 0;
        }
        
        return bombCount;
    }

    function getAttachedTilesOfType(tileType, x, y, pathStats) {
        pathStats = pathStats || { fieldList: {}, checkedFields: {} };
        
        addFieldOfType(tileType, x, y, pathStats);
        addFieldOfType(tileType, x, y - 1, pathStats);
        addFieldOfType(tileType, x - 1, y, pathStats);
        addFieldOfType(tileType, x + 1, y, pathStats);
        addFieldOfType(tileType, x, y + 1, pathStats);

        return pathStats.fieldList;
    }

    function addFieldOfType(tileType, x, y, pathStats) {
        var tileKey = x + '_' + y;

        if (pathStats.fieldList[tileKey] === undefined && pathStats.checkedFields[tileKey] === undefined)
        {
            if (map[tileKey] && map[tileKey].tileType === tileType)
            {
                pathStats.fieldList[tileKey] = map[tileKey];

                getAttachedTilesOfType(tileType, map[tileKey].xPos, map[tileKey].yPos, pathStats);
            }
            else
            {
                pathStats.checkedFields[tileKey] = 1;
            }
        }
    }

    function extendByOne(tileList) {
        var resultList = [];

        for (var tileKey in tileList) {
            var loopedTile = tileList[tileKey];

            addFieldIfExists(resultList, loopedTile.xPos, loopedTile.yPos - 1);
            addFieldIfExists(resultList, loopedTile.xPos - 1, loopedTile.yPos);
            addFieldIfExists(resultList, loopedTile.xPos + 1, loopedTile.yPos);
            addFieldIfExists(resultList, loopedTile.xPos, loopedTile.yPos + 1);
        }

        return {...tileList, ...resultList};
    }

    function addFieldIfExists(resultList, x, y) {
        var tileKey = x + '_' + y;

        if (map[tileKey]) {
            resultList[tileKey] = map[tileKey];
        }
    }

    return {
        generateMap: generateMap,
        getBatchTiles: getBatchTiles,
        getAttachedTilesOfType: getAttachedTilesOfType,
        extendByOne: extendByOne,
        getRowTiles: getRowTiles
    }
}();