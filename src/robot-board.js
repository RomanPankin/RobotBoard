(function () {
    "use strict";
    
    /// Permitted directions for movement
    const DIRECTIONS = {
        NORTH: "NORTH",
        SOUTH: "SOUTH",
        EAST: "EAST",
        WEST: "WEST"
    };

    /// Allowed actions
    const ACTIONS = {
        PLACE: "PLACE",
        MOVE: "MOVE",
        LEFT: "LEFT",
        RIGHT: "RIGHT",
        REPORT: "REPORT"
    };

    /// Changes in state depending on the direction
    const ROBOT_STEPS = {
        [DIRECTIONS.NORTH] : {
            [ACTIONS.LEFT]  : {x:  0, y:  0, dir : DIRECTIONS.WEST},
            [ACTIONS.RIGHT] : {x:  0, y:  0, dir : DIRECTIONS.EAST},
            [ACTIONS.MOVE]  : {x:  0, y:  1, dir : DIRECTIONS.NORTH}
        },
        [DIRECTIONS.SOUTH] : {
            [ACTIONS.LEFT]  : {x:  0, y:  0, dir : DIRECTIONS.EAST},
            [ACTIONS.RIGHT] : {x:  0, y:  0, dir : DIRECTIONS.WEST},
            [ACTIONS.MOVE]  : {x:  0, y: -1, dir : DIRECTIONS.SOUTH}
        },
        [DIRECTIONS.WEST] : {
            [ACTIONS.LEFT]  : {x:  0, y:  0, dir : DIRECTIONS.SOUTH},
            [ACTIONS.RIGHT] : {x:  0, y:  0, dir : DIRECTIONS.NORTH},
            [ACTIONS.MOVE]  : {x: -1, y:  0, dir : DIRECTIONS.WEST}
        },
        [DIRECTIONS.EAST] : {
            [ACTIONS.LEFT]  : {x:  0, y:  0, dir : DIRECTIONS.NORTH},
            [ACTIONS.RIGHT] : {x:  0, y:  0, dir : DIRECTIONS.SOUTH},
            [ACTIONS.MOVE]  : {x:  1, y:  0, dir : DIRECTIONS.EAST}
        }
    };


    class RobotBoard {

        constructor(sizeX, sizeY) {
            this._sizeX = sizeX;
            this._sizeY = sizeY;

            this._x = 0;
            this._y = 0;
            this._direction = null;
        }

        execute(actions) {
            if ( !actions ) return;
            if ( !Array.isArray(actions) ) actions = [ actions ];

            for (let action of actions ) {
                let params = action.split(' ');
                let actionName = params[0];

                switch (actionName) {
                    case ACTIONS.PLACE:
                        this._placeRobot(params[1]);
                        break;
                    case ACTIONS.MOVE:
                    case ACTIONS.LEFT:
                    case ACTIONS.RIGHT:
                        this._moveRobot(actionName);
                        break;
                    case ACTIONS.REPORT:
                        this._makeReport();
                        break;
                }
            }
        }

        report() {
            return (!this._direction ? null : `${this._x},${this._y},${this._direction}`);
        }

        _placeRobot(position) {
            let info = position.split(',');

            let x = parseInt(info[0]);
            let y = parseInt(info[1]);
            let direction = DIRECTIONS[info[2]];

            if (!this._possiblePosition(x,y) || !direction) return;

            this._x = x;
            this._y = y;
            this._direction = direction;
        }

        _moveRobot(action) {
            if (!this._direction) return;

            let shift = ROBOT_STEPS[this._direction][action];
            let x = this._x + shift.x;
            let y = this._y + shift.y;
            let direction = shift.dir;

            if (!this._possiblePosition(x,y)) return;

            this._x = x;
            this._y = y;
            this._direction = direction;
        }

        _makeReport() {
            let result = this.report();
            if ( result ) console.log( result );
        }

        _possiblePosition(x,y) {
            return (x >= 0 && x < this._sizeX && y >= 0 && y < this._sizeY );
        }
    }

    module.exports = RobotBoard;
})();