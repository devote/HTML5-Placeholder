/*
 * Brings HTML5 "placeholder" attribute into all older browser -  v0.0.1 beta
 *
 * Support: IE6+, FF3+, Opera 9+, Safari, Chrome
 *
 * Copyright 2011-2012, Dmitriy Pakhtinov ( spb.piksel@gmail.com )
 *
 * http://spb-piksel.ru/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Update: 04-09-2012
 */

(function( window ) {

	var
		document = window.document,
		msie = eval("/*@cc_on (@_jscript_version+'').replace(/\\d\\./, '');@*/"),
		isSupportPseudoPlaceholder = (function( style ) {
			var prefixes = [ "", ":input-", "-o-", ":-o-input-", "-moz-", ":-webkit-input-", "-ms-", ":-ms-input-" ];
			document.documentElement.firstChild.appendChild( style );
			for( var i = 0; i < prefixes.length; i++ ) {
				try {
					style.sheet.insertRule( ":" + prefixes[ i ] + "placeholder{}", 0 );
				} catch( _e_ ) {}
			}
			var result = style.sheet ? style.sheet.cssRules.length > 0 : false;
			style.parentNode.removeChild( style );
			return result;
		})( document.createElement( 'style' ) );

	// fake for support browser
	window["inputPlaceholder"] = function() {};

	// If browser not support pseudo-element placeholder or
	// Safari supported pseudo-element placeholder,
	// but effective to only change font-style and color :(
	if ( !isSupportPseudoPlaceholder || ( !window.external && !window.opera ) ) {

		var
			eventMethod = window.addEventListener ? ['','addEventListener'] : ['on','attachEvent'],
			focusHandler = function( e ) {
				var type, target = e && e.target || window.event.srcElement;
				if ( type = target.getAttribute( 'data-placeholder-type' ) ) {
					if ( target._relatedTarget ) {
						target.parentNode.removeChild( target._relatedTarget );
						target._relatedTarget = null;
					}
					target.removeAttribute( 'data-placeholder-type' );
					target.className = (" " + target.className + " ").
						replace(/\s+input-placeholder\s+/, ' ').
						replace( /^[\s]+|[\s](?=\s)|[\s]+$/g, '' );
					target.value = "";
					if ( ( !msie || msie > 8 ) && target.type !== type ) {
						target.setAttribute( 'type', type );
					}
				}
			},
			blurHandler = function( e ) {
				var target = e && e.target || window.event.srcElement;
				if ( target.value === "" ) {
					target.setAttribute( 'data-placeholder-type', target.type );
					target.className += ' input-placeholder';
					if ( target.type !== 'text' && msie && msie < 9 ) {
						var input = document.createElement( 'input' );
						input._relatedTarget = target;
						target._relatedTarget = input;
						input.className = target.className + " input-placeholder";
						input.style.position = "absolute";
						input.style.zIndex = ( parseInt( target.currentStyle.zIndex ) || 0 ) + 1;
						input.style.borderColor = input.style.backgroundColor = "transparent";
						input.readOnly = true;
						input.type = "text";
						input.value = target.getAttribute( 'data-placeholder' );
						input.onfocus = function() {
							var target = window.event.srcElement;
							if ( target.nextSibling === target._relatedTarget )  {
								target.nextSibling.focus();
								target.nextSibling._relatedTarget = null;
							}
							target.parentNode.removeChild( target );
						}
						target.parentNode.insertBefore( input, target );
					} else {
						target.value = target.getAttribute( 'data-placeholder' );
						if ( target.type !== 'text' ) {
							target.setAttribute( 'type', 'text' );
						}
					}
				}
			};

		window["inputPlaceholder"] = function( elem /* internal use only -> */, value ) {
			if (
				( elem.type === "text" || elem.type === "password" ) &&
				( value = elem.getAttribute( 'placeholder' ) ) )
			{
				elem.setAttribute( 'data-placeholder', value );
				elem.removeAttribute( 'placeholder' );
				blurHandler( { "target": elem } );
				elem[ eventMethod[ 1 ] ]( eventMethod[ 0 ] + "focus", focusHandler, false );
				elem[ eventMethod[ 1 ] ]( eventMethod[ 0 ] + "blur", blurHandler, false );
			}
		}

		var DOMContentLoaded = function() {
			var elems = document.getElementsByTagName('input');
			for( var i = 0, elem; elem = elems[ i++ ]; ) {
				window["inputPlaceholder"]( elem );
			}
		}

		if ( document.addEventListener ) {
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		}
		window[ eventMethod[ 1 ] ]( eventMethod[ 0 ] + "load", DOMContentLoaded, false );
	}

})( window );
