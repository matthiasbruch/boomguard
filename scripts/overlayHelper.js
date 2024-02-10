var overlayHelper = function() {
    let appInstance = null;
    let progressWidth = 0;
    let elementLookup = {};

    var overlayTypes = {
        Progress: 'progress',
        BigMessage: 'bigmessage'
    };

    var wellKnownElements = {
        Background: 'background',
        DiggingDialog: 'diggingDialog',
        ProgressContainer: 'progressContainer',
        ProgressBar: 'progressBar'
    };

    function initialize(app) {
        appInstance = app;
    }

    function createOrGetRectangle(key, rectangleConfig) {
        if (!elementLookup[key]) {
            container = new PIXI.Container();
            container.eventMode = 'static';
            container.width = rectangleConfig.width;
            container.height = rectangleConfig.height;
            container.x = rectangleConfig.x;
            container.y = rectangleConfig.y;

            sprite = PIXI.Sprite.from(PIXI.Texture.WHITE);
            sprite.width = rectangleConfig.width;
            sprite.height = rectangleConfig.height;
            sprite.x = 0;
            sprite.y = 0;
            sprite.tint = rectangleConfig.tint;

            elementLookup[key] = container;
            container.addChild(sprite);
            
            if (rectangleConfig.parent) {
                rectangleConfig.parent.addChild(container);
            }
            else {
                appInstance.stage.addChild(container);
            }
        }

        return elementLookup[key];
    }

    function createOrGetBackground() {
        var background = createOrGetRectangle(wellKnownElements.Background, {
            x: 0,
            y: 0,
            width: appInstance.view.width,
            height: appInstance.view.height,
            tint: 0x666666
        });

        background.alpha = 0.5;
        background.eventMode = 'static';
        background.on('mousedown', function(e) {
            e.stopPropagation();
        });
        background.on('mouseup', function(e) {
            e.stopPropagation();
        });

        return background;
    }

    function createProgressDialog(overlayConfig) {
        var gameMiddleX = appInstance.view.width / 2;
        var gameMiddleY = appInstance.view.height / 2;
        var dialogLeft = (gameMiddleX - overlayConfig.width / 2);
        var dialogTop = (gameMiddleY - overlayConfig.height / 2);
        var dialogWidth = overlayConfig.width;
        var dialogHeight = overlayConfig.height;

        var diggingDialog = elementLookup[wellKnownElements.DiggingDialog];
        if (diggingDialog) {
            diggingDialog.alpha = 1;
            diggingDialog.eventMode = 'static';

            setProgress(0);
        }
        else {
            diggingDialog = createOrGetRectangle(wellKnownElements.DiggingDialog, {
                x: dialogLeft,
                y: dialogTop,
                width: dialogWidth,
                height: dialogHeight,
                tint: 0x333333
            });

            var progressContainer = createOrGetRectangle(wellKnownElements.ProgressContainer, {
                x: 10,
                y: diggingDialog.height - 30,
                width: diggingDialog.width - 20,
                height: 20,
                tint: 0x000000,
                parent: diggingDialog
            });

            progressWidth = progressContainer.width - 8
            createOrGetRectangle(wellKnownElements.ProgressBar, {
                x: 4,
                y: 4,
                width: progressWidth * 0,
                height: progressContainer.height - 8,
                tint: 0xFFFF00,
                parent: progressContainer
            });


            var textElement = new PIXI.Text(
                "Digging",
                labelHelper.getConfigForTileLabel(0xFFFFFF)
            );
            textElement.x = 70;
            textElement.y = 15;
            diggingDialog.addChild(textElement);
        }
    }

    function bigMessage(overlayConfig) {
        var gameMiddleX = appInstance.view.width / 2;
        var gameMiddleY = appInstance.view.height / 2;
        var dialogLeft = (gameMiddleX - overlayConfig.width / 2);
        var dialogTop = (gameMiddleY - overlayConfig.height / 2);
        var dialogWidth = overlayConfig.width;
        var dialogHeight = overlayConfig.height;

        diggingDialog = createOrGetRectangle(wellKnownElements.DiggingDialog, {
            x: dialogLeft,
            y: dialogTop,
            width: dialogWidth,
            height: dialogHeight,
            tint: 0x333333
        });

        var textConfig = labelHelper.getConfigForTileLabel(0xFFFFFF);
        textConfig.fontSize = 24;

        var textElement = new PIXI.Text(
            overlayConfig.text,
            textConfig
        );
        textElement.x = 35;
        textElement.y = 25;
        diggingDialog.addChild(textElement);
    }

    function showOverlay(overlayConfig) {
        if (overlayConfig.blockBackground) {
            createOrGetBackground();
        }

        switch (overlayConfig.type) { 
            case overlayHelper.overlayTypes.Progress: 
                createProgressDialog(overlayConfig);
                break;
            case overlayHelper.overlayTypes.BigMessage: 
                bigMessage(overlayConfig);
                break;
        }
    }

    function hideOverlay() {
        if (elementLookup[wellKnownElements.Background]) {
            var background = elementLookup[wellKnownElements.Background];
            background.alpha = 0;
            background.eventMode = 'none';
        }
        
        var diggingDialog = elementLookup[wellKnownElements.DiggingDialog];
        if (diggingDialog) {
            diggingDialog.alpha = 0;
            diggingDialog.eventMode = 'none';
        }
    }

    function setProgress(progress) {
        var progressBar = createOrGetRectangle(wellKnownElements.ProgressBar);
        progressBar.children[0].width = progressWidth * (progress / 100);
    }

    return {
        initialize: initialize,
        showOverlay: showOverlay,
        hideOverlay: hideOverlay,
        setProgress: setProgress,
        overlayTypes: overlayTypes
    };
}();