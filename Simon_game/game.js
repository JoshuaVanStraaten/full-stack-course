var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var inProgress = false;
var level = 0;

function nextSequence() {
    // Set the state of the game as in progress
    inProgress = true;
    // Reset the user Clicked Pattern
    userClickedPattern = [];
    // Increment the level
    level++;
    // Display the current level
    $("h1").text("Level " + level);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    // Select button
    $("#" + randomChosenColour).fadeOut(50).fadeIn(50);
    // Play Audio for button
    playSound(randomChosenColour);
}

// Add event listeners on button clicks
$(".btn").click(function(event) {
    var userChosenColour = $(event.target).attr("id");
    userClickedPattern.push(userChosenColour);
    // Play Audio for button click
    playSound(userChosenColour);
    // Animate click
    animatePress(userChosenColour);
    // Check answer
    checkAnswer(userClickedPattern.length - 1);
})

// Helper functions
function playSound(name) {
    var buttonAudio = new Audio("sounds/" + name + ".mp3");
    buttonAudio.play();
}

function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed")
    setTimeout(function() {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

function checkAnswer(currentLevel) {

    // Compare both arrays
    if (gamePattern[currentLevel] != userClickedPattern[currentLevel]) {
        playSound("wrong");
        // Apply game-over class
        $("body").addClass("game-over");
        // Remove class after 200 ms
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        // Update the title to reflect the Game Over
        $("h1").text("Game Over, Press Any Key to Restart");
        // Allow the user to restart the game
        startOver();
    }


    // Check if the sequence is finished
    if (gamePattern.length == userClickedPattern.length) {
        setTimeout(function() {
            nextSequence();
        }, 1000);
    }
}

function startOver() {
    // Reset starting values
    gamePattern = [];
    userClickedPattern = [];
    inProgress = false;
    level = 0;
}

// Main logic
// Detect a keyboard Press to Start the game
$(document).keydown(function() {
    if (!inProgress) {
        nextSequence();
    }
});
