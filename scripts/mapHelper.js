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

            addFieldIfExists(resultList, loopedTile.xPos - 1,   loopedTile.yPos - 1);
            addFieldIfExists(resultList, loopedTile.xPos,       loopedTile.yPos - 1);
            addFieldIfExists(resultList, loopedTile.xPos + 1,   loopedTile.yPos - 1);
            addFieldIfExists(resultList, loopedTile.xPos - 1,   loopedTile.yPos);
            // addFieldIfExists(resultList, loopedTile.xPos,       loopedTile.yPos);
            addFieldIfExists(resultList, loopedTile.xPos + 1,   loopedTile.yPos);
            addFieldIfExists(resultList, loopedTile.xPos - 1,   loopedTile.yPos + 1);
            addFieldIfExists(resultList, loopedTile.xPos,       loopedTile.yPos + 1);
            addFieldIfExists(resultList, loopedTile.xPos + 1,   loopedTile.yPos + 1);
        }

        let addedTileKeys = getAddedTileKeys(tileList, resultList);
        resultList = {...tileList, ...resultList}; 

        return {
            resultList: resultList,
            groupedTiles: getGroupedTiles(addedTileKeys)
        }
    }

    function addFieldIfExists(resultList, x, y) {
        var tileKey = x + '_' + y;

        if (map[tileKey]) {
            resultList[tileKey] = map[tileKey];
        }
    }

    function getGroupedTiles(tileKeyList) {
        var info = {
            'empty': [],
            'bomb': [],
            'number': []
        };

        for (var tileKeyIdx = 0; tileKeyIdx < tileKeyList.length; tileKeyIdx++) {
            var tileKey = tileKeyList[tileKeyIdx];

            info[map[tileKey].tileType].push(map[tileKey]);
        }

        return info;
    }

    function getAddedTileKeys(oldList, newList) {
        var addedList = [];

        for (var prop in newList) {
            if (!oldList.hasOwnProperty(prop)) {
                addedList.push(prop);
            }
        }

        return addedList;
    }

    function getRandomTile() {
        var randomX = Math.floor(Math.random() * config.columns);
        var randomY = Math.floor(Math.random() * config.rows);
        
        var tileKey = randomX + '_' + randomY;
        return map[tileKey];
    }

    function getRandomEmptyTile() {
        let randomTile = null;

        do
        {
            randomTile = getRandomTile();
        }
        while (randomTile.tileType != 'empty');

        return randomTile;
    }

    function getTilesToReveal(tileList, xPos, yPos) {
        
        var tileKey = xPos + '_' + yPos;
        var mapTile = map[tileKey];

        if (mapTile.tileType === 'empty')
        {
            // If empty, discover all neighbour fields.
            var emptyFields = mapHelper.getAttachedTilesOfType('empty', mapTile.xPos, mapTile.yPos);
            
            // Add the new tiles to the existing list if new ones were discovered.
            if (getAddedTileKeys(tileList, emptyFields).length) {
                tileList = Object.assign(tileList, emptyFields);
                
                // If we have new empty tiles, extend the revealed area by 1.
                var extensionResult = mapHelper.extendByOne(emptyFields);
                
                // Add the extension to the summary.
                tileList = Object.assign(tileList, extensionResult.resultList);

                // If new empty tiles have been discovered... 
                if (extensionResult.groupedTiles.empty.length) {
                    // Do the same logic for each newly discovered empty field.
                    for (var i = 0; i < extensionResult.groupedTiles.empty.length; i++) {
                        var emptyTileInExtension = extensionResult.groupedTiles.empty[i];
                        getTilesToReveal(tileList, emptyTileInExtension.xPos, emptyTileInExtension.yPos);
                    }
                }

            }
        }

        return tileList;
    }

    return {
        generateMap: generateMap,
        getBatchTiles: getBatchTiles,
        getAttachedTilesOfType: getAttachedTilesOfType,
        extendByOne: extendByOne,
        getRowTiles: getRowTiles,
        getRandomEmptyTile: getRandomEmptyTile,
        getTilesToReveal: getTilesToReveal
    }
}();