var interactionMenuHelper = function() {
    let appInstance = null;
    let buttonRegister = {};
    let buttonPosition = 20;

    async function initialize(app) {
        appInstance = app;

        await addButton(interactionHelper.interactionTypes.Digging);
        await addButton(interactionHelper.interactionTypes.Scan);
    }

    async function addButton(interactionType) {
        var asset = await PIXI.Assets.load('images/buttons/button-' + interactionType + '.png');
        var sprite = new PIXI.Sprite(asset);
        buttonRegister[interactionType] = sprite;

        sprite.x = buttonPosition;
        sprite.y = appInstance.view.height - 70;
        sprite.eventMode = 'static';

        sprite.on('click', function() {
            interactionHelper.setNextMode(interactionType);
        });

        appInstance.stage.addChild(sprite);

        buttonPosition += 80;
    }

    return {
        initialize: initialize
    }
}();