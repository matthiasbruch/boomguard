var interactionMenuHelper = function() {
    let appInstance = null;
    let buttonRegister = {};
    let buttonPosition = 20;

    async function initialize(app) {
        appInstance = app;

        await addButton(interactionHelper.interactionTypes.Digging);
        await addButton(interactionHelper.interactionTypes.Scan, true);
        await addButton(interactionHelper.interactionTypes.Drop, true);
    }

    async function addButton(interactionType, disable) {
        var asset = await PIXI.Assets.load('images/buttons/button-' + interactionType + '.png');
        var assetActive = await PIXI.Assets.load('images/buttons/button-' + interactionType + '-active.png');
        var sprite = new PIXI.Sprite(asset);
        var spriteActive = new PIXI.Sprite(assetActive);
        spriteActive.alpha = 0;


        var container = new PIXI.Container();
        container.eventMode = 'static';
        container.cursor = 'pointer';
        container.x = buttonPosition;
        container.y = appInstance.view.height - 70;
        container.width = 70;
        container.height = 70;
        container.addChild(sprite);
        container.addChild(spriteActive);
        
        container.on('click', function() {
            if (interactionType === interactionHelper.getNextMode()) {
                interactionHelper.setNextMode(null);
            }
            else {
                interactionHelper.setNextMode(interactionType);
            }
        });

        appInstance.stage.addChild(container);

        if (disable) {
            container.eventMode = 'none';
            sprite.alpha = 0.5;
        }
        else {
            container.eventMode = 'static';
        }

        buttonPosition += 80;

        
        buttonRegister[interactionType] = sprite;
        buttonRegister[interactionType + '-active'] = spriteActive;
        buttonRegister[interactionType + '-container'] = container;
    }

    function setButtonActive(interactionType) {
        setAllInactive();

        soundHelper.play(soundHelper.soundKey.Interaction);
        buttonRegister[interactionType + '-active'].alpha = 1;
    }

    function setAllInactive() {
        buttonRegister[interactionHelper.interactionTypes.Digging + '-active'].alpha = 0;
        buttonRegister[interactionHelper.interactionTypes.Scan + '-active'].alpha = 0;
        buttonRegister[interactionHelper.interactionTypes.Drop + '-active'].alpha = 0;
    }

    function handleStatUpdate(stats) {
        if (stats.credits >= 2) {
            buttonRegister[interactionHelper.interactionTypes.Scan + '-container'].eventMode = 'static';
            buttonRegister[interactionHelper.interactionTypes.Scan].alpha = 1;
        }
        else {
            buttonRegister[interactionHelper.interactionTypes.Scan + '-container'].eventMode = 'none';
            buttonRegister[interactionHelper.interactionTypes.Scan].alpha = 0.5;
        }

        if (stats.credits >= 8) {
            buttonRegister[interactionHelper.interactionTypes.Drop + '-container'].eventMode = 'static';
            buttonRegister[interactionHelper.interactionTypes.Drop].alpha = 1;
        }
        else {
            buttonRegister[interactionHelper.interactionTypes.Drop + '-container'].eventMode = 'none';
            buttonRegister[interactionHelper.interactionTypes.Drop].alpha = 0.5;
        }
    }
    
    return {
        initialize: initialize,
        handleStatUpdate: handleStatUpdate,
        setButtonActive: setButtonActive,
        setAllInactive: setAllInactive
    }
}();