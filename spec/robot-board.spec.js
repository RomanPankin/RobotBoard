let RobotBoard = require('../src/robot-board');

describe('Tests for RobotBoard.', () => {
    const SIZE_X = 5;
    const SIZE_Y = 5;

    let board;
    let log = console.log;
    let executeTests = ( command, data ) => {
        data.forEach((item) => {
            let isArray = Array.isArray(item.in);

            it(`Execute ${command} with ${isArray ? item.in.join(';') : item.in}`, () => {
                board.execute( isArray || !command ? item.in : `${command} ${item.in}`);

                expect(board.report()).toBe(item.out);
            });
        });
    }

    beforeEach(() => {
        console.log = log;
        board = new RobotBoard(SIZE_X,SIZE_Y);
    });

    describe('PLACE command.', () => {
        let data = [
            // Directions and legal coordinates
            {in: "0,0,NORTH", out: "0,0,NORTH"},
            {in: "1,2,EAST", out: "1,2,EAST"},
            {in: "2,1,WEST", out: "2,1,WEST"},

            // Illegal directions
            {in: "2,2,TEST", out: null},

            // Wrong formats
            {in: "222", out: null},
            {in: "TEST", out: null},
            {in: "T,T,T", out: null},

            // Illegal coordinates
            {in: "-1,2,SOUTH", out: null},
            {in: `${SIZE_X},2,SOUTH`, out: null},
            {in: "1,-1,SOUTH", out: null},
            {in: `1,${SIZE_Y},SOUTH`, out: null},

            // Chain of actions
            {in: ["PLACE 0,0,EAST", "MOVE", "LEFT", "MOVE", "PLACE 3,3,NORTH"], out: "3,3,NORTH"}
        ];

        executeTests( "PLACE", data );
    });

    describe('MOVE command.', () => {
        let data = [
            // First action
            {in: "MOVE", out: null},

            // Directions and legal coordinates
            {in: ["PLACE 1,1,NORTH","MOVE"], out: "1,2,NORTH"},
            {in: ["PLACE 1,1,EAST","MOVE"], out: "2,1,EAST"},
            {in: ["PLACE 1,1,SOUTH","MOVE"], out: "1,0,SOUTH"},
            {in: ["PLACE 1,1,WEST","MOVE"], out: "0,1,WEST"},

            // Out-of-range
            {in: [`PLACE 0,${SIZE_Y-1},NORTH`,"MOVE"], out: `0,${SIZE_Y-1},NORTH`},
            {in: [`PLACE ${SIZE_X-1},1,EAST`,"MOVE"], out: `${SIZE_X-1},1,EAST`},
            {in: ["PLACE 0,0,SOUTH","MOVE"], out: "0,0,SOUTH"},
            {in: ["PLACE 0,0,WEST","MOVE"], out: "0,0,WEST"},

            // From the spec
            {in: ["PLACE 0,0,NORTH","MOVE"], out: "0,1,NORTH"}
        ];

        executeTests( "MOVE", data );
    });

    describe('LEFT command.', () => {
        let data = [
            // First action
            {in: "LEFT", out: null},

            // Move around
            {in: ["PLACE 1,1,NORTH","LEFT"], out: "1,1,WEST"},
            {in: ["PLACE 1,1,EAST","LEFT"], out: "1,1,NORTH"},
            {in: ["PLACE 1,1,SOUTH","LEFT"], out: "1,1,EAST"},
            {in: ["PLACE 1,1,WEST","LEFT"], out: "1,1,SOUTH"},
        ];

        executeTests( "LEFT", data );
    });

    describe('RIGHT command.', () => {
        let data = [
            // First action
            {in: "RIGHT", out: null},

            // Move around
            {in: ["PLACE 1,1,NORTH","RIGHT"], out: "1,1,EAST"},
            {in: ["PLACE 1,1,EAST","RIGHT"], out: "1,1,SOUTH"},
            {in: ["PLACE 1,1,SOUTH","RIGHT"], out: "1,1,WEST"},
            {in: ["PLACE 1,1,WEST","RIGHT"], out: "1,1,NORTH"},
        ];

        executeTests( "RIGHT", data );
    });

    describe('REPORT command.', () => {
        it(`Restore information from console`, () => {
            // Restore information from console
            let result = "";
            console.log = (...args) => {
                result += args.join(',');
            };

            let currentResult = board.execute(["PLACE 1,1,NORTH", "REPORT"]);
            expect(result).toBe("1,1,NORTH");
        });
    });

    describe('Chain of actions.', () => {
        let data = [
            {in: ["PLACE 2,2,NORTH","MOVE","RIGHT","MOVE","LEFT","MOVE"], out: "3,4,NORTH"},
            {in: ["PLACE 1,2,EAST","MOVE","MOVE","LEFT","MOVE"], out: "3,3,NORTH"}
        ];

        executeTests( null, data );
    });

    describe('Crash-tests.', () => {
        it(`UNDEFINED-command`, () => {
            board.execute();
            expect(board.report()).toBe(null);
        });

        it(`NULL-command`, () => {
            board.execute(null);
            expect(board.report()).toBe(null);
        });

        it(`Not a string`, () => {
            expect( () => board.execute(123) ).toThrow();
        });
    });
});