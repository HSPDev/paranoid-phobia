#Paranoid Phobia

Are you concerned about our increasing lack of privacy online? Do you often transmit sensitive files over Facebook, Skype, Email and other insecure channels?

**Fear not!** Paranoid Phobia will secure your files before transmission, and allow secure key exchange with 3rd parties. 
Paranoid Phobia is a complete application, written entirely in Javascript and HTML (with a few lines of CSS). 

This means you can run it from it's folder sitting on your desktop. It requires no server and no data EVER leaves your machine. 

###How does it work?
It works using the following tools:

 - jQuery 2.1 (for the UI) 
 - CryptoJS v3.1.2 (for AES)
 - JSEncrypt (for RSA).
 - HTML5 FileReader API
 
We could probably have done without jQuery, but I doubt it will compromise the security as a local Javascript file.  
(feel free to make a rewrite without it).

There are some basic steps to sending a file with Paranoid Phobia.

 1. The **receiving** party creates a new identity. It's only stored in RAM, so the tab will need to remain open.
 2. The **receiving** party sends the provided public message key to the **sending** party. This can be through any insecure channel.
 3. The **sending** party inputs the key, chooses a file and encrypts it. It will automatically download the encrypted file to the **sending** partys disk. The filename is chosen at random and always end in ".paranoid".
 4. The **sending** party will now send the file over any insecure connection. 
 5. The **receiving** party will choose the encrypted file, and click "Decrypt", and it will automatically download the unencrypted file to his own harddrive, with it's original filename.
 6. Profit?!? (And some confused NSA workers).
 
As soon as the receiving party closes his tab, the encrypted file is lost forever. Please note that the download of the files is handled entirely in HTML using Javascript, meaning **no data ever leaves your machine**. 


###How does it really work? Like, technically?!

When the receiving party creates a new identity, we use JSEncrypt to create a completely **random RSA-2048 Key-pair**, and store the private key in a variable, and the public part in the textbox for easy copy/pasting. This key is sent to the sending party.

On the sending party, we generate a random 128 character string, for use as an AES256 key.
We read the entire chosen file into memory (therefore the filesize limit) and encrypt it using this randomly created password.

Afterwards, we encrypt the random 128 character string, using the **public key** of the receiving party, and _prepend_ it the encrypted file data. Please note that right after this, we also store the encrypted filename, encrypted using the same public key. We use two custom delimiters to seperate all this encrypted data (more on that in a moment).

When the receiving file load this encrypted file, we will try to find our two delimiters, and throw an error if they aren't found (meaning it's not a file we made). We will split the data up, and use our own private RSA key (the one stored in RAM from the key-pair we made in the beginning), to decrypt the 128 character AES key, and also decrypt the filename.

We use the decrypted AES key to decrypt the true file data, and we download it to the receivings partys machine, using the filename we also have decrypted.

The file encrypted format is as follows:

```
(RSA ENCRYPTED AES KEY) + "|_PARANOIDPHOBIA_|" + (RSA ENCRYPTED FILE NAME) + "|_THETHREATISREAL_|" + (THE AES ENCRYPTED FILE DATA)
```

As you can see, we won't even leak the filename of the file, during transmission. The only information leakage which might occur, is the filesize. This might be mitigated in a future version.
