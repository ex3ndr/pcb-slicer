# Material Calibration Guide

To calibrate the material, you need to know the following parameters:
* Pressure advance value - how much pressure is required to begin extruding
* Pressure advance factor - how much of this pressure should be done during the begining XY movement
* Pressure release factor - how much of the pressure should be released using XY movement after the main extrusion is done
* Deoozing distance - how much we need to travel to release remaining material
* Extrusion factor - multiplier for calculation of an actual extrusion volume from the extrusion length

## 1. Pressure advance value

Before calculating other parameters, you need to find the pressure advance value. This value is measured in mm dispenser plunge need to be moved to start extrusion. To find it, you need to do the following: