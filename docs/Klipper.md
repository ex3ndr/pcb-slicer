# Klipper Configuration


## Extruder rotation distance

Extruder rotation distance is meant to be the distance the extruder extrudes the filament in one rotation. We are using fake 1.75 diameter instead of ~6.35mm diameter of syringe. 
Extruder travels 0.8mm in one rotation and we are geared it 1:4. This means that extruder travels 0.2mm in one rotation. Which ends up being 126.68mm^2 * 0.2mm = 25.33mm^3. For 1.75 diameter it would
end up in 25.33 / 2.41 = 10.5mm^3. This is the value we are using in Klipper config.