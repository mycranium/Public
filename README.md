These are various ScriptUI Panels, mostly for Adobe After Effects.

Most of them are automation tools I create for specific needss on actual projects. As such, they may not be applicable beyond those contexts without some adaptation.

As I have time I will be making these more generally useful.

SCRIPTS:

Add Assets to Selected Comps.jsx

Automates adding items from a selected folder in the project panel to comps in another selected folder in the project panel.

Example use-case:
You have 100 comps of a brief intro animation, duplicates of a prototype comp, that have been cusomized with the names and photos of 100 different people.

The client gives you a folder containing 100 voiceover audio files, one for each of the individual comps.Aadding them all manually will be very time-consuming.

In the panel spawned by this script, the user can select the folder containing the assets, the folder containing the comps to put the assets into, and optionally a start time for the asset in the receiving comp's timeline.

It will then loop through each comp and search for a name match in the filenames of the assets folder. If it finds a match, it will add the matching asset as a layer in the comp, starting at the specified time. It will report any comps that have not had assets added.

The code currently performs the name-match searching based on the file naming pattern of the actual files I was working with for this project. That code would need to be adapted for other patterns. I plan to add the ability for the user to specify some kind of name-matching scheme.
