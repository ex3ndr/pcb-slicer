# Design Document

## Introduction
Slicing for PCBs is a very different task since the paste is not a filament. We are trying to combad problems of using paste using multiple techniques.

## Pressure
Since paste extrusion is much less linear than filament one (where pressure advance technique would work well), we are using a different approach to compensate for the pressure. In my experiments by tweaking extrusion lead me to believe that there is a minimum pressure that you need to build up to begin extrusion. My first naive approach that was easiest to code was to just create a pressure during initial z axis movement by extruding some sizable amount of paste (about one full turn of a dispenser), perform movement in XY plane and then during the final z hop retract the amount of paste that was not dispenced. This worked really well, comparing to a trivial approach where we extrude during movement. This tecnique is basically a pressure advance but the one that i can control and tune in my code.

## De-oozing
One of the major problems for me was a constant oozing from the dispenser. After implementing pressure advance i was able to remove most of the oozing (since there are no pressure to extrude anymore), but some small part of it still oozes after the printing of a path. I decided to simply move backwards for some distance to remove the oozing. This is a very simple approach but it works really well ending in nearly zero oozing.

## Blobbing
After implementing pressure advance and de-oozing prints now have some blobbing in the begining of the path. This is caused by the fact that it was extruded too much paste during the initial z movement. It is not clear for now if i can just reduce the amount of paste extruded or i need to spread it a little to the XY movements similar to de-oozing.

## Speeds
Right now code has randomly chosen speeds and it does not respect extrusion speed. It is not clear for me how to calculate total speed because we need to provide speed in G Code that would mean as speed for all axes together. It was trivial for z movements, but not, for example, for Z and E one. Should we keep extrusion speed constant? What about other speeds? I have a fast printer and we can do very fast movements.

## Limitations
Current test implementation does not limit the length of the extrusion path but since we are not extruding along the way it could be a problem, but splitting path in multiple shorter one should work and be a simple solution.