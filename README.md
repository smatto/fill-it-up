fill-it-up
==========

This little game will require you to fill the space with as many circles as you can fit. 

- ToDo:
- //Create space, canvas, and array
- //clicking creates a circle which expands while mouse button down
- //expansion stops when edge collides
- //percentage filled printed to screen
- reset button
- save high scores to JSON using AJAX + PHP
-   HTML5 -> play game

Javascript -> make call via AJAX to your saveScore.php with scores to store in db

php -> collect score and store it in scores.txt

//later (or earlier) when you want to display scores

Javascript -> ask getScore.php for scores

php -> fetch scores from scores.txt

Javascript draw scores in your display
