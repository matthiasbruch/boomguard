var game = function() 
{
    let app = null;

    function initialize()
    {
        app = new PIXI.Application({ width: 800, height: 600 });

        document.getElementById('game-container').appendChild(app.view);

        if (app.view && app.view.addEventListener) {
            app.view.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        }
    }

    async function switchToStage(stageToShow) {
        await stageToShow.initialize(app);
        stageToShow.start();
    }

    return {
        initialize: initialize,
        switchToStage: switchToStage
    }
}();


// Prevent mouse wheel scrolling

window.addEventListener('mousedown', function(mouseEvent) {
    if(mouseEvent.button != 1) {
        return;
    }

    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
}, true);