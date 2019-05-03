/**
 * Returns the protocol from within the protocol set matching the provided label.
 * If only one label exists, one protocol object is returned.
 * When multiple protocols in the set have the same label an array with all
 * protcol objects of matching labels is returned.
 * @access public
 * @param {string} label The label from the protocol set
 * @param {Object} json Required! The protocol content
 * @param {boolean} [array=false] Always return an array
 * @returns {(Object|Object[])} Single protocol or an array of protocols
 * @example GetIndexByLabel( "PAM", json );
 * // returns e.g. { "label": "PAM", ...} or [{ "label": "PAM", ...}, { "label": "PAM", ...}]
 *
 * GetIndexByLabel( "PAM", json, true );
 * // returns e.g. [{ "label": "PAM", ...}] or [{ "label": "PAM", ...}, { "label": "PAM", ...}]
 */

function GetProtocolByLabel( label, json, array ) {
    if(label === undefined)
        return null;

    if(array === undefined)
        array = false;

    var out = json.set.filter(function(a){
        return a.label == label;
    });

    if( out.length == 0 )
        return null;
    if( out.length == 1 )
        return array ? out : out[0];
    else
        return out;
}

module.exports = GetProtocolByLabel;
