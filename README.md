Brings HTML5 "placeholder" attribute into all older browser

example:

```html
<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src="placeholder.min.js"></script>
		<script type="text/javascript">
			function insertInput() {
				var input = document.createElement('input');
				input.type = "text";
				input.setAttribute( 'placeholder', "Enter value" );
				document.body.appendChild( input );
				inputPlaceholder( input );
			}
		</script>

		<style type="text/css">

			input {
				aposition: absolute;
				color: #f00;
				text-align: center;
			}

			/*
			* Стиль для браузеров не поддерживающих
			* placeholder или псевдо-елемента input-placeholder
			*/
			input.input-placeholder {
				color: #00f;
				text-align: center;
			}

			/*
			* Стиль для WebKit браузера ( Chrome )
			*/
			input::-webkit-input-placeholder {
				color: #00f;
				text-align: center;
			}

			/*
			* Стиль для Mozilla ( FireFox )
			*/
			input:-moz-placeholder {
				color: #00f;
				text-align: center;
			}
		</style>
	</head>
	<body>
		<input type="text" value="" placeholder="Enter name" />
		<input type="text" value="" placeholder="Enter email" class="vasya" />
		<input type="password" value="" placeholder="Enter password" class="petya" />
		<button onclick="insertInput();">Insert new input</button>
	</body>
</html>
```
