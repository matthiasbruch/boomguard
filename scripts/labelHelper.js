var labelHelper = function() {
    function getColorForLabel(label) {
        var fillColor = '#ffffff';
        switch (label) {
            case '1':
                fillColor = '#0000ff';
                break;
            case '2':
                fillColor = '#027b27';
                break;
            case '3':
                fillColor = '#95c80d';
                break;
            case '4':
                fillColor = '#af6904';
                break;
            case '5':
                fillColor = '#fa0000';
                break;
            case '6':
                fillColor = '#ac0000';
                break;
            case '7':
                fillColor = '#6d0000';
                break;
            case '8':
                fillColor = '#800000';
                break;
        }

        return fillColor;
    }

    function getConfigForTileLabel(fillColor) {
        return {
            fontFamily: 'Arial',
            fontSize: 16,
            fontWeight: 600,
            fill: fillColor,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 2,
            align: 'center',
        };
    }

    return {
        getColorForLabel: getColorForLabel,
        getConfigForTileLabel: getConfigForTileLabel
    }
}();