Calculator
Author: Susan Wang
==================
Download all the contents:
./index.html
./css/
./js/

To view the calculator, open index.html in Chrome or
Firefox (I did not test IE).

Some of the technologies used:
I used Angular and JQuery to help me organize the code.
For example, instead of exhaustively listing the keys on the calculator,
I used Angular’s ng-repeat directive.

Inputs
For the calculator, I tried my best to check for invalid inputs before the
user types it in. I think this is more efficient for the user too.
I used javascript’s built in eval() function because this leads to shorter code
and better code reuse. However, before I knew I can use this, I wrote my own
in calculate_() in compute.js. It is now under a deprecated section
(for your reference). The eval() function can be dangerous because it evaluates
any javascript expression, so the input is carefully validated
before calling eval(). I tried to add in some tolerence to the user's
entry. For example, '3(4)' should evaluate to 12 instead of throwing an error.

Buttons
The ‘=’ operator is the most important, so it is highlighted in a solid
blue color. The operators are different from the numbers, so they are in a
different background color. To further accentuate the buttons’ functionalities,
different on hover backgrounds are used. For example, the ‘DEL’, delete button
is in a warm color, to remind the user that the action cannot be undone.
It is placed on the top right corner to match the user’s mental model of a
delete key, or a backspace key on the keyboard. I think it also makes sense
to group the operators together and the parenthesis together.

Feature
I think an interactive way to convert units is to allow users to drag values
‘into’ a converter instead of always manually typing it in (drag and drop the
pink dropbox into the blue dropbox). A user can drag the pink dropbox into
the blue one to convert the numbers in the calculator’s input into
another unit. ‘Error’ will be displayed if the conversion cannot be made.
The user can also enter a number in the left input field to convert the units.
The conversions are done responsively thanks to Angular’s watch methods.

Overall design
All the colors and font are found from dropbox’s website.
I am going for a simplistic design, just like my overall impression of
dropbox’s website. I think a hand-crafted arrow (done in Adobe Illustrator)
is a nice way to link the two seemingly separate panels together.
I have always been a fan of dropbox as a kite illustration on the dropbox
website. I guess I’m trying to imitate it here :)

TODOs
Currently, all units are hardcoded. However, the functions labeled as
TODOs can use some kind of web services to populate the units.
I spent some time looking for an appropriate web service, but ended in vain...
Another option is to read in an xml file, but that might be slow for a
small widget like a calculator.

Currently, if the user enters in a number with too many digits for
convert, an ‘Overflow’ is displayed. I can probably optimise this a little
with toFixed, or truncate. But I was out of time. Similarly, I should also
validate input before evaluating. For example, negative 'kg' doesn't make
sense. But that involves more hardcoding at this stage.

The watch methods can be expensive, but I think for a simple calculator like
this, the cleaner code that this method brings outweigh the cons.

Thank you for viewing! I sincerely enjoyed making this calculator :)

