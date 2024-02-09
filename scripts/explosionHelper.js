var explosionHelper = function() {

    let appInstance = null;

    function initialize(app) {
        appInstance = app;
    }

    function playExplosion(xPos, yPos) {
        const particleContainer = new PIXI.ParticleContainer();
        appInstance.stage.addChild(particleContainer);
    
        const emitter = new PIXI.particles.Emitter(particleContainer, {
            ...explosionEmitterConfig,
            autoUpdate: true,
            pos: {
                x: xPos,
                y: yPos
            }
        });

        soundHelper.play(soundHelper.soundKey.Explosion);
        emitter.playOnceAndDestroy();
    }

    return {
        initialize: initialize,
        playExplosion: playExplosion
    }
}();