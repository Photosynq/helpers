/**
 * Generate a protocol lookup table for a protocol set.
 * @access public
 * @function
 * @param {object} json
 * @returns {object} Lookup table
 * @example GetLabelLookup(json);
 * // returns e.g. { "PAM": [0,2], "ECS": [1]}
 */

function GetLabelLookup(json){
    var lookup = {};
    // Return null if there is no set
	if(json.set === undefined)
		return null;
    for(var i in json.set){
        if(json.set[i].label !== undefined){
            if(lookup[json.set[i].label] === undefined)
                lookup[json.set[i].label] = [];
            lookup[json.set[i].label].push(i);
        }
        else{
            if(lookup.unknown === undefined)
                lookup.unknown = [];
            lookup.unknown.push(i);
        }
    }
    if(Object.keys(lookup).length == 0)
        return null;
    else
        return lookup;
}

module.exports = GetLabelLookup;
