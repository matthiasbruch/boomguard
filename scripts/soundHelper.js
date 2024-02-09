var soundHelper = function() {

    let soundKeyInteraction = 'interaction';
    let soundKeyReveal = 'reveal';
    let soundKeyExplosion = 'explosion';

    function initialize() {
        PIXI.sound.add(soundKeyInteraction, 'sounds/interaction.mp3');
        PIXI.sound.add(soundKeyReveal, 'sounds/reveal.mp3');
        PIXI.sound.add(soundKeyExplosion, 'sounds/explosion.wav');
    }

    function play(soundKey) {
        switch (soundKey) {
            case soundKeyInteraction:    
                PIXI.sound.play(soundKeyInteraction, { volume: 0.1 });
                break;
            case soundKeyExplosion:
                PIXI.sound.play(soundKeyExplosion, { volume: 1 });
                break;
            case soundKeyReveal:
                PIXI.sound.play(soundKeyReveal, { volume: 1 });
                break;
        }
    }

    return {
        initialize: initialize,
        play: play,
        soundKey: {
            Interaction: soundKeyInteraction,
            Reveal: soundKeyReveal,
            Explosion: soundKeyExplosion
        }
    };
}();