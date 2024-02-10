var interactionHelper = function() {
    
    const diggingIcon = 'url(\'images/cursors/digging.png\'),auto';

    let appInstance = null;
    let progress = 0;
    let interactionTypes = {
        Digging: 'digging'
    }
    let diggingOverlayConfig = {
        text: 'Digging',
        blockBackground: true,
        width: 200,
        height: 80,
        type: overlayHelper.overlayTypes.Progress
    };
    let selectedInteraction = null;

    function initialize(app) {
        appInstance = app;
    }

    function interact() {
        switch (interaction) {
            case interactionTypes.Digging:
                diggingStart();
                break;
        }
    }

    function setNextMode(interaction) {
        selectedInteraction = interaction;

        switch (selectedInteraction) {
            case interactionTypes.Digging:
                appInstance.renderer.events.cursorStyles.default = diggingIcon;
                appInstance.renderer.events.cursorStyles.hover = diggingIcon
                break;
            default:
                appInstance.renderer.events.cursorStyles.default = null;
                appInstance.renderer.events.cursorStyles.hover = null;
                break;
        }
    }

    function diggingStart() {
        overlayHelper.showOverlay(diggingOverlayConfig);
        
        PIXI.Ticker.shared.add(diggingRun);
    }

    function diggingRun(delta) {
        overlayHelper.setProgress(progress++);

        if (progress >= 100) {
            diggingEnd();
        }
    }

    function diggingEnd() {
        PIXI.Ticker.shared.remove(diggingRun);
        progress = 0;

        overlayHelper.hideOverlay();
    }

    return {
        initialize: initialize,
        interact: interact,
        setNextMode: setNextMode,
        interactionTypes: interactionTypes
    }
}();