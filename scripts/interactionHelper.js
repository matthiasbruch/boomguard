var interactionHelper = function() {
    
    const diggingIcon = 'url(\'images/cursors/digging.png\'),auto';

    let appInstance = null;
    let progress = 0;
    let interactionTypes = {
        Digging: 'digging',
        Scan: 'scan',
        Drop: 'drop'
    }
    let diggingOverlayConfig = {
        text: 'Digging',
        blockBackground: true,
        width: 200,
        height: 80,
        type: overlayHelper.overlayTypes.Progress
    };
    let selectedInteraction = null;
    let defaultStyle = null;
    let mapTile = null;

    function initialize(app) {
        appInstance = app;

        defaultStyle = appInstance.renderer.events.cursorStyles.hover;

        appInstance.renderer.events.cursorStyles[interactionTypes.Digging] = diggingIcon;
    }

    function interact(mapTileForInteraction) {
        mapTile = mapTileForInteraction;

        switch (selectedInteraction) {
            case interactionTypes.Digging:
                diggingStart();
                break;
            case interactionTypes.Scan: 
                startScanning();
                break;
            case interactionTypes.Drop: 
                startDropping();
                break;
            default:
                cleanup();
                break;
        }
    }

    function cleanup() {
        setNextMode(null);
        mapTile = null;
    }

    function setNextMode(interaction) {
        if (interaction) {
            interactionMenuHelper.setButtonActive(interaction);
        }
        else {
            interactionMenuHelper.setAllInactive();
        }
        selectedInteraction = interaction;
    }

    function startDropping() {
        statHelper.decreaseStat(statHelper.statType.Credits, 8);

        var rowTiles = mapHelper.getRowTiles(mapTile.yPos);
        
        for (var i = 0; i < rowTiles.length; i++) {
            var loopedTile = rowTiles[i];
            var loopedTileCenter = loopedTile.getTileCenter();

            explosionHelper.playExplosion(loopedTileCenter.xPos, loopedTileCenter.yPos);
            loopedTile.reveal(gameTileRevalType.InteractionBombDrop);
        }
        
        cleanup();
    }

    function getNextMode() {
        return selectedInteraction;
    }

    function startScanning() {
        statHelper.decreaseStat(statHelper.statType.Credits, 2);

        var batchToScan = mapHelper.getBatchTiles(mapTile.xPos, mapTile.yPos);

        for (var i = 0; i < batchToScan.length; i++) {
            var loopedTile = batchToScan[i];
            
            loopedTile.showHidden();
        }
        
        cleanup();
    }

    function diggingStart() {
        overlayHelper.showOverlay(diggingOverlayConfig);

        PIXI.Ticker.shared.add(diggingRun);
    }

    const DIG_TIME = 1500;
    let digTime = 0;
    function diggingRun(delta) {
        digTime += PIXI.Ticker.shared.elapsedMS;
        progress = (digTime / DIG_TIME) * 100;
        overlayHelper.setProgress(progress);

        if (progress >= 100) {
            diggingEnd();
        }
    }

    function diggingEnd() {
        PIXI.Ticker.shared.remove(diggingRun);
        progress = 0;
        digTime = 0;

        if (mapTile) {
            mapTile.reveal(gameTileRevalType.InteractionDigging);
        }

        overlayHelper.hideOverlay();
        cleanup();
    }

    return {
        initialize: initialize,
        interact: interact,
        setNextMode: setNextMode,
        getNextMode: getNextMode,
        interactionTypes: interactionTypes
    }
}();