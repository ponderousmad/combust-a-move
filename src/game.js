(function () {
    "use strict";
    
    var loader = new ImageBatch("images/"),
        fire = new Flipbook(loader, "fire1/fire_", 16, 2),
        background = loader.load("bg.png"),
        p1Images = {
            U: loader.load("up.png"),
            D: loader.load("down.png"),
            L: loader.load("left.png"),
            R: loader.load("right.png")
        },
        p2Images = {
            U: loader.load("w.png"),
            D: loader.load("s.png"),
            L: loader.load("a.png"),
            R: loader.load("d.png")
        },
        keyboardState = new INPUT.KeyboardState(window),
        mouseState = null,
        touchState = null,
        
        KEYS = {
            Up : 38,
            Down : 40,
            Left : 37,
            Right : 39,
            Space : 32,
            Escape : 27,
            LT : 188,
            GT : 190
            
        },
        player1 = new Player([KEYS.Up, KEYS.Down, KEYS.Left, KEYS.Right], p1Images, 1),
        player2 = new Player(["W".charCodeAt(), "S".charCodeAt(), "A".charCodeAt(), "D".charCodeAt()], p2Images, -1),
        twoPlayer = true,
        FIRE_FRAME_TIME = 80,
        FIRE_WIDTH = 106,
        FIRE_HEIGHT = FIRE_WIDTH,
        BACKGROUND_PIXEL_WIDTH = 300,
        fireDraw = fire.setupPlayback(FIRE_FRAME_TIME, true);
    
    function Sequence() {
        this.notes = [];
    }
    
    loader.commit();
    
    function update() {
        var now = TIMING.now(),
            elapsed = TIMING.updateDelta(now);
        
        player1.update(now, elapsed, keyboardState);
        if (twoPlayer) {
            player2.update(now, elapsed, keyboardState);
        }
        
        keyboardState.postUpdate();
        
        fire.updatePlayback(elapsed, fireDraw);
    }
    
    function pixelated(context, drawPixels) {
        var smooth = !drawPixels
        context.mozImageSmoothingEnabled = smooth;
        context.webkitImageSmoothingEnabled = smooth;
        context.msImageSmoothingEnabled = smooth;
        context.imageSmoothingEnabled = smooth;
    }
    
    function draw(context, width, height) {
        var centerX = 0,
            centerY = 0,
            aspect = background.height / background.width,
            pixelSize = width / BACKGROUND_PIXEL_WIDTH;
        
        context.save();        
        pixelated(context, true);
        context.scale(pixelSize, pixelSize);
        context.translate(BACKGROUND_PIXEL_WIDTH * 0.5, (height * 0.5) / pixelSize);
        context.font = "50px serif";

        if (loader.loaded) {
            DRAW.centeredScaled(context, background, centerX, centerY, BACKGROUND_PIXEL_WIDTH, BACKGROUND_PIXEL_WIDTH * aspect);
            fire.draw(context, fireDraw, centerX, centerY, true, FIRE_WIDTH, FIRE_HEIGHT);
            player1.draw(context, centerX, centerY);
            if (twoPlayer) {
                player2.draw(context, centerX, centerY);
            }
        }
        context.restore();
        
        // DRAW.centeredText(context, "Com-bust-a-move", centerX, centerY, "black", "white", 2);
    }
    
    function safeWidth() {
        var inner = window.innerWidth,
            client = document.documentElement.clientWidth || inner,
            body = document.getElementsByTagName('body')[0].clientWidth || inner;
            
        return Math.min(inner, client, body);
    }
    
    function safeHeight() {
        var inner = window.innerHeight,
            client = document.documentElement.clientHeight || inner,
            body = document.getElementsByTagName('body')[0].clientHeight || inner;
            
        return Math.min(inner, client, body) - 5;
    }
    
    window.onload = function (e) {
        console.log("window.onload", e, Date.now());
        var canvas = document.getElementById("canvas"),
            context = canvas.getContext("2d");
            
        mouseState = new INPUT.MouseState(canvas);
        touchState = new INPUT.TouchState(canvas);

        function drawFrame() {
            canvas.width  = safeWidth();
            canvas.height = safeHeight();
            requestAnimationFrame(drawFrame);
            draw(context, canvas.width, canvas.height);
        }
        
        window.setInterval(update, 16);
        
        drawFrame();
    };
}());
