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