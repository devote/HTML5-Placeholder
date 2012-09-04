/*
 * Brings HTML5 "placeholder" attribute into all older browser -  v0.0.2 beta
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
			var result = style.sheet ? style.sheet.cssRules.length > 0 : 0;
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
			elements = [ "input", "textarea" ],
			eventMethod = window.addEventListener ? ['','addEventListener'] : ['on','attachEvent'],
			focusHandler = function( e ) {
				var type, target = e && e.target || window.event.srcElement;
				if ( type = target.getAttribute( 'data-placeholder-type' ) ) {
					if ( target._relatedTarget ) {
						target.parentNode.removeChild( target._relatedTarget );
						target.runtimeStyle.display = target._oldDisplay;
						target._relatedTarget = null;
					}
					target.removeAttribute( 'data-placeholder-type' );
					target.className = (" " + target.className + " ").
						replace(/\s+input-placeholder\s+/, ' ').
						replace( /^[\s]+|[\s](?=\s)|[\s]+$/g, '' );
					target.value = "";
					if ( ( !msie || msie > 8 ) && target.nodeName === "INPUT" && target.type !== type ) {
						target.setAttribute( 'type', type );
					}
				}
			},
			blurHandler = function( e ) {
				var target = e && e.target || window.event.srcElement;
				if ( target.value === "" ) {
					target.setAttribute( 'data-placeholder-type', target.nodeName === "INPUT" ? target.type : "true" );
					target.className += ' input-placeholder';
					target.value = target.getAttribute( 'data-placeholder' );
					if ( target.nodeName === "INPUT" && target.type !== 'text' ) {
						try {
							target.setAttribute( 'type', 'text' );
						} catch( _e_ ) {
							var input = document.createElement( 'input' );
							input._relatedTarget = target;
							target._relatedTarget = input;
							target._oldDisplay = target.currentStyle.display;
							target.runtimeStyle.display = 'none';
							input.className = target.className + " input-placeholder";
							input.type = "text";
							input.value = target.getAttribute( 'data-placeholder' );
							input.onfocus = function() {
								var input = window.event.srcElement,
									target = input.nextSibling;
								if ( target === input._relatedTarget )  {
									target.runtimeStyle.display = target._oldDisplay;
									target.focus();
									target._relatedTarget = null;
								}
								input.parentNode.removeChild( input );
							}
							target.parentNode.insertBefore( input, target );
						}
					}
				}
			};

		window["inputPlaceholder"] = function( elem /* internal use only -> */, value ) {
			if (
				( elem.nodeName === "TEXTAREA" || elem.type === "text" || elem.type === "password" ) &&
				( value = elem.getAttribute( 'placeholder' ) ) )
			{
				elem.setAttribute( 'data-placeholder', value );
				elem.removeAttribute( 'placeholder' );
				blurHandler( { "target": elem } );
				elem[ eventMethod[ 1 ] ]( eventMethod[ 0 ] + "focus", focusHandler, false );
				elem[ eventMethod[ 1 ] ]( eventMethod[ 0 ] + "blur", blurHandler, false );

				if ( elem.form && !elem.form.__submitAttached ) {
					elem.form.__submitAttached = true;
					elem.form[ eventMethod[ 1 ] ]( eventMethod[ 0 ] + "submit", function( e ) {
						var target = e && e.target || window.event.srcElement;
						for( var i = 0, elems; i < elements.length; i++ ) {
							elems = target.getElementsByTagName( elements[ i ] );
							for( var j = 0, elem; elem = elems[ j++ ]; ) {
								focusHandler( { "target": elem } );
							}
						}
					}, false );
				}
			}
		}

		var DOMContentLoaded = function() {
			for( var i = 0, elems; i < elements.length; i++ ) {
				elems = document.getElementsByTagName( elements[ i ] );
				for( var j = 0, elem; elem = elems[ j++ ]; ) {
					window["inputPlaceholder"]( elem );
				}
			}
		}

		if ( document.addEventListener ) {
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		}
		window[ eventMethod[ 1 ] ]( eventMethod[ 0 ] + "load", DOMContentLoaded, false );
	}

})( window );
