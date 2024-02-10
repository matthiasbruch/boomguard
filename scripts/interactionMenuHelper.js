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
        var sprite = new PIXI.Sprite(asset);
        buttonRegister[interactionType] = sprite;

        sprite.x = buttonPosition;
        sprite.y = appInstance.view.height - 70;
        

        sprite.on('click', function() {
            interactionHelper.setNextMode(interactionType);
        });

        appInstance.stage.addChild(sprite);

        if (disable) {
            sprite.eventMode = 'none';
            sprite.alpha = 0.5;
        }
        else {
            sprite.eventMode = 'static';
        }

        buttonPosition += 80;
    }

    function handleStatUpdate(stats) {
        if (stats.credits >= 2) {
            buttonRegister[interactionHelper.interactionTypes.Scan].eventMode = 'static';
            buttonRegister[interactionHelper.interactionTypes.Scan].alpha = 1;
        }
        else {
            buttonRegister[interactionHelper.interactionTypes.Scan].eventMode = 'none';
            buttonRegister[interactionHelper.interactionTypes.Scan].alpha = 0.5;
        }

        if (stats.credits >= 8) {
            buttonRegister[interactionHelper.interactionTypes.Drop].eventMode = 'static';
            buttonRegister[interactionHelper.interactionTypes.Drop].alpha = 1;
        }
        else {
            buttonRegister[interactionHelper.interactionTypes.Drop].eventMode = 'none';
            buttonRegister[interactionHelper.interactionTypes.Drop].alpha = 0.5;
        }
    }
    
    return {
        initialize: initialize,
        handleStatUpdate: handleStatUpdate
    }
}();