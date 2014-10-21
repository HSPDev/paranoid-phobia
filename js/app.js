/*
Contains all our application logic.
*/

var randomString = function(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
    	var randomPoz = Math.floor(Math.random() * charSet.length);
    	randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}
$(document).ready(function()
{
	//The private key of our current identity
	var privateKeyData = null;

	//Save the file in memory for the file reader API
	var file = null;
	$('#toEncryptDecrypt').on('change', function(e){
		file = e.target.files[0];
	});

	//On encryption
	$('#encryptBtn').on('click', function(e)
	{
		e.preventDefault();

		//Check if we have selected a file
		if(file === null)
		{
			alert("You haven't chosen any file yet!");
			return false;
		}

		//Check if our file is too big (> 1,5 MB). Let the user try anyway, but warn them.
		if(file.size > 1024*1536) {
			if(!confirm("WARNING!\nYour file is over 1,5 MB. This may VERY WELL crash your browser. Save all work before attempting this. Chrome will probably handle this best but will still die easy.\n\nDo you have a death wish and want to continue?"))
			{
				return false;
			}
		}

		//Check a valid encryption key (public key) is provided. (200 is just some bullshit length)
		//also check header and footer of key.
		var receiverMessageKey = $('#encryptionKey').val();
		if(receiverMessageKey.trim().length < 200 || 
			receiverMessageKey.indexOf('-----BEGIN PUBLIC KEY-----') == -1 || 
			receiverMessageKey.indexOf('-----END PUBLIC KEY-----') == -1)
		{
			alert("You must provide the receivers public message key!");
			return false;
		}

		//Make up a random filename, with our own extension.
		var filename = randomString(12)+'.paranoid';

		var reader = new FileReader();
		reader.onload = function(e){
			//Generate the actual encryption password
			var password = randomString(128); //Just some really long random string...

			//Encrypt the actual data.
			var encrypted = CryptoJS.AES.encrypt(e.target.result, password);

			//Encrypt the password used for the file, for prepending
			var crypt = new JSEncrypt();
			crypt.setPublicKey(receiverMessageKey);
			password = crypt.encrypt(password);
			var encryptedFilename = crypt.encrypt(file.name);

			//Prepend the RSA encrypted password to the file itself, and also store the encrypted filename in there.
			encrypted = password+'|_PARANOIDPHOBIA_|'+encryptedFilename+'|_THETHREATISREAL_|'+encrypted;

			//Invoke a download of the encrypted file automatically
			var save = document.createElement('a');
	        save.href = 'data:application/octet-stream,'+encrypted;
	        save.target = '_blank';
	        save.download = filename || 'unknown';
	        var event = document.createEvent('Event');
	        event.initEvent('click', true, true);
	        save.dispatchEvent(event);
	        (window.URL || window.webkitURL).revokeObjectURL(save.href);
		};
		//Read the file in and start the above callback.
		reader.readAsDataURL(file);
		return false;
	});


	//On decryption
	$('#decryptBtn').on('click', function(e)
	{
		e.preventDefault();

		//Check if we have selected a file
		if(file === null)
		{
			alert("You haven't chosen any file yet!");
			return false;
		}

		//Check if our file is too big (> 1,5 MB). Let the user try anyway, but warn them.
		if(file.size > 1024*1536) {
			if(!confirm("WARNING!\nYour file is over 1,5 MB. This may VERY WELL crash your browser. Save all work before attempting this. Chrome will probably handle this best but will still die easy.\n\nDo you have a death wish and want to continue?"))
			{
				return false;
			}
		}

		//Check if we have an identity stored in RAM
		if(privateKeyData === null)
		{
			alert("You can't decrypt this file, as you haven't made any identity and any previous identity is gone now.\n\nThe file is lost! :(");
			return false;
		}

		var reader = new FileReader();
		reader.onload = function(e){
			//Find the encrypted encryption key at the start of the file (also validates it's from this app)
			var keyIndex = e.target.result.indexOf('|_PARANOIDPHOBIA_|');
			if(keyIndex == -1)
			{
				alert("Your file hasn't been encrypted by this application and cannot be decrypted!");
				return false;
			}
			var encryptedEncryptionKey = e.target.result.substr(0, keyIndex);
			var cleanedFileData = e.target.result.substr(keyIndex+('|_PARANOIDPHOBIA_|'.length));

			//Find the encrypted filename
			var nameIndex = cleanedFileData.indexOf('|_THETHREATISREAL_|');
			if(nameIndex == -1)
			{
				alert("Your file hasn't been encrypted by this application and cannot be decrypted!");
				return false;
			}
			var encryptedFilename = cleanedFileData.substr(0, nameIndex);
			cleanedFileData = cleanedFileData.substr(nameIndex+('|_THETHREATISREAL_|'.length));

			//Decrypt the encrypted encryption key nad filename
			var crypt = new JSEncrypt();
			crypt.setPrivateKey(privateKeyData);
			var password = crypt.decrypt(encryptedEncryptionKey);
			var filename = crypt.decrypt(encryptedFilename);
			if(password === false)
			{
				alert("Your current private key doesn't unlock this file. \n\nThis file is probably lost forever! :(");
				return false;
			}

			//Decrypt the actual data.
			var decrypted = CryptoJS.AES.decrypt(cleanedFileData, password).toString(CryptoJS.enc.Latin1);


			//Invoke a download of the encrypted file automatically
			var save = document.createElement('a');
	        save.href = decrypted; //The Base64 headers and stuff is already there.
	        save.target = '_blank';
	        save.download = filename || 'unknown';
	        var event = document.createEvent('Event');
	        event.initEvent('click', true, true);
	        save.dispatchEvent(event);
	        (window.URL || window.webkitURL).revokeObjectURL(save.href);
		};
		//Read the file in and start the above callback.
		reader.readAsText(file);
		return false;
	});

	$('#newIdentityBtn').on('click', function(e)
	{
		e.preventDefault();
		//Hardcoded to 2048 bit RSA keys. 4096 took a minute or so... Anything lower is too vulnerable.
		var crypt = new JSEncrypt({default_key_size: 2048});

		//Create the actual keypair. This will block the UI for a few seconds.
		crypt.getKey();

		//Save the private key in a local variable. Will be gone on refresh.
		privateKeyData = crypt.getPrivateKey();

		//Save the public key in the textbox.
      	$('#publicEncryptionKey').val(crypt.getPublicKey());

      	//Update the message
      	$('#secureIdentityMessage').html("Send the above identity to the person sending the file. Don't close this tab.");
		return false;
	});
});