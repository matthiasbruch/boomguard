var statHelper = function() {
    let appInstance = null;
    let ellapsedTimeLabel = null;
    let totalBombsLabel = null;
    let creditsLabel = null;
    let revealedFieldsLabel = null;
    let startTime = new Date();
    var stats = {
        totalBombs: 0,
        markedBombs: 0,
        dugOutBombs: 0,
        detonatedBombs: 0,
        credits: 0,
        emptyRevealed: 0
    }
    var statType = {
        TotalBombs: 'totalBombs',
        MarkedBombs: 'markedBombs',
        DugOutBombs: 'dugOutBombs',
        DetonatedBombs: 'detonatedBombs',
        Credits: 'credits',
        EmptyRevealed: 'emptyRevealed',
    };
    let statUpdateCallback = null;

    function initialize(app, config) {
        appInstance = app;

        stats.totalBombs = config.numberOfBombs;

        if (config.statUpdate) {
            statUpdateCallback = config.statUpdate;
        }

        showEllapsedTime();
        showTotalBombs();
        // showRevealedFields();
        showCredits();
    }

    function getElapsedTime() {
        var elapsedMS = new Date() - startTime;
        var totalSeconds = Math.floor(elapsedMS / 1000);
        var totalMinutes = Math.floor(totalSeconds / 60);
        var secondsWithoutMinutes = totalSeconds - (totalMinutes * 60);
        return (totalMinutes + '').padStart(2, '0') + ':' + (secondsWithoutMinutes + '').padStart(2, '0');
    }

    function showEllapsedTime() {
        if (!ellapsedTimeLabel) {
            ellapsedTimeLabel = new PIXI.Text(
                'Time: 00:00',
                labelHelper.getConfigForStats()
            );

            ellapsedTimeLabel.x = 10;
            ellapsedTimeLabel.y = 10;

            appInstance.stage.addChild(ellapsedTimeLabel);
        }
        
        ellapsedTimeLabel.text = 'Time: ' + getElapsedTime();

        window.setTimeout(showEllapsedTime, 1000);
    }

    function increaseStat(statTypeToUpdate) {
        stats[statTypeToUpdate]++;

        if (statTypeToUpdate === statType.DugOutBombs) {
            stats[statType.Credits] += 1;
        }

        showTotalBombs();
        showCredits();
        // showRevealedFields();

        if (statUpdateCallback) {
            statUpdateCallback(stats);
        }

        checkWinCondition();
    }

    function checkWinCondition() {
        var foundBombs = 
            stats[statType.MarkedBombs] +
            stats[statType.DugOutBombs] +
            stats[statType.DetonatedBombs];

        if (foundBombs === stats[statType.TotalBombs] && ((30*18) - stats.emptyRevealed) === stats[statType.TotalBombs]) {
            overlayHelper.showOverlay({
                text: 'WIN [' + getElapsedTime() + ']',
                blockBackground: true,
                width: 200,
                height: 80,
                type: overlayHelper.overlayTypes.BigMessage
            });
        }
    }

    function decreaseStat(statType, amount) {
        if (!amount) {
            amount = 1;
        }

        stats[statType] -= amount;
        showTotalBombs();
        showCredits();

        if (statUpdateCallback) {
            statUpdateCallback(stats);
        }
    }

    function showTotalBombs() {
        if (!totalBombsLabel) {
            totalBombsLabel = new PIXI.Text(
                'Bombs: ',
                labelHelper.getConfigForStats()
            );

            totalBombsLabel.x = 270;
            totalBombsLabel.y = 10;

            appInstance.stage.addChild(totalBombsLabel);
        }
        
        totalBombsLabel.text = 'Bombs: ' + stats.markedBombs + ' (marked) | ' + (stats.dugOutBombs + stats.detonatedBombs) + ' (revealed) | ' + stats.totalBombs + ' (total)';
    }

    // function showRevealedFields() {
    //     if (!revealedFieldsLabel) {
    //         revealedFieldsLabel = new PIXI.Text(
    //             '',
    //             labelHelper.getConfigForStats()
    //         );

    //         revealedFieldsLabel.x = 250;
    //         revealedFieldsLabel.y = 550;

    //         appInstance.stage.addChild(revealedFieldsLabel);
    //     }
        
    //     revealedFieldsLabel.text = 'Revealed: ' + stats.emptyRevealed;
    // }
    
    function showCredits() {
        if (!creditsLabel) {
            creditsLabel = new PIXI.Text(
                'Credits: ' + stats.credits,
                labelHelper.getConfigForStats()
            );

            creditsLabel.x = 660;
            creditsLabel.y = 550;

            appInstance.stage.addChild(creditsLabel);
        }
        
        creditsLabel.text = 'Credits: ' + stats.credits;
    }

    function getNumber(numberToReturn) {
        return stats[numberToReturn]
    }

    return {
        initialize: initialize,
        getNumber: getNumber,
        increaseStat: increaseStat,
        decreaseStat: decreaseStat,
        statType: statType
    };
}();