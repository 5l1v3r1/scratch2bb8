(function(ext) {
    ext._shutdown = function() {};

    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.right = function(degrees) {
        $.get('http://localhost:8080/right?degrees=' + degrees, null, function() {
            console.log('turn right ' + degrees + ' degrees');
        });
    };

    ext.left = function(degrees) {
        $.get('http://localhost:8080/left?degrees=' + degrees, null, function() {
            console.log('turn left ' + degrees + ' degrees');
        });
    }

    ext.forward = function(steps) {
        $.get('http://localhost:8080/forward?steps=' + steps, null, function() {
            console.log('move forward ' + steps + ' steps');
        });
    };

    ext.backward = function(steps) {
        $.get('http://localhost:8080/backward?steps=' + steps, null, function() {
            console.log('move backward ' + steps + ' steps');
        });
    }

    ext.spin = function(steps) {
        $.get('http://localhost:8080/spin', null, function() {
            console.log('spin');
        });
    }

    var lang = ((navigator.language || navigator.userLanguage) == 'ja') ? 'ja' : 'en';
    var locale = {
        ja: {
            right: '右に %n 度回す',
            left: '左に %n 度回す',
            forward: '%n 歩前進させる',
            backward: '%n 歩後退させる',
            spin: '回転する'
        },
        en: {
            right: 'turn right %n degrees',
            left: 'turn left %n degrees',
            forward: 'move forward %n steps',
            backward: 'move backward %n steps',
            spin: 'spin'
        },
    }

    var descriptor = {
        blocks: [
            [' ', 'BB-8: ' + locale[lang].right, 'right', 90],
            [' ', 'BB-8: ' + locale[lang].left, 'left', 90],
            [' ', 'BB-8: ' + locale[lang].forward, 'forward'],
            [' ', 'BB-8: ' + locale[lang].backward, 'backward'],
            [' ', 'BB-8: ' + locale[lang].spin, 'spin'],
        ]
    };

    ScratchExtensions.register('Scratch2bb8', descriptor, ext);
})({});
