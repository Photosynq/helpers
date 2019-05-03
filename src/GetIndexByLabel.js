/**
 * Find the positions for protocols within a protocol set matching the
 * provided label. If only one label exists within a set, a number is returned.
 * When multiple protocols in the set have the same label an array with all
 * indexes of matching labels is returned.
 * @access public
 * @param {string} label Label from the protocol set
 * @param {Object} json Required! The protocol content
 * @param {boolean} [array=false] Always return an array
 * @returns {(number|number[])} Single index or an array of indexes
 * @example GetIndexByLabel( "PAM", json );
 * // returns e.g. 1 or [1,2]
 *
 * GetIndexByLabel( "PAM", json, true );
 * // returns e.g. [1] or [1,2]
 */

function GetIndexByLabel( label, json, array ) {
    if(label === undefined)
        return null;

    if(array === undefined)
        array = false;

    var out = json.set.map(function(a,i){
        if(a.label == label)
            return i;
        else
            return null;
    }).filter(Number);

    if( out.length == 0 )
        return null;
    if( out.length == 1 )
        return array ? out : out[0];
    else
        return out;
}

module.exports = GetIndexByLabel;
