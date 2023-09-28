# Design Document
Slicing for PCBs is a very different task since the paste is not a filament. We are trying to combad problems of using paste using multiple techniques.

# Slicer Design
## Pressure
Since paste extrusion is much less linear than filament one (where pressure advance technique would work well), we are using a different approach to compensate for the pressure. In my experiments by tweaking extrusion lead me to believe that there is a minimum pressure that you need to build up to begin extrusion. My first naive approach that was easiest to code was to just create a pressure during initial z axis movement by extruding some sizable amount of paste (about one full turn of a dispenser), perform movement in XY plane and then during the final z hop retract the amount of paste that was not dispenced. This worked really well, comparing to a trivial approach where we extrude during movement. This tecnique is basically a pressure advance but the one that i can control and tune in my code.

## De-oozing
One of the major problems for me was a constant oozing from the dispenser. After implementing pressure advance i was able to remove most of the oozing (since there are no pressure to extrude anymore), but some small part of it still oozes after the printing of a path. I decided to simply move backwards for some distance to remove the oozing. This is a very simple approach but it works really well ending in nearly zero oozing.

## Blobbing
After implementing pressure advance and de-oozing prints now have some blobbing in the begining of the path. This is caused by the fact that it was extruded too much paste during the initial z movement. It is not clear for now if i can just reduce the amount of paste extruded or i need to spread it a little to the XY movements similar to de-oozing.

## Speeds
Right now code has randomly chosen speeds and it does not respect extrusion speed. It is not clear for me how to calculate total speed because we need to provide speed in G Code that would mean as speed for all axes together. It was trivial for z movements, but not, for example, for Z and E one. Should we keep extrusion speed constant? What about other speeds? I have a fast printer and we can do very fast movements. On normal 3d printers speed is determined by the movement speed and then it would be reduced if needed if flow rate is exceeded.

## Limit of working length
Current test implementation does not limit the length of the extrusion path but since we are not extruding along the way it could be a problem, but splitting path in multiple shorter one should work and be a simple solution.

# Extruder Design

## Gear ratio
This design is my very fist design of gears and i just went to 12 and 24 teeth gears making it 4:1 ratio (two 2:1 meshings). It seems that [V One uses](https://github.com/VolteraInc/v-one-marlin/blob/acad305bb86d41d31a7a733d18bbb7c3e31962e1/Marlin/Configuration.h#L186) 24/16 = 1.5:1. I am not sure what is better, extrusion speed and torque is accepable in my tests and i don't need to change it, but maybe it is better to have a higher speed and lower torque.

## Extruder math
We are using klipper firmware and we would provide our calculations here for some settings for it. Unlike V One we are going to adjust distance to behave it like it extrudes standard filament. This simplifies configuration of the some low level tools and allows user to play around with a printer since it would behave like a standard one, but with a smaller nozzle.

- Syringe cross section: (6.35 ^ 2) * pi = 126.677 mm^2
- Dispenser lead screw pitch: 0.7mm. My measurements show that it is 0.8mm per turn, but in the [sources code of V One](https://github.com/VolteraInc/v-one-marlin/blob/acad305bb86d41d31a7a733d18bbb7c3e31962e1/Marlin/Configuration.h#L186) it is 0.7 mm and i think it is more accurate.
- Extruder gear ratio: 4:1
- Dispenser rotation distance per one extruder motor rotation: pitch * ratio = 0.7 mm * 1/4 = 0.175 mm
- Extruder rotation volume: `syringe cross section` * `dispenser distance` = 126.677 * 0.175 = 22.168 mm^3
- Extruder adjusted rotation: `extruder rotation volume` / `fake filament cross section` = 22.168 / 2.405 = **9.22 mm**