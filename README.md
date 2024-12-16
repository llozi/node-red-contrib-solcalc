A node-red node that calculates the next upcoming sunrise or sunset for a given latitude/longitude and given date/time.

Requires [https://github.com/llozi/noaa_solcalc](https://github.com/llozi/noaa_solcalc).

The input message must be a json containing a property "datetime" with a 
javascript Date object as it's value,
a property "latitude" (positive is northern hemisphere)
and "longitude" (positive is west of Greenwich).

The output message is a json containing the properties "nextevent" with value of
either "rise" or "set" and "datetime" with a javascript Date object as it's value.
